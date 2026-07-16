// Unified data layer for the CAIRO portal.
//
// Two modes, one synchronous read API:
//  • Demo mode  (no Supabase env vars): all data lives in localStorage, seeded.
//  • Live mode  (Supabase configured): data is loaded from Supabase on boot into
//    the same in-memory `state`, reads stay synchronous, and every mutation is
//    written through to Supabase and then the affected slice is reloaded.
import { seedEvents, seedMaterials, seedNews, seedCourses, seedCommentaries } from './seed'
import { supabaseEnabled } from './supabase'
import * as api from './supabaseApi'

const SB = supabaseEnabled
const KEY = 'cairo-portal-v1'

function emptyState() {
  return { events: [], materials: [], news: [], courses: [], commentaries: [], members: [], session: null, progress: {}, admin: false }
}
function demoDefaults() {
  return { ...emptyState(), events: seedEvents, materials: seedMaterials, news: seedNews, courses: seedCourses, commentaries: seedCommentaries }
}

function load() {
  if (SB) return emptyState()   // live data arrives via bootstrap()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return demoDefaults()
    return { ...demoDefaults(), ...JSON.parse(raw) }
  } catch {
    return demoDefaults()
  }
}

let state = load()
const listeners = new Set()

function persist() {
  if (!SB) localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((fn) => fn(state))
}

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) }
export function getState() { return state }

function uid(prefix) { return prefix + '-' + Math.random().toString(36).slice(2, 9) }
function today() { return new Date().toISOString().slice(0, 10) }
function logErr(e) { if (e) console.error('[store]', e.message || e) }

// ---------------------------------------------------------------------------
// Boot: in live mode, pull public content (and the signed-in member) into state.
// ---------------------------------------------------------------------------
export async function bootstrap() {
  if (!SB) return
  try {
    const pub = await api.loadPublic()
    Object.assign(state, pub)
    const member = await api.fetchCurrentMember()
    if (member) await afterLogin(member)
  } catch (e) { logErr(e) }
  persist()
}

async function afterLogin(member) {
  state.session = member
  state.admin = !!member.isAdmin
  const rows = await api.loadProgress(member.id)
  const map = {}
  rows.forEach((r) => { map[`${member.email}::${r.course_id}::${r.lesson_id}`] = true })
  state.progress = map
  if (member.isAdmin) await refreshAdminData()
}

async function refreshAdminData() {
  try {
    state.members = await api.db.loadMembers()
    state.commentaries = await api.db.loadCommentaries()
  } catch (e) { logErr(e) }
}

