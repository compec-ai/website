import { Link } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';

export default function Oduller() {
  const { yukleniyor, hata, veri } = useApi({ oduller: '/api/oduller' });
  const baslik = (
    <Baslik baslik="Boğaziçi Bilişim Ödülleri arşivi"
      aciklama="Boğaziçi Bilişim Ödülleri’nin 2013’ten bugüne kazananları, kategori kategori ve kaynaklarıyla." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const hepsi = veri.oduller;
  const gruplu = new Map();
  for (const o of hepsi) {
    if (!gruplu.has(o.yil)) gruplu.set(o.yil, []);
    gruplu.get(o.yil).push(o);
  }
  const yillar = [...gruplu.entries()].sort((a, b) => b[0] - a[0]);
  const kategoriSayisi = new Set(hepsi.map((o) => o.kategori)).size;

  return (
    <>
      {baslik}
      <section className="kapak">
        <div className="kap">
          <div className="kapak-ic">
            <div>
              <h1>Bilişim Ödülleri <span>arşivi.</span></h1>
              <p className="kapak-ozet">
                Bir ödül töreninin en kalıcı çıktısı kazanan listesidir. Boğaziçi Bilişim
                Ödülleri 2013'ten beri düzenleniyor ve bu liste bugüne kadar hiçbir yerde
                toplu halde durmuyordu. Her satırın yanında kaynağı var; çoğu Wayback
                Machine üzerinden kurtarılmış eski tören sayfalarından geliyor.
              </p>
            </div>
            <div className="kunye-tablo">
              <div className="kunye-satir"><b>{hepsi.length}</b><div className="ne">kayıtlı ödül<span className="kaynak">2013-2025</span></div></div>
              <div className="kunye-satir"><b>{yillar.length}</b><div className="ne">tören yılı<span className="kaynak">arşivden çıkarılabilen</span></div></div>
              <div className="kunye-satir"><b>{kategoriSayisi}</b><div className="ne">ayrı kategori<span className="kaynak">yıllar içinde değişti</span></div></div>
              <div className="kunye-satir"><b>130.000+</b><div className="ne">2018 oyu, 20 gün içinde<span className="kaynak">Boğaziçi Üniversitesi resmî haber sitesi</span></div></div>
            </div>
          </div>
        </div>
      </section>

      {yillar.map(([yil, satirlar]) => (
        <section className="bolum" style={{ paddingBottom: 0 }} key={yil}>
          <div className="kap">
            <div className="bas">
              <div><h2>{yil}</h2></div>
              <div className="yan">{satirlar.length} ödül</div>
            </div>
            <div className="tablo-sar">
              <table className="tablo odul-tablo">
                <thead><tr><th>Kategori</th><th>Kazanan</th><th>Kaynak</th></tr></thead>
                <tbody>
                  {satirlar.map((o, i) => (
                    <tr key={i}>
                      <td>{o.kategori}</td>
                      <td><b>{o.kazanan || ''}</b></td>
                      <td>{o.kaynak_url ? <a href={o.kaynak_url} target="_blank" rel="noopener">arşiv kaydı</a> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      <section className="bolum">
        <div className="kap dar">
          <div className="not">
            Bu arşiv tamamlanmış değil. Bazı yılların kategori dökümü eksik, bazı kazananlar
            yalnızca tek kaynakta geçiyor ve o satırlar şüpheli olarak işaretli. Elinde eski
            bir tören programı ya da haber bağlantısı varsa
            {' '}<a href="mailto:hello@compec.org">hello@compec.org</a> adresine yazarsan ekleriz.
          </div>
          <p style={{ marginTop: 22 }}><Link className="dugme sade" to="/kanit">Rakamlar ve kaynakları</Link></p>
        </div>
      </section>
    </>
  );
}
