import mongoose from 'mongoose';

// Alan adlari seed JSON'larindaki gibi kalsin diye serbest sema kullaniliyor.
function collection(name) {
  const schema = new mongoose.Schema({}, { strict: false, versionKey: false });
  return mongoose.model(name, schema, name);
}

export const Etkinlik = collection('etkinlikler');
export const Baski = collection('baskilar');
export const Odul = collection('oduller');
export const Kanit = collection('kanitlar');
export const Kilometre = collection('kilometre');
export const Konusmaci = collection('konusmacilar');
export const Kurum = collection('kurumlar');
export const Gezi = collection('gezileri');
export const Uye = collection('uyeler');

// Hesap sistemi (HESAP-KONTRAT.md). Bunlar seed'den gelmez, sema siki tutulur.
const userSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  soyad: { type: String, required: true },
  eposta: { type: String, required: true, unique: true, lowercase: true, trim: true },
  parolaHash: { type: String, required: true },
  rol: { type: String, default: 'uye' },
  kulupBasvuru: { type: Boolean, default: false },
  duyuruIzni: { type: Boolean, default: false },
  alanlar: { type: mongoose.Schema.Types.Mixed, default: {} },
  olusturma: { type: Date, default: Date.now },
  guncelleme: { type: Date, default: Date.now }
}, { versionKey: false });

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  jetonHash: { type: String, required: true, unique: true },
  olusturma: { type: Date, default: Date.now },
  sonKullanim: { type: Date, default: Date.now },
  bitis: { type: Date, required: true }
}, { versionKey: false });

const subscriberSchema = new mongoose.Schema({
  eposta: { type: String, required: true, unique: true, lowercase: true, trim: true },
  izinTarihi: { type: Date, default: Date.now },
  kaynak: { type: String, default: 'form' },
  aktif: { type: Boolean, default: true }
}, { versionKey: false });

const settingSchema = new mongoose.Schema({
  tekil: { type: String, default: 'ayarlar', unique: true },
  kayitAlanlari: { type: Array, default: [] },
  adminEsigi: { type: String, default: 'yk' },
  bultenAciklama: { type: String, default: '' }
}, { versionKey: false });

export const User = mongoose.model('users', userSchema, 'users');
export const Session = mongoose.model('sessions', sessionSchema, 'sessions');
export const Subscriber = mongoose.model('subscribers', subscriberSchema, 'subscribers');
export const Setting = mongoose.model('settings', settingSchema, 'settings');
