import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Duzen from './bilesenler/Duzen.jsx';
import { sayfaGosterimi } from './olcum.js';
import Anasayfa from './sayfalar/Anasayfa.jsx';
import Arsiv from './sayfalar/Arsiv.jsx';
import Kanit from './sayfalar/Kanit.jsx';
import Oduller from './sayfalar/Oduller.jsx';
import Kimlerle from './sayfalar/Kimlerle.jsx';
import Land from './sayfalar/Land.jsx';
import Etkinlikler from './sayfalar/Etkinlikler.jsx';
import Etkinlik from './sayfalar/Etkinlik.jsx';
import Sponsorlar from './sayfalar/Sponsorlar.jsx';
import Ekip from './sayfalar/Ekip.jsx';
import Uye from './sayfalar/Uye.jsx';
import Kayit from './sayfalar/Kayit.jsx';
import Giris from './sayfalar/Giris.jsx';
import Profil from './sayfalar/Profil.jsx';
import Yonetim from './sayfalar/Yonetim.jsx';
import Bulunamadi from './sayfalar/Bulunamadi.jsx';

export default function App() {
  const konum = useLocation();
  const ilk = useRef(true);

  // Ilk gosterimi posthog kendi sayiyor; sonraki yol degisimleri elle bildirilir.
  useEffect(() => {
    if (ilk.current) { ilk.current = false; return; }
    sayfaGosterimi();
  }, [konum.pathname]);

  return (
    <Duzen>
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/arsiv" element={<Arsiv />} />
        <Route path="/kanit" element={<Kanit />} />
        <Route path="/oduller" element={<Oduller />} />
        <Route path="/kimlerle" element={<Kimlerle />} />
        <Route path="/land" element={<Land />} />
        {/* Eski yollar korunur (DIKKAT.md 6): iki tanitim sayfasi /land'de birlesti. */}
        <Route path="/ogrenciler" element={<Navigate to="/land" replace />} />
        <Route path="/sirketler" element={<Navigate to="/land" replace />} />
        <Route path="/etkinlikler" element={<Etkinlikler />} />
        <Route path="/etkinlik/:slug" element={<Etkinlik />} />
        <Route path="/sponsorlar" element={<Sponsorlar />} />
        {/* Eski yol korunur; nginx tarafinda ayrica 301 var. */}
        <Route path="/kurumlar" element={<Navigate to="/sponsorlar" replace />} />
        <Route path="/ekip" element={<Ekip />} />
        <Route path="/uye/:slug" element={<Uye />} />
        <Route path="/kayit" element={<Kayit />} />
        <Route path="/giris" element={<Giris />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/yonetim" element={<Yonetim />} />
        {/* Eski yol korunur (DIKKAT.md 6): /katil artik /kayit. */}
        <Route path="/katil" element={<Navigate to="/kayit" replace />} />
        <Route path="*" element={<Bulunamadi />} />
      </Routes>
    </Duzen>
  );
}
