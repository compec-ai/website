import { useCallback, useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';
import Sekmeler from '../bilesenler/Sekmeler.jsx';
import { ROLLER, ROL_ETIKET, dizi, hesapIstek, rolSira, useHesap } from '../lib/hesap.js';

const ONEK = import.meta.env.BASE_URL.replace(/\/+$/, '');

const SEKMELER = [
  ['uyeler', 'Üyeler'],
  ['etkinlikler', 'Etkinlikler'],
  ['bulten', 'Bülten'],
  ['olcum', 'Ölçüm'],
  ['ayarlar', 'Ayarlar'],
];

/* Kimlik alani backend'de _id ya da id olabilir. */
const kimlik = (k) => k._id || k.id;

/* Sirket maili ayrimi (Tuna istegi): sirket yetkililerinin adresleri ayri
   gorulebilsin. Kisisel saglayicilar ve okul alanlari disinda kalan her alan
   sirket sayilir; filtre istemci tarafinda calisir. */
const KISISEL_ALANLAR = ['gmail.com', 'hotmail.com', 'hotmail.com.tr', 'outlook.com',
  'outlook.com.tr', 'yahoo.com', 'icloud.com', 'yandex.com', 'yandex.com.tr',
  'live.com', 'msn.com', 'proton.me', 'protonmail.com'];
function epostaTuru(eposta) {
  const alan = String(eposta || '').split('@')[1]?.toLowerCase() || '';
  if (!alan) return 'kisisel';
  if (alan.endsWith('.edu.tr') || alan.endsWith('.edu')) return 'okul';
  if (KISISEL_ALANLAR.includes(alan)) return 'kisisel';
  return 'sirket';
}
const EPOSTA_TURLERI = [['sirket', 'Şirket'], ['okul', 'Okul'], ['kisisel', 'Kişisel']];

function EpostaTurSec({ deger, degistir, kimlikOn }) {
  return (
    <label className="suzgec-alan" htmlFor={kimlikOn + '-eposta-tur'}>
      <span>E-posta</span>
      <select id={kimlikOn + '-eposta-tur'} value={deger} onChange={(o) => degistir(o.target.value)}>
        <option value="">Tümü</option>
        {EPOSTA_TURLERI.map(([d, ad]) => <option key={d} value={d}>{ad}</option>)}
      </select>
    </label>
  );
}

const EpostaHucre = ({ eposta }) => (
  <>
    {eposta}
    {epostaTuru(eposta) === 'sirket' && <span className="eposta-tur">şirket</span>}
  </>
);

function Not({ durum }) {
  if (!durum) return null;
  return <div className={'uyari ' + (durum.iyi ? 'iyi' : 'hata')}>{durum.mesaj}</div>;
}

export default function Yonetim() {
  const { kullanici, yonetim, yukleniyor } = useHesap();
  const [parametre, setParametre] = useSearchParams();
  const sekme = SEKMELER.some(([a]) => a === parametre.get('sekme'))
    ? parametre.get('sekme') : 'uyeler';

  if (yukleniyor) return <Durum yukleniyor hata={null} />;
  if (!kullanici) return <Navigate to="/giris" replace />;

  return (
    <>
      <Baslik baslik="Yönetim" />
      <section className="bolum">
        <div className="kap">
          <h1>Yönetim</h1>
          {!yonetim ? (
            <div className="uyari hata" style={{ marginTop: 22 }}>Bu sayfa için yetkin yok.</div>
          ) : (
            <>
              <Sekmeler sekmeler={SEKMELER} etkin={sekme}
                sec={(a) => setParametre({ sekme: a }, { replace: true })} />
              {sekme === 'uyeler' && <Uyeler ben={kullanici} />}
              {sekme === 'etkinlikler' && <Etkinlikler />}
              {sekme === 'bulten' && <Bulten />}
              {sekme === 'olcum' && <Olcum />}
              {sekme === 'ayarlar' && <Ayarlar />}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* ---- Üyeler: liste, filtre, başvuru onay/ret, rol atama ---- */
function Uyeler({ ben }) {
  const [liste, setListe] = useState(null);
  const [hata, setHata] = useState(null);
  const [durum, setDurum] = useState(null);
  const [rol, setRol] = useState('');
  const [bekleyen, setBekleyen] = useState(false);
  const [epostaTur, setEpostaTur] = useState('');

  const cek = useCallback(async () => {
    const p = new URLSearchParams();
    if (rol) p.set('rol', rol);
    if (bekleyen) p.set('kulupBasvuru', '1');
    const q = p.toString();
    try {
      const veri = await hesapIstek('/api/admin/uyeler' + (q ? '?' + q : ''));
      setListe(dizi(veri, 'uyeler', 'liste'));
      setHata(null);
    } catch (h) { setHata(h.message); }
  }, [rol, bekleyen]);

  useEffect(() => { cek(); }, [cek]);

  async function guncelle(k, govde, mesaj) {
    setDurum(null);
    try {
      await hesapIstek('/api/admin/uyeler/' + kimlik(k), { yontem: 'PATCH', govde });
      await cek();
      setDurum({ iyi: true, mesaj });
    } catch (h) { setDurum({ iyi: false, mesaj: h.message }); }
  }

  // Kimse kendi rolüne eşit veya üstünü atayamaz; başkan devri istisnası başkanda.
  const atanabilir = ROLLER.filter((r) =>
    rolSira(r) < rolSira(ben.rol) || (r === 'baskan' && ben.rol === 'baskan'));

  if (hata) return <div className="uyari hata">{hata}</div>;
  if (!liste) return <p style={{ color: 'var(--metin-2)' }}>Yükleniyor…</p>;

  return (
    <>
      <div className="suzgec">
        <label className="suzgec-alan" htmlFor="suz-rol">
          <span>Rol</span>
          <select id="suz-rol" value={rol} onChange={(o) => setRol(o.target.value)}>
            <option value="">Tümü</option>
            {ROLLER.map((r) => <option key={r} value={r}>{ROL_ETIKET[r]}</option>)}
          </select>
        </label>
        <EpostaTurSec deger={epostaTur} degistir={setEpostaTur} kimlikOn="uye" />
        <label className="onay-satir" htmlFor="suz-bekleyen">
          <input id="suz-bekleyen" type="checkbox" checked={bekleyen}
            onChange={(o) => setBekleyen(o.target.checked)} />
          <span>Bekleyen kulüp başvurusu</span>
        </label>
      </div>
      <Not durum={durum} />
      <div className="tablo-sar">
        <table className="tablo">
          <thead>
            <tr><th>Ad</th><th>E-posta</th><th>Rol</th><th>Başvuru</th><th>Duyuru</th></tr>
          </thead>
          <tbody>
            {liste.filter((k) => !epostaTur || epostaTuru(k.eposta) === epostaTur).map((k) => (
              <tr key={kimlik(k)}>
                <td><b>{k.ad} {k.soyad}</b></td>
                <td><EpostaHucre eposta={k.eposta} /></td>
                <td>
                  <select value={k.rol} aria-label={k.eposta + ' rolü'}
                    disabled={!atanabilir.includes(k.rol) && rolSira(k.rol) >= rolSira(ben.rol)}
                    onChange={(o) => guncelle(k, { rol: o.target.value }, 'Rol güncellendi.')}>
                    {[...new Set([k.rol, ...atanabilir])].map((r) => (
                      <option key={r} value={r} disabled={!atanabilir.includes(r)}>
                        {ROL_ETIKET[r] || r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {k.kulupBasvuru ? (
                    <>
                      <button type="button"
                        onClick={() => guncelle(k, { kulupBasvuruOnay: true }, 'Başvuru onaylandı.')}>
                        Onayla
                      </button>
                      <button type="button"
                        onClick={() => guncelle(k, { kulupBasvuruOnay: false }, 'Başvuru reddedildi.')}>
                        Reddet
                      </button>
                    </>
                  ) : '-'}
                </td>
                <td>{k.duyuruIzni ? 'açık' : 'kapalı'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {liste.length === 0 && <p style={{ color: 'var(--metin-2)' }}>Bu filtreye uyan kayıt yok.</p>}
    </>
  );
}

/* ---- Etkinlikler: liste + ekle/düzenle + yayından kaldırma ---- */
/* Alan adlari seed/etkinlikler.json ile birebir (API-KONTRAT.md). */
const ETKINLIK_ALAN = [
  ['slug', 'slug', 'text'],
  ['ad', 'Ad', 'text'],
  ['tur', 'Tür', 'text'],
  ['yil', 'Yıl', 'text'],
  ['mekan', 'Mekan', 'text'],
  ['kayit_sayisi', 'Kayıt sayısı', 'number'],
  ['sure', 'Süre', 'text'],
  ['baski', 'Baskı', 'text'],
  ['foto', 'Foto', 'text'],
  ['sira', 'Sıra', 'number'],
];
const BOS_ETKINLIK = { slug: '', ad: '', ozet: '', tur: '', yil: '', mekan: '', kayit_sayisi: '', sure: '', baski: '', foto: '', sira: '' };

function Etkinlikler() {
  const [liste, setListe] = useState(null);
  const [hata, setHata] = useState(null);
  const [durum, setDurum] = useState(null);
  const [form, setForm] = useState(null); // null: form kapali
  const [yeni, setYeni] = useState(false);

  const cek = useCallback(async () => {
    try {
      const veri = await hesapIstek('/api/admin/etkinlikler');
      setListe(dizi(veri, 'etkinlikler', 'liste'));
      setHata(null);
    } catch (h) { setHata(h.message); }
  }, []);
  useEffect(() => { cek(); }, [cek]);

  async function kaydet(olay) {
    olay.preventDefault();
    setDurum(null);
    const govde = { ...form };
    for (const ad of ['kayit_sayisi', 'sira']) {
      govde[ad] = govde[ad] === '' || govde[ad] == null ? null : Number(govde[ad]);
    }
    try {
      if (yeni) await hesapIstek('/api/admin/etkinlikler', { yontem: 'POST', govde });
      else await hesapIstek('/api/admin/etkinlikler/' + form.slug, { yontem: 'PATCH', govde });
      await cek();
      setForm(null);
      setDurum({ iyi: true, mesaj: yeni ? 'Etkinlik eklendi.' : 'Etkinlik güncellendi.' });
    } catch (h) { setDurum({ iyi: false, mesaj: h.message }); }
  }

  async function yayin(e, deger) {
    setDurum(null);
    try {
      await hesapIstek('/api/admin/etkinlikler/' + e.slug, { yontem: 'PATCH', govde: { yayinda: deger } });
      await cek();
      setDurum({ iyi: true, mesaj: deger ? 'Yayına alındı.' : 'Yayından kaldırıldı.' });
    } catch (h) { setDurum({ iyi: false, mesaj: h.message }); }
  }

  if (hata) return <div className="uyari hata">{hata}</div>;
  if (!liste) return <p style={{ color: 'var(--metin-2)' }}>Yükleniyor…</p>;

  return (
    <>
      <Not durum={durum} />
      <div className="hesap-arac">
        <button className="dugme kucuk" type="button"
          onClick={() => { setYeni(true); setForm({ ...BOS_ETKINLIK }); }}>Etkinlik ekle</button>
      </div>
      {form && (
        <form className="form enli hesap-form" onSubmit={kaydet}>
          <div className="ikili">
            {ETKINLIK_ALAN.map(([ad, etiket, tip]) => (
              <div className="alan" key={ad}>
                <label htmlFor={'e-' + ad}>{etiket}</label>
                <input id={'e-' + ad} type={tip} required={ad === 'slug' || ad === 'ad'}
                  readOnly={ad === 'slug' && !yeni}
                  value={form[ad] ?? ''}
                  onChange={(o) => setForm((f) => ({ ...f, [ad]: o.target.value }))} />
              </div>
            ))}
          </div>
          <div className="alan">
            <label htmlFor="e-ozet">Özet</label>
            <textarea id="e-ozet" value={form.ozet ?? ''}
              onChange={(o) => setForm((f) => ({ ...f, ozet: o.target.value }))} />
          </div>
          <div className="hesap-arac">
            <button className="dugme" type="submit">Kaydet</button>
            <button className="dugme sade" type="button" onClick={() => setForm(null)}>Vazgeç</button>
          </div>
        </form>
      )}
      <div className="tablo-sar">
        <table className="tablo">
          <thead>
            <tr><th>Ad</th><th>slug</th><th>Tür</th><th>Yıl</th><th>Sıra</th><th>Durum</th><th></th></tr>
          </thead>
          <tbody>
            {liste.map((e) => (
              <tr key={e.slug}>
                <td><b>{e.ad}</b></td>
                <td className="mono">{e.slug}</td>
                <td>{e.tur}</td>
                <td>{e.yil}</td>
                <td>{e.sira}</td>
                <td>{e.yayinda ? 'yayında' : 'yayında değil'}</td>
                <td>
                  <button type="button" onClick={() => { setYeni(false); setForm({ ...BOS_ETKINLIK, ...e }); }}>
                    Düzenle
                  </button>
                  <button type="button" onClick={() => yayin(e, e.yayinda ? 0 : 1)}>
                    {e.yayinda ? 'Yayından kaldır' : 'Yayına al'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---- Bülten: birleşik abone listesi + CSV ---- */
function Bulten() {
  const [liste, setListe] = useState(null);
  const [hata, setHata] = useState(null);
  const [epostaTur, setEpostaTur] = useState('');

  useEffect(() => {
    let iptal = false;
    hesapIstek('/api/admin/bulten')
      .then((v) => { if (!iptal) setListe(dizi(v, 'aboneler', 'liste')); })
      .catch((h) => { if (!iptal) setHata(h.message); });
    return () => { iptal = true; };
  }, []);

  if (hata) return <div className="uyari hata">{hata}</div>;
  if (!liste) return <p style={{ color: 'var(--metin-2)' }}>Yükleniyor…</p>;

  return (
    <>
      <div className="hesap-arac">
        <div className="suzgec">
          <EpostaTurSec deger={epostaTur} degistir={setEpostaTur} kimlikOn="bulten" />
        </div>
        <a className="dugme sade kucuk" href={ONEK + '/api/admin/bulten?csv=1'}>CSV indir</a>
      </div>
      <div className="tablo-sar">
        <table className="tablo">
          <thead>
            <tr><th>E-posta</th><th>Kaynak</th><th>İzin tarihi</th><th>Durum</th></tr>
          </thead>
          <tbody>
            {liste.filter((a) => !epostaTur || epostaTuru(a.eposta) === epostaTur).map((a, i) => (
              <tr key={a.eposta || i}>
                <td><b><EpostaHucre eposta={a.eposta} /></b></td>
                <td>{a.kaynak || '-'}</td>
                <td>{a.izinTarihi ? String(a.izinTarihi).slice(0, 10) : '-'}</td>
                <td>{a.aktif === false ? 'kapalı' : 'açık'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {liste.length === 0 && <p style={{ color: 'var(--metin-2)' }}>Kayıt yok.</p>}
    </>
  );
}

/* ---- Ölçüm: PostHog özeti ----
   Grafik kütüphanesiz; çubuk genişliği en yüksek güne göre yüzde (stil.css
   .olcum-cubuklar). Anahtar yoksa uç { kurulu: false } döner. */
function OlcumCubuk({ satirlar, etiket, alan }) {
  const enYuksek = Math.max(1, ...satirlar.map((s) => s.sayi));
  return (
    <div className="olcum-cubuklar">
      {satirlar.map((s, i) => (
        <div className="olcum-satir" key={String(s[alan]) + i}>
          <span className="gun" title={String(s[alan])}>{String(s[alan])}</span>
          <span className="yuva">
            <span className="cubuk" style={{ width: (s.sayi / enYuksek) * 100 + '%' }}
              role="img" aria-label={`${s[alan]}: ${s.sayi} ${etiket}`} />
          </span>
          <span className="deger">{s.sayi}</span>
        </div>
      ))}
    </div>
  );
}

function Olcum() {
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    let iptal = false;
    hesapIstek('/api/admin/olcum')
      .then((v) => { if (!iptal) setVeri(v || {}); })
      .catch((h) => { if (!iptal) setHata(h.message); });
    return () => { iptal = true; };
  }, []);

  if (hata) return <div className="uyari hata">{hata}</div>;
  if (!veri) return <p style={{ color: 'var(--metin-2)' }}>Yükleniyor…</p>;

  if (!veri.kurulu) {
    return (
      <p style={{ color: 'var(--metin-2)', maxWidth: 720 }}>
        Ölçüm verisi için sunucudaki compose .env dosyasına iki satır gerekiyor:
        <span className="mono"> POSTHOG_KISISEL_ANAHTAR</span> (PostHog hesabındaki
        phx_ ile başlayan kişisel API anahtarı) ve
        <span className="mono"> POSTHOG_PROJE_ID</span> (proje numarası).
        Eklendikten sonra backend yeniden başlatılınca bu sekme dolar.
      </p>
    );
  }
  if (veri.hata) return <div className="uyari hata">{veri.hata}</div>;

  const gunler = dizi(veri, 'gunler');
  const yollar = dizi(veri, 'yollar');
  const surumler = dizi(veri, 'surumler');
  const toplam = gunler.reduce((t, g) => t + g.sayi, 0);

  return (
    <>
      <div className="olcum-ozet">
        <div>
          <span className="etiket">son {veri.gunSayisi} günde sayfa görüntüleme</span>
          <span className="sayi">{toplam}</span>
        </div>
        <div>
          <span className="etiket">tekil ziyaretçi</span>
          <span className="sayi">{veri.tekil}</span>
        </div>
      </div>

      <h2 className="hesap-baslik">Günlük sayfa görüntüleme</h2>
      {gunler.length === 0
        ? <p style={{ color: 'var(--metin-2)' }}>Bu aralıkta kayıt yok.</p>
        : <OlcumCubuk satirlar={gunler} alan="gun" etiket="görüntüleme" />}

      <h2 className="hesap-baslik">En çok görüntülenen sayfalar</h2>
      {yollar.length === 0
        ? <p style={{ color: 'var(--metin-2)' }}>Bu aralıkta kayıt yok.</p>
        : (
          /* Iki sutunlu tablo dar ekrana sigar; .tablo-sar'in 640px alt siniri
             burada sayiyi ekran disina itiyordu, o yuzden sarmalayici yok. */
          <table className="tablo olcum-yollar">
            <thead><tr><th>Yol</th><th>Görüntüleme</th></tr></thead>
            <tbody>
              {yollar.map((y, i) => (
                <tr key={y.yol + i}><td className="mono">{y.yol}</td><td>{y.sayi}</td></tr>
              ))}
            </tbody>
          </table>
        )}

      <h2 className="hesap-baslik">Sürüm dağılımı</h2>
      {surumler.length === 0
        ? <p style={{ color: 'var(--metin-2)' }}>Bu aralıkta kayıt yok.</p>
        : <OlcumCubuk satirlar={surumler} alan="surum" etiket="olay" />}
    </>
  );
}

/* ---- Ayarlar: kayıt alanları editörü + adminEsigi ---- */
const TIPLER = [['metin', 'Metin'], ['eposta', 'E-posta'], ['sayi', 'Sayı'], ['onay', 'Onay kutusu']];
const BOS_ALAN = { ad: '', etiket: '', tip: 'metin', zorunlu: false, aktif: true };

function Ayarlar() {
  const [ayar, setAyar] = useState(null);
  const [hata, setHata] = useState(null);
  const [durum, setDurum] = useState(null);

  useEffect(() => {
    let iptal = false;
    hesapIstek('/api/admin/ayarlar')
      .then((v) => {
        if (iptal) return;
        setAyar({
          kayitAlanlari: Array.isArray(v?.kayitAlanlari) ? v.kayitAlanlari : [],
          adminEsigi: v?.adminEsigi || 'yk',
          bultenAciklama: v?.bultenAciklama || '',
        });
      })
      .catch((h) => { if (!iptal) setHata(h.message); });
    return () => { iptal = true; };
  }, []);

  if (hata) return <div className="uyari hata">{hata}</div>;
  if (!ayar) return <p style={{ color: 'var(--metin-2)' }}>Yükleniyor…</p>;

  const alanYaz = (i, ad, deger) => setAyar((a) => ({
    ...a,
    kayitAlanlari: a.kayitAlanlari.map((x, j) => (j === i ? { ...x, [ad]: deger } : x)),
  }));

  async function kaydet(olay) {
    olay.preventDefault();
    setDurum(null);
    try {
      await hesapIstek('/api/admin/ayarlar', { yontem: 'PATCH', govde: ayar });
      setDurum({ iyi: true, mesaj: 'Ayarlar kaydedildi.' });
    } catch (h) { setDurum({ iyi: false, mesaj: h.message }); }
  }

  return (
    <form className="form enli hesap-form" onSubmit={kaydet}>
      <Not durum={durum} />
      <h2 className="hesap-baslik">Kayıt alanları</h2>
      <div className="tablo-sar">
        <table className="tablo">
          <thead>
            <tr><th>Ad</th><th>Etiket</th><th>Tip</th><th>Zorunlu</th><th>Aktif</th><th></th></tr>
          </thead>
          <tbody>
            {ayar.kayitAlanlari.map((a, i) => (
              <tr key={i}>
                <td>
                  <input aria-label={'alan ' + (i + 1) + ' adı'} value={a.ad}
                    onChange={(o) => alanYaz(i, 'ad', o.target.value)} />
                </td>
                <td>
                  <input aria-label={'alan ' + (i + 1) + ' etiketi'} value={a.etiket || ''}
                    onChange={(o) => alanYaz(i, 'etiket', o.target.value)} />
                </td>
                <td>
                  <select aria-label={'alan ' + (i + 1) + ' tipi'} value={a.tip}
                    onChange={(o) => alanYaz(i, 'tip', o.target.value)}>
                    {TIPLER.map(([d, e]) => <option key={d} value={d}>{e}</option>)}
                  </select>
                </td>
                <td>
                  <input type="checkbox" aria-label={'alan ' + (i + 1) + ' zorunlu'}
                    checked={!!a.zorunlu} onChange={(o) => alanYaz(i, 'zorunlu', o.target.checked)} />
                </td>
                <td>
                  <input type="checkbox" aria-label={'alan ' + (i + 1) + ' aktif'}
                    checked={a.aktif !== false} onChange={(o) => alanYaz(i, 'aktif', o.target.checked)} />
                </td>
                <td>
                  <button type="button" onClick={() => setAyar((s) => ({
                    ...s, kayitAlanlari: s.kayitAlanlari.filter((_, j) => j !== i),
                  }))}>Kaldır</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hesap-arac">
        <button className="dugme sade kucuk" type="button" onClick={() => setAyar((s) => ({
          ...s, kayitAlanlari: [...s.kayitAlanlari, { ...BOS_ALAN }],
        }))}>Alan ekle</button>
      </div>

      <h2 className="hesap-baslik">Panel erişimi</h2>
      <div className="alan">
        <label htmlFor="admin-esigi">adminEsigi</label>
        <select id="admin-esigi" value={ayar.adminEsigi}
          onChange={(o) => setAyar((s) => ({ ...s, adminEsigi: o.target.value }))}>
          {ROLLER.map((r) => <option key={r} value={r}>{ROL_ETIKET[r]}</option>)}
        </select>
        <p className="ipucu">bu rol ve üstü yönetim paneline girer</p>
      </div>
      <div className="alan">
        <label htmlFor="bulten-aciklama">Bülten açıklaması</label>
        <textarea id="bulten-aciklama" value={ayar.bultenAciklama}
          onChange={(o) => setAyar((s) => ({ ...s, bultenAciklama: o.target.value }))} />
      </div>
      <button className="dugme" type="submit">Ayarları kaydet</button>
    </form>
  );
}
