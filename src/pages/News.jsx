import { News } from '../lib/store'
import { useStore } from '../lib/useStore'
import { formatDate } from './Events'

export default function NewsPage() {
  useStore()
  const news = News.all()
  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>News</h1>
          <p>Announcements and updates from the CAIRO Journal Club.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {news.length === 0 ? <div className="empty">No news yet.</div> : (
            <div className="grid grid-2">
              {news.map((n) => (
                <div key={n.id} className="card">
                  <span className="badge badge-blue">{n.tag}</span>
                  <h3 style={{ marginTop: 8 }}>{n.title}</h3>
                  <div className="meta">{formatDate(n.date)}</div>
                  <p>{n.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
