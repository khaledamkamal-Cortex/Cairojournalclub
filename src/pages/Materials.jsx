import { useState } from 'react'
import { Events, Materials } from '../lib/store'
import { useStore } from '../lib/useStore'
import { formatDate } from './Events'

function KindBadge({ kind }) {
  const map = { video: ['badge-blue', '▶ Video'], pdf: ['badge-red', '📄 PDF'], article: ['badge-green', '📖 Article'], slides: ['badge-gold', '📊 Slides'] }
  const [cls, label] = map[kind] || ['badge-purple', kind]
  return <span className={`badge ${cls}`}>{label}</span>
}

export default function MaterialsPage() {
  useStore()
  const [active, setActive] = useState(null)
  const eventsWithMaterials = Events.all()
    .map((e) => ({ event: e, items: Materials.forEvent(e.id) }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.event.date.localeCompare(a.event.date))

  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Meeting Materials &amp; Education</h1>
          <p>Recordings, slide decks and reading materials from each CAIRO event.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {active && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>{active.title}</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setActive(null)}>✕ Close</button>
              </div>
              {active.kind === 'video'
                ? (active.url
                    ? <div className="video-frame"><iframe src={active.url} title={active.title} allowFullScreen /></div>
                    : <div className="alert alert-info">🎬 The recording will be added soon.</div>)
                : (active.url && active.url !== '#'
                    ? <div className="alert alert-info">📄 <a href={active.url} target="_blank" rel="noreferrer">Open the document ({active.pages || '?'} pages) →</a></div>
                    : <div className="alert alert-info">📄 This document ({active.pages || '?'} pages) will be available soon.</div>)}
            </div>
          )}

          {eventsWithMaterials.length === 0 && <div className="empty">No materials published yet.</div>}

          {eventsWithMaterials.map(({ event, items }) => (
            <div key={event.id} style={{ marginBottom: 28 }}>
              <h2 className="section-title" style={{ fontSize: '1.25rem' }}>{event.title}</h2>
              <div className="meta" style={{ marginBottom: 12 }}>{formatDate(event.date)} · {event.location}</div>
              <div className="grid grid-3">
                {items.map((m) => (
                  <div key={m.id} className="card card-link" onClick={() => setActive(m)} style={{ cursor: 'pointer' }}>
                    <KindBadge kind={m.kind} />
                    <h3 style={{ marginTop: 10, fontSize: '1rem' }}>{m.title}</h3>
                    <div className="meta">{m.duration ? `Duration ${m.duration}` : m.pages ? `${m.pages} pages` : ''}</div>
                    <span className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>{m.kind === 'video' ? 'Watch' : 'Open'} →</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
