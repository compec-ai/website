import { KURUM_LOGOLARI } from '../veri/kurumlogolari.js';

/* Sayiyi Turkce bicimde yaz (1234 -> 1.234) */
export function sayi(n) {
  return typeof n === 'number' ? n.toLocaleString('tr-TR') : '';
}

/* v7'deki lib/guvenlik.mjs slugla() ile ayni davranis. */
export function slugla(ad) {
  const harita = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i', I: 'i' };
  return String(ad || '').toLowerCase()
    .replace(/[çğıöşüİI]/g, (c) => harita[c] || c)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const LOGO_HARITA = Object.fromEntries(
  KURUM_LOGOLARI.map((d) => [d.replace(/\.[^.]+$/, '').toLowerCase(), d]),
);

/* Bir kurum adi icin logo dosyasi (yoksa null). */
export const logoBul = (ad) => LOGO_HARITA[slugla(ad)] || null;

/* Yayin oneki (vite base). Kokte '' olur, /website altinda '/website'. */
const ONEK = import.meta.env.BASE_URL.replace(/\/+$/, '');

export const foto = (d) => ONEK + '/varliklar/foto/' + d;
export const kurumLogo = (d) => ONEK + '/varliklar/kurumlogo/' + d;
export const bashARF = (ad) => (ad || '?').trim().charAt(0).toLocaleUpperCase('tr');

export const ETKAD = {
  techsummit: 'TechSummit', datacamp: 'DataCamp',
  digitalized: 'Digitalized', algorun: 'algoRun',
};
export const KADEME = {
  ana: 'Ana sponsor', altin: 'Altın sponsor', gumus: 'Gümüş sponsor', ortak: 'Ortak',
};

/* Turkce arama: SQLite'in ASCII katlamasi gibi, tr karakterleri sadelestir. */
const TR_HARITA = { ı: 'i', İ: 'i', ş: 's', Ş: 's', ğ: 'g', Ğ: 'g',
                    ü: 'u', Ü: 'u', ö: 'o', Ö: 'o', ç: 'c', Ç: 'c', I: 'i' };
export function sadelestir(metin) {
  return String(metin || '')
    .replace(/[ıİşŞğĞüÜöÖçÇI]/g, (c) => TR_HARITA[c])
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Seritte gosterilecek kurum listesi: sponsorlar + konusmaci kurumlari.
 *  Etiket ayrimi korunur, sponsor olmayan kurum sponsor gibi gosterilmez. */
export function seritKurumlari(kurumlar, konusmacilar) {
  const liste = [];
  const gorulen = new Set();
  // en yeni yilin ana sponsoru seritte one cikarilir
  const guncel = kurumlar.filter((k) => k.kademe === 'ana')
    .reduce((a, b) => ((b.yil || 0) > (a?.yil || 0) ? b : a), null);
  for (const k of kurumlar) {
    if (gorulen.has(k.ad)) continue;
    gorulen.add(k.ad);
    const bu = guncel && k.ad === guncel.ad && k.yil === guncel.yil;
    liste.push({
      ad: k.ad,
      etiket: bu ? `${k.yil} ana sponsoru`
        : [k.kademe === 'ana' ? 'ana sponsor' : 'sponsor', k.yil].filter(Boolean).join(' '),
      anaSponsor: bu,
    });
  }
  liste.sort((a, b) => (b.anaSponsor ? 1 : 0) - (a.anaSponsor ? 1 : 0));
  for (const k of konusmacilar) {
    const ad = k.kurum;
    if (!ad || gorulen.has(ad)) continue;
    gorulen.add(ad);
    liste.push({ ad, etiket: ['konuşmacı', k.yil].filter(Boolean).join(' ') });
  }
  return liste;
}
