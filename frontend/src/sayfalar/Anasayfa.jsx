import { Link } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik, IKON } from '../bilesenler/Duzen.jsx';
import Serit from '../bilesenler/Serit.jsx';
import Cip from '../bilesenler/Cip.jsx';
import Durum from '../bilesenler/Durum.jsx';
import Kaydirak from '../bilesenler/Kaydirak.jsx';
import { sayi, foto, logoBul, kurumLogo, bashARF, seritKurumlari } from '../lib/bicim.js';

const AMIRAL = ['techsummit', 'datacamp', 'digitalized'];
const KANITLI_IDDIA = ['TechSummit 2022 kaydı', 'Bilişim Ödülleri 2018 oyu, 20 gün içinde',
  'Digitalized 2022 kaydı', 'TechSummit 2019 katılımcısı'];
const SECKI_KAZANAN = ['Netflix', 'Yemeksepeti', 'Ekşi Sözlük', 'Google', 'Getir',
  'Trendyol', 'Spotify', 'sahibinden.com'];
const BUYUK_YIL = [1994, 2013, 2017, 2026];

/* Kahraman kaydiraginin ILK karesi: Tuna'nin sectigi kare burada kaliyor.
   Olculer gercek dosyayla birebir (2200x1650); yanlis oran verilirse tarayici
   yukleme sirasinda yerlesimi kaydiriyor. Aciklama cumlesi dogrulanmis kunye,
   uydurma degil; digerlerinden farkli olarak ayri bir kaynak/ad kunyesi yok. */
const KAHRAMAN_ILK = {
  anahtar: 'dc23-havadan',
  foto: 'dc23-havadan.jpg',
  alt: "Albert Long Hall'da dolu bir COMPEC etkinliği",
  en: 2200,
  boy: 1650,
  aciklama: 'DataCamp 2023, Albert Long Hall. Salonun fiziksel kapasitesi dolmuştu.',
  kunye: '',
};

