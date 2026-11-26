import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { usePageMeta } from '../hooks/usePageMeta';
import { DownloadLink, ExtLink, LinkButton } from '../components/ui';
import { HomeGraph } from '../features/home/HomeGraph';
import { ProjectCard } from '../features/projects/ProjectCard';

const featured = ['graph-rag', 'ai-customer-support', 'multi-agent-support', 'juju-kids-academy'];

const expertise = [
  { label: 'GenAI & Agentic AI', note: 'Agents, RAG, GraphRAG', box: 'border-ai/40 bg-ai/10', text: 'text-ai' },
  { label: 'Infoblox DDI', note: '10+ years, DNS · DHCP · IPAM', box: 'border-infra/40 bg-infra/10', text: 'text-infra' },
  { label: 'Automation', note: 'Terraform · Ansible · Jenkins', box: 'border-net/40 bg-net/10', text: 'text-net' },
  { label: 'Cloud & Networking', note: 'AWS · Routing · Firewalls', box: 'border-exp/40 bg-exp/10', text: 'text-exp' },
];

const milestones = [
  { year: '2010', text: 'Started in network support on the AT&T / IBM project (Kaizen).', dot: 'bg-exp' },
  { year: '2011', text: 'Joined AT&T: data center switching, routing, firewalls, WAN and DMZ.', dot: 'bg-net' },
  { year: '2016', text: 'Moved to Infoblox DDI: Grid upgrades, DNS/DHCP migrations, CDAT certified.', dot: 'bg-infra' },
  { year: '2024', text: 'HCLTech: cloud-integrated DDI with AWS, Terraform, Ansible and Jenkins.', dot: 'bg-ai' },
  { year: '2026', text: 'Building AI agents, RAG apps and live automation projects.', dot: 'bg-ok' },
];

export function Home() {
  usePageMeta(
    profile.name,
    'Infrastructure automation engineer with 16+ years in enterprise infrastructure and 10+ years in Infoblox DDI, building AI agents, RAG applications and automation.',
    '/',
  );
  const shown = featured.map((id) => projects.find((p) => p.id === id)!).filter(Boolean);

  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-4 pb-6 pt-10 sm:px-6 sm:pt-16" aria-labelledby="hero-h">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
          <div className="shrink-0 rounded-full bg-gradient-to-br from-ai via-infra to-net p-[3px]">
            {profile.photo ? (
              <img src={profile.photo} alt="Arul Murugan" width={160} height={160} className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-surface text-4xl font-bold sm:h-40 sm:w-40 sm:text-5xl" aria-hidden="true">
                <span className="bg-gradient-to-br from-ai via-infra to-net bg-clip-text text-transparent">AM</span>
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-infra">{profile.location}</p>
            <h1 id="hero-h" className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-ai via-infra to-net bg-clip-text text-transparent">{profile.name}</span>
            </h1>
            <p className="mt-2 text-lg text-fg">Infrastructure Automation Engineer · GenAI &amp; Agentic AI</p>
            <p className="mt-3 max-w-xl text-muted">
              16+ years in enterprise infrastructure, 10+ in Infoblox DDI. I now build AI agents, RAG apps and automation on top of that real operations experience.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
              <DownloadLink href={profile.resumeHref} variant="primary">Resume (PDF)</DownloadLink>
              <ExtLink href={profile.linkedin} variant="secondary">LinkedIn</ExtLink>
              <ExtLink href={profile.github}>GitHub</ExtLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-5xl px-4 sm:px-6" aria-labelledby="exp-h">
        <h2 id="exp-h" className="mb-4 text-xl font-bold">What I do</h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {expertise.map((e) => (
            <li key={e.label} className={`rounded-2xl border p-4 ${e.box}`}>
              <p className={`font-semibold ${e.text}`}>{e.label}</p>
              <p className="mt-1 text-sm text-muted">{e.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <HomeGraph />

      <section className="mx-auto mt-12 w-full max-w-5xl px-4 sm:px-6" aria-labelledby="journey-h">
        <h2 id="journey-h" className="mb-4 text-xl font-bold">My journey</h2>
        <ol className="space-y-3 border-l border-line pl-5">
          {milestones.map((m) => (
            <li key={m.year} className="relative">
              <span className={`absolute -left-[26px] top-1.5 h-3 w-3 rounded-full ${m.dot}`} aria-hidden="true" />
              <span className="font-mono text-sm font-semibold text-fg">{m.year}</span>
              <span className="ml-3 text-muted">{m.text}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4"><LinkButton to="/experience">Full experience</LinkButton></div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-5xl px-4 sm:px-6" aria-labelledby="proj-h">
        <h2 id="proj-h" className="mb-4 text-xl font-bold">Selected projects</h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {shown.map((p) => (
            <li key={p.id}><ProjectCard project={p} /></li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton to="/projects" variant="primary">All projects</LinkButton>
          <LinkButton to="/topology" variant="secondary">Explore my network graph</LinkButton>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-5xl px-4 pb-4 sm:px-6" aria-labelledby="contact-h">
        <div className="rounded-3xl border border-ai/40 bg-surface p-8 text-center">
          <h2 id="contact-h" className="text-2xl font-bold sm:text-3xl">Let’s connect</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Open to GenAI, Agentic AI and infrastructure automation roles, and to AI and automation projects.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton to="/contact" variant="primary">Contact</LinkButton>
            <DownloadLink href={profile.resumeHref} variant="secondary">Resume (PDF)</DownloadLink>
          </div>
        </div>
      </section>
    </>
  );
}
