// Seed content for the CAIRO Journal Club portal demo store.
// CAIRO = Critical Appraisal Initiative for Research in Oncology (Egypt, since 2013).
// Events below are illustrative; edit freely from the Admin panel.

export const seedEvents = [
  {
    id: 'ev-2024-esmo',
    title: 'ESMO 2024 Highlights — Practice-Changing GI Oncology',
    date: '2024-11-15',
    time: '19:00',
    type: 'past',
    location: 'Cairo Marriott Hotel, Zamalek',
    speakers: 'Prof. A. Hassan, Dr. M. Farouk',
    topic: 'Gastrointestinal',
    image: 'linear-gradient(135deg,#6d2077,#1b9cd8)',
    summary: 'A critical appraisal of the most impactful GI oncology abstracts from ESMO 2024, with structured discussion of trial methodology and applicability to Egyptian practice.',
    attendees: 142
  },
  {
    id: 'ev-2024-breast',
    title: 'Journal Club: CDK4/6 Inhibitors in Early Breast Cancer',
    date: '2024-09-05',
    time: '20:00',
    type: 'past',
    location: 'Online (Zoom)',
    speakers: 'Dr. S. Ibrahim',
    topic: 'Breast',
    image: 'linear-gradient(135deg,#e63946,#f4a300)',
    summary: 'Critical appraisal of the NATALEE and monarchE trials — adjuvant CDK4/6 inhibition, absolute benefit, toxicity and cost considerations.',
    attendees: 98
  },
  {
    id: 'ev-2024-immuno',
    title: 'Immunotherapy Biomarkers: Beyond PD-L1',
    date: '2024-06-20',
    time: '19:30',
    type: 'past',
    location: 'Semiramis InterContinental, Cairo',
    speakers: 'Prof. N. El-Din, Dr. K. Adel',
    topic: 'Immuno-oncology',
    image: 'linear-gradient(135deg,#00a896,#1b9cd8)',
    summary: 'TMB, MSI, and emerging composite biomarkers — how to critically read biomarker-driven trials and avoid over-interpretation.',
    attendees: 120
  },
  {
    id: 'ev-2025-asco',
    title: 'ASCO 2025 Post-Conference Review',
    date: '2025-08-14',
    time: '19:00',
    type: 'future',
    location: 'Cairo Marriott Hotel, Zamalek',
    speakers: 'CAIRO Faculty Panel',
    topic: 'Multidisciplinary',
    image: 'linear-gradient(135deg,#6d2077,#4d1554)',
    summary: 'Our flagship annual meeting: a full-day critical appraisal of the practice-changing studies presented at ASCO 2025.',
    attendees: 0
  },
  {
    id: 'ev-2025-lung',
    title: 'Workshop: Critical Appraisal of Lung Cancer RCTs',
    date: '2025-09-27',
    time: '18:30',
    type: 'future',
    location: 'Online (Zoom)',
    speakers: 'Dr. H. Mostafa',
    topic: 'Thoracic',
    image: 'linear-gradient(135deg,#1b9cd8,#0f6fa0)',
    summary: 'Hands-on workshop on appraising non-small cell lung cancer trials — endpoints, hazard ratios, and forest plot interpretation.',
    attendees: 0
  }
]

export const seedMaterials = [
  { id: 'm1', eventId: 'ev-2024-esmo', title: 'ESMO 2024 GI Highlights — Full Recording', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '01:12:40' },
  { id: 'm2', eventId: 'ev-2024-esmo', title: 'Slide Deck (PDF)', kind: 'pdf', url: '#', pages: 48 },
  { id: 'm3', eventId: 'ev-2024-breast', title: 'NATALEE vs monarchE — Appraisal Recording', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '00:58:10' },
  { id: 'm4', eventId: 'ev-2024-breast', title: 'Critical Appraisal Worksheet (PDF)', kind: 'pdf', url: '#', pages: 6 },
  { id: 'm5', eventId: 'ev-2024-immuno', title: 'Immunotherapy Biomarkers — Recording', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '01:05:22' },
  { id: 'm6', eventId: 'ev-2024-immuno', title: 'Reference Reading List (PDF)', kind: 'pdf', url: '#', pages: 3 }
]

export const seedNews = [
  { id: 'n1', title: 'CAIRO Journal Club celebrates 12 years of oncology education', date: '2025-05-10', body: 'Since 2013, CAIRO has hosted more than 80 critical appraisal sessions, training a generation of Egyptian oncologists in evidence-based practice.', tag: 'Milestone' },
  { id: 'n2', title: 'New LMS launched: earn certificates for completed courses', date: '2025-07-01', body: 'Our new Learning Management System lets members follow structured courses, complete quizzes, and download certificates of completion.', tag: 'Announcement' },
  { id: 'n3', title: 'Call for young faculty presenters — 2025/2026 season', date: '2025-06-15', body: 'We invite oncology fellows and junior consultants to present at upcoming journal club sessions. Mentorship provided.', tag: 'Opportunity' }
]

