import { Link } from 'react-router-dom';
import { Baslik } from '../bilesenler/Duzen.jsx';

export default function Bulunamadi({ mesaj = 'Aradığın sayfa burada değil.' }) {
  return (
    <>
      <Baslik baslik="Sayfa bulunamadı" aciklama={mesaj} />
      <section className="bolum">
        <div className="kap dar">
          <h1>404</h1>
          <p style={{ marginTop: 16, color: 'var(--metin-2)' }}>{mesaj}</p>
          <p style={{ marginTop: 26 }}><Link className="dugme sade" to="/">Ana sayfa</Link></p>
        </div>
      </section>
    </>
  );
}
