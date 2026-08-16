# backend

İçerik API'si (salt-okunur) + hesap/yönetim API'si: Node.js (ESM) + Express + Mongoose.
Bağımlılık: `express`, `mongoose`, `bcrypt` (yerel derlenen). Çerez ayrıştırma elle
yapılır (`src/yetki.js`), tek çerez için paket eklemeye değmedi.

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
- `src/hesap.js` — `/api/hesap/*` ve `/api/bulten/abone` (HESAP-KONTRAT.md).
- `src/admin.js` — `/api/admin/*`: üyeler, ayarlar, bülten (CSV), etkinlik CRUD.
- `src/yetki.js` — roller, bcrypt, oturum çerezi, admin eşiği, `X-Istek` kontrolü.
- `src/yonetici.js` — CLI: `node src/yonetici.js <eposta> baskan` (ilk başkan).

## Hesap

Roller: `uye` < `kulup-uyesi` < `lider` < `yk` < `baskan`. Oturum httpOnly +
SameSite=Lax çerezle taşınır, jeton DB'de yalnız SHA-256 özeti olarak durur (JWT yok).
Admin yazma isteklerinde `X-Istek: compec` başlığı zorunludur. Giriş ucunda IP başına
dakikada 10 deneme sınırı vardır. Etkinlik silme gerçek silme değildir: `yayinda=0`.

## Tohum

`seed/*.json` içerik için doğruluk kaynağıdır. İki farklı davranış var:
admin panelden düzenlenebilen `etkinlikler` koleksiyonu YALNIZCA boşsa seed'den
yüklenir (yoksa admin'in düzenlemesi restart'ta silinirdi); diğer tüm koleksiyonlar
her açılışta silinip JSON'dan yeniden yazılır, yani idempotenttir.
İçerik değişikliği = JSON'u düzenle + backend'i yeniden başlat (etkinlikler için
koleksiyonu boşaltmak ya da admin ucunu kullanmak gerekir).

Alan adları JSON'dakiyle aynı kalır; backend yeniden adlandırma yapmaz, yalnızca
`_id` alanını gizler. Sıralama kontrattaki gibidir (ödüller yıl azalan + sıra artan,
kilometre taşları yıl artan, diğerleri sıra artan). Yayında olmayan etkinlikler
(`yayinda: 0`) listelenmez.
