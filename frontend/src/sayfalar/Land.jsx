import { Link } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Serit from '../bilesenler/Serit.jsx';
import Durum from '../bilesenler/Durum.jsx';
import { seritKurumlari, ETKAD } from '../lib/bicim.js';

/* /ogrenciler ve /sirketler sayfalari tek akista birlestirildi: once ogrenci
   tarafi, sonra kurum tarafi. Ortak parcalar (kurum seridi) tek kez basiliyor.
   Metinler 2026-08 yazi oturumunda tek seste bastan yazildi. */

// Tabloda kademe adlari kisa yazilir.
const TABLO_KADEME = { ana: 'Ana sponsor', altin: 'Altın', gumus: 'Gümüş', ortak: 'Ortak' };

export default function Land() {
  const { yukleniyor, hata, veri } = useApi({
    konusmacilar: '/api/konusmacilar', gezileri: '/api/gezileri', kanitlar: '/api/kanitlar',
    kurumlar: '/api/kurumlar',
  });
  const baslik = (
    <Baslik baslik="Öğrenciler ve şirketler için"
      aciklama="COMPEC'te üye olunca seni neler bekliyor, sponsor olunca kime ulaşıyorsunuz. Boğaziçi Üniversitesi Bilişim Kulübü, 1994'ten beri." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const tumKadro = veri.konusmacilar;
  const konusmacilar = tumKadro.filter((k) => k.etkinlik === 'datacamp' && k.yil === 2025);
  const geziler = veri.gezileri;
  const biletler = veri.kanitlar.filter((k) => k.konu === 'erisim' && k.deger && k.deger !== 'Ücretsiz');
  const kurumSayisi = new Set(tumKadro.map((k) => k.kurum).filter(Boolean)).size;
  const sponsorZinciri = veri.kurumlar;
  const serit = seritKurumlari(veri.kurumlar, veri.konusmacilar);

  return (
    <>
      {baslik}

      {/* ---------------- ogrenci tarafi ---------------- */}
      <section className="giris">
        <div className="kap">
          <div className="giris-izgara">
            <div>
              <h1>Mezun olduğunda seni <i>tanıyan</i> biri olsun.</h1>
              <p className="giris-ozet">
                Dört yıl boyunca iyi not alabilirsin; seni sektörden kimin tanıdığı
                ayrı bir soru. COMPEC seni o insanlarla aynı odaya koyar. Çoğu zaman
                o odayı da sen kurarsın.
              </p>
              <div className="giris-eylem">
                <Link className="dugme" to="/kayit" data-olcum="uye_ol_tikla" data-olcum-veri="land-giris">Üye ol</Link>
                <Link className="dugme sade" to="/ekip">Üyeleri gör</Link>
              </div>
            </div>
            <div className="kulak">
              <dl>
                <dt>Üyelik</dt><dd><b>Ücretsiz</b></dd>
                <dt>Bölüm şartı</dt><dd><b>Yok</b></dd>
                <dt>Alt kurul</dt><dd><b>7</b>seçebileceğin</dd>
                <dt>Tanışabileceğin kurum</dt><dd><b>{kurumSayisi}</b>bugüne kadar sahnede</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div><h2>Sana ne katıyor</h2></div>
          </div>

          <div className="arsiv">
            <div className="satir">
              <div className="satir-yil">01</div>
              <div>
                <h3>Sektörle mesafeni kapatır</h3>
                <p>
                  DataCamp 2025'te NVIDIA'dan bir Senior LLM Technologist, Hepsiburada'nın
                  teknoloji direktörü ve Insider'dan bir staff engineer konuştu. LinkedIn'de
                  mesajına dönmeyecek insanlar bunlar; etkinlikte kahve sırasında
                  yanlarında duruyorsun.
                </p>
              </div>
              <div className="satir-veri"><span>DataCamp, Digitalized, TechSummit</span></div>
            </div>

            <div className="satir">
              <div className="satir-yil">02</div>
              <div>
                <h3>Etkinliği sen kurarsın</h3>
                <p>
                  TechSummit'i, DataCamp'i, Digitalized'ı öğrenciler kuruyor: sponsor
                  görüşmesi, bütçe, mekân, bilet sistemi, konuşmacı takibi, kriz yönetimi.
                  801 kayıtlı bir etkinliğin lojistiğini çevirmişsen mülakatta anlatacak
                  hikâyen hazır.
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
                  Süre kısıtlı, ekibi sen seçmiyorsun ve sonunda ortaya çalışan bir şey
                  çıkması gerekiyor. İş hayatı da böyle.
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
                  görebiliyorsun. Staj ararken bir tanıdığın olması çok şey değiştirir.
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
                TechSummit 2018'de on şirkete teknik gezi düzenlendi. Ofise girip
                ekiple konuşmak, sahneden dinlemeye hiç benzemiyor.
              </p>
            </div>
            <div className="yan">2018 kaydı</div>
          </div>
          <div className="gezi">{geziler.map((g, i) => <span key={i}>{g.kurum}</span>)}</div>
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
                <div className="satir-veri" />
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
              <p className="bas-alt">DataCamp 2025'in kadrosu.</p>
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
            Üyelik ücretsiz, bölüm şartı yok. Hesap açtığında üye dizininde yerini
            alırsın; hangi alt kurulda çalışmak istediğini sonra birlikte konuşuruz.
            Etkinliklerin çoğu zaten herkese açık, ama düzenleyen tarafta olmak
            istiyorsan başlangıç noktası burası.
          </p>
          <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="dugme" to="/kayit" data-olcum="uye_ol_tikla" data-olcum-veri="land-alt">Üye ol</Link>
            <a className="dugme sade" href="mailto:hello@compec.org">hello@compec.org</a>
          </div>
        </div>
      </section>

      {/* Iki tarafi ayiran ortak parca: kurum seridi tek kez basilir. */}
      <Serit kurumlar={serit} />

      {/* ---------------- kurum tarafi ---------------- */}
      <section className="giris">
        <div className="kap">
          <div className="giris-izgara">
            <div>
              <h2>Boğaziçi mühendislik öğrencisiyle <i>aynı salonda</i> olmanın yolu.</h2>
              <p className="giris-ozet">
                Aradığınız mühendisler daha kampüsten çıkmadan burada. COMPEC 1994'ten
                beri bu öğrencileri bir araya getiriyor; etkinlikleri de onlar
                düzenliyor. Sponsor olarak o salona giriyorsunuz.
              </p>
              <div className="giris-eylem">
                <a className="dugme" href="mailto:hello@compec.org?subject=Sponsorluk%20g%C3%B6r%C3%BC%C5%9Fmesi" data-olcum="sponsor_iletisim" data-olcum-veri="giris">Görüşme talep et</a>
                <Link className="dugme sade" to="/etkinlikler">Etkinlik arşivi</Link>
              </div>
            </div>
            <div className="kulak">
              <dl>
                <dt>En büyük etkinlik</dt><dd><b>TechSummit</b>2026'da 17. baskı</dd>
                <dt>Ölçek kaydı</dt><dd><b>801</b>kayıt, TechSummit 2022</dd>
                <dt>Kesintisiz sponsor</dt><dd><b>2018</b>'den beri</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div><h2>Neden buradasınız</h2></div>
          </div>

          <div className="arsiv">
            <div className="satir">
              <div className="satir-yil">01</div>
              <div>
                <h3>İşe alım hunisinin en üstü</h3>
                <p>
                  Boğaziçi'nin mühendislik ve bilgisayar bölümleri Türkiye'nin en dar
                  kontenjanlı programları. TechSummit 2023'te Güney Kampüs çimlerinde
                  teknoloji fuarı kuruldu ve öğrenciler stantlara CV bıraktı. 2025'te
                  HubX staj ödüllü bir case study yürüttü. Bu formatlar duruyor.
                </p>
              </div>
              <div className="satir-veri"><span>Stant, case study, CV havuzu</span></div>
            </div>

            <div className="satir">
              <div className="satir-yil">02</div>
              <div>
                <h3>Marka bilinirliği, doğru zamanda</h3>
                <p>
                  Öğrenci ilk işini seçerken hangi şirketleri tanıdığına bakar.
                  2018'de Huawei ve Facebook Türkiye aynı etkinliğin sponsoruydu.
                  O yıl kampüste olan öğrenciler bugün sektörde çalışıyor.
                </p>
              </div>
              <div className="satir-veri"><span>Ana, altın, gümüş kademeler</span></div>
            </div>

            <div className="satir">
              <div className="satir-yil">03</div>
              <div>
                <h3>Teknik ekibiniz için sahne</h3>
                <p>
                  Mühendisleriniz atölye verebilir, konuşabilir, hackathon problemi
                  koyabilir. Invent Analytics algoRun'da veri problemi verdi, invent.ai
                  DataCamp'te atölye yürüttü. İşveren markası için bir stanttan daha
                  kalıcı bir iz.
                </p>
              </div>
              <div className="satir-veri"><span>Atölye, konuşma, hackathon</span></div>
            </div>

            <div className="satir">
              <div className="satir-yil">04</div>
              <div>
                <h3>Yanınızda duracağı belli bir kurum</h3>
                <p>
                  Otuz iki yıllık bir kulüp ve kesintisiz süren etkinlik serileri.
                  Yapı Kredi Teknoloji iki yıl üst üste ana sponsor oldu. Insider
                  2018 ve 2019'da altın sponsordu, 2025'te DataCamp'e konuşmacı verdi.
                  İlişki tek seferlik olmak zorunda değil.
                </p>
              </div>
              <div className="satir-veri"><span>Süreklilik</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Bizimle çalışan kurumlar</h2>
              <p className="bas-alt">
                TechSummit ana sponsor zinciri ve diğer etkinlik ortakları: hangi
                kurum, hangi yıl, hangi kademede.
              </p>
            </div>
            <div className="kunye">{sponsorZinciri.length} kayıt</div>
          </div>

          <div className="tablo-sar"><table className="tablo">
            <thead><tr><th>Kurum</th><th>Etkinlik</th><th>Yıl</th><th>Kademe</th></tr></thead>
            <tbody>
              {sponsorZinciri.map((k, i) => (
                <tr key={i}>
                  <td><b>{k.ad}</b></td>
                  <td>{ETKAD[k.etkinlik] || k.etkinlik}</td>
                  <td>{k.yil || ''}</td>
                  <td>{TABLO_KADEME[k.kademe] || 'Ortak'}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </section>

      <section className="blok">
        <div className="kap dar">
          <h2 style={{ fontSize: 'clamp(26px,3.4vw,36px)' }}>Konuşalım</h2>
          <p style={{ marginTop: 16, color: '#B7C4D3' }}>
            Hangi etkinlik, hangi format ve hangi bütçe aralığı sizin için anlamlı,
            onu birlikte belirleyelim. Kurumsal İletişim ve Finans ekibimiz güncel
            etkinlik takvimi ve sponsorluk dosyasıyla dönüş yapar.
          </p>
          <div style={{ marginTop: 26 }}>
            <a className="dugme" href="mailto:hello@compec.org?subject=Sponsorluk%20g%C3%B6r%C3%BC%C5%9Fmesi" data-olcum="sponsor_iletisim" data-olcum-veri="alt">hello@compec.org</a>
          </div>
          <p className="mono" style={{ marginTop: 20, color: '#93A6BD' }}>
            Not: 2026-2027 sezonunun etkinlik takvimi henüz ilan edilmedi. Görüşmede
            güncel tarihleri paylaşırız.
          </p>
        </div>
      </section>
    </>
  );
}
