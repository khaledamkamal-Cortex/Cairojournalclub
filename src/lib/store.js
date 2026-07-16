// Unified data layer for the CAIRO portal.
// If Supabase is configured (env vars present) it will be used; otherwise all
// data lives in localStorage so the portal is fully functional as a demo.
import { seedEvents, seedMaterials, seedNews, seedCourses, seedCommentaries } from './seed'

const KEY = 'cairo-portal-v1'

function defaults() {
  return {
    events: seedEvents,
    materials: seedMaterials,
    news: seedNews,
    courses: seedCourses,
    commentaries: seedCommentaries,
    members: [],
    session: null,       // logged-in member email
    progress: {},        // { "email::courseId::lessonId": true }
    admin: false
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults()
    const data = JSON.parse(raw)
    return { ...defaults(), ...data }
  } catch {
    return defaults()
  }
}

let state = load()
const listeners = new Set()

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((fn) => fn(state))
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getState() { return state }

function uid(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 9)
}

// ---------- Events ----------
export const Events = {
  all: () => state.events,
  past: () => state.events.filter((e) => e.type === 'past').sort((a, b) => b.date.localeCompare(a.date)),
  future: () => state.events.filter((e) => e.type === 'future').sort((a, b) => a.date.localeCompare(b.date)),
  get: (id) => state.events.find((e) => e.id === id),
  add: (ev) => { state.events = [{ ...ev, id: uid('ev') }, ...state.events]; persist() },
  update: (id, patch) => { state.events = state.events.map((e) => e.id === id ? { ...e, ...patch } : e); persist() },
  remove: (id) => { state.events = state.events.filter((e) => e.id !== id); persist() }
}

// ---------- Materials ----------
export const Materials = {
  all: () => state.materials,
  forEvent: (eventId) => state.materials.filter((m) => m.eventId === eventId),
  add: (m) => { state.materials = [{ ...m, id: uid('m') }, ...state.materials]; persist() },
  remove: (id) => { state.materials = state.materials.filter((m) => m.id !== id); persist() }
}

// ---------- News ----------
export const News = {
  all: () => [...state.news].sort((a, b) => b.date.localeCompare(a.date)),
  add: (n) => { state.news = [{ ...n, id: uid('n') }, ...state.news]; persist() },
  remove: (id) => { state.news = state.news.filter((n) => n.id !== id); persist() }
}

// ---------- Courses ----------
export const Courses = {
  all: () => state.courses,
  get: (id) => state.courses.find((c) => c.id === id),
  add: (c) => { state.courses = [{ ...c, id: uid('c'), modules: c.modules || [] }, ...state.courses]; persist() },
  update: (id, patch) => { state.courses = state.courses.map((c) => c.id === id ? { ...c, ...patch } : c); persist() },
  remove: (id) => { state.courses = state.courses.filter((c) => c.id !== id); persist() },
  lessons: (course) => (course?.modules || []).flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))),

  // ----- Modules -----
  addModule: (courseId, title) => {
    state.courses = state.courses.map((c) => c.id === courseId
      ? { ...c, modules: [...(c.modules || []), { id: uid('mod'), title, lessons: [] }] } : c)
    persist()
  },
  updateModule: (courseId, moduleId, patch) => {
    state.courses = state.courses.map((c) => c.id === courseId
      ? { ...c, modules: c.modules.map((m) => m.id === moduleId ? { ...m, ...patch } : m) } : c)
    persist()
  },
  removeModule: (courseId, moduleId) => {
    state.courses = state.courses.map((c) => c.id === courseId
      ? { ...c, modules: c.modules.filter((m) => m.id !== moduleId) } : c)
    persist()
  },
  moveModule: (courseId, moduleId, dir) => {
    state.courses = state.courses.map((c) => {
      if (c.id !== courseId) return c
      const mods = [...c.modules]
      const i = mods.findIndex((m) => m.id === moduleId)
      const j = i + dir
      if (i < 0 || j < 0 || j >= mods.length) return c
      ;[mods[i], mods[j]] = [mods[j], mods[i]]
      return { ...c, modules: mods }
    })
    persist()
  },

  // ----- Lessons -----
  addLesson: (courseId, moduleId, lesson) => {
    state.courses = state.courses.map((c) => c.id === courseId
      ? { ...c, modules: c.modules.map((m) => m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { ...lesson, id: uid('l') }] } : m) } : c)
    persist()
  },
  updateLesson: (courseId, moduleId, lessonId, patch) => {
    state.courses = state.courses.map((c) => c.id === courseId
      ? { ...c, modules: c.modules.map((m) => m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, ...patch } : l) } : m) } : c)
    persist()
  },
  removeLesson: (courseId, moduleId, lessonId) => {
    state.courses = state.courses.map((c) => c.id === courseId
      ? { ...c, modules: c.modules.map((m) => m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m) } : c)
    persist()
  },
  moveLesson: (courseId, moduleId, lessonId, dir) => {
    state.courses = state.courses.map((c) => {
      if (c.id !== courseId) return c
      return { ...c, modules: c.modules.map((m) => {
        if (m.id !== moduleId) return m
        const ls = [...m.lessons]
        const i = ls.findIndex((l) => l.id === lessonId)
        const j = i + dir
        if (i < 0 || j < 0 || j >= ls.length) return m
        ;[ls[i], ls[j]] = [ls[j], ls[i]]
        return { ...m, lessons: ls }
      }) }
    })
    persist()
  },
}

