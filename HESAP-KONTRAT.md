# Hesap sistemi kontratı (profil + üyelik + bülten + admin)

API-KONTRAT.md'nin devamı; hesapla ilgili her şey burada. Bağlayıcıdır:
değişiklik önce buraya, sonra koda. İçerik API'si salt-okunur kalır, hesap
uçları `/api/hesap/...`, yönetim uçları `/api/admin/...` altındadır.

## Roller (sıralı, her rol altındakileri kapsar)

`uye` < `kulup-uyesi` < `lider` < `yk` < `baskan`

- Kayıt olan herkes `uye` başlar. Kayıtta "kulüp üyesi olmak istiyorum"
  işaretlenirse `kulupBasvuru: true` yazılır; bir yönetici onaylayınca rol
  `kulup-uyesi` olur (oryantasyon akışı: masada YK onaylar).
- Yönetim paneline erişim eşiği varsayılan `yk` (ayarlardan değiştirilebilir).
- Rol atama: kimse kendi rolüne eşit veya üstünü atayamaz; `baskan` tektir,
  devri yalnızca mevcut başkan yapabilir.
- Görünürlük: `lider` ve üstü ileride sitede kamuya listelenebilir; `uye` ve
  `kulup-uyesi` HİÇBİR kamu ucunda görünmez. (Mevcut /api/uyeler seed'den
  gelen içeriktir ve ayrı kalır; birleştirme sonraya, karar Ali Kağan'da.)

## Veri modeli (Mongo koleksiyonları)

- `users`: ad, soyad, eposta (benzersiz, giriş kimliği), parolaHash (bcrypt),
  rol, kulupBasvuru, duyuruIzni (bool, açık rıza), alanlar (esnek nesne:
  ayarlardaki kayıt alanlarının cevapları, örn. okulMaili, okulNo),
  olusturma, guncelleme.
- `sessions`: userId, jeton (rastgele 256 bit, hash'lenerek saklanır),
  olusturma, sonKullanim, bitis. Çerez: httpOnly + SameSite=Lax +
  (üretimde) Secure. JWT YOK.
- `subscribers`: eposta (benzersiz), izinTarihi, kaynak ('kayit' | 'form'),
  aktif. Üye olmayan da abone olabilir.
- `settings`: tek belge. `kayitAlanlari`: [{ad, etiket, tip: 'metin'|'eposta'|
  'sayi'|'onay', zorunlu, aktif}] (varsayılan: okulMaili + okulNo, ikisi de
  zorunlu; admin panelden değiştirilir, kod değişikliği gerekmez),
  `adminEsigi`, `bultenAciklama`.

## Uçlar

Hesap (herkese açık olanlar işaretli):
| Uç | Ne |
|---|---|
| `GET /api/hesap/kayit-alanlari` (açık) | settings.kayitAlanlari'nın aktif olanları; kayıt formu bundan çizilir |
| `POST /api/hesap/kayit` (açık) | ad, soyad, eposta, parola (min 8), duyuruIzni, kulupBasvuru, alanlar{} (zorunlu alanlar doğrulanır) |
| `POST /api/hesap/giris` (açık) | eposta + parola; başarısızda tek tip mesaj, hesap var/yok sızdırılmaz |
| `POST /api/hesap/cikis` | oturumu kapatır |
| `GET /api/hesap/ben` | kendi profili (parolaHash asla dönmez) |
| `PATCH /api/hesap/profil` | ad, soyad, duyuruIzni, alanlar{} |
| `PATCH /api/hesap/parola` | eski + yeni parola |
| `POST /api/bulten/abone` (açık) | eposta + açık izin; çift kayıtta sessiz başarı |

Admin (oturum + rol >= adminEsigi; her yazma isteğinde `X-Istek: compec`
başlığı zorunlu, CSRF önlemi):
| Uç | Ne |
|---|---|
| `GET /api/admin/uyeler` | tüm kullanıcılar (parolaHash hariç), filtre: rol, kulupBasvuru |
| `PATCH /api/admin/uyeler/:id` | rol atama (kural yukarıda), başvuru onayı/reddi |
| `GET/PATCH /api/admin/ayarlar` | kayitAlanlari, adminEsigi, bultenAciklama |
| `GET /api/admin/bulten` | aboneler + duyuruIzni=true üyeler (birleşik liste, CSV dışa aktarım parametresi `?csv=1`) |
| `GET/POST/PATCH/DELETE /api/admin/etkinlikler(/:slug)` | etkinlik CRUD |

## Seed stratejisi değişikliği (önemli)

Admin'den düzenlenebilen koleksiyonlar (şimdilik yalnız `etkinlikler`) her
açılışta seed ile EŞİTLENMEZ; yalnız koleksiyon BOŞSA seed'den yüklenir.
Yoksa admin'in düzenlemesi ilk restartta silinir. Diğer içerik koleksiyonları
eskisi gibi eşitlenir. backend/README bu ayrımı açıkça yazar.

## Güvenlik ve KVKK

- Parola bcrypt (cost 12). Oturum jetonu DB'de hash'li durur.
- Giriş ucunda basit hız sınırı (IP başına dakikada 10 deneme, bellek içi).
- Kişisel veri kuralı değişmedi: depoya ve seed'e kişisel veri girmez; artık
  DB'de kişisel veri VAR, DB volume'u git dışında ve host'a kapalı.
- Kayıt sayfasına KVKK aydınlatma metni ve açık rıza kutusu ŞART; metnin
  içeriği yazı oturumunda yazılacak, yer tutucu bileşen şimdiden konur.
- Bülten GÖNDERİMİ bu kapsamda yok (SMTP/servis kararı verilmedi); şimdilik
  toplama + admin listesi + CSV. Gönderim ayrı iş olarak açılacak.

## İlk yönetici

`backend` bir CLI komutu sağlar: `node src/yonetici.js <eposta> baskan`
(var olan kullanıcıyı yükseltir). İlk kurulumda başkan böyle atanır.
