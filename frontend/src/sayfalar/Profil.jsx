import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';
import { DinamikAlanlar } from '../bilesenler/HesapAlanlari.jsx';
import { ROL_ETIKET, dizi, hesapIstek, useHesap } from '../lib/hesap.js';
import { cerezDinle, cerezTercih, cerezTercihYaz } from '../lib/cerez.js';
import { olcumBaslat, olcumDurdur } from '../olcum.js';

/* Alt cubukta verilen karar buradan da degistirilebilir. Oturum cerezi
   zorunlu kategoride oldugu icin burada gecmez; secim yalniz olcumu kapsar. */
function CerezTercihi() {
  const [tercih, setTercih] = useState(cerezTercih);
  useEffect(() => cerezDinle(setTercih), []);

  const sec = (deger) => {
    cerezTercihYaz(deger);
    if (deger === 'tam') olcumBaslat(); else olcumDurdur();
  };

  const metin = tercih === 'zorunlu' ? 'Yalnız zorunlu çerezler'
    : 'Ölçüm çerezleri açık';

  return (
    <div className="cerez-tercih">
      <span><b>{metin}</b></span>
      {tercih === 'zorunlu' && (
        <button className="dugme sade kucuk" type="button" onClick={() => sec('tam')}>
          Ölçümü aç
        </button>
      )}
      {tercih !== 'zorunlu' && (
        <button className="dugme sade kucuk" type="button" onClick={() => sec('zorunlu')}>
          Ölçümü kapat
        </button>
      )}
    </div>
  );
}

