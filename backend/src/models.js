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