// ---------- Members ----------
export const Members = {
  all: () => state.members,
  get: (email) => state.members.find((m) => m.email.toLowerCase() === email.toLowerCase()),
  register: (m) => {
    if (Members.get(m.email)) throw new Error('An account with this email already exists.')
    const member = { ...m, id: uid('mem'), joined: new Date().toISOString().slice(0, 10), status: 'active' }
    state.members = [member, ...state.members]
    state.session = member.email
    persist()
    return member
  },
  login: (email, password) => {
    const m = Members.get(email)
    if (!m || m.password !== password) throw new Error('Invalid email or password.')
    state.session = m.email
    persist()
    return m
  },
  logout: () => { state.session = null; persist() },
  update: (email, patch) => { state.members = state.members.map((m) => m.email === email ? { ...m, ...patch } : m); persist() },
  remove: (email) => { state.members = state.members.filter((m) => m.email !== email); persist() },
  current: () => state.session ? Members.get(state.session) : null
}

// ---------- Commentaries ----------
export const Commentaries = {
  all: () => state.commentaries,
  approved: () => state.commentaries.filter((c) => c.approved),
  add: (c) => { state.commentaries = [{ ...c, id: uid('cm'), approved: false, date: new Date().toISOString().slice(0, 10) }, ...state.commentaries]; persist() },
  approve: (id) => { state.commentaries = state.commentaries.map((c) => c.id === id ? { ...c, approved: true } : c); persist() },
  remove: (id) => { state.commentaries = state.commentaries.filter((c) => c.id !== id); persist() }
}

// ---------- LMS progress ----------
export const Progress = {
  key: (email, courseId, lessonId) => `${email}::${courseId}::${lessonId}`,
  isDone: (email, courseId, lessonId) => !!state.progress[Progress.key(email, courseId, lessonId)],
  toggle: (email, courseId, lessonId, done) => {
    const k = Progress.key(email, courseId, lessonId)
    if (done) state.progress[k] = true
    else delete state.progress[k]
    state.progress = { ...state.progress }
    persist()
  },
  courseCompletion: (email, course) => {
    const lessons = Courses.lessons(course)
    if (!lessons.length) return 0
    const done = lessons.filter((l) => Progress.isDone(email, course.id, l.id)).length
    return Math.round((done / lessons.length) * 100)
  }
}

// ---------- Admin auth (demo) ----------
export const Admin = {
  isAuthed: () => state.admin,
  login: (password) => {
    if (password === 'cairo-admin') { state.admin = true; persist(); return true }
    throw new Error('Incorrect admin password.')
  },
  logout: () => { state.admin = false; persist() }
}

export function resetDemo() {
  state = defaults()
  persist()
}
