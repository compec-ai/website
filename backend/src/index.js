import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import { seedDatabase } from './seed.js';

const PORT = Number(process.env.PORT) || 3001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/compec';

const app = express();
app.use('/api', routes);

app.get('/saglik', (req, res) => res.json({ durum: 'iyi' }));

app.use((req, res) => res.status(404).json({ hata: 'Uc bulunamadi' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ hata: 'Sunucu hatasi' });
});

await mongoose.connect(MONGO_URL);
await seedDatabase();
app.listen(PORT, () => console.log(`backend hazir: ${PORT}`));
