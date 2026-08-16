# Beyaz (ters zemin) kurum logoları — kaynak listesi

Bu klasördeki dosyalar kurumların **resmi** beyaz / tek renk logo varyantlarıdır.
Koyu zeminde `filter: brightness(0) invert(1)` uygulanmadan basılırlar
(HATALAR.md madde 5). Üçüncü parti logo siteleri (seeklogo, logowik vb.)
kullanılmadı; her dosya ya kurumun kendi sitesinden ya da Wikimedia Commons'tan
alındı.

İşlem: kaynak SVG/PNG → şeffaf zeminli PNG, yükseklik 64px, tamamen saydam
kenarlar kırpıldı. Marka oranı değiştirilmedi, kırpma/gerdirme yapılmadı.
"Beyaza çevrildi" yazan satırlarda resmi vektörün dolgu renkleri beyaza
alındı; şekiller (delikler, iç detay) olduğu gibi korundu.

| Kurum | Dosya | Kaynak | İşlem / lisans notu |
|---|---|---|---|
| Akbank | `akbank.png` | https://www.akbank.com/SiteAssets/img/footer-logo.svg | Kurumun kendi sitesindeki resmi beyaz footer logosu. Renk değişikliği yok. Marka hakkı Akbank T.A.Ş. |
| HubX | `hubx.png` | https://hubx.com/assets/images/logo-white-title.svg | Kurumun kendi sitesindeki resmi beyaz logo (mercan aksan korundu). Renk değişikliği yok. Marka hakkı HubX. |
| Acıbadem Technology | `acibadem-technology.png` | https://www.acibademtechnology.com/_next/static/media/logo.8da6bde8.png | Kurumun kendi sitesindeki resmi beyaz logo. Renk değişikliği yok. Marka hakkı Acıbadem Technology. |
| Yapı Kredi Teknoloji | `yapi-kredi-teknoloji.png` | https://www.ykteknoloji.com.tr/images/header-icon.svg | Kurumun kendi sitesindeki resmi ters zemin logosu (amblem gri, yazı beyaz). Renk değişikliği yok. Marka hakkı Yapı Kredi Teknoloji A.Ş. |
| ING | `ing.png` | https://ing.com/webfiles/1782982167080/images/ing-logo.svg | Kurumun kendi sitesindeki resmi vektör; **beyaza çevrildi** (lacivert yazı + turuncu aslan → beyaz). Aslanın iç detayı vektör deliği olduğu için korundu. Marka hakkı ING Groep N.V. |
| Solvoyo | `solvoyo.png` | https://www.solvoyo.com/wp-content/uploads/2026/06/solvoyo-logo-white-300x118.png | Kurumun kendi sitesindeki resmi beyaz logo. Renk değişikliği yok. Marka hakkı Solvoyo. |
| Upsonic | `upsonic.png` | https://upsonic.ai/ (sitenin koyu başlığındaki gömülü SVG logo) | Resmi ters zemin logosu; `CurrentColor` **beyaza sabitlendi**, yeşil aksan (#0BDA51) korundu. Marka hakkı Upsonic. |

## Beyaz varyantı bulunamayanlar

Aşağıdaki kurumların resmi bir beyaz/ters zemin varyantı açık kaynakta
bulunamadı. Bunlar mevcut renkli logo + invert filtresiyle kalmaya devam ediyor.
Bir kurum ileride beyaz varyant yayımlarsa buraya eklenip
`frontend/src/veri/kurumbeyazlogolari.js` güncellenir.

| Kurum | Bakılan yer | Durum |
|---|---|---|
| Huawei | huawei.com (başlık logosu yalnızca renkli), Wikimedia Commons (yalnızca wordmark, taç yaprakları yok) | Bulunamadı. İnvert temiz çıkıyor (taç yaprakları ayrı şekil), mevcut hâl korundu. |
| TEB | teb.com.tr (başlık/footer yalnızca renkli), Wikimedia Commons'taki `TEB logo.svg` **başka kurum** (Eurodistrict Trinational de Bâle) | Bulunamadı. İnvertte yeşil kare beyaz bloğa dönüyor, sorun sürüyor. |
| Global Maksimum | globalmaksimum.com (yalnızca tek renkli PNG amblem) | Bulunamadı. İnvertte amblem 26px'te okunmuyor, sorun sürüyor. |
| Invent Analytics | inventanalytics.com artık invent.ai'a yönleniyor; orada yalnızca `Wordmark_Black.svg` var, `_White` varyantı 404 | Bulunamadı. |
| Ace Games | acegames.io (resmi SVG çok renkli, beyaz varyant yok) | Bulunamadı. İnvert kabul edilebilir. |
