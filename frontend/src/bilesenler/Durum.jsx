/** Yukleme ve hata durumlari icin ortak, sade blok. */
export default function Durum({ yukleniyor, hata }) {
  return (
    <section className="bolum">
      <div className="kap">
        <p style={{ color: 'var(--metin-2)' }}>
          {yukleniyor ? 'Yükleniyor…' : 'İçerik yüklenemedi: ' + (hata?.message || 'bilinmeyen hata')}
        </p>
      </div>
    </section>
  );
}