export const seedCourses = [
  {
    id: 'c-appraisal',
    title: 'Foundations of Critical Appraisal in Oncology',
    level: 'Beginner',
    banner: 'linear-gradient(135deg,#6d2077,#1b9cd8)',
    summary: 'The core CAIRO curriculum: learn to read, appraise and apply oncology randomized controlled trials. Covers study design, bias, endpoints, statistics and applicability.',
    hours: 6,
    modules: [
      {
        id: 'mod1', title: 'Module 1 — Study Design & Hierarchy of Evidence',
        lessons: [
          { id: 'l1', title: 'Why critical appraisal matters', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '08:20' },
          { id: 'l2', title: 'The hierarchy of evidence', kind: 'article', body: 'Not all evidence is equal. At the base sit case reports and expert opinion; above them cohort and case-control studies; then randomized controlled trials (RCTs); and at the apex, systematic reviews and meta-analyses of RCTs.\n\nIn oncology, the RCT remains the reference standard for demonstrating that a treatment causally improves outcomes. But hierarchy is a starting point, not a verdict — a poorly conducted RCT can be less reliable than a well-designed observational study. Always appraise the individual study, not just its label.' },
          { id: 'l3', title: 'Randomization & allocation concealment', kind: 'pdf', url: '#', pages: 4 }
        ]
      },
      {
        id: 'mod2', title: 'Module 2 — Bias, Blinding & Confounding',
        lessons: [
          { id: 'l4', title: 'Sources of bias in clinical trials', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '11:05' },
          { id: 'l5', title: 'Intention-to-treat vs per-protocol', kind: 'article', body: 'Intention-to-treat (ITT) analysis keeps every randomized patient in their originally assigned group, regardless of what happened afterward. This preserves the benefit of randomization and gives a pragmatic, real-world estimate of effect.\n\nPer-protocol analysis includes only patients who adhered to the protocol. It can exaggerate efficacy and break randomization. For superiority trials, ITT is conservative and preferred; for non-inferiority trials, both analyses should agree.' },
          { id: 'l6', title: 'Knowledge check: Bias', kind: 'quiz', questions: [
            { q: 'Which analysis preserves the benefit of randomization?', options: ['Per-protocol', 'Intention-to-treat', 'As-treated', 'Subgroup analysis'], answer: 1 },
            { q: 'Blinding primarily reduces which type of bias?', options: ['Selection bias', 'Performance & detection bias', 'Attrition bias', 'Publication bias'], answer: 1 }
          ] }
        ]
      },
      {
        id: 'mod3', title: 'Module 3 — Endpoints & Statistics',
        lessons: [
          { id: 'l7', title: 'OS, PFS and surrogate endpoints', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '13:40' },
          { id: 'l8', title: 'Hazard ratios & confidence intervals', kind: 'article', body: 'A hazard ratio (HR) of 0.70 means a 30% relative reduction in the rate of the event at any given moment. But relative measures can mislead: always ask about the absolute difference and the baseline risk.\n\nThe 95% confidence interval (CI) tells you the precision. If the CI for an HR crosses 1.0, the result is not statistically significant. A wide CI signals an underpowered or small trial. Never read the point estimate without its interval.' },
          { id: 'l9', title: 'Final assessment', kind: 'quiz', questions: [
            { q: 'A hazard ratio of 0.65 (95% CI 0.52–0.81) indicates:', options: ['A non-significant result', 'A significant 35% relative risk reduction', 'A 65% increase in risk', 'An underpowered study'], answer: 1 },
            { q: 'Overall survival is generally considered:', options: ['A surrogate endpoint', 'The most robust efficacy endpoint', 'Less reliable than PFS', 'Only relevant in phase I'], answer: 1 },
            { q: 'A confidence interval crossing 1.0 for a hazard ratio means:', options: ['Strong benefit', 'Not statistically significant', 'Definite harm', 'Perfect precision'], answer: 1 }
          ] }
        ]
      }
    ]
  },
  {
    id: 'c-stats',
    title: 'Biostatistics for the Practising Oncologist',
    level: 'Intermediate',
    banner: 'linear-gradient(135deg,#00a896,#7cb518)',
    summary: 'Demystifying the statistics behind oncology trials — p-values, power, survival analysis and how to spot statistical spin.',
    hours: 4,
    modules: [
      {
        id: 'smod1', title: 'Module 1 — Foundations',
        lessons: [
          { id: 'sl1', title: 'p-values and what they really mean', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '09:15' },
          { id: 'sl2', title: 'Type I & Type II error, power', kind: 'article', body: 'A Type I error (α) is a false positive — concluding a treatment works when it does not. A Type II error (β) is a false negative — missing a real effect. Statistical power (1 − β) is the probability of detecting a true effect, conventionally set at 80–90%.\n\nUnderpowered trials are common in oncology and frequently produce "negative" results that are really inconclusive. When a trial reports no significant difference, always ask: was it powered to find one?' }
        ]
      },
      {
        id: 'smod2', title: 'Module 2 — Survival Analysis',
        lessons: [
          { id: 'sl3', title: 'Reading Kaplan–Meier curves', kind: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10:30' },
          { id: 'sl4', title: 'Quiz: Survival analysis', kind: 'quiz', questions: [
            { q: 'The number at risk on a KM curve helps you judge:', options: ['Statistical spin', 'Reliability of the tail of the curve', 'The p-value', 'The hazard ratio directly'], answer: 1 }
          ] }
        ]
      }
    ]
  }
]

export const seedCommentaries = [
  { id: 'cm1', name: 'Dr. Mona A.', role: 'Medical Oncology Resident', text: 'CAIRO transformed how I read a paper. The structured appraisal framework is something I now use every single day on the ward.', approved: true, date: '2025-03-11' },
  { id: 'cm2', name: 'Dr. Youssef K.', role: 'Clinical Oncologist', text: 'The best CME in Egypt for evidence-based oncology. The ASCO/ESMO review sessions save me weeks of reading.', approved: true, date: '2025-04-02' },
  { id: 'cm3', name: 'Dr. Salma R.', role: 'Oncology Fellow', text: 'Being invited to present as a young faculty member was a career highlight. The mentorship is genuine.', approved: true, date: '2025-05-20' }
]
