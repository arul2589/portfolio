import { ArrowRight, ArrowDown } from 'lucide-react';

const box = 'rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm';

export function InfraDiagram() {
  return (
    <figure>
      <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-line bg-surface p-6 md:flex-row md:items-center">
        <div className={box}><b className="block text-fg">Visitor</b><span className="text-muted">Browser</span></div>
        <ArrowRight className="hidden shrink-0 text-infra md:block" aria-hidden="true" />
        <ArrowDown className="self-center text-infra md:hidden" aria-hidden="true" />
        <div className={`${box} border-infra/60`}><b className="block text-fg">Reverse proxy</b><span className="text-muted">Traefik, HTTPS</span></div>
        <ArrowRight className="hidden shrink-0 text-infra md:block" aria-hidden="true" />
        <ArrowDown className="self-center text-infra md:hidden" aria-hidden="true" />
        <div className={`${box} border-ai/60`}><b className="block text-fg">Portfolio container</b><span className="text-muted">Static files, unprivileged Nginx</span></div>
        <ArrowRight className="hidden shrink-0 text-infra md:block" aria-hidden="true" />
        <ArrowDown className="self-center text-infra md:hidden" aria-hidden="true" />
        <div className={box}><b className="block text-fg">Assets</b><span className="text-muted">React bundle and curated data</span></div>
      </div>
      <div className="mt-3 rounded-2xl border border-dashed border-line bg-surface/60 p-4 text-sm text-muted">
        <b className="text-fg">Independent applications.</b> Demo links open separate apps that run on their own and are not part of this site.
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        A conceptual view of how this portfolio is served. It is not an inventory of any server.
      </figcaption>
    </figure>
  );
}
