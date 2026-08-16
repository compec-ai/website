import { useEffect, useState } from 'react';

const onbellek = new Map();

/* Ayni uc iki kez istenmesin: soz nesnesi saklanir. */
export function getir(yol) {
  if (!onbellek.has(yol)) {
    onbellek.set(yol, fetch(yol).then(async (c) => {
      const g = await c.json().catch(() => null);
      if (!c.ok) throw new Error(g?.hata || `${c.status} ${yol}`);
      return g;
    }).catch((h) => { onbellek.delete(yol); throw h; }));
  }
  return onbellek.get(yol);
}

/** Birden cok ucu paralel cek. yollar: { ad: '/api/...' } */
export function useApi(yollar) {
  const anahtar = JSON.stringify(yollar);
  const [durum, setDurum] = useState({ yukleniyor: true, hata: null, veri: null });

  useEffect(() => {
    let iptal = false;
    setDurum({ yukleniyor: true, hata: null, veri: null });
    const adlar = Object.keys(yollar);
    Promise.all(adlar.map((a) => getir(yollar[a])))
      .then((sonuc) => {
        if (iptal) return;
        setDurum({ yukleniyor: false, hata: null, veri: Object.fromEntries(adlar.map((a, i) => [a, sonuc[i]])) });
      })
      .catch((h) => { if (!iptal) setDurum({ yukleniyor: false, hata: h, veri: null }); });
    return () => { iptal = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anahtar]);

  return durum;
}

/* Kontratta baski listesi icin toplu bir uc yok; baskilar yalnizca
   /api/etkinlikler/:slug icinde donuyor. Arsiv ve etkinlik listesi
   sayfalari icin dokuz ayrintiyi paralel cekiyoruz. */
let ayrintiSoz = null;
export function tumEtkinlikler() {
  if (!ayrintiSoz) {
    ayrintiSoz = getir('/api/etkinlikler')
      .then((liste) => Promise.all(liste.map((e) => getir('/api/etkinlikler/' + e.slug))))
      .catch((h) => { ayrintiSoz = null; throw h; });
  }
  return ayrintiSoz;
}

export function useTumEtkinlikler() {
  const [durum, setDurum] = useState({ yukleniyor: true, hata: null, veri: null });
  useEffect(() => {
    let iptal = false;
    tumEtkinlikler()
      .then((v) => { if (!iptal) setDurum({ yukleniyor: false, hata: null, veri: v }); })
      .catch((h) => { if (!iptal) setDurum({ yukleniyor: false, hata: h, veri: null }); });
    return () => { iptal = true; };
  }, []);
  return durum;
}
