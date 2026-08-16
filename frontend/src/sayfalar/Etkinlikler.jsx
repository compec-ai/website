import { Link } from 'react-router-dom';
import { useTumEtkinlikler } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';
import { foto, bashARF } from '../lib/bicim.js';

export default function Etkinlikler() {
  const { yukleniyor, hata, veri } = useTumEtkinlikler();
  const baslik = (
    <Baslik baslik="Etkinlikler"
      aciklama="COMPEC etkinlik serileri: TechSummit, DataCamp, Digitalized, Teknodolu, DevTalks, algoRun ve daha fazlası." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  return (
    <>
      {baslik}
      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Etkinlikler</h2>
              <p className="bas-alt">
                Kulübün düzenlediği seriler. Her birinin kendi sayfasında baskı zinciri,
                konuşmacı kadrosu ve sponsorları var.
              </p>
            </div>
            <div className="kunye">{veri.length} seri</div>
          </div>

          <div className="arsiv gorselli">
            {veri.map((e) => (
              <Link className="satir" to={'/etkinlik/' + e.slug} key={e.slug}>
                <div className="satir-yil">{e.yil || ''}</div>
                <div className="satir-kare">
                  {e.foto
                    ? <img src={foto(e.foto)} alt={e.ad + ' etkinliğinden bir kare'} loading="lazy" />
                    : <span aria-hidden="true">{bashARF(e.ad)}</span>}
                </div>
                <div>
                  <h3>{e.ad}{e.tur ? <em>{e.tur}</em> : null}</h3>
                  <p>{e.ozet}</p>
                </div>
                <div className="satir-veri">
                  {e.baski ? <span><b>{e.baski}</b></span> : null}
                  {e.baskilar?.length ? <span>{e.baskilar.length} baskı kayıtlı</span> : null}
                  {e.konusmacilar?.length ? <span>{e.konusmacilar.length} konuşmacı</span> : null}
                  <span className="ayrinti">Ayrıntı</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
