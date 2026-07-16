import { useState } from 'react'
import { Commentaries } from '../lib/store'
import { useStore } from '../lib/useStore'

export default function CommentariesPage() {
  useStore()
  const approved = Commentaries.approved()
  const [form, setForm] = useState({ name: '', role: '', text: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => { e.preventDefault(); Commentaries.add(form); setSent(true); setForm({ name: '', role: '', text: '' }) }

  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Attendees' Commentaries &amp; Suggestions</h1>
          <p>What our community says — and a space for your feedback.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 className="section-title" style={{ fontSize: '1.3rem' }}>From our attendees</h2>
              <div className="section-title-bar" />
              {approved.length === 0 ? <div className="empty">No commentaries yet — be the first!</div> : approved.map((c) => (
                <div key={c.id} className="card" style={{ marginBottom: 14, borderLeft: '4px solid var(--gold)' }}>
                  <p style={{ fontStyle: 'italic' }}>“{c.text}”</p>
                  <div className="meta" style={{ marginTop: 8 }}><b>{c.name}</b>{c.role ? ` · ${c.role}` : ''} · {c.date}</div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Share your commentary</h2>
              <div className="section-title-bar" />
              {sent && <div className="alert alert-success">Thank you! Your commentary was submitted and will appear after moderation.</div>}
              <form className="form card" onSubmit={submit}>
                <div><label>Name</label><input value={form.name} onChange={set('name')} required /></div>
                <div><label>Role / title (optional)</label><input value={form.role} onChange={set('role')} placeholder="e.g. Oncology Fellow" /></div>
                <div><label>Your commentary or suggestion</label><textarea rows={5} value={form.text} onChange={set('text')} required /></div>
                <button className="btn btn-primary" type="submit">Submit</button>
                <p className="form-note">Submissions are moderated before appearing publicly.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
