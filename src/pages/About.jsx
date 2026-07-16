export default function About() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>About Us</h1>
          <p>Critical Appraisal Initiative for Research in Oncology</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <h2 className="section-title">Who we are</h2>
          <div className="section-title-bar" />
          <p>The <b>CAIRO Journal Club</b> — the <b>C</b>ritical <b>A</b>ppraisal <b>I</b>nitiative for <b>R</b>esearch in <b>O</b>ncology — is an Egyptian educational entity that has been active since <b>2013</b>. Our mission is to strengthen evidence-based oncology practice across Egypt and the region by teaching clinicians how to critically read, appraise and apply the medical literature.</p>
          <p style={{ marginTop: 12 }}>Over more than a decade we have hosted structured journal-club sessions, hands-on appraisal workshops and post-conference review meetings covering the major international congresses (ASCO, ESMO and others). Our sessions bring together medical, clinical, radiation and surgical oncologists, fellows and residents in a collegial, discussion-driven format.</p>

          <h2 className="section-title" style={{ marginTop: 32 }}>What we do</h2>
          <div className="section-title-bar" />
          <div className="grid grid-3">
            <div className="card"><h3>Journal Clubs</h3><p>Regular sessions dissecting practice-changing oncology trials with a structured appraisal framework.</p></div>
            <div className="card"><h3>Workshops</h3><p>Skills-based training in study design, biostatistics and evidence interpretation.</p></div>
            <div className="card"><h3>Learning Platform</h3><p>A dedicated LMS delivering our curriculum online, with quizzes and certificates.</p></div>
          </div>

          <h2 className="section-title" style={{ marginTop: 32 }}>Our values</h2>
          <div className="section-title-bar" />
          <ul style={{ paddingLeft: 20 }}>
            <li>Rigorous, unbiased appraisal of the evidence</li>
            <li>Open, collegial, mentorship-driven learning</li>
            <li>Relevance to real-world Egyptian and regional oncology practice</li>
            <li>Empowering young faculty to teach and present</li>
          </ul>

          <div className="card" style={{ marginTop: 28, background: 'var(--purple-light)', border: 'none' }}>
            <p style={{ margin: 0 }}>Follow our full history and event archive on our <a href="https://www.facebook.com/CAIROJournalClub" target="_blank" rel="noreferrer"><b>Facebook page</b></a>.</p>
          </div>
        </div>
      </section>
    </>
  )
}
