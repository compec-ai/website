import { useCallback, useEffect, useRef } from 'react';
import KurumLogosu from './KurumLogosu.jsx';

/* Kurum etiketi ("2026 ana sponsoru" gibi) burada degil, seritKurumlari()
   icinde uretiliyor. Serit yalnizca k.etiket'i basar. */

/* Akis artik CSS animasyonuyla degil, requestAnimationFrame ile suruluyor:
   kullanicinin seridi eliyle cekebilmesi icin konumun tek bir sahibi olmasi
   gerekiyordu (CSS animasyonu transform'u kilitliyor, inline transform ile
   birlikte kullanilamiyor). Liste iki kez basildigi icin konum yarim genislikte
   sarilir; sonsuz dongu hissi surukleme sirasinda da bozulmaz.
   Kutuphane yok (DIKKAT.md 11). */

const AZALT = '(prefers-reduced-motion: reduce)';

/* Azaltilmis hareket tercihinde serit ne akar ne surtuklenir: kap kendi yatay
   kaydirmasini kullanir (stil.css'teki reduced-motion blogu). */
const azaltilmis = () => (typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia(AZALT).matches : false);

/** YC tarzi akan kurum seridi. Logosu olan kurum logoyla, olmayan adiyla gorunur. */
export default function Serit({ kurumlar }) {
  const rayRef = useRef(null);
  const durum = useRef({ x: 0, yari: 0, hiz: 0, cekme: null, son: 0 });

  // ayni kurum birden cok yil sponsor olduysa tek kez goster
  const gorulen = new Set();
  const ogeler = [];
  for (const k of kurumlar || []) {
    if (gorulen.has(k.ad)) continue;
    gorulen.add(k.ad);
    ogeler.push(k);
  }

  // Akis hizi icerik uzunlugundan bagimsiz olsun: oge basina sabit sure.
  const sure = Math.max(90, Math.round(ogeler.length * 4.4));

  /* Konumu (-yari, 0] araligina sar: gorsel olarak ayni kare (liste iki kez
     basili), ama sayi buyumez ve sifir sifir kalir. */
  const sar = useCallback((x) => {
    const { yari } = durum.current;
    if (!yari) return 0;
    return -(((-x % yari) + yari) % yari);
  }, []);

  const bas = useCallback(() => {
    const d = durum.current;
    d.x = sar(d.x);
    if (rayRef.current) rayRef.current.style.transform = `translate3d(${d.x}px,0,0)`;
  }, [sar]);

  /* Olcum: ray iki kopya basiyor, yari genislik bir turun uzunlugu.
     Logolar gec yuklendiginde genislik degistigi icin ResizeObserver ile
     yeniden olculuyor. */
  useEffect(() => {
    const ray = rayRef.current;
    if (!ray) return undefined;
    const olc = () => {
      const yari = ray.scrollWidth / 2;
      durum.current.yari = yari;
      durum.current.hiz = yari / sure; // px/sn: CSS animasyonuyla ayni hiz
      bas();
    };
    olc();
    const g = new ResizeObserver(olc);
    g.observe(ray);
    return () => g.disconnect();
  }, [sure, bas, ogeler.length]);

  /* Otomatik akis. Sekme arka plandayken rAF zaten durur; azaltilmis hareket
     tercihinde hic baslamaz (o durumda kap kendi yatay kaydirmasini kullanir). */
  useEffect(() => {
    if (azaltilmis()) return undefined;
    let kimlik = 0;
    const d = durum.current;
    d.son = 0;
    const adim = (t) => {
      kimlik = requestAnimationFrame(adim);
      const gecen = d.son ? Math.min((t - d.son) / 1000, 0.1) : 0;
      d.son = t;
      if (d.cekme) return; // surukleme sirasinda otomatik akis durur
      d.x = sar(d.x - d.hiz * gecen);
      if (rayRef.current) rayRef.current.style.transform = `translate3d(${d.x}px,0,0)`;
    };
    kimlik = requestAnimationFrame(adim);
    return () => cancelAnimationFrame(kimlik);
  }, [sar]);

  if (!ogeler.length) return null;

  /* Surukleme. touch-action: pan-y (CSS) dikey sayfa kaydirmasini serbest
     birakir, yatay hareketi biz aliriz. Birakinca akis kaldigi yerden devam
     eder: konum tek degiskende tutuluyor, sifirlanmiyor. */
  const cekBas = (o) => {
    if (azaltilmis()) return;
    if (o.pointerType === 'mouse' && o.button !== 0) return;
    durum.current.cekme = { id: o.pointerId, x: o.clientX };
    o.currentTarget.setPointerCapture?.(o.pointerId);
  };
  const cekOynat = (o) => {
    const d = durum.current;
    if (!d.cekme || d.cekme.id !== o.pointerId) return;
    const dx = o.clientX - d.cekme.x;
    d.cekme.x = o.clientX;
    d.x = sar(d.x + dx);
    if (rayRef.current) rayRef.current.style.transform = `translate3d(${d.x}px,0,0)`;
  };
  const cekBirak = (o) => {
    const d = durum.current;
    if (!d.cekme || d.cekme.id !== o.pointerId) return;
    d.cekme = null;
    o.currentTarget.releasePointerCapture?.(o.pointerId);
  };

  const oge = (k, i) => {
    return (
      <div className={'serit-oge' + (k.anaSponsor ? ' ana' : '')} key={i}>
        <KurumLogosu ad={k.ad} yedek={<b>{k.ad}</b>} draggable="false" />
        <i>{k.etiket}</i>
      </div>
    );
  };

  return (
    <div className="serit-sar" aria-label="Etkinliklerimizi destekleyen kurumlar"
      onPointerDown={cekBas} onPointerMove={cekOynat}
      onPointerUp={cekBirak} onPointerCancel={cekBirak}
      onDragStart={(o) => o.preventDefault()}>
      {/* kesintisiz akis icin liste iki kez basilir */}
      <div className="serit" ref={rayRef}>
        {ogeler.map((k, i) => oge(k, 'a' + i))}
        {ogeler.map((k, i) => oge(k, 'b' + i))}
      </div>
    </div>
  );
}