async function reloadCourses() { state.courses = await api.loadCourses(); persist() }

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
export const Events = {
  all: () => state.events,
  past: () => state.events.filter((e) => e.type === 'past').sort((a, b) => b.date.localeCompare(a.date)),
  future: () => state.events.filter((e) => e.type === 'future').sort((a, b) => a.date.localeCompare(b.date)),
  get: (id) => state.events.find((e) => e.id === id),
  add: async (ev) => {
    if (SB) { const { error } = await api.db.addEvent(ev); logErr(error); state.events = await api.db.loadEvents(); persist() }
    else { state.events = [{ ...ev, id: uid('ev') }, ...state.events]; persist() }
  },
  update: async (id, patch) => {
    if (SB) { const { error } = await api.db.updateEvent(id, patch); logErr(error); state.events = await api.db.loadEvents(); persist() }
    else { state.events = state.events.map((e) => e.id === id ? { ...e, ...patch } : e); persist() }
  },
  remove: async (id) => {
    if (SB) { const { error } = await api.db.removeEvent(id); logErr(error); state.events = await api.db.loadEvents(); persist() }
    else { state.events = state.events.filter((e) => e.id !== id); persist() }
  }
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
export const Materials = {
  all: () => state.materials,
  forEvent: (eventId) => state.materials.filter((m) => m.eventId === eventId),
  add: async (m) => {
    if (SB) { const { error } = await api.db.addMaterial(m); logErr(error); state.materials = await api.db.loadMaterials(); persist() }
    else { state.materials = [{ ...m, id: uid('m') }, ...state.materials]; persist() }
  },
  remove: async (id) => {
    if (SB) { const { error } = await api.db.removeMaterial(id); logErr(error); state.materials = await api.db.loadMaterials(); persist() }
    else { state.materials = state.materials.filter((m) => m.id !== id); persist() }
  }
}

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------
export const News = {
  all: () => [...state.news].sort((a, b) => (b.date || '').localeCompare(a.date || '')),
  add: async (n) => {
    if (SB) { const { error } = await api.db.addNews(n); logErr(error); state.news = await api.db.loadNews(); persist() }
    else { state.news = [{ ...n, id: uid('n') }, ...state.news]; persist() }
  },
  remove: async (id) => {
    if (SB) { const { error } = await api.db.removeNews(id); logErr(error); state.news = await api.db.loadNews(); persist() }
    else { state.news = state.news.filter((n) => n.id !== id); persist() }
  }
}

// ---------------------------------------------------------------------------
// Courses / modules / lessons
// ---------------------------------------------------------------------------
export const Courses = {
  all: () => state.courses,
  get: (id) => state.courses.find((c) => c.id === id),
  lessons: (course) => (course?.modules || []).flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))),

  add: async (c) => {
    if (SB) { const { error } = await api.db.addCourse(c); logErr(error); await reloadCourses() }
    else { state.courses = [{ ...c, id: uid('c'), modules: c.modules || [] }, ...state.courses]; persist() }
  },
  update: async (id, patch) => {
    if (SB) { const { error } = await api.db.updateCourse(id, patch); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.map((c) => c.id === id ? { ...c, ...patch } : c); persist() }
  },
  remove: async (id) => {
    if (SB) { const { error } = await api.db.removeCourse(id); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.filter((c) => c.id !== id); persist() }
  },

  addModule: async (courseId, title) => {
    if (SB) { const { error } = await api.db.addModule(courseId, title); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.map((c) => c.id === courseId ? { ...c, modules: [...(c.modules || []), { id: uid('mod'), title, lessons: [] }] } : c); persist() }
  },
  updateModule: async (courseId, moduleId, patch) => {
    if (SB) { const { error } = await api.db.updateModule(moduleId, patch); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.map((c) => c.id === courseId ? { ...c, modules: c.modules.map((m) => m.id === moduleId ? { ...m, ...patch } : m) } : c); persist() }
  },
  removeModule: async (courseId, moduleId) => {
    if (SB) { const { error } = await api.db.removeModule(moduleId); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.map((c) => c.id === courseId ? { ...c, modules: c.modules.filter((m) => m.id !== moduleId) } : c); persist() }
  },
  moveModule: async (courseId, moduleId, dir) => {
    if (SB) {
      const course = state.courses.find((c) => c.id === courseId); if (!course) return
      const mods = course.modules; const i = mods.findIndex((m) => m.id === moduleId); const j = i + dir
      if (i < 0 || j < 0 || j >= mods.length) return
      await api.db.swapModuleSort({ id: mods[i].id, sort: mods[i].sort }, { id: mods[j].id, sort: mods[j].sort })
      await reloadCourses()
    } else {
      state.courses = state.courses.map((c) => {
        if (c.id !== courseId) return c
        const mods = [...c.modules]; const i = mods.findIndex((m) => m.id === moduleId); const j = i + dir
        if (i < 0 || j < 0 || j >= mods.length) return c
        ;[mods[i], mods[j]] = [mods[j], mods[i]]; return { ...c, modules: mods }
      }); persist()
    }
  },

  addLesson: async (courseId, moduleId, lesson) => {
    if (SB) { const { error } = await api.db.addLesson(moduleId, lesson); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.map((c) => c.id === courseId ? { ...c, modules: c.modules.map((m) => m.id === moduleId ? { ...m, lessons: [...m.lessons, { ...lesson, id: uid('l') }] } : m) } : c); persist() }
  },
  updateLesson: async (courseId, moduleId, lessonId, patch) => {
    if (SB) { const { error } = await api.db.updateLesson(lessonId, patch); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.map((c) => c.id === courseId ? { ...c, modules: c.modules.map((m) => m.id === moduleId ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, ...patch } : l) } : m) } : c); persist() }
  },
  removeLesson: async (courseId, moduleId, lessonId) => {
    if (SB) { const { error } = await api.db.removeLesson(lessonId); logErr(error); await reloadCourses() }
    else { state.courses = state.courses.map((c) => c.id === courseId ? { ...c, modules: c.modules.map((m) => m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m) } : c); persist() }
  },
  moveLesson: async (courseId, moduleId, lessonId, dir) => {
    if (SB) {
      const course = state.courses.find((c) => c.id === courseId); const mod = course?.modules.find((m) => m.id === moduleId); if (!mod) return
      const ls = mod.lessons; const i = ls.findIndex((l) => l.id === lessonId); const j = i + dir
      if (i < 0 || j < 0 || j >= ls.length) return
      await api.db.swapLessonSort({ id: ls[i].id, sort: ls[i].sort }, { id: ls[j].id, sort: ls[j].sort })
      await reloadCourses()
    } else {
      state.courses = state.courses.map((c) => {
        if (c.id !== courseId) return c
        return { ...c, modules: c.modules.map((m) => {
          if (m.id !== moduleId) return m
          const ls = [...m.lessons]; const i = ls.findIndex((l) => l.id === lessonId); const j = i + dir
          if (i < 0 || j < 0 || j >= ls.length) return m
          ;[ls[i], ls[j]] = [ls[j], ls[i]]; return { ...m, lessons: ls }
        }) }
      }); persist()
    }
  }
}

