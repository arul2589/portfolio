import { useState } from 'react';
import { projectGroups, projects } from '../../data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectsBrowser() {
  const [group, setGroup] = useState<(typeof projectGroups)[number]>('All');
  const list = projects.filter((p) => group === 'All' || p.group === group);
  const present = projectGroups.filter((g) => g === 'All' || projects.some((p) => p.group === g));

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {present.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={group === g}
            onClick={() => setGroup(g)}
            className="rounded-full border border-line px-3.5 py-1.5 text-sm text-fg transition-colors hover:border-muted aria-pressed:border-ai aria-pressed:bg-ai/15"
          >
            {g}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">{list.length} projects shown</p>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <li key={p.id}><ProjectCard project={p} /></li>
        ))}
      </ul>
    </div>
  );
}
