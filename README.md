# COMPEC website

Boğaziçi Üniversitesi Bilişim Kulübü'nün yeni sitesi. Tasarım, deneme sürümleri
arasından seçilen v7'den ([website-tests](https://github.com/compec-ai/website-tests)
deposu, canlı hali <https://compec.tunapro.xyz/website/>) React'e taşındı.

## Yapı

```
backend/    Node.js (Express) + MongoDB (Mongoose). Salt-okunur içerik API'si.
frontend/   React + Vite. v7 tasarımının birebir taşıması.
seed/       İçerik verisi (JSON). Tek doğruluk kaynağı; MongoDB buradan tohumlanır.
API-KONTRAT.md  backend ile frontend arasındaki sözleşme. Önce burası değişir.
HATALAR.md      yapılmış hataların sicili. Benzer işe girişmeden önce oku.
```

## Çalıştırma (Docker, tek komut)

```bash
docker compose up --build          # üretim benzeri: http://localhost:8080
docker compose -f docker-compose.dev.yml up --build   # geliştirme: http://localhost:5173 (hot reload)
```

MongoDB kalıcı verisi named volume'da tutulur; `seed/` içeriği açılışta
otomatik yüklenir (idempotent, tekrar çalıştırmak güvenlidir).

## Dallar

- `dev`: günlük çalışma burada. Varsayılan dal.
- `stable`: yayına hazır durum. `dev`'den bilinçli merge alır, doğrudan push edilmez.

## İçerik kuralları (tasarım denemelerinden devralındı, pazarlıksız)

- Sitedeki her rakam `seed/` verisinden gelir ve kaynağı vardır. Uydurma
  konuşmacı, rakam veya sponsor eklenmez; doğrulanamayan bilgi konmaz, bölüm boş kalır.
- Doğrulama etiketleri yalnızca istisnalar için basılır (`çıkarım`, `kulüp içi`,
  `eksik`); "doğrulanmış" etiketi basılmaz.
- Kommunity sayıları "katılımcı" değil "kayıt" olarak yazılır.
- Metinlerde ve yorumlarda uzun tire (em dash) kullanılmaz.
- Kişisel veri (e-posta, parola, oturum, IP) depoya ve API'ye girmez.

## Yol haritası: profil / hesap sistemi (planda, henüz yazılmadı)

İlk amaç temiz bir depo ve çalışan içerik sitesi. Hesap sistemi bilinçli olarak
sonraya bırakıldı ama temeller ona göre atıldı:

- İnsanların kendi profili olacak: ad soyad + e-posta ile kayıt/giriş.
- E-posta listesi ileride newsletter ve etkinlik duyuruları için kullanılacak,
  bu yüzden kayıtta açık bir "duyuru almak istiyorum" onayı (opt-in) tutulacak.
- Veri modeli önerisi: tek `users` koleksiyonu (`ad`, `eposta` benzersiz,
  `duyuruIzni`, `olusturma`). Parola mı, e-postaya giriş bağlantısı mı
  (magic link) backend sorumlusunun kararı; magic link daha az veri tutar.
- Mevcut içerik API'si salt-okunur kalır; hesap uçları `/api/hesap/...` altına
  gelir, içerikle karışmaz.

Şimdilik depoda hesapla ilgili KOD YOK; bloat istemiyoruz. Bu bölüm yazılana
kadar tek kişisel veri kuralı geçerli: depoya ve API'ye kişisel veri girmez.

## Bilerek olmayanlar

- Hesap/üyelik kodu (yukarıdaki plan yazılana kadar).
- Analytics varsayılan kapalı (`VITE_POSTHOG_KEY` verilirse açılır).
- CMS, admin paneli, SSR framework'ü. İçerik `seed/` JSON'larından gelir;
  içerik değişikliği = JSON düzenle + PR.
