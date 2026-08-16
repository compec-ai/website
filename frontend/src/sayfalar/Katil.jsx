import { Baslik } from '../bilesenler/Duzen.jsx';

/* Hesap sistemi henuz yazilmadi (bkz. depo README yol haritasi). Bu sayfa
   "Aramiza katil" baglantilarinin gectigi yer: durum bilgisi ve v7 alt
   bilgisinde zaten bulunan gercek iletisim kanallari. */
export default function Katil() {
  return (
    <>
      <Baslik baslik="Aramıza katıl"
        aciklama="COMPEC üyelik sistemi hazırlanıyor. O zamana kadar bize aşağıdaki kanallardan ulaşabilirsin." />
      <section className="bolum">
        <div className="kap dar">
          <h1>Aramıza katıl</h1>
          <p style={{ marginTop: 18, color: 'var(--metin-2)' }}>
            Üyelik ücretsiz ve bölüm şartı yok. Site üzerinden hesap açma sistemi
            şu anda hazırlanıyor; hazır olduğunda kayıt buradan yapılacak.
          </p>
          <p style={{ marginTop: 14, color: 'var(--metin-2)' }}>
            O zamana kadar bize aşağıdaki kanallardan yazabilirsin. Etkinlik
            duyurularımız Kommunity'de, günlük paylaşımlarımız Instagram'da.
          </p>
          <div style={{ marginTop: 26, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="dugme" href="mailto:hello@compec.org">hello@compec.org</a>
            <a className="dugme sade" href="https://www.instagram.com/bouncompec/" rel="noopener">Instagram</a>
            <a className="dugme sade" href="https://kommunity.com/compec" rel="noopener">Kommunity</a>
            <a className="dugme sade" href="https://www.linkedin.com/company/bouncompec" rel="noopener">LinkedIn</a>
          </div>
        </div>
      </section>
    </>
  );
}
