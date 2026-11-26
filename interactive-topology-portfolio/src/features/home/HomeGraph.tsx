import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ForceGraph } from '../topology/ForceGraph';
import { computeVisible, getNode, isExpandable } from '../topology/model';

/** A compact, live knowledge graph for the home page. Tap a node to grow the graph from it. */
export function HomeGraph() {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visible = useMemo(() => computeVisible(expanded, 'all'), [expanded]);

  const select = useCallback((id: string) => {
    const n = getNode(id);
    if (!n) return;
    const wasSelected = selectedId === id;
    setSelectedId(id);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (isExpandable(id)) {
        if (next.has(id) && wasSelected) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }, [selectedId]);

  const node = selectedId ? getNode(selectedId) : null;

  return (
    <section className="mx-auto mt-12 w-full max-w-5xl px-4 sm:px-6" aria-labelledby="hg-h">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 id="hg-h" className="text-xl font-bold">My work as a graph</h2>
        <Link to="/topology" className="text-sm text-infra underline underline-offset-4 hover:text-fg">Open the full graph</Link>
      </div>
      <div
        className="kg-wrap kg-home h-[440px] overflow-hidden rounded-2xl border border-line bg-[radial-gradient(circle_at_50%_50%,rgba(23,32,51,0.9),rgba(9,14,25,0.6))] sm:h-[460px]"
        role="region"
        aria-label="Interactive knowledge graph preview"
      >
        <ForceGraph visible={visible} expanded={expanded} selectedId={selectedId} onSelect={(id) => select(id)} />
      </div>
      <p className="mt-2 text-sm text-muted" role="status">
        {node ? (
          <>
            <span className="font-semibold text-fg">{node.label}</span>
            {' · '}
            <Link to={`/topology?node=${node.id}`} className="text-infra underline underline-offset-4 hover:text-fg">See details in the full graph</Link>
          </>
        ) : (
          'Tap any node and its connections grow out of it. Tap again to fold it back.'
        )}
      </p>
    </section>
  );
}
