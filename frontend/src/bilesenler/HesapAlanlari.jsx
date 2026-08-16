/* Ayarlardan yonetilen dinamik kayit alanlarini cizen ortak bilesen.
   Tipler HESAP-KONTRAT.md'deki dortlu: metin | eposta | sayi | onay.
   Hem /kayit hem /profil ayni bileseni kullanir, alan listesi
   GET /api/hesap/kayit-alanlari'ndan gelir, kodda gomulu degildir. */

const GIRDI_TIPI = { metin: 'text', eposta: 'email', sayi: 'number' };

export function DinamikAlanlar({ alanlar, deger, degistir, onek = 'alan' }) {
  return alanlar.map((a) => {
    const kimlik = onek + '-' + a.ad;
    if (a.tip === 'onay') {
      return (
        <label className="onay-satir" key={a.ad} htmlFor={kimlik}>
          <input id={kimlik} name={a.ad} type="checkbox"
            checked={deger[a.ad] === true}
            onChange={(o) => degistir(a.ad, o.target.checked)} />
          <span>{a.etiket || a.ad}{a.zorunlu ? ' *' : ''}</span>
        </label>
      );
    }
    return (
      <div className="alan" key={a.ad}>
        <label htmlFor={kimlik}>{a.etiket || a.ad}{a.zorunlu ? ' *' : ''}</label>
        <input id={kimlik} name={a.ad} type={GIRDI_TIPI[a.tip] || 'text'}
          required={!!a.zorunlu}
          value={deger[a.ad] ?? ''}
          onChange={(o) => degistir(a.ad, o.target.value)} />
      </div>
    );
  });
}

/* KVKK aydinlatma metni: 2026-08 yazi oturumunda taslak olarak yazildi. */
export function KvkkOnay({ isaretli, degistir }) {
  return (
    <div className="kvkk">
      {/* TASLAK, kulup onayindan gecmedi */}
      <div className="kvkk-metin">
        <p>
          Kayıt olurken verdiğin ad, soyad, e-posta adresi ve duyuru tercihinle
          birlikte, formda istenirse okul mailin ve okul numaran kaydedilir.
          Parolan olduğu gibi tutulmaz; yalnızca özeti saklanır.
        </p>
        <p>
          Bu bilgileri üyeliğini yürütmek ve, izin verdiysen, etkinlik duyuruları
          göndermek için kullanırız. Hepsi kulübün kendi sunucusunda durur;
          başka bir şirkete ya da kuruma aktarılmaz.
        </p>
        <p>
          Oturumunu açık tutan çerez dışında ölçüm çerezleri de var, onlar
          isteğe bağlı ve sayfanın altındaki çubuktan yönetiliyor.
        </p>
        <p>
          Bilgilerinin silinmesini istersen{' '}
          <a href="mailto:hello@compec.org">hello@compec.org</a> adresine yazman
          yeterli.
        </p>
      </div>
      <label className="onay-satir" htmlFor="kvkk-onay">
        <input id="kvkk-onay" name="kvkkOnay" type="checkbox" required
          checked={isaretli} onChange={(o) => degistir(o.target.checked)} />
        <span>Aydınlatma metnini okudum, kişisel verilerimin işlenmesini onaylıyorum. *</span>
      </label>
    </div>
  );
}