// ---------------------------------------------------------------------------
// Members + auth
// ---------------------------------------------------------------------------
export const Members = {
  all: () => state.members,
  get: (email) => state.members.find((m) => m.email.toLowerCase() === email.toLowerCase()),
  register: async (m) => {
    if (SB) {
      const res = await api.signUp(m)
      if (res && res.pending) return res           // needs email confirmation
      await afterLogin(res); persist(); return res
    }
    if (Members.get(m.email)) throw new Error('An account with this email already exists.')
    const member = { ...m, id: uid('mem'), joined: today(), status: 'active' }
    state.members = [member, ...state.members]; state.session = member.email; persist(); return member
  },
  login: async (email, password) => {
    if (SB) { const member = await api.signIn(email, password); await afterLogin(member); persist(); return member }
    const m = Members.get(email)
    if (!m || m.password !== password) throw new Error('Invalid email or password.')
    state.session = m.email; persist(); return m
  },
  logout: async () => {
    if (SB) { await api.signOut(); state.session = null; state.admin = false; state.progress = {}; persist(); return }
    state.session = null; persist()
  },
  update: async (email, patch) => {
    if (SB) { await api.updateMemberProfile(email, patch); if (state.session) state.session = { ...state.session, ...patch }; persist(); return }
    state.members = state.members.map((m) => m.email === email ? { ...m, ...patch } : m); persist()
  },
  remove: async (email) => {
    if (SB) { const { error } = await api.db.removeMember(email); logErr(error); state.members = await api.db.loadMembers(); persist(); return }
    state.members = state.members.filter((m) => m.email !== email); persist()
  },
  current: () => {
    if (!state.session) return null
    return SB ? state.session : Members.get(state.session)
  }
}

// ---------------------------------------------------------------------------
// Commentaries
// ---------------------------------------------------------------------------
export const Commentaries = {
  all: () => state.commentaries,
  approved: () => state.commentaries.filter((c) => c.approved),
  add: async (c) => {
    if (SB) { const { error } = await api.db.addCommentary(c); logErr(error) }
    else { state.commentaries = [{ ...c, id: uid('cm'), approved: false, date: today() }, ...state.commentaries]; persist() }
  },
  approve: async (id) => {
    if (SB) { const { error } = await api.db.approveCommentary(id); logErr(error); state.commentaries = await api.db.loadCommentaries(); persist() }
    else { state.commentaries = state.commentaries.map((c) => c.id === id ? { ...c, approved: true } : c); persist() }
  },
  remove: async (id) => {
    if (SB) { const { error } = await api.db.removeCommentary(id); logErr(error); state.commentaries = await api.db.loadCommentaries(); persist() }
    else { state.commentaries = state.commentaries.filter((c) => c.id !== id); persist() }
  }
}

// ---------------------------------------------------------------------------
// LMS progress
// ---------------------------------------------------------------------------
export const Progress = {
  key: (email, courseId, lessonId) => `${email}::${courseId}::${lessonId}`,
  isDone: (email, courseId, lessonId) => !!state.progress[Progress.key(email, courseId, lessonId)],
  toggle: async (email, courseId, lessonId, done) => {
    const k = Progress.key(email, courseId, lessonId)
    if (done) state.progress[k] = true; else delete state.progress[k]
    state.progress = { ...state.progress }; persist()
    if (SB && state.session) { try { await api.setProgress(state.session.id, courseId, lessonId, done) } catch (e) { logErr(e) } }
  },
  courseCompletion: (email, course) => {
    const lessons = Courses.lessons(course)
    if (!lessons.length) return 0
    const done = lessons.filter((l) => Progress.isDone(email, course.id, l.id)).length
    return Math.round((done / lessons.length) * 100)
  }
}

// ---------------------------------------------------------------------------
// Admin auth
//  • Demo mode: single shared password.
//  • Live mode: log in with a Supabase account that is present in the `admins` table.
// ---------------------------------------------------------------------------
export const Admin = {
  isAuthed: () => SB ? !!(state.session && state.session.isAdmin) : state.admin,
  login: async (a, b) => {
    if (SB) {
      const member = await api.signIn(a, b)          // a = email, b = password
      if (!member || !member.isAdmin) { await api.signOut(); throw new Error('This account is not an administrator.') }
      await afterLogin(member); persist(); return true
    }
    if (a === 'cairo-admin') { state.admin = true; persist(); return true }
    throw new Error('Incorrect admin password.')
  },
  logout: async () => {
    if (SB) { await Members.logout(); return }
    state.admin = false; persist()
  }
}

export function resetDemo() {
  if (SB) return
  state = demoDefaults(); persist()
}
