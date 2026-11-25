import { usePageMeta } from '../hooks/usePageMeta';
import { ProjectsBrowser } from '../features/projects/ProjectsBrowser';

export function ProjectsPage() {
  usePageMeta('Projects', 'AI agents, GraphRAG, workflow automation and cloud tools by Arulmurugan S, with case studies.', '/projects');
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-infra">Projects</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Selected projects</h1>
        <p className="mt-3 text-muted">
          Release status is shown on every card. A public demo link appears only when one exists, and details that are not documented are left out.
        </p>
      </header>
      <ProjectsBrowser />
    </div>
  );
}
