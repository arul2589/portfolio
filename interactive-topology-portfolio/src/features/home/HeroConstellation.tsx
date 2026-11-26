import { Link } from 'react-router-dom';
import { clusterIds, clusterMeta } from '../../data/topology';
import { accent } from '../topology/model';

const short: Record<string, string> = {
  ai: 'GenAI & Agents',
  work: 'Projects',
  career: 'Experience',
  contact: 'Contact',
  infra: 'Infrastructure',
  net: 'Networking & DDI',
};

const pos = clusterIds.map((id) => {
  const a = (clusterMeta[id].angle * Math.PI) / 180;
  return { id, x: 50 + 36 * Math.cos(a), y: 50 + 36 * Math.sin(a) };
});

/** A lightweight, link-based preview of the topology. The full explorer lives at /topology. */
export function HeroConstellation() {
  return (
    <nav aria-label="Network map preview" className="relative mx-auto aspect-square w-full max-w-[480px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(148,163,184,0.25)" strokeDasharray="1.5 1.5" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(148,163,184,0.12)" strokeDasharray="1.5 1.5" strokeWidth="0.3" />
        {pos.map((p) => (
          <line key={p.id} x1="50" y1="50" x2={p.x} y2={p.y} stroke={accent[p.id]} strokeOpacity="0.55" strokeWidth="0.4" />
        ))}
      </svg>
      <Link
        to="/topology"
        className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ai bg-gradient-to-br from-ai/40 to-infra/30 text-center text-xs font-bold leading-tight text-fg shadow-[0_0_40px_-6px_rgba(167,139,250,0.7)] hover:border-infra"
      >
        <span>Arul<br />Murugan</span>
        <span className="sr-only">: open the full topology</span>
      </Link>
      <ul>
        {pos.map((p) => (
          <li key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <Link
              to={`/topology?node=${p.id}`}
              className="whitespace-nowrap rounded-full border bg-surface px-3 py-1.5 text-[13px] font-medium text-fg transition-colors hover:bg-surface-2"
              style={{ borderColor: accent[p.id] }}
            >
              {short[p.id]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
