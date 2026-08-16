import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Baslik } from '../bilesenler/Duzen.jsx';
import { useHesap } from '../lib/hesap.js';

export default function Giris() {
  const { kullanici, yukleniyor, giris } = useHesap();
  const gec = useNavigate();
  const [eposta, setEposta] = useState('');
  const [parola, setParola] = useState('');
  const [hata, setHata] = useState(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  if (!yukleniyor && kullanici) return <Navigate to="/profil" replace />;

  async function gonder(olay) {
    olay.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      await giris(eposta, parola);
      gec('/profil');
    } catch (h) {
      // Mesaj backend'den geldigi gibi basilir (tek tip mesaj kurali orada).
      setHata(h.message);
      setGonderiliyor(false);
    }
  }

  return (
    <>
      <Baslik baslik="Giriş" />
      <section className="bolum">
        <div className="kap">
          <div className="hesap-orta">
            <h1>Giriş</h1>
            {hata && <div className="uyari hata">{hata}</div>}
            <form className="form hesap-form" onSubmit={gonder}>
              <div className="alan">
                <label htmlFor="eposta">E-posta</label>
                <input id="eposta" name="eposta" type="email" required autoComplete="email"
                  value={eposta} onChange={(o) => setEposta(o.target.value)} />
              </div>
              <div className="alan">
                <label htmlFor="parola">Parola</label>
                <input id="parola" name="parola" type="password" required autoComplete="current-password"
                  value={parola} onChange={(o) => setParola(o.target.value)} />
              </div>
              <button className="dugme genis" type="submit" disabled={gonderiliyor}>
                {gonderiliyor ? 'Gönderiliyor…' : 'Giriş yap'}
              </button>
            </form>
            <p className="hesap-alt">Hesabın yok mu? <Link to="/kayit">Kayıt ol</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
