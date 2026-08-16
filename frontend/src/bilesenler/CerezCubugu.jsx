/* Alt kenardaki cerez BILGILENDIRME cubugu (Tuna, 2026-08-16: "onay ya da
   red degil"). Olcum varsayilan acik; cubuk yalniz bilgi verir, Tamam ile
   kapanir ve bir daha cikmaz. Kapatma istegi profil sayfasindaki "Olcumu
   kapat" ile yapilir. Kutuphanesiz, icerigi engellemez. */

import { useState } from 'react';

const BILGI_ANAHTAR = 'cerezBilgi';

function goruldu() {
  try { return localStorage.getItem(BILGI_ANAHTAR) === '1'; } catch { return true; }
}

export default function CerezCubugu() {
  const [kapali, setKapali] = useState(goruldu);

  if (kapali) return null;

  const kapat = () => {
    try { localStorage.setItem(BILGI_ANAHTAR, '1'); } catch { /* sayfa omru yeter */ }
    setKapali(true);
  };

  return (
    <div className="cerez" role="region" aria-label="Çerez bilgilendirmesi">
      <div className="kap cerez-ic">
        <p className="cerez-metin">
          Bu site giriş yapanların oturumunu açık tutan zorunlu bir çerez ve
          hangi sayfaların okunduğunu sayan ölçüm çerezleri (PostHog) kullanır.
          Ölçümü istemezsen profil sayfandan kapatabilirsin.
        </p>
        <div className="cerez-dugme">
          <button className="dugme kucuk" type="button" onClick={kapat}>
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
