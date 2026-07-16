-- ============================================================================
-- CAIRO Journal Club portal — Supabase schema
-- Run this in the Supabase SQL editor to move from demo mode to a live backend.
-- Then set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.
-- ============================================================================

-- ---------- Events ----------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time text,
  type text not null default 'future' check (type in ('past','future')),
  location text,
  speakers text,
  topic text,
  summary text,
  image text,
  attendees int default 0,
  created_at timestamptz default now()
);

-- ---------- Meeting materials (videos / PDFs / slides) ----------
create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  title text not null,
  kind text not null check (kind in ('video','pdf','slides','article')),
  url text,
  duration text,
  pages int,
  created_at timestamptz default now()
);

-- ---------- News ----------
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date default now(),
  tag text,
  body text,
  created_at timestamptz default now()
);

-- ---------- Members (profile; auth handled by Supabase Auth) ----------
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  grade text,
  specialty text,
  institution text,
  status text default 'active',
  joined date default now()
);

-- ---------- LMS: courses / modules / lessons ----------
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level text,
  summary text,
  banner text,
  hours int,
  sort int default 0,
  created_at timestamptz default now()
);

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  sort int default 0
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references modules(id) on delete cascade,
  title text not null,
  kind text check (kind in ('video','pdf','article','quiz')),
  url text,
  body text,
  pages int,
  duration text,
  questions jsonb,   -- for quiz lessons: [{q, options[], answer}]
  sort int default 0
);

-- ---------- LMS progress ----------
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  unique (member_id, lesson_id)
);

-- ---------- Commentaries (moderated) ----------
create table if not exists commentaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  text text not null,
  approved boolean default false,
  date date default now(),
  created_at timestamptz default now()
);

-- ---------- Row Level Security (starter policies) ----------
alter table events enable row level security;
alter table materials enable row level security;
alter table news enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table commentaries enable row level security;
alter table members enable row level security;
alter table progress enable row level security;

-- Public read for published content
create policy "public read events"     on events      for select using (true);
create policy "public read materials"  on materials   for select using (true);
create policy "public read news"       on news        for select using (true);
create policy "public read courses"    on courses     for select using (true);
create policy "public read modules"    on modules     for select using (true);
create policy "public read lessons"    on lessons     for select using (true);
create policy "public read approved commentaries" on commentaries for select using (approved = true);

-- Anyone may submit a commentary (pending moderation)
create policy "anyone submit commentary" on commentaries for insert with check (true);

-- Members manage their own profile & progress
create policy "member reads own profile"  on members  for select using (auth.uid() = user_id);
create policy "member updates own profile" on members  for update using (auth.uid() = user_id);
create policy "member inserts own profile" on members  for insert with check (auth.uid() = user_id);
create policy "member reads own progress"  on progress for select using (member_id in (select id from members where user_id = auth.uid()));
create policy "member writes own progress" on progress for insert with check (member_id in (select id from members where user_id = auth.uid()));
create policy "member deletes own progress" on progress for delete using (member_id in (select id from members where user_id = auth.uid()));

-- NOTE: create an "admin" role (or check a custom claim / an admins table) for
-- write access to events, materials, news, courses and commentary moderation.