export default function Profil() {
  const { kullanici, yukleniyor, tazele } = useHesap();
  const [alanlar, setAlanlar] = useState([]);
  const [form, setForm] = useState(null);
  const [ek, setEk] = useState({});
  const [profilDurum, setProfilDurum] = useState(null);
  const [izinDurum, setIzinDurum] = useState(null);
  const [parola, setParola] = useState({ eski: '', yeni: '' });
  const [parolaDurum, setParolaDurum] = useState(null);

  useEffect(() => {
    let iptal = false;
    hesapIstek('/api/hesap/kayit-alanlari')
      .then((v) => { if (!iptal) setAlanlar(dizi(v, 'kayitAlanlari', 'alanlar')); })
      .catch(() => { /* dinamik alanlar cekilemezse sabit alanlar calismaya devam eder */ });
    return () => { iptal = true; };
  }, []);

  useEffect(() => {
    if (!kullanici || form) return;
    setForm({
      ad: kullanici.ad || '',
      soyad: kullanici.soyad || '',
      duyuruIzni: kullanici.duyuruIzni === true,
    });
    setEk({ ...(kullanici.alanlar || {}) });
  }, [kullanici, form]);

  if (yukleniyor) return <Durum yukleniyor hata={null} />;
  if (!kullanici) return <Navigate to="/giris" replace />;
  if (!form) return <Durum yukleniyor hata={null} />;

  async function profilKaydet(olay) {
    olay.preventDefault();
    setProfilDurum(null);
    try {
      await hesapIstek('/api/hesap/profil', { yontem: 'PATCH', govde: { ...form, alanlar: ek } });
      await tazele();
      setProfilDurum({ iyi: true, mesaj: 'Kaydedildi.' });
    } catch (h) {
      setProfilDurum({ iyi: false, mesaj: h.message });
    }
  }

  // Kutu hemen tepki versin; istek basarisiz olursa eski haline doner.
  async function izinDegistir(deger) {
    setIzinDurum(null);
    setForm((f) => ({ ...f, duyuruIzni: deger }));
    try {
      await hesapIstek('/api/hesap/profil', { yontem: 'PATCH', govde: { duyuruIzni: deger } });
      await tazele();
      setIzinDurum({ iyi: true, mesaj: deger ? 'Duyuru izni açıldı.' : 'Duyuru izni kapatıldı.' });
    } catch (h) {
      setForm((f) => ({ ...f, duyuruIzni: !deger }));
      setIzinDurum({ iyi: false, mesaj: h.message });
    }
  }

  async function parolaKaydet(olay) {
    olay.preventDefault();
    setParolaDurum(null);
    try {
      await hesapIstek('/api/hesap/parola', {
        yontem: 'PATCH',
        govde: { eskiParola: parola.eski, yeniParola: parola.yeni },
      });
      setParola({ eski: '', yeni: '' });
      setParolaDurum({ iyi: true, mesaj: 'Parola değiştirildi.' });
    } catch (h) {
      setParolaDurum({ iyi: false, mesaj: h.message });
    }
  }

  const basvuruMetni = kullanici.kulupBasvuru
    ? 'Kulüp üyeliği başvurusu değerlendiriliyor'
    : (kullanici.rol === 'uye' ? 'Kulüp üyeliği başvurusu yok' : null);

  return (
    <>
      <Baslik baslik="Profil" />
      <section className="bolum">
        <div className="kap">
          <div className="hesap-orta genis">
            <h1>Profil</h1>

            <dl className="hesap-kunye">
              <div><dt>E-posta</dt><dd>{kullanici.eposta}</dd></div>
              <div><dt>Rol</dt><dd>{ROL_ETIKET[kullanici.rol] || kullanici.rol}</dd></div>
              {basvuruMetni && <div><dt>Başvuru</dt><dd>{basvuruMetni}</dd></div>}
            </dl>

            <h2 className="hesap-baslik">Bilgilerim</h2>
            {profilDurum && (
              <div className={'uyari ' + (profilDurum.iyi ? 'iyi' : 'hata')}>{profilDurum.mesaj}</div>
            )}
            <form className="form hesap-form" onSubmit={profilKaydet}>
              <div className="ikili">
                <div className="alan">
                  <label htmlFor="ad">Ad</label>
                  <input id="ad" name="ad" required value={form.ad}
                    onChange={(o) => setForm((f) => ({ ...f, ad: o.target.value }))} />
                </div>
                <div className="alan">
                  <label htmlFor="soyad">Soyad</label>
                  <input id="soyad" name="soyad" required value={form.soyad}
                    onChange={(o) => setForm((f) => ({ ...f, soyad: o.target.value }))} />
                </div>
              </div>
              <DinamikAlanlar alanlar={alanlar} deger={ek} onek="profil"
                degistir={(a, d) => setEk((o) => ({ ...o, [a]: d }))} />
              <button className="dugme" type="submit">Kaydet</button>
            </form>

            <h2 className="hesap-baslik">Duyuru izni</h2>
            {izinDurum && (
              <div className={'uyari ' + (izinDurum.iyi ? 'iyi' : 'hata')}>{izinDurum.mesaj}</div>
            )}
            <label className="onay-satir" htmlFor="duyuru-izni">
              <input id="duyuru-izni" name="duyuruIzni" type="checkbox"
                checked={form.duyuruIzni === true}
                onChange={(o) => izinDegistir(o.target.checked)} />
              <span>Duyuru almak istiyorum</span>
            </label>

            <h2 className="hesap-baslik">Çerez tercihi</h2>
            <CerezTercihi />

            <h2 className="hesap-baslik">Parola değiştir</h2>
            {parolaDurum && (
              <div className={'uyari ' + (parolaDurum.iyi ? 'iyi' : 'hata')}>{parolaDurum.mesaj}</div>
            )}
            <form className="form hesap-form" onSubmit={parolaKaydet}>
              <div className="alan">
                <label htmlFor="eski-parola">Eski parola</label>
                <input id="eski-parola" name="eskiParola" type="password" required
                  autoComplete="current-password" value={parola.eski}
                  onChange={(o) => setParola((p) => ({ ...p, eski: o.target.value }))} />
              </div>
              <div className="alan">
                <label htmlFor="yeni-parola">Yeni parola</label>
                <input id="yeni-parola" name="yeniParola" type="password" required minLength={8}
                  autoComplete="new-password" value={parola.yeni}
                  onChange={(o) => setParola((p) => ({ ...p, yeni: o.target.value }))} />
                <p className="ipucu">en az 8 karakter</p>
              </div>
              <button className="dugme" type="submit">Parolayı değiştir</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
