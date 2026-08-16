import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Baslik } from '../bilesenler/Duzen.jsx';
import { DinamikAlanlar, KvkkOnay } from '../bilesenler/HesapAlanlari.jsx';
import { dizi, hesapIstek, useHesap } from '../lib/hesap.js';

export default function Kayit() {
  const { kullanici, yukleniyor, tazele, giris } = useHesap();
  const gec = useNavigate();
  const [alanlar, setAlanlar] = useState([]);
  const [form, setForm] = useState({ ad: '', soyad: '', eposta: '', parola: '' });
  const [ek, setEk] = useState({});
  const [kulupBasvuru, setKulupBasvuru] = useState(false);
  const [duyuruIzni, setDuyuruIzni] = useState(false); // acik riza: varsayilan isaretsiz
  const [kvkk, setKvkk] = useState(false);
  const [hata, setHata] = useState(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  // Form alan listesi ayarlardan gelir; kodda gomulu alan yok.
  useEffect(() => {
    let iptal = false;
    hesapIstek('/api/hesap/kayit-alanlari')
      .then((v) => { if (!iptal) setAlanlar(dizi(v, 'kayitAlanlari', 'alanlar')); })
      .catch((h) => { if (!iptal) setHata(h.message); });
    return () => { iptal = true; };
  }, []);

  if (!yukleniyor && kullanici) return <Navigate to="/profil" replace />;

  const yaz = (ad, deger) => setForm((o) => ({ ...o, [ad]: deger }));
  const yazEk = (ad, deger) => setEk((o) => ({ ...o, [ad]: deger }));

  async function gonder(olay) {
    olay.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      await hesapIstek('/api/hesap/kayit', {
        yontem: 'POST',
        govde: { ...form, duyuruIzni, kulupBasvuru, alanlar: ek },
      });
      // Kayit ucu oturumu acmiyorsa girisi biz yapariz.
      const k = await tazele();
      if (!k) await giris(form.eposta, form.parola);
      gec('/profil');
    } catch (h) {
      setHata(h.message);
      setGonderiliyor(false);
    }
  }

  return (
    <>
      <Baslik baslik="Kayıt" />
      <section className="bolum">
        <div className="kap">
          <div className="hesap-orta">
            <h1>Kayıt</h1>
            {hata && <div className="uyari hata">{hata}</div>}
            <form className="form hesap-form" onSubmit={gonder}>
              <div className="ikili">
                <div className="alan">
                  <label htmlFor="ad">Ad *</label>
                  <input id="ad" name="ad" required value={form.ad}
                    onChange={(o) => yaz('ad', o.target.value)} />
                </div>
                <div className="alan">
                  <label htmlFor="soyad">Soyad *</label>
                  <input id="soyad" name="soyad" required value={form.soyad}
                    onChange={(o) => yaz('soyad', o.target.value)} />
                </div>
              </div>
              <div className="alan">
                <label htmlFor="eposta">E-posta *</label>
                <input id="eposta" name="eposta" type="email" required autoComplete="email"
                  value={form.eposta} onChange={(o) => yaz('eposta', o.target.value)} />
              </div>
              <div className="alan">
                <label htmlFor="parola">Parola *</label>
                <input id="parola" name="parola" type="password" required minLength={8}
                  autoComplete="new-password"
                  value={form.parola} onChange={(o) => yaz('parola', o.target.value)} />
                <p className="ipucu">en az 8 karakter</p>
              </div>

              <DinamikAlanlar alanlar={alanlar} deger={ek} degistir={yazEk} />

              <label className="onay-satir" htmlFor="kulup-basvuru">
                <input id="kulup-basvuru" name="kulupBasvuru" type="checkbox"
                  checked={kulupBasvuru} onChange={(o) => setKulupBasvuru(o.target.checked)} />
                <span>Kulüp üyesi olmak istiyorum</span>
              </label>
              <label className="onay-satir" htmlFor="duyuru-izni">
                <input id="duyuru-izni" name="duyuruIzni" type="checkbox"
                  checked={duyuruIzni} onChange={(o) => setDuyuruIzni(o.target.checked)} />
                <span>Duyuru almak istiyorum</span>
              </label>

              <KvkkOnay isaretli={kvkk} degistir={setKvkk} />

              <button className="dugme genis" type="submit" disabled={gonderiliyor || !kvkk}>
                {gonderiliyor ? 'Gönderiliyor…' : 'Kayıt ol'}
              </button>
            </form>
            <p className="hesap-alt">Hesabın var mı? <Link to="/giris">Giriş yap</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
