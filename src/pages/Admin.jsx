import { useState } from 'react'
import { Admin, Events, Materials, News, Members, Commentaries, Courses, resetDemo } from '../lib/store'
import { useStore } from '../lib/useStore'
import LmsAdmin from './LmsAdmin'

export default function AdminPage() {
  useStore()
  if (!Admin.isAuthed()) return <AdminLogin />
  return <AdminPanel />
}

function AdminLogin() {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const submit = (e) => { e.preventDefault(); try { Admin.login(pw) } catch (err) { setError(err.message) } }
  return (
    <>
      <div className="page-head"><div className="container"><h1>Admin Panel</h1><p>Restricted access.</p></div></div>
      <section className="section">
        <div className="container" style={{ maxWidth: 420 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form className="form card" onSubmit={submit}>
            <div><label>Admin password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus /></div>
            <button className="btn btn-primary" type="submit">Log in</button>
            <p className="form-note">Demo password: <b>cairo-admin</b></p>
          </form>
        </div>
      </section>
    </>
  )
}

const TABS = ['Dashboard', 'Events', 'Materials', 'News', 'LMS Content', 'Members', 'Commentaries']

function AdminPanel() {
  const [tab, setTab] = useState('Dashboard')
  return (
    <>
      <div className="page-head">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div><h1>Admin Panel</h1><p>Manage all portal content.</p></div>
          <button className="btn btn-outline" onClick={() => Admin.logout()}>Log out</button>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="admin-layout">
            <nav className="admin-nav">
              {TABS.map((t) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}
            </nav>
            <div>
              {tab === 'Dashboard' && <Dashboard />}
              {tab === 'Events' && <EventsAdmin />}
              {tab === 'Materials' && <MaterialsAdmin />}
              {tab === 'News' && <NewsAdmin />}
              {tab === 'LMS Content' && <LmsAdmin />}
              {tab === 'Members' && <MembersAdmin />}
              {tab === 'Commentaries' && <CommentariesAdmin />}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Dashboard() {
  const stats = [
    ['Events', Events.all().length], ['Materials', Materials.all().length], ['News', News.all().length],
    ['Courses', Courses.all().length], ['Members', Members.all().length],
    ['Pending comments', Commentaries.all().filter((c) => !c.approved).length]
  ]
  return (
    <>
      <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Overview</h2>
      <div className="section-title-bar" />
      <div className="grid grid-3">
        {stats.map(([label, num]) => <div key={label} className="card stat-card"><div className="num">{num}</div><div className="lbl">{label}</div></div>)}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Danger zone</h3>
        <p className="form-note" style={{ marginBottom: 10 }}>Reset all demo data (events, members, progress) back to the seeded defaults.</p>
        <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Reset all demo data?')) resetDemo() }}>Reset demo data</button>
      </div>
    </>
  )
}

function Field({ label, children }) { return <div><label>{label}</label>{children}</div> }

function EventsAdmin() {
  const blank = { title: '', date: '', time: '', type: 'future', location: '', speakers: '', topic: '', summary: '', image: 'linear-gradient(135deg,#6d2077,#1b9cd8)' }
  const [form, setForm] = useState(blank)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => { e.preventDefault(); Events.add({ ...form, attendees: 0 }); setForm(blank) }

  return (
    <>
      <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Add an event</h2>
      <div className="section-title-bar" />
      <form className="form card" onSubmit={submit} style={{ marginBottom: 24 }}>
        <Field label="Title"><input value={form.title} onChange={set('title')} required /></Field>
        <div className="form-row">
          <Field label="Date"><input type="date" value={form.date} onChange={set('date')} required /></Field>
          <Field label="Time"><input value={form.time} onChange={set('time')} placeholder="19:00" /></Field>
        </div>
        <div className="form-row">
          <Field label="Type"><select value={form.type} onChange={set('type')}><option value="future">Future</option><option value="past">Past</option></select></Field>
          <Field label="Topic"><input value={form.topic} onChange={set('topic')} placeholder="Breast, GI, …" /></Field>
        </div>
        <Field label="Location"><input value={form.location} onChange={set('location')} /></Field>
        <Field label="Speakers"><input value={form.speakers} onChange={set('speakers')} /></Field>
        <Field label="Summary"><textarea rows={3} value={form.summary} onChange={set('summary')} /></Field>
        <button className="btn btn-primary" type="submit">Add event</button>
      </form>

      <h3>All events</h3>
      <div className="table-wrap" style={{ marginTop: 10 }}>
        <table className="data">
          <thead><tr><th>Title</th><th>Date</th><th>Type</th><th></th></tr></thead>
          <tbody>
            {Events.all().map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td><td>{e.date}</td>
                <td><span className={`badge ${e.type === 'future' ? 'badge-gold' : 'badge-purple'}`}>{e.type}</span></td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => Events.update(e.id, { type: e.type === 'future' ? 'past' : 'future' })}>Toggle</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => Events.remove(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function MaterialsAdmin() {
  const events = Events.all()
  const blank = { eventId: events[0]?.id || '', title: '', kind: 'video', url: '', duration: '', pages: '' }
  const [form, setForm] = useState(blank)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => { e.preventDefault(); Materials.add(form); setForm({ ...blank, eventId: form.eventId }) }

  return (
    <>
      <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Add material</h2>
      <div className="section-title-bar" />
      <form className="form card" onSubmit={submit} style={{ marginBottom: 24 }}>
        <Field label="Event"><select value={form.eventId} onChange={set('eventId')} required>{events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</select></Field>
        <Field label="Title"><input value={form.title} onChange={set('title')} required /></Field>
        <div className="form-row">
          <Field label="Type"><select value={form.kind} onChange={set('kind')}><option value="video">Video</option><option value="pdf">PDF</option><option value="slides">Slides</option><option value="article">Article</option></select></Field>
          <Field label={form.kind === 'video' ? 'Duration' : 'Pages'}><input value={form.kind === 'video' ? form.duration : form.pages} onChange={set(form.kind === 'video' ? 'duration' : 'pages')} /></Field>
        </div>
        <Field label="URL (YouTube embed or file link)"><input value={form.url} onChange={set('url')} placeholder="https://www.youtube.com/embed/…" /></Field>
        <button className="btn btn-primary" type="submit">Add material</button>
        <p className="form-note">For videos use the YouTube <b>embed</b> URL. For PDFs, connect Supabase Storage to upload files.</p>
      </form>

      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Title</th><th>Event</th><th>Type</th><th></th></tr></thead>
          <tbody>
            {Materials.all().map((m) => (
              <tr key={m.id}><td>{m.title}</td><td>{Events.get(m.eventId)?.title || '—'}</td><td>{m.kind}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => Materials.remove(m.id)}>Delete</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function NewsAdmin() {
  const blank = { title: '', date: new Date().toISOString().slice(0, 10), tag: 'Announcement', body: '' }
  const [form, setForm] = useState(blank)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => { e.preventDefault(); News.add(form); setForm(blank) }
  return (
    <>
      <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Post news</h2>
      <div className="section-title-bar" />
      <form className="form card" onSubmit={submit} style={{ marginBottom: 24 }}>
        <Field label="Title"><input value={form.title} onChange={set('title')} required /></Field>
        <div className="form-row">
          <Field label="Date"><input type="date" value={form.date} onChange={set('date')} /></Field>
          <Field label="Tag"><select value={form.tag} onChange={set('tag')}><option>Announcement</option><option>Milestone</option><option>Opportunity</option><option>Event</option></select></Field>
        </div>
        <Field label="Body"><textarea rows={4} value={form.body} onChange={set('body')} required /></Field>
        <button className="btn btn-primary" type="submit">Publish</button>
      </form>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Title</th><th>Date</th><th></th></tr></thead>
          <tbody>{News.all().map((n) => <tr key={n.id}><td>{n.title}</td><td>{n.date}</td><td><button className="btn btn-danger btn-sm" onClick={() => News.remove(n.id)}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </>
  )
}

function MembersAdmin() {
  const members = Members.all()
  return (
    <>
      <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Members ({members.length})</h2>
      <div className="section-title-bar" />
      {members.length === 0 ? <div className="empty">No members have registered yet.</div> : (
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Name</th><th>Email</th><th>Grade</th><th>Specialty</th><th>Joined</th><th></th></tr></thead>
            <tbody>{members.map((m) => (
              <tr key={m.id}><td>{m.name}</td><td>{m.email}</td><td>{m.grade}</td><td>{m.specialty}</td><td>{m.joined}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => Members.remove(m.email)}>Remove</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  )
}

function CommentariesAdmin() {
  const all = Commentaries.all()
  return (
    <>
      <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Moderate commentaries</h2>
      <div className="section-title-bar" />
      {all.length === 0 ? <div className="empty">No commentaries submitted.</div> : all.map((c) => (
        <div key={c.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <p style={{ fontStyle: 'italic' }}>“{c.text}”</p>
              <div className="meta" style={{ marginTop: 6 }}><b>{c.name}</b>{c.role ? ` · ${c.role}` : ''} · {c.date} {c.approved ? <span className="badge badge-green">approved</span> : <span className="badge badge-gold">pending</span>}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {!c.approved && <button className="btn btn-blue btn-sm" onClick={() => Commentaries.approve(c.id)}>Approve</button>}
              <button className="btn btn-danger btn-sm" onClick={() => Commentaries.remove(c.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
