import express from 'express';
import { User, Subscriber, Etkinlik } from './models.js';
import { ROLLER, rolDuzeyi, ayarlar, adminGerekli, kullaniciDisa } from './yetki.js';
import { olcumOzeti } from './olcum.js';

const router = express.Router();
const tut = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.use(adminGerekli);

/* Olcum ozeti: PostHog Query API, 5 dakikalik bellek onbellegi (olcum.js). */
router.get('/olcum', tut(olcumOzeti));

router.get('/uyeler', tut(async (req, res) => {
  const filtre = {};
  if (req.query.rol) filtre.rol = req.query.rol;
  if (req.query.kulupBasvuru !== undefined) {
    filtre.kulupBasvuru = req.query.kulupBasvuru === 'true' || req.query.kulupBasvuru === '1';
  }
  const liste = await User.find(filtre).sort({ olusturma: -1 });
  res.json(liste.map(kullaniciDisa));
}));

router.patch('/uyeler/:id', tut(async (req, res) => {
  const hedef = await User.findById(req.params.id).catch(() => null);
  if (!hedef) return res.status(404).json({ hata: 'Uye bulunamadi' });
  const yapan = req.kullanici;
  const govde = req.body || {};

  if (govde.rol !== undefined) {
    const yeni = govde.rol;
    if (!ROLLER.includes(yeni)) return res.status(400).json({ hata: 'Gecersiz rol' });
    if (String(hedef._id) === String(yapan._id)) {
      return res.status(403).json({ hata: 'Kendi rolunu degistiremezsin' });
    }
    const baskanDevri = yeni === 'baskan';
    if (baskanDevri && yapan.rol !== 'baskan') {
      return res.status(403).json({ hata: 'Baskanligi yalniz mevcut baskan devredebilir' });
    }
    if (!baskanDevri && rolDuzeyi(yeni) >= rolDuzeyi(yapan.rol)) {
      return res.status(403).json({ hata: 'Kendi rolune esit veya ustunu atayamazsin' });
    }
    if (rolDuzeyi(hedef.rol) >= rolDuzeyi(yapan.rol)) {
      return res.status(403).json({ hata: 'Bu uyenin rolunu degistiremezsin' });
    }
    hedef.rol = yeni;
    if (baskanDevri) {
      // Baskan tektir: devredince eski baskan yk olur.
      yapan.rol = 'yk';
      yapan.guncelleme = new Date();
      await yapan.save();
    }
  }

  if (govde.kulupBasvuruOnay !== undefined) {
    if (govde.kulupBasvuruOnay === true || govde.kulupBasvuruOnay === 'true') {
      if (rolDuzeyi(hedef.rol) < rolDuzeyi('kulup-uyesi')) hedef.rol = 'kulup-uyesi';
    }
    hedef.kulupBasvuru = false;
  }

  hedef.guncelleme = new Date();
  await hedef.save();
  res.json(kullaniciDisa(hedef));
}));

router.get('/ayarlar', tut(async (req, res) => {
  const ayar = await ayarlar();
  res.json({
    kayitAlanlari: ayar.kayitAlanlari || [],
    adminEsigi: ayar.adminEsigi,
    bultenAciklama: ayar.bultenAciklama
  });
}));

router.patch('/ayarlar', tut(async (req, res) => {
  const ayar = await ayarlar();
  const govde = req.body || {};
  if (govde.kayitAlanlari !== undefined) {
    if (!Array.isArray(govde.kayitAlanlari)) {
      return res.status(400).json({ hata: 'kayitAlanlari dizi olmali' });
    }
    const tipler = ['metin', 'eposta', 'sayi', 'onay'];
    const temiz = [];
    for (const alan of govde.kayitAlanlari) {
      if (!alan || typeof alan.ad !== 'string' || !alan.ad.trim()) {
        return res.status(400).json({ hata: 'Her alanin ad degeri olmali' });
      }
      if (!tipler.includes(alan.tip)) return res.status(400).json({ hata: 'Gecersiz alan tipi' });
      temiz.push({
        ad: alan.ad.trim(),
        etiket: typeof alan.etiket === 'string' && alan.etiket ? alan.etiket : alan.ad.trim(),
        tip: alan.tip,
        zorunlu: alan.zorunlu === true,
        aktif: alan.aktif !== false
      });
    }
    ayar.kayitAlanlari = temiz;
  }
  if (govde.adminEsigi !== undefined) {
    if (!ROLLER.includes(govde.adminEsigi)) return res.status(400).json({ hata: 'Gecersiz esik' });
    if (rolDuzeyi(govde.adminEsigi) > rolDuzeyi(req.kullanici.rol)) {
      return res.status(403).json({ hata: 'Kendi rolunun ustunde esik koyamazsin' });
    }
    ayar.adminEsigi = govde.adminEsigi;
  }
  if (govde.bultenAciklama !== undefined) ayar.bultenAciklama = String(govde.bultenAciklama);
  await ayar.save();
  res.json({
    kayitAlanlari: ayar.kayitAlanlari,
    adminEsigi: ayar.adminEsigi,
    bultenAciklama: ayar.bultenAciklama
  });
}));

