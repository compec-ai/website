import { kurumGorseli } from '../lib/bicim.js';

/* Koyu zeminde kurum logosu. Kaynak secimi tek yerde (bicim.js kurumGorseli):
   kurumun RESMI beyaz varyanti varsa filtresiz basilir, yoksa renkli logo
   `.serit-oge img`/`.kadro-oge .kurum img` invert filtresine duser.
   `beyaz-logo` sinifi o filtreyi kapatir. */
export default function KurumLogosu({ ad, yedek = null, ...kalan }) {
  const g = kurumGorseli(ad);
  if (!g) return yedek;
  return (
    <img
      className={g.beyaz ? 'beyaz-logo' : undefined}
      src={g.src}
      alt={ad}
      loading="lazy"
      {...kalan}
    />
  );
}
