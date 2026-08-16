import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { User, Session, Setting } from './models.js';

export const ROLLER = ['uye', 'kulup-uyesi', 'lider', 'yk', 'baskan'];
export const rolDuzeyi = (rol) => ROLLER.indexOf(rol);

export const BCRYPT_COST = 12;
export const CEREZ_ADI = 'compec_oturum';
const OTURUM_SURESI = 30 * 24 * 60 * 60 * 1000; // 30 gun

export const parolaHashle = (parola) => bcrypt.hash(parola, BCRYPT_COST);
export const parolaDogrula = (parola, hash) => bcrypt.compare(parola, hash);

const jetonHashle = (jeton) => crypto.createHash('sha256').update(jeton).digest('hex');

// Tek bir cerez okuyacagiz; ayri bir paket yerine kucuk bir ayristirici yeterli.
export function cerezOku(req, ad) {
  const ham = req.headers.cookie;
  if (!ham) return null;
  for (const parca of ham.split(';')) {
    const esittir = parca.indexOf('=');
    if (esittir < 0) continue;
    if (parca.slice(0, esittir).trim() === ad) {
      return decodeURIComponent(parca.slice(esittir + 1).trim());
    }
  }
  return null;
}

export async function oturumAc(res, userId) {
  const jeton = crypto.randomBytes(32).toString('hex');
  const bitis = new Date(Date.now() + OTURUM_SURESI);
  await Session.create({ userId, jetonHash: jetonHashle(jeton), bitis });
  const parcalar = [
    `${CEREZ_ADI}=${jeton}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(OTURUM_SURESI / 1000)}`
  ];
  if (process.env.NODE_ENV === 'production') parcalar.push('Secure');
  res.append('Set-Cookie', parcalar.join('; '));
}

export async function oturumKapat(req, res) {
  const jeton = cerezOku(req, CEREZ_ADI);
  if (jeton) await Session.deleteOne({ jetonHash: jetonHashle(jeton) });
  res.append('Set-Cookie', `${CEREZ_ADI}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

// Oturum varsa req.kullanici doldurur; yoksa sessizce gecer.
export async function oturumYukle(req) {
  if (req.kullaniciYuklendi) return req.kullanici;
  req.kullaniciYuklendi = true;
  req.kullanici = null;
  const jeton = cerezOku(req, CEREZ_ADI);
  if (!jeton) return null;
  const oturum = await Session.findOne({ jetonHash: jetonHashle(jeton) });
  if (!oturum) return null;
  if (oturum.bitis.getTime() < Date.now()) {
    await Session.deleteOne({ _id: oturum._id });
    return null;
  }
  const kullanici = await User.findById(oturum.userId);
  if (!kullanici) return null;
  await Session.updateOne({ _id: oturum._id }, { $set: { sonKullanim: new Date() } });
  req.kullanici = kullanici;
  return kullanici;
}

export const girisGerekli = (req, res, next) => oturumYukle(req).then((k) => {
  if (!k) return res.status(401).json({ hata: 'Oturum gerekli' });
  next();
}).catch(next);

export const VARSAYILAN_ALANLAR = [
  { ad: 'okulMaili', etiket: 'Okul e-postasi', tip: 'eposta', zorunlu: true, aktif: true },
  { ad: 'okulNo', etiket: 'Okul numarasi', tip: 'metin', zorunlu: true, aktif: true }
];

export async function ayarlar() {
  let belge = await Setting.findOne({ tekil: 'ayarlar' });
  if (!belge) {
    belge = await Setting.create({
      tekil: 'ayarlar',
      kayitAlanlari: VARSAYILAN_ALANLAR,
      adminEsigi: 'yk',
      bultenAciklama: ''
    });
  }
  return belge;
}

// Yonetim esigi ayarlardan okunur; her yazma isteginde X-Istek basligi zorunlu.
export const adminGerekli = (req, res, next) => (async () => {
  const kullanici = await oturumYukle(req);
  if (!kullanici) return res.status(401).json({ hata: 'Oturum gerekli' });
  const ayar = await ayarlar();
  if (rolDuzeyi(kullanici.rol) < rolDuzeyi(ayar.adminEsigi)) {
    return res.status(403).json({ hata: 'Yetkisiz' });
  }
  if (req.method !== 'GET' && req.get('X-Istek') !== 'compec') {
    return res.status(403).json({ hata: 'Istek basligi eksik' });
  }
  next();
})().catch(next);

export const kullaniciDisa = (k) => ({
  id: String(k._id),
  ad: k.ad,
  soyad: k.soyad,
  eposta: k.eposta,
  rol: k.rol,
  kulupBasvuru: !!k.kulupBasvuru,
  duyuruIzni: !!k.duyuruIzni,
  alanlar: k.alanlar || {},
  olusturma: k.olusturma,
  guncelleme: k.guncelleme
});
