import { logoBul, kurumLogo } from '../lib/bicim.js';

/* Kurum etiketi ("2026 ana sponsoru" gibi) burada degil, seritKurumlari()
   icinde uretiliyor. Serit yalnizca k.etiket'i basar. */

/** YC tarzi akan kurum seridi. Logosu olan kurum logoyla, olmayan adiyla gorunur. */
export default function Serit({ kurumlar }) {
  // ayni kurum birden cok yil sponsor olduysa tek kez goster
  const gorulen = new Set();
  const ogeler = [];
  for (const k of kurumlar || []) {
    if (gorulen.has(k.ad)) continue;
    gorulen.add(k.ad);
    ogeler.push(k);
  }
  if (!ogeler.length) return null;

  // Akis hizi icerik uzunlugundan bagimsiz olsun: oge basina sabit sure.
  const sure = Math.max(90, Math.round(ogeler.length * 4.4));

  const oge = (k, i) => {
    const dosya = logoBul(k.ad);
    return (
      <div className={'serit-oge' + (k.anaSponsor ? ' ana' : '')} key={i}>
        {dosya ? <img src={kurumLogo(dosya)} alt={k.ad} loading="lazy" /> : <b>{k.ad}</b>}
        <i>{k.etiket}</i>
      </div>
    );
  };

  return (
    <div className="serit-sar" aria-label="Etkinliklerimizi destekleyen kurumlar">
      {/* kesintisiz akis icin liste iki kez basilir */}
      <div className="serit" style={{ '--sure': sure + 's' }}>
        {ogeler.map((k, i) => oge(k, 'a' + i))}
        {ogeler.map((k, i) => oge(k, 'b' + i))}
      </div>
    </div>
  );
}
