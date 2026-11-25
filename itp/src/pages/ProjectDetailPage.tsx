import { Link, useParams } from 'react-router-dom';
import { getProject, releaseLabel } from '../data/projects';
import { skills } from '../data/skills';
import { usePageMeta } from '../hooks/usePageMeta';
import { Badge, Chips, ExtLink, LinkButton, card } from '../components/ui';
import { NotFoundPage } from './NotFoundPage';

function Detail({ id }: { id: string }) {
  const p = getProject(id)!;
  usePageMeta(p.title, p.summary.slice(0, 155), `/projects/${p.id}`);
  const related = [...p.skillIds, ...(p.demonstrates ?? []), ...(p.hostedOn ?? [])]
    .map((sid) => skills.find((s) => s.id === sid))
    .filter((s): s is NonNullable<typeof s> => !!s && s.inGraph);

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link to="/projects" className="text-infra underline underline-offset-4 hover:text-fg">Projects</Link>
        <span className="text-muted"> / {p.title}</span>
      </nav>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="ok">{releaseLabel[p.releaseStatus]}</Badge>
        <span className="font-mono text-xs text-muted">{p.category}</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{p.summary}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {p.demoUrl && <ExtLink href={p.demoUrl} variant="primary">{p.releaseStatus === 'preview' ? 'Open preview' : 'Open live demo'}</ExtLink>}
        {p.repoUrl && <ExtLink href={p.repoUrl} variant="secondary">View code</ExtLink>}
        <LinkButton to={`/topology?node=${p.id}`}>Show in topology</LinkButton>
      </div>

      <div className="mt-10 grid gap-6">
        {p.workflow && (
          <section className={card} aria-labelledby="wf">
            <h2 id="wf" className="mb-3 text-lg font-semibold">How it works</h2>
            <ol className="list-decimal space-y-1.5 pl-5 text-muted marker:text-ai">
              {p.workflow.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>
        )}
        {p.guardrails && (
          <section className={card} aria-labelledby="gr">
            <h2 id="gr" className="mb-3 text-lg font-semibold">Guardrails</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-muted marker:text-ai">
              {p.guardrails.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </section>
        )}
        {p.stack.length > 0 && (
          <section className={card} aria-labelledby="st">
            <h2 id="st" className="mb-3 text-lg font-semibold">Stack</h2>
            <Chips items={p.stack} />
          </section>
        )}
        <section className={card} aria-labelledby="ds">
          <h2 id="ds" className="mb-3 text-lg font-semibold">Deployment status</h2>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="text-muted">Release</dt>
            <dd>{releaseLabel[p.releaseStatus]}</dd>
            {p.demoUrl && (
              <>
                <dt className="text-muted">Availability</dt>
                <dd>Not monitored. The link opens an independent application.</dd>
              </>
            )}
            {p.deployment && (
              <>
                <dt className="text-muted">Hosting</dt>
                <dd>{p.deployment}</dd>
              </>
            )}
            <dt className="text-muted">Evidence</dt>
            <dd>{p.evidence.join(', ')}</dd>
          </dl>
        </section>
        {p.limitations && (
          <section className={card} aria-labelledby="lm">
            <h2 id="lm" className="mb-3 text-lg font-semibold">Limitations</h2>
            <p className="text-muted">{p.limitations}</p>
          </section>
        )}
        {related.length > 0 && (
          <section className={card} aria-labelledby="rs">
            <h2 id="rs" className="mb-3 text-lg font-semibold">Related skills</h2>
            <ul className="flex flex-wrap gap-2">
              {related.map((s) => (
                <li key={s.id}>
                  <Link to={`/topology?node=${s.id}`} className="rounded-lg border border-line px-2.5 py-1 font-mono text-xs text-fg hover:border-muted">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  return getProject(slug) ? <Detail id={slug} /> : <NotFoundPage />;
}
