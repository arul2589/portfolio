import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { List, Maximize, Network, RotateCcw, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ForceGraph, type ForceGraphHandle } from './ForceGraph';
import { ListView } from './ListView';
import { DetailPanel } from './DetailPanel';
import { computeVisible, filters, getNode, isExpandable, resolveDeepLink, type Filter } from './model';
import { clusterIds } from '../../data/topology';

const btn =
  'inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-fg transition-colors hover:border-muted disabled:cursor-not-allowed disabled:opacity-40';

function GraphControls({ graph }: { graph: React.RefObject<ForceGraphHandle | null> }) {
  return (
    <>
      <button type="button" className={btn} onClick={() => graph.current?.zoomBy(1.3)} aria-label="Zoom in" title="Zoom in"><ZoomIn size={16} aria-hidden="true" /></button>
      <button type="button" className={btn} onClick={() => graph.current?.zoomBy(1 / 1.3)} aria-label="Zoom out" title="Zoom out"><ZoomOut size={16} aria-hidden="true" /></button>
      <button type="button" className={btn} onClick={() => graph.current?.fit()}><Maximize size={16} aria-hidden="true" />Fit view</button>
    </>
  );
}

function Explorer() {
  usePageMeta(
    'Interactive topology',
    'Explore Arulmurugan S’s experience, skills and projects as an interactive network, with a keyboard-accessible list view.',
    '/topology',
  );
  const [params, setParams] = useSearchParams();
  const nodeParam = params.get('node');
  const initial = useMemo(() => resolveDeepLink(nodeParam), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedId, setSelectedId] = useState<string | null>(initial?.id ?? null);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set(initial?.expanded ?? []));
  const [filter, setFilter] = useState<Filter>('all');
  const graph = useRef<ForceGraphHandle>(null);
  const narrow = useMediaQuery('(max-width: 767px)');
  const [listChoice, setListChoice] = useState<boolean | null>(null);
  const listView = listChoice ?? narrow;
  const [notice, setNotice] = useState<string | null>(
    nodeParam && !initial ? `No node called “${nodeParam}”. Showing the default view.` : null,
  );

  const panelRef = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;

  const visible = useMemo(() => computeVisible(expanded, filter), [expanded, filter]);
  const visibleClusters = useMemo(() => new Set(clusterIds.filter((c) => visible.has(c))), [visible]);

  const writeParam = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(params);
      if (id) next.set('node', id);
      else next.delete('node');
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  // Follow ?node= changes made by links elsewhere on the site.
  useEffect(() => {
    if (!nodeParam) return;
    if (nodeParam === selectedRef.current) return;
    const r = resolveDeepLink(nodeParam);
    if (r) {
      setSelectedId(r.id);
      setExpanded(new Set(r.expanded));
      setFilter('all');
      setNotice(null);
    } else {
      setNotice(`No node called “${nodeParam}”. Showing the default view.`);
    }
  }, [nodeParam]);

  const select = useCallback(
    (id: string, el: HTMLElement, viaKeyboard: boolean) => {
      const n = getNode(id);
      if (!n) return;
      trigger.current = el;
      setNotice(null);
      const wasSelected = selectedRef.current === id;
      setSelectedId(id);
      setExpanded((prev) => {
        const next = new Set(prev);
        if (isExpandable(id)) {
          // Touch a node to grow the graph from it; touch it again while selected to fold it back up.
          if (next.has(id) && wasSelected) next.delete(id);
          else next.add(id);
        }
        // Reaching an item from the panel or list must also make sure it is on the canvas.
        if (n.kind !== 'cluster' && n.kind !== 'core' && n.cluster) next.add(n.cluster);
        return next;
      });
      writeParam(id);
      requestAnimationFrame(() => {
        if (viaKeyboard) panelRef.current?.focus();
        else if (window.matchMedia('(max-width: 1023px)').matches) panelRef.current?.scrollIntoView({ block: 'nearest' });
      });
    },
    [writeParam],
  );

  const close = useCallback(() => {
    const id = selectedRef.current;
    setSelectedId(null);
    writeParam(null);
    // The graph re-renders as the panel closes and a node can be briefly hidden, in which case
    // focus() is ignored. Retry for a few frames until focus has actually landed.
    let tries = 0;
    const restore = () => {
      const el =
        trigger.current && trigger.current.isConnected
          ? trigger.current
          : document.querySelector<HTMLElement>(`[data-node-btn="${id}"]`);
      el?.focus();
      if (el && document.activeElement !== el && tries++ < 20) requestAnimationFrame(restore);
    };
    requestAnimationFrame(restore);
  }, [writeParam]);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, close]);

  const applyFilter = (f: Filter) => {
    setFilter(f);
    const c = filters.find((x) => x.id === f)?.cluster;
    setExpanded(new Set(c ? [c] : []));
    setSelectedId(null);
    writeParam(null);
    graph.current?.fit();
  };

  const reset = () => {
    setFilter('all');
    setExpanded(new Set());
    setSelectedId(null);
    setNotice(null);
    writeParam(null);
    graph.current?.fit();
  };

  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-5 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-infra">Topology</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore the network</h1>
        <p className="mt-3 text-muted">
          Touch any node and its connections grow out of it: a cluster shows its items, a project shows the skills it uses, a skill shows
          the projects behind it. Touch it again to fold it back. Drag nodes to rearrange. Everything here is drawn from curated data, and a
          tool in a lab is never shown as production experience.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2" role="toolbar" aria-label="Topology controls">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => applyFilter(f.id)}
              className="rounded-full border border-line px-3.5 py-1.5 text-sm text-fg transition-colors hover:border-muted aria-pressed:border-infra aria-pressed:bg-infra/15"
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
        <button type="button" className={btn} onClick={() => setListChoice(!listView)} aria-pressed={listView}>
          {listView ? <Network size={16} aria-hidden="true" /> : <List size={16} aria-hidden="true" />}
          {listView ? 'Show graph' : 'Show list'}
        </button>
        {!listView && <GraphControls graph={graph} />}
        <button type="button" className={btn} onClick={collapseAll} disabled={expanded.size === 0}>
          <Minimize2 size={16} aria-hidden="true" />Collapse all
        </button>
        <button type="button" className={btn} onClick={reset}><RotateCcw size={16} aria-hidden="true" />Reset</button>
      </div>

      {notice && <p role="status" className="mb-3 rounded-lg border border-exp/40 px-3 py-2 text-sm text-exp">{notice}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          {listView ? (
            <ListView visibleClusters={visibleClusters} expanded={expanded} selectedId={selectedId} onSelect={select} />
          ) : (
            <>
              <div
                role="region"
                aria-label="Network topology graph"
                className="kg-wrap h-[560px] overflow-hidden rounded-2xl border border-line bg-[radial-gradient(circle_at_50%_50%,rgba(23,32,51,0.9),rgba(9,14,25,0.6))] lg:h-[calc(100vh-11rem)] lg:min-h-[660px]"
                data-testid="graph"
              >
                <ForceGraph ref={graph} visible={visible} expanded={expanded} selectedId={selectedId} onSelect={select} />
              </div>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted" aria-label="Legend">
                <div className="flex items-center gap-2"><dt className="font-mono text-fg">+ / −</dt><dd>touch to expand or fold</dd></div>
                <div className="flex items-center gap-2"><dt className="font-mono text-fg">solid</dt><dd>belongs to</dd></div>
                <div className="flex items-center gap-2"><dt className="font-mono text-fg">dashed</dt><dd>uses</dd></div>
                <div className="flex items-center gap-2"><dt className="font-mono text-fg">dotted</dt><dd>demonstrates</dd></div>
                <div className="flex items-center gap-2"><dt className="font-mono text-fg">dash-dot</dt><dd>hosted on</dd></div>
                <div className="flex items-center gap-2"><dt className="font-mono text-fg">amber</dt><dd>career stage</dd></div>
              </dl>
            </>
          )}
        </div>
        <DetailPanel ref={panelRef} selectedId={selectedId} onClose={close} onSelect={select} />
      </div>
    </div>
  );
}

export default function TopologyPage() {
  return <Explorer />;
}
