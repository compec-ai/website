/* Alt kenardaki cerez onay cubugu. Kutuphanesiz, tek komponent (DIKKAT.md 11).
   Icerigi engellemez: sayfanin dibine oturur, ustunde modal ya da perde yok.
   Secim yapilana kadar her sayfada gorunur; secimden sonra bir daha cikmaz. */

import { useEffect, useState } from 'react';
import { cerezDinle, cerezTercih, cerezTercihYaz } from '../lib/cerez.js';
import { olcumBaslat } from '../olcum.js';

export default function CerezCubugu() {
  const [tercih, setTercih] = useState(cerezTercih);

  // Profil sayfasindan degistirilirse cubuk da haberdar olsun.
  useEffect(() => cerezDinle(setTercih), []);

  if (tercih) return null;

  const sec = (deger) => {
    cerezTercihYaz(deger);
    // Kabul edildiyse olcum sayfa yenilenmeden burada baslar.
    if (deger === 'tam') olcumBaslat();
  };

  return (
    <div className="cerez" role="region" aria-label="Çerez tercihi">
      <div className="kap cerez-ic">
        <p className="cerez-metin">
          Giriş yapanların oturumunu açık tutan çerez zorunlu, o hep çalışır.
          Bir de hangi sayfaların okunduğunu sayan ölçüm çerezleri var
          (PostHog); onları açmak sana kalmış.
        </p>
        <div className="cerez-dugme">
          <button className="dugme kucuk" type="button" onClick={() => sec('tam')}>
            Kabul et
          </button>
          <button className="dugme sade kucuk" type="button" onClick={() => sec('zorunlu')}>
            Yalnız zorunlular
          </button>
        </div>
      </div>
    </div>
  );
}
