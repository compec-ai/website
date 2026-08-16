# Dikkat listesi

Koda dokunan her agent'a ve katkıcıya verilen kontrol listesi. HATALAR.md'deki
yaşanmış hatalardan ve gelen geri bildirimlerden süzüldü. Kısa kalması bilerek;
madde eklerken bir yaşanmışlığa dayandır.

1. **Mobil her değişiklikte test edilir** (390px genişlik dahil). Header menüsü
   header ile birlikte sabit (sticky) olmalı ve açılıp kapanması animasyonlu
   olmalı; sayfanın neresinde olursan ol menü görünür açılmalı.
2. **Sol/sağ boşluklar simetrik.** Tablo ve liste hücrelerinde kenara yapışan
   veya gereksiz içeri kaçan metin bırakma; bir kenarı düzeltirken diğerini ölç.
3. **Koyu şemada kontrast:** ayraç çizgileri ve ikincil metinler seçilebilir mi
   diye gözle kontrol et, tek piksellik soluk çizgiler kaybolur.
4. **Aynı bilgi bir sayfada iki kez basılmaz.** Bir sayı zaten bir bölümde
   varsa başka bölümde tekrarlanmaz.
5. **Metinlere dokunma.** Site metinleri geçici, Tuna ile baştan yazılacak.
   Kendi kafana göre metin yazma/parlatma; sorunlu metni raporda işaretle.
6. **Rota adları kullanıcı dilinde.** Kullanıcıya görünen yollar Türkçe ve
   anlaşılır olur; bir rota adı değişirse eski yol 301 ile korunur.
7. **Bağlamsız sayı etiketi kullanma.** "23 kişilik kadro" gibi tek başına
   anlaşılmayan ifadeler yerine "tümünü gör" kalıbı ve sayfaya yönlendirme.
8. **Görünen her sayı veriden gelir** (seed/API), koda gömülmez.
9. **Nokta düzeltmesi yerine ortak kural.** Bir margin/padding sorununu tek
   öğede yamamadan önce aynı sınıfı kullanan diğer yerlere bak; sorun kuralda
   ise kuralı düzelt.
10. **Bölüm sırası içerik hiyerarşisine göre.** Sponsor/destek öğeleri sayfanın
    üst kısmında yer kaplamaz.
11. **Yeni etkileşim kalıbı tek komponent.** Carousel gibi bir kalıp gerekirse
    bir kez, ortak komponent olarak ve kütüphanesiz yazılır.
12. **HATALAR.md okunur, yeni hata oraya işlenir.**
