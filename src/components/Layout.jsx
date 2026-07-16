import { NavLink, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { supabaseEnabled } from '../lib/supabase'
import { Members } from '../lib/store'
import { useStore } from '../lib/useStore'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/events', label: 'Events' },
  { to: '/materials', label: 'Materials' },
  { to: '/lms', label: 'Learning' },
  { to: '/news', label: 'News' },
  { to: '/about', label: 'About' },
  { to: '/affiliations', label: 'Affiliations' },
  { to: '/commentaries', label: 'Commentaries' },
  { to: '/contact', label: 'Contact' }
]

export function Navbar() {
  useStore()
  const member = Members.current()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  return (
    <>
      {!supabaseEnabled && (
        <div className="demo-banner">Demo mode — data is stored in your browser. Connect Supabase to go live. Admin password: <b>cairo-admin</b></div>
      )}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <img src="/logo.svg" alt="CAIRO Journal Club logo" />
            <span>
              <span className="brand-name">C.A.I.R.O</span><br />
              <span className="brand-sub">Journal Club</span>
            </span>
          </Link>
          <button className="btn btn-ghost btn-sm no-print" style={{ marginLeft: 'auto' }} onClick={() => setOpen(!open)} aria-label="Toggle menu">☰ Menu</button>
          <div className="nav-links" style={{ display: open ? 'flex' : undefined }}>
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}>{n.label}</NavLink>
            ))}
            {member
              ? <NavLink to="/membership" className="nav-cta">My Membership</NavLink>
              : <NavLink to="/membership" className="nav-cta">Join / Login</NavLink>}
          </div>
        </div>
      </nav>
      <div key={loc.pathname} />
    </>
  )
}

export function Footer() {
  return (
    <footer className="site">
      <div className="container cols">
        <div>
          <h4>C.A.I.R.O Journal Club</h4>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Critical Appraisal Initiative for Research in Oncology. Enhancing oncology practice in Egypt since 2013.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/events">Events</Link>
          <Link to="/materials">Meeting Materials</Link>
          <Link to="/lms">Learning Management System</Link>
          <Link to="/news">News</Link>
        </div>
        <div>
          <h4>Community</h4>
          <Link to="/membership">Membership</Link>
          <Link to="/commentaries">Commentaries</Link>
          <Link to="/affiliations">Affiliations</Link>
          <Link to="/about">About Us</Link>
        </div>
        <div>
          <h4>Connect</h4>
          <a href="https://www.facebook.com/CAIROJournalClub" target="_blank" rel="noreferrer">Facebook Page</a>
          <Link to="/contact">Contact Us</Link>
          <Link to="/admin">Admin Panel</Link>
        </div>
      </div>
      <div className="bottom">© 2013–{new Date().getFullYear()} CAIRO Journal Club. All rights reserved.</div>
    </footer>
  )
}
