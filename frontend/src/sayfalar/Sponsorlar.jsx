import { Link } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Serit from '../bilesenler/Serit.jsx';
import Durum from '../bilesenler/Durum.jsx';
import { ETKAD, KADEME } from '../lib/bicim.js';

export default function Sponsorlar() {
  const { yukleniyor, hata, veri } = useApi({ kurumlar: '/api/kurumlar' });
  const baslik = (
    <Baslik baslik="Sponsorlar"
      aciklama="COMPEC etkinliklerini destekleyen kurumlar: Akbank, HubX, Acıbadem Technology, Yapı Kredi Teknoloji, ING, Huawei ve diğerleri." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const kurumlar = veri.kurumlar;
  const yillar = [...new Set(kurumlar.map((k) => k.yil).filter(Boolean))].sort((a, b) => b - a);
  const benzersiz = [...new Set(kurumlar.map((k) => k.ad))];

  return (
    <>
      {baslik}
      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Sponsorlar</h2>
              <p className="bas-alt">
                Etkinliklerimizi destekleyen şirketler: hangi kurum, hangi etkinlikte,
                hangi yıl, hangi kademede.
              </p>
            </div>
            <div className="kunye">{benzersiz.length} kurum</div>
          </div>
        </div>
      </section>

      <Serit kurumlar={kurumlar} />

      <section className="bolum">
        <div className="kap">
          {yillar.map((yil) => (
            <div className="kanit-grup" key={yil}>
              <h3>{yil}</h3>
              <div className="tanimlar">
                {kurumlar.filter((k) => k.yil === yil).map((k, i) => (
                  <div className="tanim" key={i}>
                    <h3>{k.ad}</h3>
                    <p>{[ETKAD[k.etkinlik] || k.etkinlik, KADEME[k.kademe] || ''].filter(Boolean).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="dugme" to="/sirketler" data-olcum="sirket_sayfasi_tikla">Sponsorluk bilgisi</Link>
            <Link className="dugme sade" to="/etkinlikler">Etkinlikler</Link>
          </div>
        </div>
      </section>
    </>
  );
}
