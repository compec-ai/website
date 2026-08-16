# frontend

v7 tasarımının React + Vite taşıması. Tüm içerik `/api/...` uçlarından gelir
(bkz. `../API-KONTRAT.md`); sayfalarda sabit yazılı rakam yoktur.

```bash
npm install
npm run dev      # 5173, /api -> VITE_API_HEDEF (varsayılan http://backend:3001)
npm run build    # dist/
```

Docker: `Dockerfile` (çok aşamalı, nginx, 80, `/api` -> `backend:3001`),
`Dockerfile.dev` (vite dev sunucusu, 5173).

## Yapı

- `src/sayfalar/` her yol için bir bileşen, `src/bilesenler/` ortak parçalar.
- `src/lib/api.js` fetch + önbellek, `src/lib/bicim.js` biçimleme ve şerit mantığı.
- `public/stil.css`, `public/yazi.css` v7'den aynen alındı; `public/varliklar/` ve
  `public/yazi/` görsel ve fontlar. Dışarıya (Google Fonts, CDN) istek yok.
- `src/veri/kurumlogolari.js`: kurum logosu dosya listesi, yeni logoda güncellenir.

## Notlar

- Analytics varsayılan kapalı: yalnızca `VITE_POSTHOG_KEY` tanımlıysa yüklenir.
- "Doğrulanmış" etiketi basılmaz; yalnızca çıkarım / kulüp içi / eksik basılır.
- Hesap sistemi henüz yok: "Aramıza katıl" bağlantıları `/katil` sayfasına gider.
