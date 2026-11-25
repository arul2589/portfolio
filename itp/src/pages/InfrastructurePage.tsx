import { usePageMeta } from '../hooks/usePageMeta';
import { InfraDiagram } from '../features/infrastructure/InfraDiagram';

export function InfrastructurePage() {
  usePageMeta('Infrastructure', 'A conceptual view of how this portfolio is served: Traefik over HTTPS in front of an isolated static container.', '/infrastructure');
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-infra">Infrastructure</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">How this site is served</h1>
        <p className="mt-3 text-muted">
          The portfolio is a static site in its own container behind an HTTPS reverse proxy. It has no database, no API keys, no accounts and no tracking.
        </p>
      </header>
      <InfraDiagram />
    </div>
  );
}
