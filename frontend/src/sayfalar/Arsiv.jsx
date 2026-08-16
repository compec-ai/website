import { Link } from 'react-router-dom';
import { useApi, useTumEtkinlikler } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';

/* Kurum hafizasinin tek giris noktasi: baski kayitlari, odul arsivi, konusmaci
   kadrosu ve kurumlar tek sayfadan aciliyor. */
export default function Arsiv() {
  const o = useApi({ ozet: '/api/ozet' });
  const e = useTumEtkinlikler();
  const baslik = (
    <Baslik baslik="Kurum arşivi"
      aciklama="COMPEC kurum hafızası: baskı kayıtları, ödül arşivi, konuşmacı kadrosu ve kurumlar." />
  );
  if (!o.veri || !e.veri) {
    return <>{baslik}<Durum yukleniyor={o.yukleniyor || e.yukleniyor} hata={o.hata || e.hata} /></>;
  }

  const ozet = o.veri.ozet;
  const tumBaskilar = e.veri.flatMap((x) => (x.baskilar || []).map((b) => ({ ...b, ad: x.ad })));
  const sonBaskilar = [...tumBaskilar].sort((a, b) => b.yil - a.yil || (b.no || 0) - (a.no || 0)).slice(0, 8);
  const sayimlar = {
    ...ozet, baski: tumBaskilar.length,
    toplam: ozet.odul + tumBaskilar.length + ozet.konusmaci + ozet.kurum,
  };

  return (
    <>
      {baslik}
      <section className="giris">
        <div className="kap">
          <div className="giris-izgara">
            <div>
              <h1>Kurum <i>arşivi.</i></h1>
              <p className="giris-ozet">
                Kulüp 1994'ten beri çalışıyor ama kurum hafızası her yıl yönetim
                değişince biraz daha eksiliyordu. Burası o hafızanın durduğu yer:
                hangi etkinlik hangi yıl kaç kez yapıldı, kim konuştu, kim destekledi,
                kim kazandı.
              </p>
              <div className="giris-eylem">
                <Link className="dugme sade" to="/kanit">Kayıt defteri</Link>
              </div>
            </div>
            <div className="kulak">
              <dl>
                <dt>Toplam kayıt</dt><dd><b>{sayimlar.toplam}</b>arşivde</dd>
                <dt>En eski kayıt</dt><dd><b>1994</b>kuruluş</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div><h2>Kayıt kümeleri</h2></div>
          </div>
          <div className="arsiv-kapi">
            <Link className="arsiv-kart" to="/oduller">
              <span className="sayi">{sayimlar.odul}</span>
              <h3>Ödül kaydı</h3>
              <p>Boğaziçi Bilişim Ödülleri, 2013'ten bugüne {sayimlar.odulYil} tören yılı. Yıl, kategori, kazanan ve arşiv bağlantısı.</p>
              <span className="git">Aç &rarr;</span>
            </Link>
            <Link className="arsiv-kart" to="/etkinlikler">
              <span className="sayi">{sayimlar.baski}</span>
              <h3>Baskı kaydı</h3>
              <p>Dokuz etkinlik serisinin baskı zincirleri. Yıl, tarih, mekân, ana sponsor ve not.</p>
              <span className="git">Aç &rarr;</span>
            </Link>
            <Link className="arsiv-kart" to="/kimlerle">
              <span className="sayi">{sayimlar.konusmaci}</span>
              <h3>Konuşmacı kaydı</h3>
              <p>Sahnede olan ve atölye veren herkes: adı, kurumu, unvanı ve konuştuğu konu.</p>
              <span className="git">Aç &rarr;</span>
            </Link>
            <Link className="arsiv-kart" to="/sponsorlar">
              <span className="sayi">{sayimlar.kurum}</span>
              <h3>Kurum kaydı</h3>
              <p>Hangi kurum, hangi etkinlikte, hangi yıl, hangi kademede destek verdi.</p>
              <span className="git">Aç &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="kap">
          <div className="bas">
            <div>
              <h2>En son ne oldu</h2>
              <p>Arşivdeki en yeni baskı kayıtları.</p>
            </div>
            <div className="yan">son {sonBaskilar.length} kayıt</div>
          </div>
          <div className="liste">
            {sonBaskilar.map((b, i) => (
              <Link className="satir" to={'/etkinlik/' + b.etkinlik} key={i}>
                <div className="satir-yan">{b.yil}{b.tarih ? <><br />{b.tarih}</> : null}</div>
                <div>
                  <h3>{b.ad}{b.no ? <em>{b.no}. baskı</em> : null}</h3>
                  <p>{[b.mekan, b.ana_sponsor ? 'ana sponsor ' + b.ana_sponsor : null, b.not_metni].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="satir-veri">
                  {b.kayit_sayisi ? <span><b>{b.kayit_sayisi}</b> kayıt</span> : null}
                  <span className="ayrinti">Ayrıntı</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="kap dar">
          <div className="not">
            Bu arşiv tamamlanmış değil. Katılımcı sayısı çoğu yıl tutulmamış, bazı
            baskıların tarihi bilinmiyor; Bilişim Ödülleri'nin bazı yıllarında da
            kategori dökümü eksik. Elinde eski bir program, bilet ya da haber varsa
            {' '}<a href="mailto:hello@compec.org">hello@compec.org</a> adresine
            yazarsan ekleriz.
          </div>
        </div>
      </section>
    </>
  );
}
