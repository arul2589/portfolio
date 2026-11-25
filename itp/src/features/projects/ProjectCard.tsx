import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import { releaseLabel } from '../../data/projects';
import { Badge, Chips, ExtLink, card } from '../../components/ui';

const tone = { preview: 'exp', demo: 'ok', private: 'muted', 'in-development': 'infra', archived: 'muted' } as const;

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className={`${card} flex h-full flex-col transition-colors hover:border-ai/60`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone={tone[p.releaseStatus]}>{releaseLabel[p.releaseStatus]}</Badge>
        <span className="font-mono text-xs text-muted">{p.category}</span>
      </div>
      <h3 className="text-lg font-semibold text-fg">
        <Link to={`/projects/${p.id}`} className="hover:text-ai">
          {p.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-5 text-sm leading-relaxed text-muted">{p.summary}</p>
      <div className="mt-4">
        <Chips items={p.stack.slice(0, 6)} />
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link
          to={`/projects/${p.id}`}
          className="inline-flex items-center rounded-xl bg-ai px-3.5 py-2 text-sm font-semibold text-bg hover:bg-[#b9a2fb]"
        >
          Case study<span className="sr-only">: {p.title}</span>
        </Link>
        {p.demoUrl && (
          <ExtLink href={p.demoUrl} variant="secondary">
            {p.releaseStatus === 'preview' ? 'Open preview' : 'Live demo'}
            <span className="sr-only">: {p.title}</span>
          </ExtLink>
        )}
        {p.repoUrl && (
          <ExtLink href={p.repoUrl}>
            Code<span className="sr-only">: {p.title}</span>
          </ExtLink>
        )}
      </div>
    </article>
  );
}
