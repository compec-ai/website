import { Link } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';
import { ETKAD } from '../lib/bicim.js';
import KurumLogosu from '../bilesenler/KurumLogosu.jsx';

export default function Kimlerle() {
  const { yukleniyor, hata, veri } = useApi({ konusmacilar: '/api/konusmacilar' });
  const baslik = (
    <Baslik baslik="Kimlerle tanışırsın"
      aciklama="COMPEC etkinliklerinde konuşan ve atölye veren kişiler: adları, kurumları ve konuşma başlıkları." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const kadro = veri.konusmacilar;
  const yillar = [...new Set(kadro.map((k) => k.yil))].sort((a, b) => b - a);
  const kurumSayisi = new Set(kadro.map((k) => k.kurum).filter(Boolean)).size;

  return (
    <>
      {baslik}
      <section className="kapak">
        <div className="kap">
          <div className="kapak-ic">
            <div>
              <h1>Sahnede <span>kimler oldu.</span></h1>
              <p className="kapak-ozet">
                Etkinliklerimizde konuşan ve atölye veren herkes burada: adı, kurumu,
                konuştuğu konu. Liste yıl yıl geriye gidiyor.
              </p>
            </div>
            <div className="kunye-tablo">
              <div className="kunye-satir"><b>{kadro.length}</b><div className="ne">kayıtlı konuşmacı ve eğitmen<span className="kaynak">etkinlik duyuruları ve biletimGO kayıtları</span></div></div>
              <div className="kunye-satir"><b>{kurumSayisi}</b><div className="ne">ayrı kurum<span className="kaynak">NVIDIA, Insider, Hepsiburada, Boyner, Vestel, Amadeus ve diğerleri</span></div></div>
            </div>
          </div>
        </div>
      </section>

      {yillar.map((yil) => (
        <section className="bolum" style={{ paddingBottom: 0 }} key={yil}>
          <div className="kap">
            <div className="bas">
              <div><h2>{yil}</h2></div>
              <div className="yan">{kadro.filter((k) => k.yil === yil).length} kişi</div>
            </div>
            <div className="kadro">
              {kadro.filter((k) => k.yil === yil).map((k, i) => (
                <div className="kadro-oge" key={i}>
                  <div className="kurum">
                    <KurumLogosu ad={k.kurum} />
                    <span>{k.tur === 'egitmen' ? 'atölye' : 'konuşma'} · {ETKAD[k.etkinlik] || k.etkinlik}</span>
                  </div>
                  <h4>{k.ad}</h4>
                  <div className="unvan">{[k.unvan, k.kurum].filter(Boolean).join(', ')}</div>
                  {k.baslik ? <div className="konu">{k.baslik}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bolum">
        <div className="kap dar">
          <p className="mono">
            Eksik gördüğün bir isim varsa
            {' '}<a href="mailto:hello@compec.org">hello@compec.org</a>.
          </p>
          <p style={{ marginTop: 22 }}><Link className="dugme sade" to="/kanit">Kayıt defteri</Link></p>
        </div>
      </section>
    </>
  );
}
