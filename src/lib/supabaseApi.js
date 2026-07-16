// All Supabase reads/writes for the portal live here. store.js calls into this
// module when Supabase is configured; otherwise it uses its localStorage path.
import { supabase } from './supabase'

// ---------------- Loading public content into memory ----------------

export async function loadCourses() {
  const [{ data: courses }, { data: modules }, { data: lessons }] = await Promise.all([
    supabase.from('courses').select('*').order('sort'),
    supabase.from('modules').select('*').order('sort'),
    supabase.from('lessons').select('*').order('sort')
  ])
  return (courses || []).map((c) => ({
    ...c,
    modules: (modules || []).filter((m) => m.course_id === c.id).map((m) => ({
      ...m,
      lessons: (lessons || []).filter((l) => l.module_id === m.id)
    }))
  }))
}

export async function loadPublic() {
  const [events, materials, news, courses, commentaries] = await Promise.all([
    supabase.from('events').select('*'),
    supabase.from('materials').select('*'),
    supabase.from('news').select('*'),
    loadCourses(),
    supabase.from('commentaries').select('*')
  ])
  return {
    events: events.data || [],
    // normalise DB column event_id -> eventId used by the UI
    materials: (materials.data || []).map((m) => ({ ...m, eventId: m.event_id })),
    news: news.data || [],
    courses,
    commentaries: commentaries.data || []
  }
}

// ---------------- Auth / members ----------------

export async function signUp(profile) {
  const { data, error } = await supabase.auth.signUp({ email: profile.email, password: profile.password })
  if (error) throw new Error(error.message)
  const userId = data.user?.id
  const row = {
    user_id: userId, name: profile.name, email: profile.email, phone: profile.phone,
    grade: profile.grade, specialty: profile.specialty, institution: profile.institution, status: 'active'
  }
  const { error: insErr } = await supabase.from('members').insert(row)
  if (insErr && !/duplicate|unique/i.test(insErr.message)) throw new Error(insErr.message)
  return fetchCurrentMember()
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return fetchCurrentMember()
}

export async function signOut() { await supabase.auth.signOut() }

export async function fetchCurrentMember() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('members').select('*').eq('user_id', user.id).maybeSingle()
  const { data: adminRow } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!data) return null
  return { ...data, joined: data.joined, isAdmin: !!adminRow }
}

export async function updateMemberProfile(email, patch) {
  const fields = (({ name, phone, institution, grade, specialty }) => ({ name, phone, institution, grade, specialty }))(patch)
  await supabase.from('members').update(fields).eq('email', email)
}

// ---------------- Progress ----------------

export async function loadProgress(memberId) {
  const { data } = await supabase.from('progress').select('course_id,lesson_id').eq('member_id', memberId)
  return data || []
}

export async function setProgress(memberId, courseId, lessonId, done) {
  if (done) await supabase.from('progress').upsert({ member_id: memberId, course_id: courseId, lesson_id: lessonId }, { onConflict: 'member_id,lesson_id' })
  else await supabase.from('progress').delete().eq('member_id', memberId).eq('lesson_id', lessonId)
}

// ---------------- Admin content writes ----------------
// Each returns nothing meaningful; store.js reloads affected slices afterward.

export const db = {
  // Events
  addEvent: (e) => supabase.from('events').insert(stripId(e)),
  updateEvent: (id, patch) => supabase.from('events').update(patch).eq('id', id),
  removeEvent: (id) => supabase.from('events').delete().eq('id', id),
  loadEvents: async () => (await supabase.from('events').select('*')).data || [],

  // Materials (UI uses eventId; DB column is event_id)
  addMaterial: (m) => supabase.from('materials').insert(toMaterialRow(m)),
  removeMaterial: (id) => supabase.from('materials').delete().eq('id', id),
  loadMaterials: async () => ((await supabase.from('materials').select('*')).data || []).map((m) => ({ ...m, eventId: m.event_id })),

  // News
  addNews: (n) => supabase.from('news').insert(stripId(n)),
  removeNews: (id) => supabase.from('news').delete().eq('id', id),
  loadNews: async () => (await supabase.from('news').select('*')).data || [],

  // Commentaries
  addCommentary: (c) => supabase.from('commentaries').insert({ name: c.name, role: c.role, text: c.text, approved: false }),
  approveCommentary: (id) => supabase.from('commentaries').update({ approved: true }).eq('id', id),
  removeCommentary: (id) => supabase.from('commentaries').delete().eq('id', id),
  loadCommentaries: async () => (await supabase.from('commentaries').select('*')).data || [],

  // Members (admin)
  loadMembers: async () => (await supabase.from('members').select('*')).data || [],
  removeMember: (email) => supabase.from('members').delete().eq('email', email),

  // Courses
  addCourse: (c) => supabase.from('courses').insert({ title: c.title, level: c.level, summary: c.summary, banner: c.banner, hours: c.hours, sort: 0 }),
  updateCourse: (id, patch) => supabase.from('courses').update((({ title, level, summary, banner, hours }) => ({ title, level, summary, banner, hours }))(patch)).eq('id', id),
  removeCourse: (id) => supabase.from('courses').delete().eq('id', id),

  // Modules
  addModule: async (courseId, title) => {
    const n = await nextSort('modules', 'course_id', courseId)
    return supabase.from('modules').insert({ course_id: courseId, title, sort: n })
  },
  updateModule: (id, patch) => supabase.from('modules').update({ title: patch.title }).eq('id', id),
  removeModule: (id) => supabase.from('modules').delete().eq('id', id),
  swapModuleSort: (a, b) => swapSort('modules', a, b),

  // Lessons
  addLesson: async (moduleId, lesson) => {
    const n = await nextSort('lessons', 'module_id', moduleId)
    return supabase.from('lessons').insert({ ...toLessonRow(lesson), module_id: moduleId, sort: n })
  },
  updateLesson: (id, patch) => supabase.from('lessons').update(toLessonRow(patch)).eq('id', id),
  removeLesson: (id) => supabase.from('lessons').delete().eq('id', id),
  swapLessonSort: (a, b) => swapSort('lessons', a, b)
}

// ---------------- helpers ----------------
function stripId(obj) { const { id, ...rest } = obj; return rest }
function toMaterialRow(m) { const { id, eventId, ...rest } = m; return { ...rest, event_id: eventId || m.event_id } }
function toLessonRow(l) {
  const row = { title: l.title, kind: l.kind }
  if ('url' in l) row.url = l.url
  if ('duration' in l) row.duration = l.duration
  if ('pages' in l) row.pages = l.pages
  if ('body' in l) row.body = l.body
  if ('questions' in l) row.questions = l.questions
  return row
}
async function nextSort(table, fk, fkVal) {
  const { data } = await supabase.from(table).select('sort').eq(fk, fkVal).order('sort', { ascending: false }).limit(1)
  return ((data && data[0]?.sort) || 0) + 1
}
async function swapSort(table, a, b) {
  // a, b are { id, sort } — swap their sort values
  await supabase.from(table).update({ sort: b.sort }).eq('id', a.id)
  await supabase.from(table).update({ sort: a.sort }).eq('id', b.id)
}
