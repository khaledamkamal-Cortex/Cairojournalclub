import { Link } from 'react-router-dom'
import { Events, News, Commentaries } from '../lib/store'
import { useStore } from '../lib/useStore'
import { EventCard } from './Events'

export default function Home() {
  useStore()
  const future = Events.future().slice(0, 3)
  const past = Events.past().slice(0, 3)
  const news = News.all().slice(0, 3)
  const quotes = Commentaries.approved().slice(0, 3)

  return (
    <>
      <header className="hero">
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: 14 }}>Since 2013 · Egypt</span>
          <h1>C.<span className="acronym">A</span>.I.R.O Journal Club</h1>
          <p className="tagline">Enhancing Oncology Practice</p>
          <p className="sub">The <b>Critical Appraisal Initiative for Research in Oncology</b> — an Egyptian educational community teaching evidence-based oncology through structured journal clubs, workshops and a dedicated learning platform.</p>
          <div className="hero-actions">
            <Link to="/lms" className="btn btn-gold">Explore the Learning Platform</Link>
            <Link to="/membership" className="btn btn-outline">Become a Member</Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="grid grid-4">
            <StatBox num="12+" label="Years active" />
            <StatBox num="80+" label="Sessions held" />
            <StatBox num="2" label="LMS courses" />
            <StatBox num="1000s" label="Oncologists reached" />
          </div>
        </div>
      </section>

      {/* Learning highlight — the core of the portal */}
      <section className="section" style={{ background: 'linear-gradient(120deg,#f3e8f5,#e3f2fb)' }}>
        <div className="container">
          <span className="badge badge-purple">Core of the portal</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>Learning Management System</h2>
          <div className="section-title-bar" />
          <p className="section-sub">A Moodle-style platform built around CAIRO's critical-appraisal curriculum. Follow structured courses of video lectures, readings, PDFs and quizzes — track your progress and earn a certificate of completion.</p>
          <div className="grid grid-3">
            <FeatureCard icon="🎓" title="Structured courses" text="Modules and lessons that build from study design to biostatistics and appraisal." />
            <FeatureCard icon="✅" title="Progress tracking" text="Every lesson you complete is saved. Pick up exactly where you left off." />
            <FeatureCard icon="📜" title="Certificates" text="Finish a course and download a personalised certificate of completion." />
          </div>
          <div style={{ marginTop: 20 }}>
            <Link to="/lms" className="btn btn-primary">Enter the LMS →</Link>
          </div>
        </div>
      </section>

      {future.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Upcoming Events</h2>
            <div className="section-title-bar" />
            <div className="grid grid-3">{future.map((e) => <EventCard key={e.id} event={e} />)}</div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <h2 className="section-title">Recent Events</h2>
          <div className="section-title-bar" />
          <div className="grid grid-3">{past.map((e) => <EventCard key={e.id} event={e} />)}</div>
          <div style={{ marginTop: 20 }}><Link to="/events" className="btn btn-ghost">View all events</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 className="section-title">Latest News</h2>
              <div className="section-title-bar" />
              {news.map((n) => (
                <div key={n.id} className="card" style={{ marginBottom: 14 }}>
                  <span className="badge badge-blue">{n.tag}</span>
                  <h3 style={{ marginTop: 8 }}>{n.title}</h3>
                  <div className="meta">{n.date}</div>
                  <p>{n.body}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="section-title">What members say</h2>
              <div className="section-title-bar" />
              {quotes.map((q) => (
                <div key={q.id} className="card" style={{ marginBottom: 14, borderLeft: '4px solid var(--gold)' }}>
                  <p style={{ fontStyle: 'italic' }}>“{q.text}”</p>
                  <div className="meta" style={{ marginTop: 8 }}><b>{q.name}</b> · {q.role}</div>
                </div>
              ))}
              <Link to="/commentaries" className="btn btn-ghost">Share your commentary</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function StatBox({ num, label }) {
  return <div className="card stat-card"><div className="num">{num}</div><div className="lbl">{label}</div></div>
}
function FeatureCard({ icon, title, text }) {
  return (
    <div className="card">
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <h3 style={{ marginTop: 6 }}>{title}</h3>
      <p>{text}</p>
    </div>
  )
}
