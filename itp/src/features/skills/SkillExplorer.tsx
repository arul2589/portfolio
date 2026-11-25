import { useState } from 'react';
import { Link } from 'react-router-dom';
import { skills, skillGroups, evidenceLabel } from '../../data/skills';
import { projects } from '../../data/projects';
import { card } from '../../components/ui';

const groupTone: Record<string, string> = {
  'GenAI and Agentic AI': 'border-ai/50 text-ai',
  'Programming and APIs': 'border-infra/50 text-infra',
  'Infrastructure and Cloud': 'border-infra/50 text-infra',
  'Networking and DDI': 'border-net/50 text-net',
};

export function SkillExplorer() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = skills.find((s) => s.id === openId);
  const usedBy = open
    ? projects.filter((p) => [...p.skillIds, ...(p.demonstrates ?? []), ...(p.hostedOn ?? [])].includes(open.id))
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((g) => (
          <section key={g} className={card} aria-labelledby={`g-${g}`}>
            <h3 id={`g-${g}`} className="mb-4 text-lg font-semibold">{g}</h3>
            <ul className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.group === g)
                .map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={openId === s.id}
                      onClick={() => setOpenId(openId === s.id ? null : s.id)}
                      className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors hover:bg-white/5 aria-pressed:bg-white/10 ${groupTone[g]}`}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <aside className={`${card} lg:sticky lg:top-24 lg:self-start`} aria-live="polite" aria-label="Skill evidence">
        {open ? (
          <>
            <h3 className="text-lg font-semibold">{open.label}</h3>
            <p className="mt-1 font-mono text-xs text-exp">{evidenceLabel[open.evidence]}</p>
            <p className="mt-3 text-sm text-muted">{open.summary}</p>
            <h4 className="mt-5 text-sm font-semibold text-fg">Projects that document it</h4>
            {usedBy.length ? (
              <ul className="mt-2 space-y-1 text-sm">
                {usedBy.map((p) => (
                  <li key={p.id}>
                    <Link className="text-infra underline underline-offset-4 hover:text-fg" to={`/projects/${p.id}`}>
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">
                {open.evidence === 'enterprise'
                  ? 'Enterprise experience. See the experience timeline.'
                  : 'No documented project evidence yet.'}
              </p>
            )}
            {open.inGraph && (
              <Link className="mt-5 inline-block text-sm text-infra underline underline-offset-4 hover:text-fg" to={`/topology?node=${open.id}`}>
                Show in topology
              </Link>
            )}
          </>
        ) : (
          <p className="text-sm text-muted">
            Select a skill to see how it is evidenced: enterprise experience, project experience or hands-on labs.
          </p>
        )}
      </aside>
    </div>
  );
}
