import { Routes, Route } from 'react-router-dom'
import { Navbar, Footer } from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import Materials from './pages/Materials'
import News from './pages/News'
import About from './pages/About'
import Contact from './pages/Contact'
import Affiliations from './pages/Affiliations'
import Commentaries from './pages/Commentaries'
import Membership from './pages/Membership'
import LMS from './pages/LMS'
import Course from './pages/Course'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/affiliations" element={<Affiliations />} />
          <Route path="/commentaries" element={<Commentaries />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/lms" element={<LMS />} />
          <Route path="/lms/:courseId" element={<Course />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
