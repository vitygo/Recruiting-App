// HeroSection
export const COLUMNS = [
  { label: 'Applied', count: 12, color: 'var(--c-ink-muted)' },
  { label: 'Screening', count: 7, color: 'var(--c-accent)' },
  { label: 'Interview', count: 4, color: 'var(--c-violet)' },
  { label: 'Offer', count: 2, color: 'var(--c-success)' },
]

export const CANDIDATES = [
  { initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#ff7a3d' },
  { initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#ff7a3d' },
  { initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#ff7a3d' },
]

// FloatingCards
export const FLOATING_CARDS = [
  { initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#ff7a3d', top: '12%', left: '4%', delay: 0, scale: 1, opacity: 0.9 },
  { initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#ff7a3d', top: '68%', left: '2%', delay: 1.5, scale: 0.85, opacity: 0.5 },
  { initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#ff7a3d', top: '38%', left: '76%', delay: 0.8, scale: 0.9, opacity: 0.7 },
  { initials: 'PL', name: 'Priya Lal', role: 'Data Scientist', score: 94, color: '#ff7a3d', top: '15%', left: '80%', delay: 2.1, scale: 1, opacity: 0.85 },
  { initials: 'TW', name: 'Tom Walker', role: 'Backend Dev', score: 81, color: '#ff7a3d', top: '78%', left: '73%', delay: 0.4, scale: 0.75, opacity: 0.4 },
  { initials: 'SC', name: 'Sarah Chen', role: 'UX Researcher', score: 89, color: '#ff7a3d', top: '52%', left: '86%', delay: 1.8, scale: 0.8, opacity: 0.55 },
  { initials: 'DK', name: 'David Kim', role: 'iOS Engineer', score: 83, color: '#ff7a3d', top: '85%', left: '20%', delay: 1.2, scale: 0.7, opacity: 0.35 },
  { initials: 'NP', name: 'Nina Patel', role: 'ML Engineer', score: 96, color: '#ff7a3d', top: '8%', left: '30%', delay: 2.8, scale: 0.75, opacity: 0.4 },
  { initials: 'JL', name: 'James Lee', role: 'DevOps', score: 76, color: '#ff7a3d', top: '30%', left: '88%', delay: 3.2, scale: 0.65, opacity: 0.3 },
  { initials: 'AR', name: 'Anna Reed', role: 'QA Engineer', score: 85, color: '#ff7a3d', top: '60%', left: '0%', delay: 0.6, scale: 0.8, opacity: 0.45 },
  { initials: 'MB', name: 'Mike Brown', role: 'Tech Lead', score: 91, color: '#ff7a3d', top: '95%', left: '50%', delay: 1.9, scale: 0.7, opacity: 0.3 },
  { initials: 'LW', name: 'Lisa Wang', role: 'Product Manager', score: 88, color: '#ff7a3d', top: '5%', left: '60%', delay: 2.5, scale: 0.65, opacity: 0.35 },
]

// BentoSection
export const BARS = [
  { h: 45, active: false, delay: 0.05 },
  { h: 70, active: false, delay: 0.1 },
  { h: 100, active: true, delay: 0.15 },
  { h: 58, active: false, delay: 0.2 },
  { h: 82, active: false, delay: 0.25 },
  { h: 48, active: true, delay: 0.3 },
  { h: 62, active: false, delay: 0.35 },
  { h: 90, active: false, delay: 0.4 },
  { h: 38, active: false, delay: 0.45 },
]

export const INTEGRATIONS = [
  { icon: 'ti-brand-linkedin', label: 'LinkedIn' },
  { icon: 'ti-brand-slack', label: 'Slack' },
  { icon: 'ti-brand-google', label: 'Google' },
  { icon: 'ti-mail', label: 'Outlook' },
  { icon: 'ti-brand-github', label: 'GitHub' },
  { icon: 'ti-video', label: 'Zoom' },
  { icon: 'ti-plus', label: '34 more' },
]

// TestimonialsSection
export const PAIN_POINTS = [
  {
    icon: 'ti-table-off',
    highlight: ['200+ candidates', ' in a spreadsheet.'],
    quote: 'Columns everywhere, no history, no context. One wrong filter and everything was gone.',
    role: 'Recruiter at a Series A startup',
    span: 'g5',
  },
  {
    icon: 'ti-clock-x',
    highlight: ['2 hours every Monday', ' just scheduling interviews.'],
    quote: 'Back-and-forth emails, timezone confusion, last-minute cancellations. It was exhausting.',
    role: 'Talent Lead, remote-first team',
    span: 'g7',
  },
  {
    icon: 'ti-brain-off',
    highlight: ['91% match.', ' Completely wrong hire.'],
    quote: 'The ATS never explained why. We trusted the score and paid for it.',
    role: 'Hiring Manager, 50-person company',
    span: 'g4',
  },
  {
    icon: 'ti-messages-off',
    highlight: ['Feedback ', 'scattered', ' everywhere.'],
    quote: 'Slack, email, sticky notes. By decision time half the team forgot what they thought.',
    role: 'Engineering Manager',
    span: 'g4',
    accentMiddle: true,
  },
  {
    icon: 'ti-plug-off',
    highlight: ['3 months', ' to set up. Still broken.'],
    quote: "Required a dedicated ops person and still didn't work the way we actually hired.",
    role: 'Head of People, growth-stage startup',
    span: 'g4',
  },
  {
    icon: 'ti-eye-off',
    highlight: ['We were ', 'flying blind.'],
    quote: 'No idea where candidates dropped off. Zero visibility into our own funnel.',
    role: 'Recruiter, agency',
    span: 'g5',
    accentMiddle: true,
  },
]

// PricingSection
export const PLANS = [
  {
    name: 'Starter',
    amount: '0',
    period: 'forever',
    desc: 'Perfect for solo recruiters and small teams just getting started.',
    featured: false,
    cta: 'Get started free',
    ctaTo: '/register',
    features: [
      'Up to 3 active jobs',
      'Up to 50 candidates',
      'Kanban pipeline',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    amount: '49',
    period: '/user/mo',
    desc: 'For growing teams that need AI scoring, smart scheduling and full analytics.',
    featured: true,
    cta: 'Start free trial',
    ctaTo: '/register',
    features: [
      'Unlimited jobs & candidates',
      'AI match scoring',
      'Smart scheduling',
      'Unified timeline',
      'Advanced analytics',
      'Priority support',
      'White-label portal',
    ],
  },
  {
    name: 'Enterprise',
    amount: 'Custom',
    period: '',
    desc: 'For large teams with custom compliance, SSO and dedicated support needs.',
    featured: false,
    cta: 'Contact us',
    ctaTo: '/register',
    features: [
      'Everything in Pro',
      'SSO / SAML',
      'Custom data residency',
      'SLA 99.9%',
      'Dedicated CSM',
      'Custom integrations',
    ],
  },
]

// FaqSection
export const FAQS = [
  {
    q: 'How is RecruitApex different from Greenhouse or Lever?',
    a: 'RecruitApex is built for speed and simplicity. Setup takes 15 minutes vs 3 months. The UI is designed to minimize clicks, not maximize features. And our AI scoring is transparent — every score comes with an explanation.',
  },
  {
    q: 'Is my data safe and GDPR compliant?',
    a: 'Yes. Data is stored in EU (Frankfurt region). We support right to erasure, data export, and provide a Data Processing Agreement. Sub-processors are publicly listed. You stay in control.',
  },
  {
    q: 'Can I import my existing candidates?',
    a: 'Yes. You can import candidates via CSV from any ATS — Greenhouse, Lever, Workable, or a plain spreadsheet. The import wizard maps your columns automatically.',
  },
  {
    q: 'How does the AI scoring work?',
    a: 'Our AI scores candidates on four factors: skills match, seniority, location fit, and salary alignment. Every score includes a human-readable explanation. You can see exactly why a candidate scored 87% — no black box.',
  },
  {
    q: 'What happens when I hit the Starter plan limits?',
    a: 'You will get a notification before you hit the limit. You can upgrade to Pro at any time — your data stays exactly as is. No migration needed.',
  },
]

// LandingFooter
export const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: 'mailto:hello@recruitapex.com' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', href: '#' },
  ],
}

// LogosSection
export const PHRASES = [
  '✦ No more spreadsheets',
  '✦ Setup in 15 minutes',
  '✦ AI that explains itself',
  '✦ Zero email ping-pong',
  '✦ Drag. Drop. Hired.',
  '✦ Your pipeline, your way',
  '✦ Stop losing candidates',
  '✦ Hire faster, not harder',
  '✦ Less clicking, more hiring',
  '✦ Finally, an ATS you like',
]

// AnimatedPipeline
export const PIPELINE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer']

export const PIPELINE_STAGE_COLORS = [
  'var(--c-ink-muted)',
  'var(--c-accent)',
  'var(--c-violet)',
  'var(--c-success)',
]

export const PIPELINE_INITIAL_CARDS = [
  { id: 1, initials: 'AJ', name: 'Alex Johnson', role: 'Senior Engineer', score: 92, color: '#ff7a3d', stage: 0 },
  { id: 2, initials: 'MK', name: 'Maria Kim', role: 'Product Designer', score: 87, color: '#ff7a3d', stage: 0 },
  { id: 3, initials: 'RS', name: 'Ryan Smith', role: 'Frontend Dev', score: 78, color: '#ff7a3d', stage: 1 },
  { id: 4, initials: 'PL', name: 'Priya Lal', role: 'Data Scientist', score: 94, color: '#ff7a3d', stage: 1 },
  { id: 5, initials: 'TW', name: 'Tom Walker', role: 'Backend Dev', score: 81, color: '#ff7a3d', stage: 2 },
  { id: 6, initials: 'SC', name: 'Sarah Chen', role: 'UX Researcher', score: 89, color: '#ff7a3d', stage: 3 },
]
