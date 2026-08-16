const ETIKET_AD = { 'kulup-ici': 'kulüp içi', supheli: 'çıkarım', eksik: 'eksik' };

/* "dogrulanmis" cipi BILEREK basilmiyor. Zaten bilgi tasimiyordu: odullerde
   kayitlarin neredeyse tamami dogrulanmis, yani etiket her satirda tekrarlaniyordu.
   Anlamli olan ISTISNALAR: cikarim, kulup ici, eksik. Dogrulamanin kaniti
   kaybolmuyor, kaynak metni her satirda yerinde duruyor. */
export default function Cip({ etiket }) {
  if (!etiket || etiket === 'dogrulanmis') return null;
  return <span className={'cip ' + etiket}>{ETIKET_AD[etiket] || etiket}</span>;
}
