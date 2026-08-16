# Hata sicili

Bu projede (deneme sürümleri dahil) yapılmış gerçek hataların kaydı. Amaç
tekrarlanmamaları: benzer bir işe girişmeden önce buraya bak, yeni bir hata
yaşandığında buraya işle. Her madde: ne oldu, neden oldu, kural.

Durum işaretleri: [AÇIK] düzeltilmedi, diğerleri düzeltildi.

## İçerik ve metin

1. **İç değerlendirme notları yayımlanan HTML'e gömüldü.** Sponsorluk sayfasında
   kulübün kendi beyanlarını çürüttüğümüz satırlar HTML yorumu olarak kaynakta
   duruyordu; "kaynağı görüntüle" diyen sponsor okuyabiliyordu.
   Kural: iç not yayımlanan dosyaya girmez, ayrı not dosyasına yazılır.
2. **"Doğrulanmış" etiketi her satıra basıldı.** 222 kaydın 220'si doğrulanmışken
   etiket bilgi taşımıyordu, gürültüydü.
   Kural (2026-08-16 güncellendi): doğrulama etiketleri KULLANICIYA HİÇ
   gösterilmez (Tuna kararı); etiketler veri alanında iç kayıt olarak yaşar.
3. **Var olmayan özelliğe gönderme yapan metin.** Üye dizininde "giriş yapıp
   güncelleyebilirsin" yazıyordu; yeni sitede giriş yok.
   Kural: metin, o an sitede gerçekten var olan davranışı anlatır. Özellik
   kaldırılınca ona gönderme yapan metinler de taranıp ayıklanır.
4. **Sabit rakam koda gömüldü.** Ödül düğmesinde 250 yazıyordu, veritabanında
   222 kayıt vardı.
   Kural: sayfada görünen her sayı veriden gelir, koda yazılmaz.

## Görsel

5. **[AÇIK] Koyu logolar CSS ile beyazlatılıyor.** Kurum şeridi ve kadro
   bölümünde `filter: brightness(0) invert(1)` renkli/lacivert logoları zorla
   beyaz silüete çeviriyor; ince yazılar 26px yükseklikte eziliyor (Yapı Kredi
   Teknoloji, Acıbadem Technology belirgin bozuk).
   Kural: koyu zeminde kurumun gerçek beyaz/tek renk logo varyantı kullanılır;
   filtreyle beyazlatma geçici çözümdür, marka görselini bozar.
6. **Boş kalan ızgara hücreleri.** Ödül seçkisi 5 sütunlu auto-fit ızgaraya 7
   öge koyunca son satır boşluk bloğu gibi görünüyordu.
   Kural: seçki ızgaralarında sütun sayısı sabitlenir ve öge sayısı satırı
   dolduracak şekilde seçilir.
17. **`aspect-ratio` ile `max-height` aynı kutuda kullanıldı, kutu daraldı.**
    (Numara sıra dışı: eski numaralar sabit kalsın diye sona eklendi.)
    Kahraman kaydırağında foto alanına `aspect-ratio: 16/6.2` + `max-height:
    52vh` verildi; yükseklik sınırı devreye girince Chromium oranı korumak için
    kutunun GENİŞLİĞİNİ de kıstı (1280 yerine 1208px), fotoğrafın iki yanında
    koyu şerit kaldı. Ekran görüntüsüne bakınca fotoğrafın kendi karanlığı
    sanıldı, ancak ölçünce çıktı.
    Kural: sabit yükseklik isteniyorsa `height` (clamp/vw) yazılır; oran ve
    yükseklik sınırı aynı kutuda birleştirilmez. Kutu ölçüsü gözle değil
    `getBoundingClientRect` ile doğrulanır.

## Veri

7. **Sürüme özel veri paylaşılan kolona yazıldı.** v7 tohumu paylaşılan
   `etkinlikler.foto` kolonunu değiştirince v3-v6'da fotoğraflar 404 oldu.
   Kural: paylaşılan veri kaynağında sürüme/özelliğe özel değişiklik ayrı
   tabloda/koleksiyonda tutulur.
