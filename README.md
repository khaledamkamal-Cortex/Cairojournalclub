# CAIRO Journal Club Portal

Portal for the **C.A.I.R.O Journal Club** — the *Critical Appraisal Initiative for Research in Oncology*, an Egyptian oncology-education community active since 2013.

Built with **React + Vite + React Router**. Runs fully in **demo mode** out of the box (data stored in the browser), and switches to a live **Supabase** backend once environment variables are set.

## Site map

| Section | Route | Notes |
|---|---|---|
| Home | `/` | Hero, stats, LMS highlight, upcoming & recent events, news, testimonials |
| Events | `/events` | Previous & future events (tabs), managed from admin |
| Meeting Materials & Education | `/materials` | Videos & PDFs grouped per event, in-page video player |
| **Learning Management System** | `/lms`, `/lms/:courseId` | **Core feature** — Moodle-style courses, video/article/PDF lessons, quizzes, progress tracking, certificates |
| News | `/news` | Admin-managed announcements |
| About Us | `/about` | Static |
| Contact Us | `/contact` | Static + contact form |
| Membership | `/membership` | Register, login, manage membership, personal learning dashboard |
| Affiliations & Cooperation | `/affiliations` | Static |
| Attendees' Commentaries | `/commentaries` | Public testimonials + moderated submission form |
| Admin Panel | `/admin` | Manage events, materials, news, courses, members, moderate commentaries |

## Running locally

```bash
npm install
npm run dev      # http://localhost:5180
```

> This machine has no global Node. Use the local copy:
> `export PATH="/Users/khaledkamal/Claude Projects/.node/bin:$PATH"`

### Admin access
Go to `/admin` and use the demo password **`cairo-admin`**.

## Going live with Supabase

1. Create a Supabase project.
2. Run [`supabase-schema.sql`](./supabase-schema.sql) in the SQL editor.
3. Copy `.env.example` → `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Wire the `src/lib/store.js` methods to Supabase queries (the interface is already structured to make this a drop-in swap), and use Supabase Auth for membership.

## Deploying (Vercel)

`vercel.json` is included with SPA rewrites. Point the domain **www.cairojournalclub.com** at the deployment.

```bash
npm run build    # outputs to dist/
```

## Branding

Colors are taken from the CAIRO logo (purple `#6d2077`, blue `#1b9cd8`, plus the multicolour accent palette) and defined as CSS variables in `src/styles.css`. Replace `public/logo.svg` with the official logo file.
