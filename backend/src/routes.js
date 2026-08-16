import express from 'express';
import {
  Etkinlik, Baski, Odul, Kanit, Kilometre, Konusmaci, Kurum, Gezi, Uye
} from './models.js';

const router = express.Router();
const gizle = { _id: 0 };

// Hata firlatan async uclari tek yerde yakala.
const tut = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.get('/ozet', tut(async (req, res) => {
  const [etkinlik, odul, odulYillari, konusmaci, kurum, uye, kanit] = await Promise.all([
    Etkinlik.countDocuments({ yayinda: { $ne: 0 } }),
    Odul.countDocuments(),
    Odul.distinct('yil'),
    Konusmaci.countDocuments(),
    Kurum.countDocuments(),
    Uye.countDocuments(),
    Kanit.countDocuments()
  ]);
  res.json({ etkinlik, odul, odulYil: odulYillari.length, konusmaci, kurum, uye, kanit });
}));

router.get('/etkinlikler', tut(async (req, res) => {
  res.json(await Etkinlik.find({ yayinda: { $ne: 0 } }, gizle).sort({ sira: 1 }).lean());
}));

router.get('/etkinlikler/:slug', tut(async (req, res) => {
  const { slug } = req.params;
  const etkinlik = await Etkinlik.findOne({ slug, yayinda: { $ne: 0 } }, gizle).lean();
  if (!etkinlik) return res.status(404).json({ hata: 'Etkinlik bulunamadi' });
  const [baskilar, konusmacilar, kurumlar] = await Promise.all([
    Baski.find({ etkinlik: slug }, gizle).sort({ no: 1 }).lean(),
    Konusmaci.find({ etkinlik: slug }, gizle).sort({ sira: 1 }).lean(),
    Kurum.find({ etkinlik: slug }, gizle).sort({ sira: 1 }).lean()
  ]);
  res.json({ ...etkinlik, baskilar, konusmacilar, kurumlar });
}));

router.get('/oduller', tut(async (req, res) => {
  res.json(await Odul.find({}, gizle).sort({ yil: -1, sira: 1 }).lean());
}));

router.get('/kanitlar', tut(async (req, res) => {
  res.json(await Kanit.find({}, gizle).sort({ sira: 1 }).lean());
}));

router.get('/kilometre', tut(async (req, res) => {
  res.json(await Kilometre.find({}, gizle).sort({ yil: 1, sira: 1 }).lean());
}));

router.get('/konusmacilar', tut(async (req, res) => {
  res.json(await Konusmaci.find({}, gizle).sort({ sira: 1 }).lean());
}));

router.get('/kurumlar', tut(async (req, res) => {
  res.json(await Kurum.find({}, gizle).sort({ sira: 1 }).lean());
}));

router.get('/gezileri', tut(async (req, res) => {
  res.json(await Gezi.find({}, gizle).sort({ sira: 1 }).lean());
}));

router.get('/uyeler', tut(async (req, res) => {
  res.json(await Uye.find({}, gizle).lean());
}));

router.get('/uyeler/:slug', tut(async (req, res) => {
  const uye = await Uye.findOne({ slug: req.params.slug }, gizle).lean();
  if (!uye) return res.status(404).json({ hata: 'Uye bulunamadi' });
  res.json(uye);
}));

export default router;
