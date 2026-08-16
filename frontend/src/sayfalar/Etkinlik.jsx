import { Link, useParams } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';
import { sayi, foto, KADEME } from '../lib/bicim.js';
import Bulunamadi from './Bulunamadi.jsx';

export default function Etkinlik() {
  const { slug } = useParams();
  const { yukleniyor, hata, veri } = useApi({
    e: '/api/etkinlikler/' + encodeURIComponent(slug), ozet: '/api/ozet',
  });
  if (!veri) {
    if (hata) return <Bulunamadi mesaj="Böyle bir etkinlik kaydı yok." />;
    return <Durum yukleniyor={yukleniyor} hata={hata} />;
  }

  const e = veri.e;
  const baskilar = e.baskilar || [];
  const konusmacilar = e.konusmacilar || [];
  const sponsorlar = e.kurumlar || [];
  const yillar = [...new Set(konusmacilar.map((k) => k.yil))].sort((a, b) => b - a);
  const enSonBaski = baskilar[0];
  // Bos sutun gostermemek icin: kayitlarda gercekten veri olan sutunlar acilir.
  const noVar = baskilar.some((b) => b.no);
  const sponsorVar = baskilar.some((b) => b.ana_sponsor);

  return (
    <>
      <Baslik baslik={e.ad} aciklama={e.ozet} />
      <section className="giris">
        <div className="kap">
          <p className="mono" style={{ marginBottom: 20 }}>
            <Link to="/etkinlikler">Etkinlikler</Link> / {e.ad}
          </p>
          <div className="giris-izgara">
            <div>
              <h1>{e.ad}</h1>
              <p className="giris-ozet">{e.ozet}</p>
            </div>
            <div className="kulak">
              <dl>
                {e.tur ? <><dt>Tür</dt><dd><b style={{ fontSize: 19 }}>{e.tur}</b></dd></> : null}
                {e.baski ? <><dt>{noVar ? 'Son baskı' : 'Kapsam'}</dt><dd>{enSonBaski && enSonBaski.no ? <b>{enSonBaski.no}.</b> : null}{e.baski}</dd></> : null}
                {baskilar.length ? <><dt>Kayıtlı {noVar ? 'baskı' : 'buluşma'}</dt><dd><b>{baskilar.length}</b></dd></> : null}
                {konusmacilar.length ? <><dt>Kayıtlı konuşmacı</dt><dd><b>{konusmacilar.length}</b></dd></> : null}
              </dl>
            </div>
          </div>

          {e.foto ? (
            <figure className="giris-foto">
              <img src={foto(e.foto)} alt={e.ad} width="2200" height="1650" />
              <figcaption><span>{e.mekan || ''}</span><span>Boğaziçi Üniversitesi</span></figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      {baskilar.length ? (
        <section className="bolum">
          <div className="kap">
            <div className="bas">
              <div>
                <h2>{noVar ? 'Baskı zinciri' : 'Buluşmalar'}</h2>
                <p className="bas-alt">
                  Doğrulanmış kayıtlar. Arada eksik olanlar varsa, onlar için bağımsız
                  kaynak bulunamadığı içindir.
                </p>
              </div>
              <div className="kunye">{baskilar.length} {noVar ? 'baskı' : 'buluşma'}</div>
            </div>
            <div className="tablo-sar"><table className="tablo">
              <thead>
                <tr>
                  <th>Yıl</th>{noVar ? <th>Baskı</th> : null}<th>Tarih</th>
                  <th>Mekân</th>{sponsorVar ? <th>Ana sponsor</th> : null}<th>Not</th>
                </tr>
              </thead>
              <tbody>
                {baskilar.map((b, i) => (
                  <tr key={i}>
                    <td><b>{b.yil}</b></td>
                    {noVar ? <td className="mono">{b.no ? b.no + '.' : ''}</td> : null}
                    <td>{b.tarih || ''}</td>
                    <td>{b.mekan || ''}</td>
                    {sponsorVar ? <td>{b.ana_sponsor || ''}</td> : null}
                    <td style={{ color: 'var(--metin-2)' }}>
                      {b.not_metni || ''}
                      {b.kayit_sayisi ? <><br /><span className="mono">{sayi(b.kayit_sayisi)} kayıt</span></> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        </section>
      ) : null}

      {yillar.map((yil) => (
        <section className="bolum" key={yil}>
          <div className="kap">
            <div className="bas">
              <div><h2>{yil} kadrosu</h2></div>
              <div className="kunye">{konusmacilar.filter((k) => k.yil === yil).length} isim</div>
            </div>
            <div className="arsiv">
              {konusmacilar.filter((k) => k.yil === yil).map((k, i) => (
                <div className="satir" key={i}>
                  <div className="satir-yil">{k.tur === 'egitmen' ? 'Atölye' : 'Konuşma'}</div>
                  <div>
                    <h3>{k.ad}</h3>
                    <p>{[k.unvan, k.kurum].filter(Boolean).join(', ')}</p>
                  </div>
                  <div className="satir-veri"><span>{k.baslik || ''}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {sponsorlar.length ? (
        <section className="blok">
          <div className="kap">
            <div className="bas">
              <div><h2>Destekleyen kurumlar</h2></div>
              <div className="kunye">{sponsorlar.length} kayıt</div>
            </div>
            <div className="tanimlar">
              {sponsorlar.map((k, i) => (
                <div className="tanim" key={i}>
                  <h3>{k.ad}</h3>
                  <p>{[k.yil, KADEME[k.kademe] || ''].filter(Boolean).join(', ')}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 26 }}><Link to="/sirketler">Sponsorluk için iletişim</Link></p>
          </div>
        </section>
      ) : null}

      <section className="bolum">
        <div className="kap dar">
          <p className="mono">
            Bu sayfadaki bilgiler bağımsız kaynaklardan (biletimGO, Biletino, Youthall,
            Kommunity, LinkedIn) doğrulanmıştır. Eksik gördüğün bir bilgi varsa
            {' '}<a href="mailto:hello@compec.org">hello@compec.org</a> adresine yazabilirsin.
          </p>
          <p style={{ marginTop: 22 }}>
            <Link className="dugme sade" to="/etkinlikler">Tüm etkinlikler</Link>
            {e.slug === 'bilisim-odulleri'
              ? <Link className="dugme" to="/oduller" style={{ marginLeft: 10 }}>Kazanan arşivi ({sayi(veri.ozet.odul)} kayıt)</Link>
              : null}
          </p>
        </div>
      </section>
    </>
  );
}
