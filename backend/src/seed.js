import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as models from './models.js';

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

// Seed tek dogruluk kaynagi: her acilista koleksiyon seed ile birebir esitlenir.
export async function seedDatabase() {
  for (const [name, model] of Object.entries(files)) {
    const raw = await readFile(path.join(seedDir, `${name}.json`), 'utf8');
    const rows = JSON.parse(raw);
    await model.deleteMany({});
    if (rows.length > 0) await model.insertMany(rows);
    console.log(`tohum: ${name} ${rows.length} kayit`);
  }
}
