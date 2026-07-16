import { useState } from 'react'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => { e.preventDefault(); setSent(true) }

  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Questions, partnership enquiries or speaker proposals — we would love to hear from you.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Get in touch</h2>
              <div className="section-title-bar" />
              <div className="card" style={{ marginBottom: 14 }}>
                <h3>📘 Facebook</h3>
                <p><a href="https://www.facebook.com/CAIROJournalClub" target="_blank" rel="noreferrer">facebook.com/CAIROJournalClub</a></p>
              </div>
              <div className="card" style={{ marginBottom: 14 }}>
                <h3>✉️ Email</h3>
                <p><a href="mailto:info@cairojournalclub.com">info@cairojournalclub.com</a></p>
              </div>
              <div className="card">
                <h3>📍 Location</h3>
                <p>Cairo, Egypt</p>
              </div>
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.3rem' }}>Send a message</h2>
              <div className="section-title-bar" />
              {sent ? (
                <div className="alert alert-success">Thank you, {form.name || 'friend'}! Your message has been recorded. (Demo — connect a backend or email service to deliver it.)</div>
              ) : (
                <form className="form card" onSubmit={submit}>
                  <div><label>Name</label><input value={form.name} onChange={set('name')} required /></div>
                  <div><label>Email</label><input type="email" value={form.email} onChange={set('email')} required /></div>
                  <div><label>Subject</label><input value={form.subject} onChange={set('subject')} required /></div>
                  <div><label>Message</label><textarea rows={5} value={form.message} onChange={set('message')} required /></div>
                  <button className="btn btn-primary" type="submit">Send message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
