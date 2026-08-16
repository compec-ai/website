import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';
import Baglantilar from '../bilesenler/Baglantilar.jsx';
import { foto, bashARF } from '../lib/bicim.js';
import Bulunamadi from './Bulunamadi.jsx';

export default function Uye() {
  const { slug } = useParams();
  const { yukleniyor, hata, veri } = useApi({ k: '/api/uyeler/' + encodeURIComponent(slug) });
  if (!veri) {
    if (hata) return <Bulunamadi mesaj="Böyle bir üye kaydı bulunamadı." />;
    return <Durum yukleniyor={yukleniyor} hata={hata} />;
  }
  const k = veri.k;

  return (
    <>
      <Baslik baslik={k.ad} aciklama={[k.ad, k.gorev, k.donem].filter(Boolean).join(', ')} />
      <section className="bolum">
        <div className="kap">
          <p className="mono" style={{ marginBottom: 22 }}><Link to="/ekip">Üye dizini</Link> / {k.ad}</p>

          <div className="kisi-ust">
            <div className="foto">
              {k.foto
                ? <img src={foto(k.foto)} alt={k.ad} />
                : <div className="kart-bos" aria-hidden="true">{bashARF(k.ad)}</div>}
            </div>
            <div>
              <h1>{k.ad}</h1>
              {k.gorev ? <p className="kisi-kimlik">{k.gorev}</p> : null}
              {k.hakkinda ? <p style={{ marginTop: 18, color: 'var(--metin-2)', maxWidth: '56ch' }}>{k.hakkinda}</p> : null}

              <dl className="kisi-veri">
                {k.donem ? <div><dt>Dönem</dt><dd>{k.donem}</dd></div> : null}
                {k.kurul ? <div><dt>Alt kurul</dt><dd>{k.kurul}</dd></div> : null}
                {k.bolum ? <div><dt>Bölüm</dt><dd>{k.bolum}</dd></div> : null}
                {k.giris_yili ? <div><dt>Giriş yılı</dt><dd>{k.giris_yili}</dd></div> : null}
                <div>
                  <dt>Bağlantı</dt>
                  <dd>
                    <div className="kart-bag" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
                      <Baglantilar k={k} />
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
