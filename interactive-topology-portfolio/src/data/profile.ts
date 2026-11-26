export const profile = {
  name: 'Arul Murugan',
  shortName: 'arul murugan',
  title: 'Infrastructure Automation Engineer | GenAI & Agentic AI | Enterprise Networking',
  headline: 'Connecting infrastructure, automation and intelligence.',
  eyebrow: 'Infrastructure / GenAI',
  supporting:
    '16+ years of enterprise infrastructure experience, including 10+ years in Infoblox DDI. I build AI agents, retrieval-augmented applications and infrastructure automation solutions, drawing on real enterprise operations experience.',
  /** Path to a headshot in /public (e.g. '/arul.jpg'); null shows initials. */
  photo: null as string | null,
  location: 'Hosur, Tamil Nadu, India',
  resumeHref: '/Arul_Murugan_Resume.pdf',
  github: 'https://github.com/arul2589',
  linkedin: 'https://www.linkedin.com/in/arul-murugan-subramanian-94b17418',
  // Published at the owner's explicit request (contrary to the spec default).
  email: 'arulmurugan@live.in',
  phone: '+91 81246 81717',
  phoneHref: 'tel:+918124681717',
  siteUrl: 'https://charu.tech',
  stats: [
    { value: '16+', label: 'years of enterprise IT' },
    { value: '10+', label: 'years in Infoblox DDI' },
    { value: 'AI + automation', label: 'agents, RAG and infrastructure' },
  ],
} as const;
