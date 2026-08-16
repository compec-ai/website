import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* Yayin oneki (vite base). Kokte '' olur, /website altinda '/website'. */
const ONEK = import.meta.env.BASE_URL.replace(/\/+$/, '');

/* Roller sirali; her rol altindakileri kapsar (HESAP-KONTRAT.md). */
export const ROLLER = ['uye', 'kulup-uyesi', 'lider', 'yk', 'baskan'];
export const ROL_ETIKET = {
  'uye': 'Üye',
  'kulup-uyesi': 'Kulüp üyesi',
  'lider': 'Lider',
  'yk': 'Yönetim kurulu',
  'baskan': 'Başkan',
};
export const rolSira = (r) => ROLLER.indexOf(r);

/**
 * Hesap ucu istegi. Oturum httpOnly cerezde durdugu icin her istekte
 * credentials: 'include'; yazma isteklerinde CSRF onlemi olarak X-Istek.
 * Hata durumunda backend'in dondugu { hata } mesaji aynen firlatilir.
 */
export async function hesapIstek(yol, { yontem = 'GET', govde } = {}) {
  const secenek = {
    method: yontem,
    credentials: 'include',
    headers: {},
  };
  if (yontem !== 'GET') secenek.headers['X-Istek'] = 'compec';
  if (govde !== undefined) {
    secenek.headers['Content-Type'] = 'application/json';
    secenek.body = JSON.stringify(govde);
  }
  const cevap = await fetch(ONEK + yol, secenek);
  const veri = await cevap.json().catch(() => null);
  if (!cevap.ok) {
    const h = new Error(veri?.hata || `${cevap.status} ${yol}`);
    h.kod = cevap.status;
    throw h;
  }
  return veri;
}

/* Liste donen uclar dizi ya da { liste } sarmali olarak gelebilir. */
export function dizi(veri, ...adlar) {
  if (Array.isArray(veri)) return veri;
  for (const a of adlar) if (Array.isArray(veri?.[a])) return veri[a];
  return [];
}

const Baglam = createContext(null);

export function useHesap() {
  const b = useContext(Baglam);
  if (!b) throw new Error('useHesap, HesapSaglayici disinda kullanildi');
  return b;
}

/**
 * Girislilik durumu tek yerde: GET /api/hesap/ben.
 * Yonetim yetkisi: kullanici nesnesi acikca soylerse ona guvenilir; yoksa
 * rol >= adminEsigi (varsayilan yk) kuralindan hesaplanir, o da tutmuyorsa
 * esik dusurulmus olabilecegi icin /api/admin/ayarlar ucu bir kez yoklanir.
 */
export function HesapSaglayici({ children }) {
  const [durum, setDurum] = useState({ yukleniyor: true, kullanici: null, yonetim: false });

  // Yoklamanin sonucu kullanici+rol basina bir kez tutulur; profil her
  // guncellendiginde 403 alacagi belli bir istek tekrarlanmasin.
  const [yoklama] = useState(() => new Map());

  const yetkiCoz = useCallback(async (k) => {
    if (!k) return false;
    if (typeof k.yonetim === 'boolean') return k.yonetim;
    const esik = k.adminEsigi && rolSira(k.adminEsigi) >= 0 ? k.adminEsigi : 'yk';
    if (rolSira(k.rol) >= rolSira(esik)) return true;
    const anahtar = (k._id || k.id || k.eposta) + '/' + k.rol;
    if (yoklama.has(anahtar)) return yoklama.get(anahtar);
    let sonuc = false;
    try {
      await hesapIstek('/api/admin/ayarlar');
      sonuc = true;
    } catch { /* yetki yok */ }
    yoklama.set(anahtar, sonuc);
    return sonuc;
  }, [yoklama]);

  const tazele = useCallback(async () => {
    try {
      const veri = await hesapIstek('/api/hesap/ben');
      const k = veri?.kullanici || veri;
      const yetki = await yetkiCoz(k);
      setDurum({ yukleniyor: false, kullanici: k, yonetim: yetki });
      return k;
    } catch {
      setDurum({ yukleniyor: false, kullanici: null, yonetim: false });
      return null;
    }
  }, [yetkiCoz]);

  useEffect(() => { tazele(); }, [tazele]);

  const giris = useCallback(async (eposta, parola) => {
    await hesapIstek('/api/hesap/giris', { yontem: 'POST', govde: { eposta, parola } });
    return tazele();
  }, [tazele]);

  const cikis = useCallback(async () => {
    try { await hesapIstek('/api/hesap/cikis', { yontem: 'POST' }); } catch { /* oturum zaten kapali olabilir */ }
    setDurum({ yukleniyor: false, kullanici: null, yonetim: false });
  }, []);

  const deger = useMemo(() => ({ ...durum, tazele, giris, cikis }), [durum, tazele, giris, cikis]);
  return createElement(Baglam.Provider, { value: deger }, children);
}
