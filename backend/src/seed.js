import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as models from './models.js';
import { ayarlar } from './yetki.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const seedDir = process.env.SEED_DIR || path.resolve(here, '../../seed');

const files = {
  etkinlikler: models.Etkinlik,
  baskilar: models.Baski,
  oduller: models.Odul,
  kanitlar: models.Kanit,
  kilometre: models.Kilometre,
  konusmacilar: models.Konusmaci,
  kurumlar: models.Kurum,
  gezileri: models.Gezi,
  uyeler: models.Uye
};

// Admin panelden duzenlenebilen koleksiyonlar her acilista EZILMEZ; yalniz bosken yuklenir.
const yalnizBoskenYukle = new Set(['etkinlikler']);

export async function seedDatabase() {
  for (const [name, model] of Object.entries(files)) {
    const raw = await readFile(path.join(seedDir, `${name}.json`), 'utf8');
    const rows = JSON.parse(raw);
    if (yalnizBoskenYukle.has(name)) {
      const sayi = await model.estimatedDocumentCount();
      if (sayi > 0) {
        console.log(`tohum: ${name} atlandi (${sayi} kayit var, admin duzenleyebilir)`);
        continue;
      }
      if (rows.length > 0) await model.insertMany(rows);
      console.log(`tohum: ${name} ${rows.length} kayit (ilk yukleme)`);
      continue;
    }
    await model.deleteMany({});
    if (rows.length > 0) await model.insertMany(rows);
    console.log(`tohum: ${name} ${rows.length} kayit`);
  }
  await ayarlar(); // ayar belgesi yoksa varsayilanlarla olustur
}
