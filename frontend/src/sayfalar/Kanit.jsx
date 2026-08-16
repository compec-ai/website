import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';

const KONU_AD = {
  olcek: 'Ölçek',
  sureklilik: 'Süreklilik',
  erisim: 'Erişilebilirlik',
  topluluk: 'Topluluk büyüklüğü',
  eksik: 'Bilmediklerimiz',
};
const KONU_ALT = {
  olcek: 'Kaç kişiye ulaştığımız. Kayıt sayısı ile kapıdan geçen katılımcı sayısını ayırıyoruz.',
  sureklilik: 'Kaç yıldır aynı işi yaptığımız.',
  erisim: 'Katılmanın maliyeti.',
  topluluk: 'Takip eden insan sayısı. Bunlar platform takipçisidir, kulüp üyesi değildir.',
  eksik: 'Söylenmesi kolay olurdu ama doğrulayamadık, o yüzden siteye koymadık.',
};
const SIRA = ['olcek', 'sureklilik', 'topluluk', 'erisim', 'eksik'];

export default function Kanit() {
  const { yukleniyor, hata, veri } = useApi({ kanitlar: '/api/kanitlar' });
  const baslik = (
    <Baslik baslik="Rakamlar ve kaynakları"
      aciklama="COMPEC sitesindeki her rakamın kaynağı, doğrulama durumu ve doğrulayamadığımız iddialar." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const hepsi = veri.kanitlar;
  const gruplar = SIRA.map((k) => [k, hepsi.filter((s) => s.konu === k)]).filter(([, s]) => s.length);
  const sayim = {};
  for (const s of hepsi) sayim[s.etiket] = (sayim[s.etiket] || 0) + 1;

  return (
    <>
      {baslik}
      <section className="kapak">
        <div className="kap">
          <div className="kapak-ic">
            <div>
              <h1>Rakamlar ve <span>kaynakları.</span></h1>
              <p className="kapak-ozet">
                Öğrenci kulüpleri tanıtımlarında büyük sayılar kullanır ve genellikle bu
                sayıların nereden geldiği yazmaz. Biz tersini yapıyoruz: sitedeki her rakamın
                yanında kimin söylediği duruyor. Doğrulayamadıklarımızı da bu sayfada
                listeliyoruz, çünkü bir kulübün neyi bilmediğini söylemesi neyi bildiğini
                söylemesi kadar önemli.
              </p>
            </div>
            <div className="kunye-tablo">
              <div className="kunye-satir">
                <b>{sayim.dogrulanmis || 0}</b>
                <div className="ne">bağımsız kaynakla doğrulanmış kayıt<span className="kaynak">biletimGO, Biletino, Kommunity, Youthall, LinkedIn, Boğaziçi Üniversitesi</span></div>
              </div>
              <div className="kunye-satir">
                <b>{sayim['kulup-ici'] || 0}</b>
                <div className="ne">yalnızca kulüp kaydına dayanan<span className="kaynak">bağımsız doğrulama yok, öyle etiketlendi</span></div>
              </div>
              <div className="kunye-satir">
                <b>{sayim.eksik || 0}</b>
                <div className="ne">bilmediğimizi kabul ettiğimiz<span className="kaynak">tahminle doldurulmadı</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bolum">
        <div className="kap">
          {gruplar.map(([konu, satirlar]) => (
            <div className="kanit-grup" key={konu}>
              <h3>{KONU_AD[konu] || konu}</h3>
              {KONU_ALT[konu]
                ? <p style={{ color: 'var(--metin-3)', fontSize: '14.5px', margin: '10px 0 4px' }}>{KONU_ALT[konu]}</p>
                : null}
              {satirlar.map((s, i) => (
                <div className="kanit" key={i}>
                  <div className="iddia">
                    {s.deger ? <b>{s.deger}</b> : null}
                    {s.iddia}
                    {s.aciklama ? <p>{s.aciklama}</p> : null}
                  </div>
                  <div className="kaynak">
                    {s.kaynak_url
                      ? <a href={s.kaynak_url} target="_blank" rel="noopener">{s.kaynak}</a>
                      : (s.kaynak || <span style={{ color: 'var(--metin-3)' }}>kaynak yok</span>)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="not" style={{ marginTop: 10 }}>
            Bir hata gördüysen ya da elinde daha iyi bir kaynak varsa
            {' '}<a href="mailto:hello@compec.org">hello@compec.org</a> adresine yazabilirsin.
            Düzeltiriz ve kaynağını yazarız.
          </div>
        </div>
      </section>
    </>
  );
}
