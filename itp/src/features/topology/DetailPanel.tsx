import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { getProject, releaseLabel } from '../../data/projects';
import { evidenceLabel } from '../../data/skills';
import { Badge, ExtLink, card } from '../../components/ui';
import { getNode, relatedNodes } from './model';
import type { Relation } from '../../types';

const out: Record<Relation, string> = {
  belongs_to: 'Part of',
  uses: 'Uses',
  demonstrates: 'Demonstrates',
  hosted_on: 'Hosted on',
  career_stage: 'Next role',
  contact_link: 'Contact link',
};
const inc: Record<Relation, string> = {
  belongs_to: 'Includes',
  uses: 'Used by',
  demonstrates: 'Demonstrated by',
  hosted_on: 'Hosts',
  career_stage: 'Previous role',
  contact_link: 'Contact link',
};
const kindLabel = {
  core: 'Profile',
  cluster: 'Cluster',
  project: 'Project',
  skill: 'Skill',
  experience: 'Career',
  contact: 'Contact',
} as const;

interface Props {
  selectedId: string | null;
  onClose: () => void;
  onSelect: (id: string, trigger: HTMLElement, viaKeyboard: boolean) => void;
}

export const DetailPanel = forwardRef<HTMLHeadingElement, Props>(function DetailPanel({ selectedId, onClose, onSelect }, ref) {
  const node = getNode(selectedId);
  const project = node?.kind === 'project' ? getProject(node.id) : undefined;

  return (
    <aside className={`${card} lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto`} aria-label="Node details" data-testid="detail-panel">
      {!node ? (
        <p className="text-sm text-muted">
          Select a node to see what it is, how it connects and where the evidence lives. Press Escape to close this panel.
        </p>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge tone="infra">{kindLabel[node.kind]}</Badge>
                {node.evidence && <Badge tone="exp">{evidenceLabel[node.evidence]}</Badge>}
                {project && <Badge tone="ok">{releaseLabel[project.releaseStatus]}</Badge>}
              </div>
              <h2 ref={ref} tabIndex={-1} className="text-xl font-semibold text-fg focus:outline-none">
                {node.title ?? node.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line p-2 text-muted hover:text-fg"
              aria-label="Close details"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted">{node.summary}</p>

          {project && project.stack.length > 0 && (
            <p className="mt-3 font-mono text-xs text-fg">{project.stack.join(' · ')}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {node.kind === 'project' && (
              <Link to={`/projects/${node.id}`} className="rounded-xl bg-ai px-3.5 py-2 text-sm font-semibold text-bg hover:bg-[#b9a2fb]">
                Open case study
              </Link>
            )}
            {project?.demoUrl && <ExtLink href={project.demoUrl} variant="secondary">{project.releaseStatus === 'preview' ? 'Open preview' : 'Live demo'}</ExtLink>}
            {project?.repoUrl && <ExtLink href={project.repoUrl}>Code</ExtLink>}
            {node.kind === 'contact' && node.href && <ExtLink href={node.href} variant="secondary">Open {node.label}</ExtLink>}
            {(node.kind === 'experience') && node.href && (
              <Link to={node.href} className="rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-fg hover:border-muted">Open experience</Link>
            )}
            {node.kind === 'skill' && (
              <Link to="/stack" className="rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-fg hover:border-muted">See stack evidence</Link>
            )}
          </div>

          {(() => {
            const rel = relatedNodes(node.id);
            if (!rel.length) return null;
            return (
              <section className="mt-6" aria-label="Connections">
                <h3 className="mb-2 text-sm font-semibold text-fg">Connections</h3>
                <ul className="space-y-1.5 text-sm">
                  {rel.map((r) => (
                    <li key={`${r.relation}-${r.node.id}-${r.direction}`} className="flex flex-wrap items-baseline gap-2">
                      <span className="w-28 shrink-0 font-mono text-xs text-muted">{(r.direction === 'out' ? out : inc)[r.relation]}</span>
                      <button
                        type="button"
                        onClick={(e) => onSelect(r.node.id, e.currentTarget, e.detail === 0)}
                        className="text-left text-infra underline underline-offset-4 hover:text-fg"
                      >
                        {r.node.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })()}
        </>
      )}
    </aside>
  );
});