8. **Büyük/küçük harfe duyarlı sorgu.** Sorgu 'Sahibinden.com' ararken veride
   'sahibinden.com' vardı, sonuç sessizce eksik geldi.
   Kural: metin eşleştirmede önce verinin gerçek halini kontrol et; sorgu
   sonucu beklenen sayıyla doğrulanır.
9. **Alan adı uyuşmazlığı sessiz veri kaybı yarattı.** Şablon `not_` okuyordu,
   veri `not_metni` taşıyordu; baskı notları aylarca hiç basılmadı ve kimse
   fark etmedi.
   Kural: alan adları tek sözleşmede yaşar (API-KONTRAT.md); şablon/istemci o
   adlara güvenir, elle senkron tutulmaz.
10. **Belirsiz GROUP BY.** SQLite `GROUP BY kazanan` gruptan rastgele satır
    seçiyordu; hangi yılın kaydının geldiği tanımsızdı.
    Kural: gruplama yaparken hangi satırın seçileceği açıkça yazılır.

## Kurulum ve dağıtım

11. **Taze klon çalışmıyordu.** `.gitignore`'daki sondaki `/` symlink'i dosya
    olarak izlemeye devam ettirdi; klonda symlink sarkık kaldı, uygulama açılışta
    çöktü. Katkı verecek kişi projeyi başlatamadı.
    Kural: her push sonrası "temiz klonda tek komutla çalışıyor mu" testi
    yapılır (bu depoda: `docker compose up --build`).
12. **Önbellek, düzeltmeyi ziyaretçiye ulaştırmadı.** Ölçüm scripti 7 gün
    önbellekleniyordu; dosya düzeltildi ama mevcut ziyaretçiler eski hatalı
    sürümü çalıştırmaya devam etti.
    Kural: uzun önbellekli statik dosyada davranış değişikliği = URL damgası
    (`?s=<sayı>`) artırılır.
13. **Kopyalanan koddaki kimlik güncellenmedi.** v7, v3'ten kopyalanınca
    analytics'e kendini "v3-gece" diye raporladı; ölçüm verisi kirlendi.
    Kural: bir sürüm/servis kopyalandığında kimlik alanları (isim, etiket,
    ölçüm damgası) ilk iş güncellenir ve gerçek trafikte doğrulanır.
14. **Şablon ve stylesheet farklı kaynaklardan birleştirildi, karşılıksız
    sınıflar kaldı.** v7 = v4 şablonları + v3 stylesheet'i; 19 class'ın CSS'i
    yoktu, iki sayfa bozuk yayındaydı.
    Kural: iki kaynaktan birleştirmede class envanteri çıkarılıp iki yönde
    (kullanılan-tanımsız / tanımlı-kullanılmayan) taranır.
15. **Depo yeniden adlandırma yönlendirmesine güvenildi.** Push'lar GitHub'ın
    eski-isim yönlendirmesiyle çalışıyordu; eski isimde yeni depo açılsa
    push'lar sessizce yanlış yere giderdi.
    Kural: depo taşındığında remote adresi hemen yeni kanonik ada çekilir.
18. **Yayın dalına toptan push az kalsın onaysız özelliği canlıya çıkarıyordu.**
    (Numara sona eklendi.) Carousel'i yayına almak için `dev:stable` push'landı;
    dev o sırada henüz KVKK metni olmayan hesap sistemini de içeriyordu. Canlıya
    çıkmadan yakalandı, stable seçilerek yeniden kuruldu.
    Kural: `stable`'a asla dal toptan push'lanmaz; yayına çıkacak değişiklik
    seçilerek alınır ve push'tan önce "stable'da şu an ekstra ne var" diye
    `git log stable..dev` okunur.
16. **Varsayılan dal karmaşası (master/main).** Yerel `master`, uzak `main`
    beklerken push'lar dallanmayı ikiye böldü.
    Kural: depo açılışında dal adı bilinçli seçilir (burada: `dev` varsayılan,
    `stable` yayın) ve uzakla birebir doğrulanır.