export default function Anasayfa() {
  const { yukleniyor, hata, veri } = useApi({
    ozet: '/api/ozet', etkinlikler: '/api/etkinlikler', kurumlar: '/api/kurumlar',
    konusmacilar: '/api/konusmacilar', kanitlar: '/api/kanitlar',
    kilometre: '/api/kilometre', oduller: '/api/oduller', uyeler: '/api/uyeler',
  });

  const baslik = (
    <Baslik baslik="Boğaziçi Üniversitesi Bilişim Kulübü"
      aciklama="1994'ten beri Boğaziçi Üniversitesi'nde teknoloji. Her rakamın kaynağı yazılı." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const { ozet, etkinlikler, kurumlar, konusmacilar, kanitlar, kilometre, oduller, uyeler } = veri;
  const gemiler = AMIRAL.map((s) => etkinlikler.find((e) => e.slug === s)).filter(Boolean);
  const serit = seritKurumlari(kurumlar, konusmacilar);
  const kadro = konusmacilar.slice(0, 8);
  const kanitli = kanitlar
    .filter((k) => k.deger && k.etiket === 'dogrulanmis' && KANITLI_IDDIA.includes(k.iddia))
    .sort((a, b) => a.sira - b.sira);
  const ekip = uyeler.filter((k) => k.donem === '2025-2026');

  /* Kahraman kareleri VERIDEN: fotografi olan etkinlikler. Kare aciklamasi
     etkinligin kendi ozeti, kunye "ad, yil" — hicbiri elle yazilmiyor. */
  const kahramanKareler = [KAHRAMAN_ILK, ...etkinlikler.filter((e) => e.foto).map((e) => ({
    anahtar: e.slug,
    foto: e.foto,
    alt: e.ad,
    aciklama: e.ozet || '',
    kunye: [e.ad, e.yil].filter(Boolean).join(', '),
  }))];

  // Her kazanan icin en yeni kaydi al, yila gore azalan sirala.
  const enYeni = new Map();
  for (const o of oduller) {
    if (!SECKI_KAZANAN.includes(o.kazanan)) continue;
    const v = enYeni.get(o.kazanan);
    if (!v || o.yil > v.yil) enYeni.set(o.kazanan, o);
  }
  const secki = [...enYeni.values()].sort((a, b) => b.yil - a.yil).slice(0, 8);
  /* Odul seckisi izgarasi 4 / 2 / 1 sutun. Oge sayisi 4'un katina indiriliyor:
     yedi ogeyle son satirda uc bos hucre kaliyor ve kabin arka plani orada
     acik bir blok gibi gorunuyordu. */
  const seckiDolu = secki.slice(0, Math.floor(secki.length / 4) * 4);

  return (
    <>
      {baslik}
      <section className="kahraman">
        {/* Baslik ve dugmeler sabit; kayan sey fotograf ile ALTINDAKI aciklama
            ve kunye. Foto alani sabit oranli oldugu icin kare degisirken
            yukseklik degismiyor. */}
        <Kaydirak sinif="kahraman-kaydirak" goster={1} sure={7000}
          etiket="Etkinlik fotoğrafları" ogeler={kahramanKareler}
          anahtar={(k) => k.anahtar}
          cocuk={(k, s) => (
            <figure className="kahraman-kare">
              <div className="kahraman-foto">
                <img src={foto(k.foto)} alt={k.alt}
                  width={k.en} height={k.boy}
                  loading={s === 0 ? 'eager' : 'lazy'}
                  fetchPriority={s === 0 ? 'high' : 'low'} />
              </div>
              <div className="kap">
                <figcaption className="kahraman-kunye-foto">
                  <span className="aciklama">{k.aciklama}</span>
                  {k.kunye ? <span className="kunye">{k.kunye}</span> : null}
                </figcaption>
              </div>
            </figure>
          )} />
        <div className="kap">
          <h1>Boğaziçi'nde teknoloji, <span>1994'ten beri.</span></h1>
          <p className="kahraman-ozet">
            TechSummit 2010'dan, DataCamp 2017'den beri kesintisiz düzenleniyor.
            Hepsini öğrenciler kuruyor. Bu sayfadaki her rakamın yanında kaynağı yazılı.
          </p>
          <div className="kahraman-eylem">
            <Link className="dugme" to="/katil" data-olcum="uye_ol_tikla" data-olcum-veri="kahraman">Aramıza katıl</Link>
            <Link className="dugme sade" to="/arsiv">Arşive gir</Link>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Rakamlar ve nereden geldikleri</h2>
              <p>
                Öğrenci kulüpleri tanıtımlarında büyük sayılar kullanır, kaynağını yazmaz.
                Biz tersini yapıyoruz. Doğrulayamadıklarımız da ayrı bir sayfada duruyor.
              </p>
            </div>
            <div className="yan"><Link to="/kanit">Tüm kayıtlar</Link></div>
          </div>
          {/* Kaynak metni her karede duruyor: bu bolumun varlik sebebi o. */}
          <Kaydirak sinif="kaydirak-kanitli" goster={3} sure={6000}
            etiket="Kanıtlı rakamlar" ogeler={kanitli} anahtar={(k) => k.iddia}
            cocuk={(k) => (
              <div className="kanitli-oge">
                <b>{k.deger}</b>
                <div className="ne">{k.iddia}</div>
                <span className="kaynak">{k.kaynak || 'kaynak yok'}</span>
              </div>
            )} />
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Amiral gemilerimiz</h2>
              <p>Her birinin sayfasında baskı zinciri, konuşmacı kadrosu ve destekleyen kurumlar var.</p>
            </div>
            <div className="yan"><Link to="/etkinlikler">Tüm etkinlikler</Link></div>
          </div>
          <div className="gemiler">
            {gemiler.map((e) => {
              const numara = (e.baski || '').match(/(\d+)\./);
              return (
                <Link className="gemi" to={'/etkinlik/' + e.slug} key={e.slug}>
                  {e.foto
                    ? <div className="gemi-foto"><img src={foto(e.foto)} alt="" loading="lazy" /></div>
                    : <div className="gemi-yazisiz">{numara ? <b>{numara[1]}</b> : null}</div>}
                  <div className="gemi-ic">
                    <span className="gemi-etiket">{e.tur || ''}</span>
                    <h3>{e.ad}</h3>
                    <p>{e.ozet}</p>
                    <div className="gemi-veri">
                      {e.baski ? <span><b>{e.baski}</b></span> : null}
                      {e.kayit_sayisi ? <span><b>{sayi(e.kayit_sayisi)}</b> kayıt</span> : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>1994'ten bugüne</h2>
              <p>
                Kulübün kendi tarihini kimse derli toplu yazmamıştı. Aşağıdaki her satır
                arşivden çıkarıldı; çıkarım olanlar ayrıca işaretli.
              </p>
            </div>
            <div className="yan">{kilometre.length} kilometre taşı</div>
          </div>
          <div className="cizelge ikili">
            {kilometre.map((t, i) => (
              <div className={'tas' + (BUYUK_YIL.includes(t.yil) ? ' buyuk' : '')} key={i}>
                <div className="tas-yil">{t.yil}</div>
                <h3>{t.baslik}</h3>
                {t.aciklama ? <p>{t.aciklama}</p> : null}
                <div className="kunye-alt"><Cip etiket={t.etiket} /><span>{t.kaynak || ''}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Sahnede kimler oldu</h2>
              <p>Son iki yılın kadrosundan bir kesit. Kulübün eski sitesinde bu bölüm uydurma isimlerle doluydu; artık gerçek.</p>
            </div>
            <div className="yan"><Link to="/kimlerle">Tüm kadroyu gör</Link></div>
          </div>
          <div className="kadro">
            {kadro.map((k, i) => (
              <div className="kadro-oge" key={i}>
                <div className="kurum">
                  {logoBul(k.kurum) ? <img src={kurumLogo(logoBul(k.kurum))} alt={k.kurum} loading="lazy" /> : null}
                  <span>{k.tur === 'egitmen' ? 'atölye' : 'konuşma'} · {k.yil}</span>
                </div>
                <h4>{k.ad}</h4>
                <div className="unvan">{[k.unvan, k.kurum].filter(Boolean).join(', ')}</div>
                {k.baslik ? <div className="konu">{k.baslik}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blok">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Bilişim Ödülleri arşivi</h2>
              <p style={{ color: '#B7C4D3' }}>
                2013'ten bugüne {ozet.odul} kazanan kaydı, {ozet.odulYil} tören yılı.
                Bir ödül töreninin en kalıcı çıktısı kazanan listesidir ve bu liste
                hiçbir yerde toplu halde durmuyordu.
              </p>
            </div>
            <div className="yan"><Link to="/oduller">Tam arşiv</Link></div>
          </div>
          <div className="secki">
            {seckiDolu.map((o, i) => (
              <div className="secki-oge" key={i}>
                <div className="yil">{o.yil}</div>
                <b>{o.kazanan}</b>
                <span>{o.kategori}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Serit kurumlar={serit} />

      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Kulübü yürütenler</h2>
              <p>2025-2026 yönetim kurulu. Herkesin LinkedIn profiline buradan ulaşabilirsin.</p>
            </div>
            <div className="yan"><Link to="/ekip">Üye dizinine git</Link></div>
          </div>
          <Kaydirak sinif="kaydirak-ekip" goster={4} sure={6000}
            etiket="Yönetim kurulu" ogeler={ekip} anahtar={(k) => k.slug}
            cocuk={(k) => (
              <article className="kisi">
                <div className="kisi-foto">
                  {k.foto
                    ? <img src={foto(k.foto)} alt={k.ad} loading="lazy" />
                    : <div className="kisi-bos" aria-hidden="true">{bashARF(k.ad)}</div>}
                </div>
                <div className="kisi-ic">
                  <h3><Link to={'/uye/' + k.slug}>{k.ad}</Link></h3>
                  <div className="rol">{k.gorev || ''}</div>
                  <div className="kisi-bag">
                    {k.linkedin
                      ? <a href={k.linkedin} target="_blank" rel="noopener me">{IKON.linkedin} LinkedIn</a>
                      : <span>eklenmemiş</span>}
                  </div>
                </div>
              </article>
            )} />
        </div>
      </section>

      <section className="bolum" style={{ paddingTop: 0 }}>
        <div className="kap">
          <div className="bas"><div><h2>Buradan devam et</h2></div></div>
          <div className="kapilar">
            <Link className="kapi" to="/ogrenciler" data-olcum="ogrenci_sayfasi_tikla">
              <span>Öğrenciysen</span>
              <h3>Kulüp sana ne katar</h3>
              <p>Kimlerle tanışacağın, hangi şirketlere gezi düzenlendiği ve bunun ne kadar tuttuğu.</p>
              <span className="git">Öğrenciler için &rarr;</span>
            </Link>
            <Link className="kapi" to="/sirketler" data-olcum="sirket_sayfasi_tikla">
              <span>Şirketseniz</span>
              <h3>Kime ulaşırsınız</h3>
              <p>Erişim formatları, geçmiş baskıların kaynaklı rakamları ve sponsor tarihçesi.</p>
              <span className="git">Şirketler için &rarr;</span>
            </Link>
            <Link className="kapi" to="/arsiv">
              <span>Merak ediyorsan</span>
              <h3>Kurum arşivi</h3>
              <p>Baskı kayıtları, ödül arşivi, konuşmacı kadrosu, kurumlar ve kaynak künyeleri bir arada.</p>
              <span className="git">Arşive gir &rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
