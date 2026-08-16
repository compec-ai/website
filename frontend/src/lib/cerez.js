/* Cerez onayi tek yerde. Tercih localStorage'da 'cerezTercih' anahtarinda durur:
   'tam'     = olcum cerezleri de acik (PostHog yuklenir)
   'zorunlu' = yalniz oturum cerezi (compec_oturum); PostHog hic yuklenmez
   null      = secim yapilmadi; alt cubuk gorunur, PostHog yine yuklenmez.

   Oturum cerezi (compec_oturum) zorunlu kategoridedir ve bu tercihe bagli
   degildir: giris yapmak icin gerekli, onaya tabi tutulmaz. */

export const CEREZ_ANAHTAR = 'cerezTercih';
const OLAY = 'compec-cerez-tercih';

export function cerezTercih() {
  try {
    const deger = localStorage.getItem(CEREZ_ANAHTAR);
    return deger === 'tam' || deger === 'zorunlu' ? deger : null;
  } catch {
    // Ozel sekmede localStorage kapali olabilir; secim yapilmamis sayilir.
    return null;
  }
}

export function cerezTercihYaz(deger) {
  if (deger !== 'tam' && deger !== 'zorunlu') return;
  try { localStorage.setItem(CEREZ_ANAHTAR, deger); } catch { /* yazilamiyorsa sayfa omru boyunca gecerli */ }
  dispatchEvent(new CustomEvent(OLAY, { detail: deger }));
}

/** Tercih degisince haber verir; geri donen islev dinleyiciyi kaldirir. */
export function cerezDinle(islev) {
  const sar = (olay) => islev(olay.detail);
  addEventListener(OLAY, sar);
  return () => removeEventListener(OLAY, sar);
}
