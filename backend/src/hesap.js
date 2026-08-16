import express from 'express';
import { User, Subscriber } from './models.js';
import {
  ayarlar, parolaHashle, parolaDogrula, oturumAc, oturumKapat,
  girisGerekli, kullaniciDisa
} from './yetki.js';

const router = express.Router();
const tut = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const metin = (v) => (typeof v === 'string' ? v.trim() : '');
const epostaGecerli = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Kayit alanlari ayarlardan gelir: yeni alan eklenince dogrulama kendiliginden degisir.
export function alanlariDogrula(kayitAlanlari, gelen) {
  const veri = gelen && typeof gelen === 'object' ? gelen : {};
  const sonuc = {};
  for (const alan of kayitAlanlari) {
    if (!alan.aktif) continue;
    const ham = veri[alan.ad];
    const bos = ham === undefined || ham === null || ham === '';
    if (bos) {
      if (alan.zorunlu) return { hata: `${alan.etiket} zorunlu` };
      continue;
    }
    if (alan.tip === 'sayi') {
      const sayi = Number(ham);
      if (!Number.isFinite(sayi)) return { hata: `${alan.etiket} sayi olmali` };
      sonuc[alan.ad] = sayi;
    } else if (alan.tip === 'onay') {
      const onay = ham === true || ham === 'true' || ham === 1;
      if (alan.zorunlu && !onay) return { hata: `${alan.etiket} zorunlu` };
      sonuc[alan.ad] = onay;
    } else if (alan.tip === 'eposta') {
      const deger = metin(ham);
      if (!epostaGecerli(deger)) return { hata: `${alan.etiket} gecerli bir e-posta olmali` };
      sonuc[alan.ad] = deger.toLowerCase();
    } else {
      sonuc[alan.ad] = metin(ham);
    }
  }
  return { deger: sonuc };
}

// Giris hiz siniri: IP basina dakikada 10 deneme, bellek ici.
const denemeler = new Map();
function hizSiniri(ip) {
  const simdi = Date.now();
  const liste = (denemeler.get(ip) || []).filter((t) => simdi - t < 60000);
  liste.push(simdi);
  denemeler.set(ip, liste);
  if (denemeler.size > 5000) denemeler.clear();
  return liste.length <= 10;
}

async function abonelikYaz(eposta, kaynak) {
  await Subscriber.updateOne(
    { eposta },
    { $setOnInsert: { eposta, izinTarihi: new Date(), kaynak }, $set: { aktif: true } },
    { upsert: true }
  );
}

router.get('/hesap/kayit-alanlari', tut(async (req, res) => {
  const ayar = await ayarlar();
  res.json((ayar.kayitAlanlari || []).filter((a) => a.aktif));
}));

router.post('/hesap/kayit', tut(async (req, res) => {
  const govde = req.body || {};
  const ad = metin(govde.ad);
  const soyad = metin(govde.soyad);
  const eposta = metin(govde.eposta).toLowerCase();
  const parola = typeof govde.parola === 'string' ? govde.parola : '';
  if (!ad || !soyad) return res.status(400).json({ hata: 'Ad ve soyad zorunlu' });
  if (!epostaGecerli(eposta)) return res.status(400).json({ hata: 'Gecerli e-posta zorunlu' });
  if (parola.length < 8) return res.status(400).json({ hata: 'Parola en az 8 karakter olmali' });

  const ayar = await ayarlar();
  const alanSonuc = alanlariDogrula(ayar.kayitAlanlari || [], govde.alanlar);
  if (alanSonuc.hata) return res.status(400).json({ hata: alanSonuc.hata });

  if (await User.exists({ eposta })) {
    return res.status(409).json({ hata: 'Bu e-posta ile kayit var' });
  }

  const duyuruIzni = govde.duyuruIzni === true || govde.duyuruIzni === 'true';
  const kullanici = await User.create({
    ad,
    soyad,
    eposta,
    parolaHash: await parolaHashle(parola),
    rol: 'uye',
    kulupBasvuru: govde.kulupBasvuru === true || govde.kulupBasvuru === 'true',
    duyuruIzni,
    alanlar: alanSonuc.deger
  });
  if (duyuruIzni) await abonelikYaz(eposta, 'kayit');
  await oturumAc(res, kullanici._id);
  res.json(kullaniciDisa(kullanici));
}));

