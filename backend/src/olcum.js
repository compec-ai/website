/* Yonetim panelindeki Olcum sekmesinin veri kaynagi.
   PostHog Query API'sine (HogQL) sorar; anahtar depoda DURMAZ, ortamdan gelir:
     POSTHOG_KISISEL_ANAHTAR  phx_... ile baslayan kisisel API anahtari
     POSTHOG_PROJE_ID         proje numarasi
     POSTHOG_SUNUCU           istege bagli, varsayilan https://eu.posthog.com
   Ikisinden biri eksikse uc 200 ile { kurulu: false } doner, panel de anahtarin
   nasil eklenecegini anlatir. PostHog tarafindaki hata mesaji disari sizmaz.

   Panel her acildiginda PostHog'a dort sorgu gitmesin diye sonuc bellekte
   5 dakika tutulur; surec yeniden baslayinca onbellek de sifirlanir. */

const ONBELLEK_SURESI = 5 * 60 * 1000;
const GUN = 14;

let onbellek = null; // { zaman, veri }

const anahtar = () => (process.env.POSTHOG_KISISEL_ANAHTAR || '').trim();
const proje = () => (process.env.POSTHOG_PROJE_ID || '').trim();
const sunucu = () => (process.env.POSTHOG_SUNUCU || 'https://eu.posthog.com').replace(/\/+$/, '');

export const olcumKurulu = () => Boolean(anahtar() && proje());

async function sor(hogql) {
  const cevap = await fetch(`${sunucu()}/api/projects/${encodeURIComponent(proje())}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${anahtar()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query: hogql } }),
    signal: AbortSignal.timeout(20000),
  });
  if (!cevap.ok) throw new Error(`posthog ${cevap.status}`);
  const govde = await cevap.json();
  return Array.isArray(govde?.results) ? govde.results : [];
}

const SORGULAR = {
  gunler: `SELECT toString(toDate(timestamp)) AS gun, count() AS sayi
           FROM events
           WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${GUN} DAY
           GROUP BY gun ORDER BY gun`,
  yollar: `SELECT properties.$pathname AS yol, count() AS sayi
           FROM events
           WHERE event = '$pageview' AND timestamp >= now() - INTERVAL ${GUN} DAY
           GROUP BY yol ORDER BY sayi DESC LIMIT 10`,
  surumler: `SELECT properties.surum AS surum, count() AS sayi
             FROM events
             WHERE timestamp >= now() - INTERVAL ${GUN} DAY
             GROUP BY surum ORDER BY sayi DESC LIMIT 20`,
  tekil: `SELECT count(DISTINCT person_id) AS sayi
          FROM events
          WHERE timestamp >= now() - INTERVAL ${GUN} DAY`,
};

const sayi = (deger) => (Number.isFinite(Number(deger)) ? Number(deger) : 0);

async function topla() {
  const [gunler, yollar, surumler, tekil] = await Promise.all([
    sor(SORGULAR.gunler), sor(SORGULAR.yollar), sor(SORGULAR.surumler), sor(SORGULAR.tekil),
  ]);
  return {
    kurulu: true,
    gunSayisi: GUN,
    gunler: gunler.map((s) => ({ gun: String(s[0] ?? ''), sayi: sayi(s[1]) })),
    yollar: yollar.map((s) => ({ yol: String(s[0] ?? '(bos)'), sayi: sayi(s[1]) })),
    surumler: surumler.map((s) => ({ surum: String(s[0] ?? '(bos)'), sayi: sayi(s[1]) })),
    tekil: sayi(tekil[0] ? tekil[0][0] : 0),
    guncelleme: new Date().toISOString(),
  };
}

export async function olcumOzeti(req, res) {
  if (!olcumKurulu()) return res.json({ kurulu: false });
  if (onbellek && Date.now() - onbellek.zaman < ONBELLEK_SURESI) {
    return res.json({ ...onbellek.veri, onbellekten: true });
  }
  try {
    const veri = await topla();
    onbellek = { zaman: Date.now(), veri };
    res.json(veri);
  } catch (hata) {
    // Anahtar ya da proje numarasi yanlis olabilir; ayrinti loga gider, cevaba degil.
    console.error('olcum sorgusu basarisiz:', hata.message);
    res.json({ kurulu: true, hata: 'PostHog sorgusu basarisiz' });
  }
}
