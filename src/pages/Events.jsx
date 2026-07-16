import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Events, Materials } from '../lib/store'
import { useStore } from '../lib/useStore'

export function EventCard({ event }) {
  const materials = Materials.forEvent(event.id)
  return (
    <div className="card card-link" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: 120, background: event.image || 'linear-gradient(135deg,#6d2077,#1b9cd8)', display: 'flex', alignItems: 'flex-end', padding: 14 }}>
        <span className={`badge ${event.type === 'future' ? 'badge-gold' : 'badge-purple'}`}>{event.type === 'future' ? 'Upcoming' : 'Past event'}</span>
      </div>
      <div style={{ padding: 18 }}>
        <div className="meta">{formatDate(event.date)}{event.time ? ` · ${event.time}` : ''} · {event.location}</div>
        <h3>{event.title}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.86rem', margin: '4px 0 8px' }}>{event.speakers} · <span className="badge badge-blue">{event.topic}</span></p>
        <p>{event.summary}</p>
        {materials.length > 0 && (
          <Link to="/materials" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>{materials.length} material{materials.length > 1 ? 's' : ''} available →</Link>
        )}
      </div>
    </div>
  )
}

export function formatDate(iso) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return iso }
}

export default function EventsPage() {
  useStore()
  const [tab, setTab] = useState('future')
  const future = Events.future()
  const past = Events.past()
  const list = tab === 'future' ? future : past
  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Events</h1>
          <p>Journal club sessions, workshops and conference reviews hosted by CAIRO since 2013.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="tabs">
            <button className={tab === 'future' ? 'active' : ''} onClick={() => setTab('future')}>Future Events ({future.length})</button>
            <button className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>Previous Events ({past.length})</button>
          </div>
          {list.length === 0
            ? <div className="empty">No {tab} events yet. Add them from the Admin panel.</div>
            : <div className="grid grid-3">{list.map((e) => <EventCard key={e.id} event={e} />)}</div>}
        </div>
      </section>
    </>
  )
}
