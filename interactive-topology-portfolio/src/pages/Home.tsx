import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skills, skillGroups } from '../data/skills';
import { usePageMeta } from '../hooks/usePageMeta';
import { DownloadLink, ExtLink, LinkButton, SectionHeading, card } from '../components/ui';
import { HeroConstellation } from '../features/home/HeroConstellation';
import { ProjectCard } from '../features/projects/ProjectCard';
import { Credentials, Timeline } from '../features/experience/Timeline';
import { InfraDiagram } from '../features/infrastructure/InfraDiagram';

const featured = ['graph-rag', 'ai-customer-support', 'multi-agent-support', 'juju-kids-academy'];

export function Home() {
  usePageMeta(
    profile.name,
    'Infrastructure automation engineer with 16+ years in enterprise infrastructure and 10+ years in Infoblox DDI, building AI agents, RAG applications and automation.',
    '/',
  );
  const shown = featured.map((id) => projects.find((p) => p.id === id)!).filter(Boolean);

  return (
    <>
      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20" aria-labelledby="hero-h">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-infra">{profile.eyebrow}</p>
          <h1 id="hero-h" className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-ai to-infra bg-clip-text text-transparent">Connecting</span> infrastructure, automation and intelligence.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.supporting}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/projects" variant="primary">Explore my projects</LinkButton>
            <LinkButton to="/topology" variant="secondary">Explore topology</LinkButton>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <ExtLink href={profile.github} variant="text">GitHub</ExtLink>
            <ExtLink href={profile.linkedin} variant="text">LinkedIn</ExtLink>
            <DownloadLink href={profile.resumeHref}>Resume (PDF)</DownloadLink>
            <Link to="/experience" className="text-infra underline underline-offset-4 hover:text-fg">View experience</Link>
          </div>
        </div>
        <HeroConstellation />
      </section>

      <section aria-label="At a glance" className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <dl className="grid divide-y divide-line rounded-2xl border border-line bg-surface/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {profile.stats.map((s) => (
            <div key={s.label} className="px-6 py-5">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block bg-gradient-to-r from-ai to-infra bg-clip-text text-2xl font-bold text-transparent">{s.value}</span>
                <span className="text-sm text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6" aria-labelledby="proj-h">
        <SectionHeading id="proj-h" eyebrow="Selected projects" title="Things I have built">
          Each project links to a case study that separates what is documented from what is not.
        </SectionHeading>
        <ul className="grid gap-5 md:grid-cols-2">
          {shown.map((p) => (
            <li key={p.id}><ProjectCard project={p} /></li>
          ))}
        </ul>
        <div className="mt-6"><LinkButton to="/projects">All projects</LinkButton></div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6" aria-labelledby="skills-h">
        <SectionHeading id="skills-h" eyebrow="Skill map" title="Skills, with evidence">
          Skills are grouped by area and labelled as enterprise experience, project experience or hands-on labs.
        </SectionHeading>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g) => {
            const list = skills.filter((s) => s.group === g);
            return (
              <li key={g} className={card}>
                <h3 className="font-semibold">{g}</h3>
                <p className="mt-2 text-sm text-muted">{list.slice(0, 5).map((s) => s.label).join(', ')} and more.</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton to="/stack">See the evidence</LinkButton>
          <LinkButton to="/topology" variant="secondary">Explore relationships</LinkButton>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6" aria-labelledby="infra-h">
        <SectionHeading id="infra-h" eyebrow="Hosting" title="How this site is served" />
        <InfraDiagram />
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6" aria-labelledby="career-h">
        <SectionHeading id="career-h" eyebrow="Career backbone" title="From network support to automation" />
        <Timeline compact />
        <div className="mt-6"><LinkButton to="/experience">Full experience</LinkButton></div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6" aria-labelledby="creds-h">
        <SectionHeading id="creds-h" eyebrow="Credentials" title="Certifications and education" />
        <Credentials />
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6" aria-labelledby="contact-h">
        <div className="rounded-3xl border border-ai/40 bg-surface p-8 text-center">
          <h2 id="contact-h" className="text-2xl font-bold sm:text-3xl">Let’s connect</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Open to GenAI, Agentic AI and infrastructure automation roles, and to AI and automation projects.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ExtLink href={profile.linkedin} variant="primary">LinkedIn</ExtLink>
            <ExtLink href={profile.github}>GitHub</ExtLink>
            <DownloadLink href={profile.resumeHref} variant="secondary">Resume (PDF)</DownloadLink>
          </div>
        </div>
      </section>
    </>
  );
}
