import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type ForceLink,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import 'd3-transition';
import { clusterMeta } from '../../data/topology';
import type { PortfolioEdge } from '../../types';
import { accent, clusterOf, computeEdges, getNode, isExpandable, type SelectHandler } from './model';

export interface ForceGraphHandle {
  zoomBy: (factor: number) => void;
  fit: () => void;
}

interface Props {
  visible: ReadonlySet<string>;
  expanded: ReadonlySet<string>;
  selectedId: string | null;
  onSelect: SelectHandler;
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  r: number;
}
type SimLink = SimulationLinkDatum<SimNode> & { relation: PortfolioEdge['relation'] };

const radiusOf = (id: string) => {
  const kind = getNode(id)?.kind;
  return kind === 'core' ? 36 : kind === 'cluster' ? 27 : kind === 'project' ? 16 : kind === 'skill' ? 10 : 12;
};
const colourOf = (id: string) => {
  const c = clusterOf(id);
  return c ? accent[c] : '#A78BFA';
};
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ForceGraph = forwardRef<ForceGraphHandle, Props>(function ForceGraph({ visible, expanded, selectedId, onSelect }, ref) {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodes = useRef(new Map<string, SimNode>());
  const sim = useRef<Simulation<SimNode, SimLink> | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const follow = useRef(true);
  const fitTimer = useRef<number | undefined>(undefined);
  const dragState = useRef<{ id: string; moved: boolean; sx: number; sy: number } | null>(null);
  const [, setFrame] = useState(0);
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  const edges = useMemo(() => computeEdges(visible as Set<string>), [visible]);
  const frame = useRef(0);
  const bump = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      setFrame((f) => f + 1);
    });
  }, []);

  /** Zoom/pan so every visible node is in view. */
  const fit = useCallback(
    (animate = true) => {
      const svg = svgRef.current;
      const z = zoomRef.current;
      if (!svg || !z || nodes.current.size === 0) return;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const n of nodes.current.values()) {
        x0 = Math.min(x0, (n.x ?? 0) - n.r - 70);
        x1 = Math.max(x1, (n.x ?? 0) + n.r + 70);
        y0 = Math.min(y0, (n.y ?? 0) - n.r - 14);
        y1 = Math.max(y1, (n.y ?? 0) + n.r + 34);
      }
      const { width, height } = svg.getBoundingClientRect();
      if (!width || !height) return;
      const k = Math.max(0.3, Math.min(1.5, 0.95 * Math.min(width / (x1 - x0), height / (y1 - y0))));
      const t = zoomIdentity.translate(width / 2 - (k * (x0 + x1)) / 2, height / 2 - (k * (y0 + y1)) / 2).scale(k);
      const sel = select(svg);
      if (animate && !reducedMotion()) sel.transition().duration(450).call(z.transform, t);
      else sel.call(z.transform, t);
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      zoomBy: (factor: number) => {
        if (svgRef.current && zoomRef.current) {
          follow.current = false;
          select(svgRef.current).transition().duration(200).call(zoomRef.current.scaleBy, factor);
        }
      },
      fit: () => {
        follow.current = true;
        fit(true);
      },
    }),
    [fit],
  );

  // One-off setup: simulation, zoom behaviour, resize tracking.
  useEffect(() => {
    const svg = svgRef.current!;
    const simulation = forceSimulation<SimNode>()
      .force(
        'link',
        forceLink<SimNode, SimLink>()
          .id((d) => d.id)
          .distance((l) => {
            const s = l.source as SimNode, t = l.target as SimNode;
            if (s.id === 'core' || t.id === 'core') return 175;
            return l.relation === 'belongs_to' ? 135 : l.relation === 'career_stage' ? 100 : 150;
          })
          .strength((l) => (l.relation === 'belongs_to' || l.relation === 'contact_link' ? 0.7 : 0.18)),
      )
      .force('charge', forceManyBody<SimNode>().strength((d) => (d.r >= 27 ? -1200 : -520)).distanceMax(800))
      .force('collide', forceCollide<SimNode>().radius((d) => d.r + 34).strength(1))
      .force('x', forceX<SimNode>(0).strength(0.02))
      .force('y', forceY<SimNode>(0).strength(0.02))
      .alphaDecay(0.035)
      .on('tick', bump)
      .on('end', () => {
        setSettled(true);
        if (follow.current) fit(true);
      });
    sim.current = simulation;

    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 2.5])
      .filter((e: Event) => {
        const target = e.target as Element | null;
        if (target?.closest?.('[data-node-btn]')) return false; // dragging a node must not pan the canvas
        if (e.type === 'wheel') return (e as WheelEvent).ctrlKey || (e as WheelEvent).metaKey; // plain scroll keeps scrolling the page
        return !(e as MouseEvent).button;
      })
      .on('zoom', (e) => {
        setTransform(e.transform);
        if (e.sourceEvent) follow.current = false; // the user took over the camera
      });
    zoomRef.current = z;
    select(svg).call(z).on('dblclick.zoom', null);

    const ro = new ResizeObserver(() => {
      const r = svg.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(svg);
    return () => {
      simulation.stop();
      ro.disconnect();
      select(svg).on('.zoom', null);
      cancelAnimationFrame(frame.current);
      window.clearTimeout(fitTimer.current);
    };
  }, [bump, fit]);

  // Sync the simulation with the visible set. New nodes burst out of the node that revealed them.
  useEffect(() => {
    const simulation = sim.current!;
    const map = nodes.current;
    for (const id of [...map.keys()]) if (!visible.has(id)) map.delete(id);
    for (const id of visible) {
      if (map.has(id)) continue;
      const kind = getNode(id)?.kind;
      let x: number, y: number;
      if (kind === 'cluster') {
        const a = (clusterMeta[id as keyof typeof clusterMeta].angle * Math.PI) / 180;
        x = 170 * Math.cos(a);
        y = 170 * Math.sin(a);
      } else {
        const anchor = edges.map((e) => (e.source === id ? e.target : e.target === id ? e.source : null)).find((o) => o && map.has(o) && o !== 'core');
        const from = anchor ? map.get(anchor)! : undefined;
        x = (from?.x ?? 0) + (Math.random() - 0.5) * 24;
        y = (from?.y ?? 0) + (Math.random() - 0.5) * 24;
      }
      map.set(id, { id, r: radiusOf(id), x, y });
    }
    const core = map.get('core');
    if (core) { core.fx = 0; core.fy = 0; }
    const list = [...map.values()];
    const links: SimLink[] = edges.map((e) => ({ source: e.source, target: e.target, relation: e.relation }));
    simulation.nodes(list);
    (simulation.force('link') as ForceLink<SimNode, SimLink>).links(links);
    setSettled(false);
    if (reducedMotion()) {
      simulation.alpha(1).stop();
      for (let i = 0; i < 300; i++) simulation.tick();
      bump();
      setSettled(true);
      if (follow.current) fit(false);
    } else {
      simulation.alpha(0.9).restart();
      window.clearTimeout(fitTimer.current);
      fitTimer.current = window.setTimeout(() => follow.current && fit(true), 650);
    }
  }, [visible, edges, bump, fit]);

  // Dragging a node pins it under the pointer while the rest of the graph reacts.
  const toGraph = (clientX: number, clientY: number) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: (clientX - r.left - transform.x) / transform.k, y: (clientY - r.top - transform.y) / transform.k };
  };
  const onPointerDown = (id: string) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragState.current = { id, moved: false, sx: e.clientX, sy: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 5) return;
    d.moved = true;
    const n = nodes.current.get(d.id);
    if (!n) return;
    const p = toGraph(e.clientX, e.clientY);
    n.fx = p.x;
    n.fy = p.y;
    sim.current?.alphaTarget(0.25).restart();
  };
  const onPointerUp = () => {
    const d = dragState.current;
    if (!d) return;
    const n = nodes.current.get(d.id);
    if (n && d.moved && d.id !== 'core') { n.fx = null; n.fy = null; }
    sim.current?.alphaTarget(0);
    // `moved` stays set until the click that follows pointerup has been swallowed.
    window.setTimeout(() => { if (dragState.current === d) dragState.current = null; }, 0);
  };
  const activate = (id: string) => (e: React.MouseEvent<SVGElement>) => {
    if (dragState.current?.moved) return;
    onSelect(id, e.currentTarget as unknown as HTMLElement, e.detail === 0);
  };
  const onKey = (id: string) => (e: React.KeyboardEvent<SVGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id, e.currentTarget as unknown as HTMLElement, true);
    }
  };

  // Highlight the hovered/selected node's neighbourhood and fade the rest.
  const focusId = hovered ?? selectedId;
  const near = useMemo(() => {
    if (!focusId) return null;
    const set = new Set<string>([focusId]);
    for (const e of edges) {
      if (e.source === focusId) set.add(e.target);
      if (e.target === focusId) set.add(e.source);
    }
    return set;
  }, [focusId, edges]);

  const pos = (id: string) => nodes.current.get(id);
  void size;

  return (
    <svg
      ref={svgRef}
      className={`kg h-full w-full ${near ? 'kg-focus' : ''}`}
      role="group"
      aria-label="Knowledge graph. Select a node to expand it."
      data-settled={settled ? 'true' : 'false'}
    >
      <defs>
        <radialGradient id="kg-core" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.55" />
        </radialGradient>
        <filter id="kg-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
        <g aria-hidden="true">
          {edges.map((e) => {
            const a = pos(e.source), b = pos(e.target);
            if (!a || !b) return null;
            const lit = near ? near.has(e.source) && near.has(e.target) && (e.source === focusId || e.target === focusId) : false;
            return (
              <line
                key={e.id}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                className={`kg-edge kg-edge-${e.relation} ${lit ? 'kg-edge-lit' : ''}`}
              />
            );
          })}
        </g>
        {[...visible].map((id) => {
          const n = pos(id);
          const meta = getNode(id);
          if (!n || !meta) return null;
          const colour = colourOf(id);
          const isSel = selectedId === id;
          const open = expanded.has(id);
          const canExpand = isExpandable(id);
          const dim = near ? !near.has(id) : false;
          const hit = Math.max(n.r, 15);
          const label = meta.label;
          return (
            <g key={id} transform={`translate(${n.x ?? 0} ${n.y ?? 0})`} className={`kg-node ${dim ? 'kg-dim' : ''}`}>
              <g className="kg-pop">
                {isSel && <circle r={n.r + 7} fill="none" stroke={colour} strokeWidth="2" strokeOpacity="0.9" />}
                {open && <circle r={n.r + 4} fill="none" stroke={colour} strokeWidth="1" strokeOpacity="0.45" strokeDasharray="3 3" />}
                <circle
                  r={n.r}
                  fill={meta.kind === 'core' ? 'url(#kg-core)' : '#0f1626'}
                  stroke={colour}
                  strokeWidth={meta.kind === 'cluster' || meta.kind === 'core' ? 2.5 : 2}
                  filter={meta.kind === 'core' || meta.kind === 'cluster' || isSel ? 'url(#kg-glow)' : undefined}
                />
                {meta.kind === 'skill' && <circle r={3.5} fill={colour} />}
                {canExpand && meta.kind !== 'skill' && (
                  <text className="kg-badge" y={meta.kind === 'cluster' ? 5 : 4.5} textAnchor="middle" fill={colour}>
                    {open ? '−' : '+'}
                  </text>
                )}
                <text
                  className={`kg-label ${meta.kind === 'cluster' || meta.kind === 'core' ? 'kg-label-strong' : ''}`}
                  y={n.r + 15}
                  textAnchor="middle"
                  aria-hidden="true"
                >
                  {label}
                </text>
                <circle
                  r={hit + 3}
                  fill="transparent"
                  className="kg-hit"
                  data-node-btn={id}
                  role="button"
                  tabIndex={0}
                  aria-label={meta.kind === 'core' ? `${label}, profile overview` : label}
                  aria-pressed={isSel}
                  aria-expanded={canExpand ? open : undefined}
                  onPointerDown={onPointerDown(id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onClick={activate(id)}
                  onKeyDown={onKey(id)}
                  onPointerEnter={() => setHovered(id)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(id)}
                  onBlur={() => setHovered(null)}
                />
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
});

