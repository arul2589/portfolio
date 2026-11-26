import { usePageMeta } from '../hooks/usePageMeta';
import { Credentials, Timeline } from '../features/experience/Timeline';
import { SectionHeading } from '../components/ui';

export function ExperiencePage() {
  usePageMeta('Experience', 'Career timeline of Arul Murugan: from network support in 2010 to Infoblox DDI and infrastructure automation.', '/experience');
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-infra">Experience</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Career backbone</h1>
        <p className="mt-3 text-muted">16+ years in enterprise infrastructure, newest role first.</p>
      </header>
      <Timeline />
      <div className="mt-16">
        <SectionHeading title="Certifications and education" />
        <Credentials />
      </div>
    </div>
  );
}
