# API kontratı (backend ↔ frontend)

İki taraf paralel geliştirildiği için bu dosya bağlayıcıdır. Değişiklik gerekirse
önce burası güncellenir, sonra kod.

Tüm uçlar salt-okunur içerik döner, JSON, UTF-8. Önek: `/api`.
Hata: `{ "hata": "<mesaj>" }` + uygun HTTP kodu. Bilinmeyen slug → 404.

| Uç | Dönen |
|---|---|
| `GET /api/ozet` | `{ etkinlik, odul, odulYil, konusmaci, kurum, uye, kanit }` (sayılar; `odulYil` = ödül arşivindeki tören yılı sayısı) |
| `GET /api/etkinlikler` | dizi: `{ slug, ad, ozet, tur, yil, mekan, kayit_sayisi, sure, baski, foto, sira }` (`sira` artan) |
| `GET /api/etkinlikler/:slug` | tek etkinlik + `baskilar: [{no, yil, tarih, mekan, ana_sponsor, not_metni, kayit_sayisi}]`, `konusmacilar: [...]`, `kurumlar: [...]` (o etkinliğe ait olanlar) |
| `GET /api/oduller` | dizi: `{ yil, kategori, kazanan, kaynak_url, etiket }` (yıl azalan, sira artan) |
| `GET /api/kanitlar` | dizi: `{ konu, iddia, deger, kaynak, kaynak_url, etiket, aciklama, sira }` |
| `GET /api/kilometre` | dizi: `{ yil, baslik, aciklama, kaynak, etiket, sira }` (yıl artan) |
| `GET /api/konusmacilar` | dizi: `{ ad, kurum, unvan, baslik, etkinlik, yil, tur, sira }` |
| `GET /api/kurumlar` | dizi: `{ ad, etkinlik, yil, kademe, sira }` |
| `GET /api/gezileri` | dizi: `{ kurum, yil, sira }` |
| `GET /api/uyeler` | dizi: `{ slug, ad, bolum, giris_yili, linkedin, github, hakkinda, foto, gorev, donem, kurul, kaynak }` |
| `GET /api/uyeler/:slug` | tek üye, aynı alanlar |

Alan adları `seed/*.json` dosyalarındakiyle birebir aynıdır; backend yeniden
adlandırma yapmaz, frontend bu adlara güvenir.

Portlar: backend `3001`, frontend dev sunucusu `5173` (Vite, `/api`yi 3001'e
proxy'ler), MongoDB `27017` (yalnızca compose ağı içinde). Üretim compose'unda
frontend nginx'i `80` dinler ve `/api`yi backend'e proxy'ler.

Kişisel veri kuralı: API'ye ve seed'e e-posta, parola, oturum, oy/IP verisi
GİRMEZ. `seed/uyeler.json` yalnızca sitede zaten yayımlanan profil alanlarını
içerir.
