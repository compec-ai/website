/* PostHog olcumu. YALNIZCA VITE_POSTHOG_KEY tanimliysa yuklenir; anahtar yoksa
   hicbir kod calismaz, hicbir dis istek gitmez ve pakete bagimlilik eklenmez.
   Resmi PostHog snippet'i kullaniliyor (v7 genel/olcum.js ile ayni): snippet,
   kutuphane inmeden once cagrilan capture isteklerini kuyruga alir.
   Gizlilik tercihleri:
   - person_profiles 'identified_only': giris yapmamis ziyaretci icin profil olusmaz
   - oturum kaydi (session recording) KAPALI
   - respect_dnt: tarayicida "Do Not Track" aciksa hic olcum yapilmaz
   - sanitize_properties: e-posta benzeri her deger olaydan temizlenir */

const ANAHTAR = import.meta.env.VITE_POSTHOG_KEY;
const SUNUCU = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';
const EPOSTA = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

/* eslint-disable */
function snippet(t, e) {
  var o, n, p, r; e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0, p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e }, u.people.toString = function () { return u.toString(1) + ".people (stub)" }, o = "init capture register register_once unregister getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags identify setPersonProperties group reset get_distinct_id onFeatureFlags set_config opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing debug".split(" "), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1)
}
/* eslint-enable */

export function olcumBaslat() {
  if (!ANAHTAR) return;
  snippet(document, window.posthog || []);

  window.posthog.init(ANAHTAR, {
    api_host: SUNUCU,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    capture_heatmaps: true,
    disable_session_recording: true,
    respect_dnt: true,
    persistence: 'localStorage+cookie',
    sanitize_properties: (ozellikler) => {
      for (const a in ozellikler) {
        if (typeof ozellikler[a] === 'string') ozellikler[a] = ozellikler[a].replace(EPOSTA, '[eposta]');
      }
      // Surum HER OLAYA burada yazilir; register() ile kalici saklamak yanlisti.
      ozellikler.surum = 'react';
      return ozellikler;
    },
  });

  // data-olcum tasiyan ogelerde tiklama
  document.addEventListener('click', (olay) => {
    const oge = olay.target?.closest?.('[data-olcum]');
    if (!oge) return;
    const veri = { yer: location.pathname };
    if (oge.dataset.olcumVeri) veri.deger = oge.dataset.olcumVeri;
    window.posthog.capture(oge.dataset.olcum, veri);
  }, { passive: true });

  // uye dizininden LinkedIn'e cikis
  document.addEventListener('click', (olay) => {
    const a = olay.target?.closest?.('a[href*="linkedin.com/in/"]');
    if (a) window.posthog.capture('uye_linkedin_tikla', { yer: location.pathname });
  }, { passive: true });
}

/** Tek sayfa uygulamasinda yol degisimi ayri bir sayfa gosterimi sayilir. */
export function sayfaGosterimi() {
  if (!ANAHTAR) return;
  window.posthog?.capture?.('$pageview');
}
