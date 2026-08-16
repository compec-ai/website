import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useHesap } from '../lib/hesap.js';

const IKON = {
  linkedin: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.4 20.5h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.04c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2.1 2.1 0 110-4.1 2.1 2.1 0 010 4.1zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-.9-.8-1.7-1.8-1.7z" /></svg>,
  github: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.999 4.6 19 4.9 19 4.9c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" /></svg>,
};
export { IKON };

/* Yayin oneki (vite base). Kokte '' olur, /website altinda '/website'. */
const ONEK = import.meta.env.BASE_URL.replace(/\/+$/, '');

const BAG = [
  ['/', 'Kulüp'],
  ['/etkinlikler', 'Etkinlikler'],
  ['/ekip', 'Ekip'],
  ['/kurumlar', 'Kurumlar'],
];

/** Sayfa basligi ve meta aciklamasi. v7'deki duzen() basligiyla ayni bicim. */
export function Baslik({ baslik, aciklama = '' }) {
  useEffect(() => {
    const tam = baslik ? `${baslik} · COMPEC` : 'COMPEC';
    document.title = tam;
    const yaz = (secici, deger) => {
      const oge = document.head.querySelector(secici);
      if (oge) oge.setAttribute('content', deger);
    };
    yaz('meta[name="description"]', aciklama);
    yaz('meta[property="og:title"]', tam);
    yaz('meta[property="og:description"]', aciklama);
  }, [baslik, aciklama]);
  return null;
}

export default function Duzen({ children }) {
  const [kaydi, setKaydi] = useState(false);
  const [menuAcik, setMenuAcik] = useState(false);
  const konum = useLocation();
  const { kullanici, yonetim, cikis } = useHesap();

  useEffect(() => {
    const kontrol = () => setKaydi(window.scrollY > 6);
    kontrol();
    addEventListener('scroll', kontrol, { passive: true });
    return () => removeEventListener('scroll', kontrol);
  }, []);

  // Yol degisince menu kapansin ve sayfa basa donsun.
  useEffect(() => { setMenuAcik(false); window.scrollTo(0, 0); }, [konum.pathname]);

  return (
    <>
      <header className={'tepe' + (kaydi ? ' kaydi' : '')}>
        <div className="kap tepe-ic">
          <Link className="arma" to="/">
            <img src={ONEK + '/varliklar/logo/compec-mark-beyaz.png'} alt="" width="789" height="439" />
            <b>Compec</b>
          </Link>
          <nav className="yon">
            {BAG.map(([yol, ad]) => (
              <NavLink key={yol} to={yol} end={yol === '/'}
                className={({ isActive }) => (isActive ? 'etkin' : undefined)}>{ad}</NavLink>
            ))}
          </nav>
          <div className="tepe-hesap">
            {kullanici ? (
              <>
                {yonetim && <Link to="/yonetim">Yönetim</Link>}
                <Link to="/profil">{kullanici.ad || kullanici.eposta}</Link>
                <button className="dugme sade kucuk" type="button" onClick={cikis}>Çıkış</button>
              </>
            ) : (
              <Link className="dugme" to="/kayit">Aramıza katıl</Link>
            )}
          </div>
          <button className="mnu" aria-label="Menü" aria-expanded={menuAcik}
            onClick={() => setMenuAcik((a) => !a)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </header>

      <div className={'gocmen' + (menuAcik ? ' acik' : '')}>
        <div className="kap">
          {BAG.map(([yol, ad]) => <Link key={yol} to={yol}>{ad}</Link>)}
          {kullanici ? (
            <>
              {yonetim && <Link to="/yonetim">Yönetim</Link>}
              <Link to="/profil">{kullanici.ad || kullanici.eposta}</Link>
              <a href="#cikis" onClick={(o) => { o.preventDefault(); cikis(); }}>Çıkış</a>
            </>
          ) : (
            <Link to="/kayit">Aramıza katıl</Link>
          )}
        </div>
      </div>

      {children}

      <footer className="dip">
        <div className="kap">
          <div className="dip-izgara">
            <div className="dip-arma">
              <img src={ONEK + '/varliklar/logo/compec-lockup-beyaz.png'} alt="Compec" width="793" height="637" />
              <p>Boğaziçi Üniversitesi Bilişim Kulübü. Güney Kampüs, Bebek, İstanbul.</p>
            </div>
            <div>
              <h4>Site</h4>
              <ul>
                <li><Link to="/">Kulüp</Link></li>
                <li><Link to="/etkinlikler">Etkinlikler</Link></li>
                <li><Link to="/ekip">Ekip</Link></li>
                <li><Link to="/kurumlar">Kurumlar</Link></li>
                <li><Link to="/ogrenciler">Öğrenciler için</Link></li>
                <li><Link to="/sirketler">Şirketler için</Link></li>
              </ul>
            </div>
            <div>
              <h4>Arşiv</h4>
              <ul>
                <li><Link to="/arsiv">Kurum arşivi</Link></li>
                <li><Link to="/oduller">Bilişim Ödülleri</Link></li>
                <li><Link to="/kimlerle">Konuşmacılar</Link></li>
                <li><Link to="/kanit">Rakamlar ve kaynakları</Link></li>
              </ul>
            </div>
            <div>
              <h4>Bağlantı</h4>
              <ul>
                <li><a href="mailto:hello@compec.org">hello@compec.org</a></li>
                <li><a href="https://www.instagram.com/bouncompec/" rel="noopener">Instagram</a></li>
                <li><a href="https://www.linkedin.com/company/bouncompec" rel="noopener">LinkedIn</a></li>
                <li><a href="https://www.youtube.com/user/compecboun" rel="noopener">YouTube</a></li>
                <li><a href="https://kommunity.com/compec" rel="noopener">Kommunity</a></li>
              </ul>
            </div>
          </div>
          <div className="dip-son">
            <span>© 2026 COMPEC. Kuruluş 1994.</span>
            <span>#compecrocks</span>
          </div>
        </div>
      </footer>
    </>
  );
}
