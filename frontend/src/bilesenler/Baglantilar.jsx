import { IKON } from './Duzen.jsx';

/** Bir uyenin dis baglantilari; hicbiri yoksa acik bir "eklenmemis" rozeti. */
export default function Baglantilar({ k }) {
  const p = [];
  if (k.linkedin) p.push(<a key="l" href={k.linkedin} target="_blank" rel="noopener me">{IKON.linkedin} LinkedIn</a>);
  if (k.github) p.push(<a key="g" href={k.github} target="_blank" rel="noopener me">{IKON.github} GitHub</a>);
  if (p.length) return <>{p}</>;
  return (
    <span className="yok" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mono)',
      fontSize: '11.5px', border: '1px dashed var(--cizgi-2)', borderRadius: 3,
      padding: '4px 9px', color: 'var(--metin-3)',
    }}>Bağlantı eklenmemiş</span>
  );
}