router.post('/hesap/giris', tut(async (req, res) => {
  const ip = req.ip || 'bilinmiyor';
  if (!hizSiniri(ip)) return res.status(429).json({ hata: 'Cok fazla deneme, biraz bekleyin' });
  const eposta = metin((req.body || {}).eposta).toLowerCase();
  const parola = typeof (req.body || {}).parola === 'string' ? req.body.parola : '';
  const basarisiz = () => res.status(401).json({ hata: 'E-posta veya parola hatali' });
  if (!eposta || !parola) return basarisiz();
  const kullanici = await User.findOne({ eposta });
  if (!kullanici) return basarisiz();
  if (!(await parolaDogrula(parola, kullanici.parolaHash))) return basarisiz();
  await oturumAc(res, kullanici._id);
  res.json(kullaniciDisa(kullanici));
}));

router.post('/hesap/cikis', tut(async (req, res) => {
  await oturumKapat(req, res);
  res.json({ durum: 'kapandi' });
}));

router.get('/hesap/ben', girisGerekli, tut(async (req, res) => {
  res.json(kullaniciDisa(req.kullanici));
}));

router.patch('/hesap/profil', girisGerekli, tut(async (req, res) => {
  const govde = req.body || {};
  const kullanici = req.kullanici;
  if (govde.ad !== undefined) {
    if (!metin(govde.ad)) return res.status(400).json({ hata: 'Ad bos olamaz' });
    kullanici.ad = metin(govde.ad);
  }
  if (govde.soyad !== undefined) {
    if (!metin(govde.soyad)) return res.status(400).json({ hata: 'Soyad bos olamaz' });
    kullanici.soyad = metin(govde.soyad);
  }
  if (govde.duyuruIzni !== undefined) {
    kullanici.duyuruIzni = govde.duyuruIzni === true || govde.duyuruIzni === 'true';
    if (kullanici.duyuruIzni) await abonelikYaz(kullanici.eposta, 'kayit');
  }
  if (govde.alanlar !== undefined) {
    const ayar = await ayarlar();
    const birlesik = { ...(kullanici.alanlar || {}), ...govde.alanlar };
    const sonuc = alanlariDogrula(ayar.kayitAlanlari || [], birlesik);
    if (sonuc.hata) return res.status(400).json({ hata: sonuc.hata });
    kullanici.alanlar = sonuc.deger;
  }
  kullanici.guncelleme = new Date();
  await kullanici.save();
  res.json(kullaniciDisa(kullanici));
}));

router.patch('/hesap/parola', girisGerekli, tut(async (req, res) => {
  const { eskiParola, yeniParola } = req.body || {};
  if (typeof yeniParola !== 'string' || yeniParola.length < 8) {
    return res.status(400).json({ hata: 'Yeni parola en az 8 karakter olmali' });
  }
  if (typeof eskiParola !== 'string' || !(await parolaDogrula(eskiParola, req.kullanici.parolaHash))) {
    return res.status(403).json({ hata: 'Eski parola hatali' });
  }
  req.kullanici.parolaHash = await parolaHashle(yeniParola);
  req.kullanici.guncelleme = new Date();
  await req.kullanici.save();
  res.json({ durum: 'degisti' });
}));

router.post('/bulten/abone', tut(async (req, res) => {
  const govde = req.body || {};
  const eposta = metin(govde.eposta).toLowerCase();
  if (!epostaGecerli(eposta)) return res.status(400).json({ hata: 'Gecerli e-posta zorunlu' });
  if (!(govde.izin === true || govde.izin === 'true')) {
    return res.status(400).json({ hata: 'Acik izin zorunlu' });
  }
  await abonelikYaz(eposta, 'form'); // cift kayitta sessiz basari
  res.json({ durum: 'abone' });
}));

export default router;
