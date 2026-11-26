import { usePageMeta } from '../hooks/usePageMeta';
import { SkillExplorer } from '../features/skills/SkillExplorer';

export function StackPage() {
  usePageMeta('Stack', 'Skills of Arul Murugan in GenAI, programming, infrastructure and networking, labelled by the kind of evidence.', '/stack');
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-infra">Stack</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Skills and evidence</h1>
        <p className="mt-3 text-muted">
          No scores or percentages. Each skill is labelled enterprise experience, project experience or hands-on labs.
        </p>
      </header>
      <SkillExplorer />
    </div>
  );
}
