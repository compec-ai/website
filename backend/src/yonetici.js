// Ilk yonetici atama CLI: node src/yonetici.js <eposta> <rol>
// Var olan kullaniciyi yukseltir. Parola/jeton basmaz.
import mongoose from 'mongoose';
import { User } from './models.js';
import { ROLLER } from './yetki.js';

const [eposta, rol] = process.argv.slice(2);

if (!eposta || !rol) {
  console.error('kullanim: node src/yonetici.js <eposta> <rol>');
  console.error(`roller: ${ROLLER.join(', ')}`);
  process.exit(1);
}
if (!ROLLER.includes(rol)) {
  console.error(`gecersiz rol: ${rol} (roller: ${ROLLER.join(', ')})`);
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/compec');

const hedef = eposta.trim().toLowerCase();
const kullanici = await User.findOne({ eposta: hedef });
if (!kullanici) {
  console.error(`kullanici bulunamadi: ${hedef}`);
  await mongoose.disconnect();
  process.exit(1);
}

if (rol === 'baskan') {
  // Baskan tektir: varsa eski baskan yk yapilir.
  await User.updateMany(
    { rol: 'baskan', _id: { $ne: kullanici._id } },
    { $set: { rol: 'yk', guncelleme: new Date() } }
  );
}

const eski = kullanici.rol;
kullanici.rol = rol;
kullanici.guncelleme = new Date();
await kullanici.save();
console.log(`${hedef}: ${eski} -> ${rol}`);
await mongoose.disconnect();
