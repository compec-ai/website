import { Link } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';

export default function Ogrenciler() {
  const { yukleniyor, hata, veri } = useApi({
    konusmacilar: '/api/konusmacilar', gezileri: '/api/gezileri', kanitlar: '/api/kanitlar',
  });
  const baslik = (
    <Baslik baslik="Öğrenciler için"
      aciklama="COMPEC üyeliği sana ne katar: sektörle temas, gerçek organizasyon deneyimi, bitirilmiş projeler ve otuz iki yıllık bir mezun ağı." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const tumKadro = veri.konusmacilar;
  const konusmacilar = tumKadro.filter((k) => k.etkinlik === 'datacamp' && k.yil === 2025);
  const geziler = veri.gezileri;
  const biletler = veri.kanitlar.filter((k) => k.konu === 'erisim' && k.deger && k.deger !== 'Ücretsiz');
  const kurumSayisi = new Set(tumKadro.map((k) => k.kurum).filter(Boolean)).size;

  return (
    <>
      {baslik}
      <section className="giris">
        <div className="kap">
          <div className="giris-izgara">
            <div>
              <h1>Mezun olduğunda seni <i>tanıyan</i> biri olsun.</h1>
              <p className="giris-ozet">
                Boğaziçi'nde iyi not almak zor değil. Zor olan, iyi not aldığını kimin
                bileceği. COMPEC'in yaptığı iş bu: seni sektörle aynı odaya koymak, ve
                o odayı senin kurmanı sağlamak.
              </p>
              <div className="giris-eylem">
                <Link className="dugme" to="/katil" data-olcum="uye_ol_tikla" data-olcum-veri="ogrenciler-giris">Aramıza katıl</Link>
                <Link className="dugme sade" to="/ekip">Üyeleri gör</Link>
              </div>
            </div>
            <div className="kulak">
              <dl>
                <dt>Üyelik</dt><dd><b>Ücretsiz</b></dd>
                <dt>Bölüm şartı</dt><dd><b>Yok</b></dd>
                <dt>Alt kurul</dt><dd><b>7</b>seçebileceğin</dd>
                <dt>Tanışabileceğin kurum</dt><dd><b>{kurumSayisi}</b>kayıtlı konuşmacı kurumu</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div><h2>Sana ne katıyor</h2></div>
            <div className="kunye">Dört somut şey</div>
          </div>

          <div className="arsiv">
            <div className="satir">
              <div className="satir-yil">01</div>
              <div>
                <h3>Sektörle mesafeni kapatır</h3>
                <p>
                  DataCamp 2025'te NVIDIA'dan bir Senior LLM Technologist, Hepsiburada'nın
                  teknoloji direktörü ve Insider'dan bir staff engineer konuştu. Bunlar
                  LinkedIn'de mesajına dönmeyecek insanlar. Etkinlikte kahve sırasında
                  yanlarında duruyorsun.
                </p>
              </div>
              <div className="satir-veri"><span>DataCamp, Digitalized, TechSummit</span></div>
            </div>

            <div className="satir">
              <div className="satir-yil">02</div>
              <div>
                <h3>CV'ne "üyeydim" değil, "yönettim" yazdırır</h3>
                <p>
                  TechSummit'i, DataCamp'i, Digitalized'ı öğrenciler kuruyor: sponsor
                  görüşmesi, bütçe, mekân, bilet sistemi, konuşmacı takibi, kriz yönetimi.
                  801 kayıtlı bir etkinliğin lojistiğini çevirmiş olmak, mülakatta
                  anlatacak gerçek bir hikâye demek.
                </p>
              </div>
              <div className="satir-veri"><span>Yedi alt kurulda görev</span></div>
            </div>

            <div className="satir">
              <div className="satir-yil">03</div>
              <div>
                <h3>Bitirdiğin bir şey olur</h3>
                <p>
                  Hackathon (algoRun), oyun geliştirme maratonu (Game Jam), veri atölyeleri.
                  Ders projelerinden farkı: süre kısıtlı, ekip senin seçmediğin insanlardan
                  oluşuyor ve sonunda ortaya çalışan bir şey çıkması gerekiyor. İş hayatı
                  da böyle.
                </p>
              </div>
              <div className="satir-veri"><span>Atölye, hackathon, jam</span></div>
            </div>

            <div className="satir">
              <div className="satir-yil">04</div>
              <div>
                <h3>Otuz iki yıllık bir ağa bağlanırsın</h3>
                <p>
                  1994'ten beri bu kulüpten geçen herkes bir yerlerde çalışıyor. Üye
                  dizinindeki profiller LinkedIn'e bağlı; kim nerede, ne yapıyor
                  görebiliyorsun. Staj ararken tanıdık aramak, tanıdığın olduğunda çok
                  daha kolay.
                </p>
              </div>
              <div className="satir-veri"><span><Link to="/ekip">Üye dizini</Link></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Şirketlerin içine girersin</h2>
              <p>
                Dinlemekle kalmıyorsun. TechSummit 2018'de on şirkete teknik gezi düzenlendi.
                Ofisi görmek, ekiple konuşmak ve işin nasıl yürüdüğünü yerinde anlamak
                bir konuşmayı dinlemekten farklı bir şey.
              </p>
            </div>
            <div className="yan">2018 kaydı</div>
          </div>
          <div className="gezi">{geziler.map((g, i) => <span key={i}>{g.kurum}</span>)}</div>
          <p className="mono" style={{ marginTop: 16 }}>Kaynak: Youthall etkinlik kaydı · <Link to="/kanit">doğrulama durumu</Link></p>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Bütçen sorun değil</h2>
              <p>
                Üyelik ücretsiz. Biletli etkinliklerde de fiyatı öğrenci bütçesine göre
                tutuyoruz; geçmiş baskıların fiyatları aşağıda.
              </p>
            </div>
            <div className="yan">geçmiş baskılar</div>
          </div>
          <div className="liste">
            {biletler.map((b, i) => (
              <div className="satir" key={i}>
                <div className="satir-yan">{b.iddia.split(', ').slice(-1)[0]}</div>
                <div><h3>{b.deger}</h3><p>{b.iddia}</p></div>
                <div className="satir-veri"><span>{b.kaynak || ''}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Geçen yıl kimlerden dinledin</h2>
              <p className="bas-alt">Bunlar gerçekleşmiş etkinliklerin kadrosu, gelecek vaadi değil.</p>
            </div>
            <div className="yan"><Link to="/kimlerle">Tüm kadro</Link></div>
          </div>
          <div className="tanimlar">
            {konusmacilar.map((k, i) => (
              <div className="tanim" key={i}>
                <h3>{k.ad}</h3>
                <p>{[k.unvan, k.kurum].filter(Boolean).join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blok">
        <div className="kap dar">
          <h2 style={{ fontSize: 'clamp(26px,3.4vw,36px)' }}>Nasıl katılırsın</h2>
          <p style={{ marginTop: 16, color: '#B7C4D3' }}>
            Üyelik ücretsiz ve bölüm şartı yok. Buradan hesap açtığında kulüp üye
            dizininde yerini alırsın; hangi alt kurulda çalışmak istediğini birlikte
            konuşuruz. Etkinliklerin çoğu üye olmayanlara da açık, ama düzenleyen
            tarafta olmak istiyorsan başlangıç noktası burası.
          </p>
          <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="dugme" to="/katil" data-olcum="uye_ol_tikla" data-olcum-veri="ogrenciler-alt">Aramıza katıl</Link>
            <a className="dugme sade" href="mailto:hello@compec.org">hello@compec.org</a>
          </div>
        </div>
      </section>
    </>
  );
}
