export default function Affiliations() {
  const partners = [
    { name: 'Egyptian oncology societies', desc: 'Collaboration on continuing medical education and joint scientific sessions.' },
    { name: 'University oncology departments', desc: 'Academic partnerships supporting fellows and residents in critical appraisal.' },
    { name: 'International congress reviews', desc: 'Structured post-conference reviews of ASCO, ESMO and other meetings.' },
    { name: 'Industry educational grants', desc: 'Unrestricted educational support, governed by strict independence of scientific content.' }
  ]
  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Affiliations &amp; Cooperation</h1>
          <p>The partnerships that make CAIRO's educational mission possible.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <p className="section-sub">CAIRO Journal Club works with academic, professional and industry partners to deliver independent, high-quality oncology education. Scientific content is always developed independently of any commercial interest.</p>
          <div className="grid grid-2">
            {partners.map((p) => (
              <div key={p.name} className="card">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 24, background: 'var(--blue-light)', border: 'none' }}>
            <h3>Interested in cooperating?</h3>
            <p>We welcome partnerships with societies, institutions and organisations that share our commitment to evidence-based oncology. Please reach out via our <a href="/contact">contact page</a>.</p>
          </div>
        </div>
      </section>
    </>
  )
}
