# backend

Salt-okunur içerik API'si: Node.js (ESM) + Express + Mongoose. Bağımlılık yalnızca
`express` ve `mongoose`; auth, admin ve yazma ucu yok.

## Çalıştırma

```bash
npm install
MONGO_URL=mongodb://localhost:27017/compec PORT=3001 npm start   # geliştirme: npm run dev
```

Ortam değişkenleri: `MONGO_URL` (varsayılan `mongodb://localhost:27017/compec`),
`PORT` (varsayılan 3001), `SEED_DIR` (varsayılan depo kökündeki `seed/`).

Docker ile: `docker compose -f docker-compose.dev.yml up mongo backend` (kod
bind-mount, `node --watch` ile yeniden başlar).

## Dosyalar

- `src/index.js` — Mongo'ya bağlan, tohumla, dinlemeye başla; 404 ve hata yakalayıcı.
- `src/routes.js` — API-KONTRAT.md'deki tüm uçlar `/api` öneki altında burada.
- `src/models.js` — koleksiyon başına bir Mongoose modeli, serbest şema (`strict: false`).
- `src/seed.js` — tohumlama.

## Tohum

`seed/*.json` tek doğruluk kaynağıdır. Her açılışta her koleksiyon silinip JSON'dan
yeniden yazılır, yani idempotenttir: veritabanı her zaman seed ile birebir aynıdır.
İçerik değişikliği = JSON'u düzenle + backend'i yeniden başlat.

Alan adları JSON'dakiyle aynı kalır; backend yeniden adlandırma yapmaz, yalnızca
`_id` alanını gizler. Sıralama kontrattaki gibidir (ödüller yıl azalan + sıra artan,
kilometre taşları yıl artan, diğerleri sıra artan). Yayında olmayan etkinlikler
(`yayinda: 0`) listelenmez.