router.get('/bulten', tut(async (req, res) => {
  const [aboneler, uyeler] = await Promise.all([
    Subscriber.find({ aktif: true }).lean(),
    User.find({ duyuruIzni: true }).lean()
  ]);
  const harita = new Map();
  for (const a of aboneler) {
    harita.set(a.eposta, { eposta: a.eposta, kaynak: a.kaynak, tarih: a.izinTarihi, uye: false, ad: '' });
  }
  for (const u of uyeler) {
    const onceki = harita.get(u.eposta);
    harita.set(u.eposta, {
      eposta: u.eposta,
      kaynak: onceki ? onceki.kaynak : 'kayit',
      tarih: onceki ? onceki.tarih : u.olusturma,
      uye: true,
      ad: `${u.ad} ${u.soyad}`
    });
  }
  const liste = [...harita.values()].sort((a, b) => a.eposta.localeCompare(b.eposta));
  if (req.query.csv === '1') {
    const kacir = (v) => {
      const ham = v instanceof Date ? v.toISOString() : v;
      return `"${String(ham == null ? '' : ham).replace(/"/g, '""')}"`;
    };
    const satirlar = ['eposta,ad,uye,kaynak,tarih'];
    for (const s of liste) {
      satirlar.push([s.eposta, s.ad, s.uye, s.kaynak, s.tarih].map(kacir).join(','));
    }
    res.type('text/csv; charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="bulten.csv"');
    return res.send(satirlar.join('\n'));
  }
  res.json(liste);
}));

// Etkinlik CRUD: seed'deki alan adlarinin aynisi kabul edilir, yeniden adlandirma yok.
const gizle = { _id: 0 };

router.get('/etkinlikler', tut(async (req, res) => {
  res.json(await Etkinlik.find({}, gizle).sort({ sira: 1 }).lean());
}));

router.get('/etkinlikler/:slug', tut(async (req, res) => {
  const kayit = await Etkinlik.findOne({ slug: req.params.slug }, gizle).lean();
  if (!kayit) return res.status(404).json({ hata: 'Etkinlik bulunamadi' });
  res.json(kayit);
}));

router.post('/etkinlikler', tut(async (req, res) => {
  const govde = { ...(req.body || {}) };
  delete govde._id;
  const slug = typeof govde.slug === 'string' ? govde.slug.trim() : '';
  if (!slug) return res.status(400).json({ hata: 'slug zorunlu' });
  if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ hata: 'slug yalniz kucuk harf, rakam ve tire icerir' });
  if (typeof govde.ad !== 'string' || !govde.ad.trim()) return res.status(400).json({ hata: 'ad zorunlu' });
  if (await Etkinlik.exists({ slug })) return res.status(409).json({ hata: 'Bu slug zaten var' });
  govde.slug = slug;
  if (govde.yayinda === undefined) govde.yayinda = 1;
  const kayit = await Etkinlik.create(govde);
  res.json(await Etkinlik.findById(kayit._id, gizle).lean());
}));

router.patch('/etkinlikler/:slug', tut(async (req, res) => {
  const govde = { ...(req.body || {}) };
  delete govde._id;
  const mevcut = await Etkinlik.findOne({ slug: req.params.slug });
  if (!mevcut) return res.status(404).json({ hata: 'Etkinlik bulunamadi' });
  if (govde.slug !== undefined) {
    const yeni = String(govde.slug).trim();
    if (!/^[a-z0-9-]+$/.test(yeni)) return res.status(400).json({ hata: 'slug yalniz kucuk harf, rakam ve tire icerir' });
    if (yeni !== req.params.slug && await Etkinlik.exists({ slug: yeni })) {
      return res.status(409).json({ hata: 'Bu slug zaten var' });
    }
    govde.slug = yeni;
  }
  await Etkinlik.updateOne({ _id: mevcut._id }, { $set: govde });
  res.json(await Etkinlik.findById(mevcut._id, gizle).lean());
}));

// Silme gercek silme degil: icerik kaybolmasin diye yayinda=0 yapilir.
router.delete('/etkinlikler/:slug', tut(async (req, res) => {
  const sonuc = await Etkinlik.updateOne({ slug: req.params.slug }, { $set: { yayinda: 0 } });
  if (sonuc.matchedCount === 0) return res.status(404).json({ hata: 'Etkinlik bulunamadi' });
  res.json({ durum: 'yayindan kaldirildi', slug: req.params.slug });
}));

export default router;
