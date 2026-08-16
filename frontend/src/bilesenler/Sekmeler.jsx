/* Sekme kalibi tek yerde (DIKKAT.md 11: yeni etkilesim kalibi ortak komponent).
   Kutuphanesiz; secili sekme URL'de ?sekme=... olarak durur, sayfa
   yenilenince ya da bag paylasilinca ayni sekme acilir. */
export default function Sekmeler({ sekmeler, etkin, sec }) {
  return (
    <div className="sekmeler" role="tablist">
      {sekmeler.map(([anahtar, etiket]) => (
        <button key={anahtar} type="button" role="tab"
          aria-selected={etkin === anahtar}
          className={'sekme' + (etkin === anahtar ? ' etkin' : '')}
          onClick={() => sec(anahtar)}>{etiket}</button>
      ))}
    </div>
  );
}
