import { ChevronDown } from 'lucide-react';
import { clusterIds, clusterMeta } from '../../data/topology';
import { childrenOf, getNode } from './model';
import type { ClusterId } from '../../types';
import type { ItemData } from './nodes';

interface Props {
  visibleClusters: Set<string>;
  expanded: ClusterId | null;
  selectedId: string | null;
  onSelect: ItemData['onSelect'];
}

export function ListView({ visibleClusters, expanded, selectedId, onSelect }: Props) {
  return (
    <ul className="space-y-3" aria-label="Topology as a list">
      {clusterIds
        .filter((c) => visibleClusters.has(c))
        .map((c) => {
          const kids = childrenOf(c);
          const isOpen = expanded === c;
          return (
            <li key={c} className="rounded-2xl border border-line bg-surface">
              <button
                type="button"
                data-node-btn={c}
                aria-expanded={isOpen}
                onClick={(e) => onSelect(c, e.currentTarget, e.detail === 0)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left"
              >
                <span>
                  <span className="block font-semibold text-fg">{clusterMeta[c].label}</span>
                  <span className="text-xs text-muted">{kids.length} items</span>
                </span>
                <ChevronDown size={18} aria-hidden="true" className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <ul className="flex flex-wrap gap-2 border-t border-line p-4">
                  {kids.map((id) => (
                    <li key={id}>
                      <button
                        type="button"
                        data-node-btn={id}
                        aria-pressed={selectedId === id}
                        onClick={(e) => onSelect(id, e.currentTarget, e.detail === 0)}
                        className="rounded-full border border-line px-3 py-1.5 text-sm text-fg hover:border-muted aria-pressed:border-infra aria-pressed:bg-infra/15"
                      >
                        {getNode(id)?.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
    </ul>
  );
}
