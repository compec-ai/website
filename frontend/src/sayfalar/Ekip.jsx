import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApi } from '../lib/api.js';
import { Baslik } from '../bilesenler/Duzen.jsx';
import Durum from '../bilesenler/Durum.jsx';
import { foto, bashARF, sadelestir } from '../lib/bicim.js';
import Baglantilar from '../bilesenler/Baglantilar.jsx';

export default function Ekip() {
  const { yukleniyor, hata, veri } = useApi({ uyeler: '/api/uyeler' });
  const [parametre, setParametre] = useSearchParams();
  const donem = parametre.get('donem') || null;
  const arama = parametre.get('q') || '';
  const [kutu, setKutu] = useState(arama);
  useEffect(() => { setKutu(arama); }, [arama]);

  const baslik = (
    <Baslik baslik="Üye dizini" aciklama="COMPEC üyeleri ve yönetim kurullarında görev almış kişiler." />
  );
  if (!veri) return <>{baslik}<Durum yukleniyor={yukleniyor} hata={hata} /></>;

  const uyeler = veri.uyeler;
  const donemSayim = new Map();
  for (const k of uyeler) if (k.donem) donemSayim.set(k.donem, (donemSayim.get(k.donem) || 0) + 1);
  const donemler = [...donemSayim.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));

  let liste = uyeler.filter((k) => !donem || k.donem === donem);
  // Guncel donem once, sonra donem azalan, sonra ada gore.
  liste = [...liste].sort((a, b) =>
    (a.donem === '2025-2026' ? 0 : 1) - (b.donem === '2025-2026' ? 0 : 1)
    || String(b.donem || '').localeCompare(String(a.donem || ''))
    || String(a.ad).localeCompare(String(b.ad), 'tr'));
  if (arama) {
    const aranan = sadelestir(arama);
    liste = liste.filter((k) => sadelestir(k.ad).includes(aranan) || sadelestir(k.gorev).includes(aranan));
  }
  const eksik = liste.filter((k) => !k.linkedin && !k.github).length;

  const suzgecYolu = (d) => (d ? { donem: d } : {});

  return (
    <>
      {baslik}
      <section className="bolum">
        <div className="kap">
          <div className="bas">
            <div>
              <h2>Üye dizini</h2>
              <p className="bas-alt">
                Kulüpte görev almış ve almakta olan üyeler. Profiline LinkedIn ekleyen
                herkese buradan doğrudan ulaşabilirsin.
              </p>
            </div>
            <div className="kunye">{uyeler.length} kayıt</div>
          </div>

          <div className="suzgec">
            <Link to="/ekip" className={!donem ? 'etkin' : undefined}>Tümü</Link>
            {donemler.map(([d, adet]) => (
              <Link key={d} to={{ pathname: '/ekip', search: new URLSearchParams(suzgecYolu(d)).toString() }}
                className={donem === d ? 'etkin' : undefined}>{d} ({adet})</Link>
            ))}
            <form onSubmit={(o) => {
              o.preventDefault();
              const y = {};
              if (donem) y.donem = donem;
              if (kutu) y.q = kutu;
              setParametre(y);
            }}>
              <input type="search" name="q" placeholder="İsim ara" value={kutu}
                onChange={(o) => setKutu(o.target.value)} aria-label="İsim ara" />
              <button className="dugme sade" type="submit">Ara</button>
            </form>
          </div>

          {liste.length === 0
            ? <p style={{ color: 'var(--metin-2)' }}>Bu ölçütlere uyan kayıt yok.</p>
            : (
              <div className="dizin">
                {liste.map((k) => (
                  <article className="kart" key={k.slug}>
                    <div className="kart-foto">
                      {k.foto
                        ? <img src={foto(k.foto)} alt={k.ad} loading="lazy" />
                        : <div className="kart-bos" aria-hidden="true">{bashARF(k.ad)}</div>}
                    </div>
                    <div className="kart-ic">
                      <h3><Link to={'/uye/' + k.slug}>{k.ad}</Link></h3>
                      {k.gorev ? <div className="rol">{k.gorev}</div> : null}
                      {k.donem ? <div className="kunye">{k.donem}</div> : null}
                      <div className="kart-bag"><Baglantilar k={k} /></div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          <p className="mono" style={{ marginTop: 24 }}>
            {eksik
              ? `${eksik} kişinin bağlantısı henüz eklenmemiş. Doğrulanmış kişisel adresi olmadan tahmin etmiyoruz.`
              : 'Listedeki herkesin bağlantısı doğrulanmış kaynaklardan eklendi.'}
          </p>
        </div>
      </section>
    </>
  );
}
