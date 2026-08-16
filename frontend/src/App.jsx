import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Duzen from './bilesenler/Duzen.jsx';
import { sayfaGosterimi } from './olcum.js';
import Anasayfa from './sayfalar/Anasayfa.jsx';
import Arsiv from './sayfalar/Arsiv.jsx';
import Kanit from './sayfalar/Kanit.jsx';
import Oduller from './sayfalar/Oduller.jsx';
import Kimlerle from './sayfalar/Kimlerle.jsx';
import Ogrenciler from './sayfalar/Ogrenciler.jsx';
import Sirketler from './sayfalar/Sirketler.jsx';
import Etkinlikler from './sayfalar/Etkinlikler.jsx';
import Etkinlik from './sayfalar/Etkinlik.jsx';
import Kurumlar from './sayfalar/Kurumlar.jsx';
import Ekip from './sayfalar/Ekip.jsx';
import Uye from './sayfalar/Uye.jsx';
import Katil from './sayfalar/Katil.jsx';
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
        <Route path="/ogrenciler" element={<Ogrenciler />} />
        <Route path="/sirketler" element={<Sirketler />} />
        <Route path="/etkinlikler" element={<Etkinlikler />} />
        <Route path="/etkinlik/:slug" element={<Etkinlik />} />
        <Route path="/kurumlar" element={<Kurumlar />} />
        <Route path="/ekip" element={<Ekip />} />
        <Route path="/uye/:slug" element={<Uye />} />
        <Route path="/katil" element={<Katil />} />
        <Route path="*" element={<Bulunamadi />} />
      </Routes>
    </Duzen>
  );
}
