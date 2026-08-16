import { useCallback, useEffect, useRef, useState } from 'react';

/* Ortak kaydirak (carousel). DIKKAT.md 11: yeni etkilesim kalibi tek yerde,
   kutuphanesiz yazilir. Ana sayfadaki uc kaydirak (kahraman fotograflari,
   kanitli rakamlar, ekip kartlari) bu tek komponenti kullanir.

   Kurallar:
   - Yerlesim kaymasi sifir: butun kareler DOM'da yan yana durur, ray yatay
     otelenir. Kabin yuksekligi en uzun kareye gore bastan bellidir, gecis
     sirasinda hicbir sey ziplamaz.
   - Otomatik ilerleme; prefers-reduced-motion acikken, isaretci/odak kabin
     uzerindeyken ve sekme gorunmezken (document.hidden) durur.
   - Ok dugmeleri ve noktalar gercek <button>, aria-label'li; klavye ile
     erisilebilir. Gorunmeyen bir karedeki bag odaklanirsa o kare kaydirilir
     (odak ekran disinda kalmaz).
   - Dokunmatikte parmakla kaydirma: pointer olaylari, kutuphane yok.

   Ozellikler:
     ogeler  dizi
     goster  genis ekranda ayni anda gorunen kare sayisi (dar ekranda hep 1)
     cocuk   (oge, indeks) => JSX
     etiket  aria-label
     sure    otomatik ilerleme araligi (ms)
     sinif   kaba eklenen ek sinif
     anahtar (oge, indeks) => React key */

const DAR = '(max-width: 700px)';

function medya(sorgu) {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(sorgu) : null;
}

function useMedya(sorgu) {
  const [acik, setAcik] = useState(() => medya(sorgu)?.matches || false);
  useEffect(() => {
    const m = medya(sorgu);
    if (!m) return undefined;
    const dinle = () => setAcik(m.matches);
    dinle();
    m.addEventListener('change', dinle);
    return () => m.removeEventListener('change', dinle);
  }, [sorgu]);
  return acik;
}

export default function Kaydirak({
  ogeler, goster = 1, cocuk, etiket, sure = 6500, sinif = '', anahtar,
}) {
  const dar = useMedya(DAR);
  const azalt = useMedya('(prefers-reduced-motion: reduce)');
  const [gizli, setGizli] = useState(() => (typeof document !== 'undefined' ? document.hidden : false));
  const [duruyor, setDuruyor] = useState(false);
  const [i, setI] = useState(0);
  const pencere = useRef(null);
  const cekme = useRef(null);

  const adet = ogeler.length;
  const gorunen = Math.max(1, Math.min(dar ? 1 : goster, adet));
  const enSon = Math.max(0, adet - gorunen);
  const durak = enSon + 1;

  const git = useCallback((h) => setI(() => Math.max(0, Math.min(enSon, h))), [enSon]);
  useEffect(() => { setI((o) => Math.min(o, enSon)); }, [enSon]);

  /* Sekme arka plandayken zamanlayici bosuna donmesin. */
  useEffect(() => {
    const bak = () => setGizli(document.hidden);
    document.addEventListener('visibilitychange', bak);
    return () => document.removeEventListener('visibilitychange', bak);
  }, []);

  useEffect(() => {
    if (azalt || duruyor || gizli || enSon === 0) return undefined;
    const t = setInterval(() => setI((o) => (o >= enSon ? 0 : o + 1)), sure);
    return () => clearInterval(t);
  }, [azalt, duruyor, gizli, enSon, sure]);

  /* Parmakla kaydirma. Esik asilmadan kare degismez, dikey kaydirma bozulmaz. */
  const bas = (o) => {
    if (o.pointerType === 'mouse' && o.button !== 0) return;
    cekme.current = { x: o.clientX, y: o.clientY, karar: false };
  };
  const oynat = (o) => {
    const c = cekme.current;
    if (!c || c.karar) return;
    const dx = o.clientX - c.x;
    const dy = o.clientY - c.y;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy)) return;
    c.karar = true;
    git(i + (dx < 0 ? 1 : -1));
  };
  const birak = () => { cekme.current = null; };

  /* Ekran disindaki bir karedeki bag klavyeyle odaklanirsa o kareyi getir;
     tarayicinin kabi kendi kaydirmasi yerleşimi bozardi. */
  const odak = (o) => {
    const kare = o.target.closest?.('.kaydirak-kare');
    if (!kare || !pencere.current) return;
    const sira = Number(kare.dataset.sira);
    if (Number.isNaN(sira)) return;
    if (sira < i) git(sira);
    else if (sira > i + gorunen - 1) git(sira - gorunen + 1);
  };
  const kaydi = () => { if (pencere.current) pencere.current.scrollLeft = 0; };

  if (!adet) return null;

  return (
    <div className={'kaydirak' + (sinif ? ' ' + sinif : '')}
      style={{ '--goster': gorunen }}
      role="group" aria-roledescription="kaydırak" aria-label={etiket}
      onMouseEnter={() => setDuruyor(true)}
      onMouseLeave={() => setDuruyor(false)}
      onFocusCapture={(o) => { setDuruyor(true); odak(o); }}
      onBlurCapture={() => setDuruyor(false)}>
      {/* Fotograf/bag suruklemesi tarayicinin kendi "drag" davranisini
          baslatiyor ve parmakla kaydirmayi yarida kesiyordu. */}
      <div className="kaydirak-pencere" ref={pencere} onScroll={kaydi}
        onDragStart={(o) => o.preventDefault()}
        onPointerDown={bas} onPointerMove={oynat}
        onPointerUp={birak} onPointerCancel={birak} onPointerLeave={birak}>
        <div className="kaydirak-ray" style={{ '--i': i }}>
          {ogeler.map((o, s) => (
            <div className="kaydirak-kare" data-sira={s}
              key={anahtar ? anahtar(o, s) : s}>
              {cocuk(o, s)}
            </div>
          ))}
        </div>
      </div>
      {enSon > 0 ? (
        <div className="kaydirak-yon">
          <div className="kaydirak-nokta">
            {Array.from({ length: durak }, (_, s) => (
              <button type="button" key={s}
                className={'nokta' + (s === i ? ' etkin' : '')}
                aria-label={`${s + 1}. kare`} aria-current={s === i}
                onClick={() => git(s)} />
            ))}
          </div>
          <div className="kaydirak-ok">
            <button type="button" aria-label="Önceki" disabled={i === 0}
              onClick={() => git(i - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
                strokeWidth="1.8"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" aria-label="Sonraki" disabled={i === enSon}
              onClick={() => git(i + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
                strokeWidth="1.8"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
