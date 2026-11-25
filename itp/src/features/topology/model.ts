import type { ClusterId, PortfolioEdge, PortfolioNode, Relation } from '../../types';
import { clusterIds, clusterMeta, topology } from '../../data/topology';

export type Filter = 'all' | 'projects' | 'ai' | 'infra' | 'net' | 'experience';

export const filters: { id: Filter; label: string; cluster?: ClusterId }[] = [
  { id: 'all', label: 'All' },
  { id: 'projects', label: 'Projects', cluster: 'work' },
  { id: 'ai', label: 'AI', cluster: 'ai' },
  { id: 'infra', label: 'Infrastructure', cluster: 'infra' },
  { id: 'net', label: 'Networking', cluster: 'net' },
  { id: 'experience', label: 'Experience', cluster: 'career' },
];

export const R1 = 180;
export const R2 = 330;

export const accent: Record<ClusterId, string> = {
  ai: '#A78BFA',
  infra: '#38BDF8',
  net: '#2DD4BF',
  career: '#FBBF24',
  work: '#E2E8F0',
  contact: '#A8B4C5',
};

const nodeById = new Map<string, PortfolioNode>(topology.nodes.map((n) => [n.id, n]));
export const getNode = (id: string | null | undefined) => (id ? nodeById.get(id) : undefined);

export const clusterOf = (id: string): ClusterId | undefined => {
  const n = getNode(id);
  if (!n) return undefined;
  if (n.kind === 'cluster') return n.id as ClusterId;
  return n.cluster;
};

const childrenByCluster = new Map<ClusterId, string[]>();
for (const id of clusterIds) childrenByCluster.set(id, []);
for (const n of topology.nodes) {
  if (n.kind !== 'cluster' && n.kind !== 'core' && n.cluster) childrenByCluster.get(n.cluster)!.push(n.id);
}
export const childrenOf = (c: ClusterId) => childrenByCluster.get(c) ?? [];

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Deterministic radial layout: the core in the centre, clusters on ring 1, items fanned out on ring 2. */
export const positions: Record<string, { x: number; y: number }> = (() => {
  const out: Record<string, { x: number; y: number }> = { core: { x: 0, y: 0 } };
  for (const id of clusterIds) {
    const a = clusterMeta[id].angle;
    out[id] = { x: R1 * Math.cos(rad(a)), y: R1 * Math.sin(rad(a)) };
    const kids = childrenOf(id);
    const n = kids.length;
    const spread = Math.min(104, 13 * n + 12);
    const levels = n > 9 ? 5 : n > 6 ? 4 : n > 3 ? 3 : n > 1 ? 2 : 1;
    kids.forEach((kid, i) => {
      const angle = n === 1 ? a : a + (i - (n - 1) / 2) * (spread / (n - 1));
      const radius = R2 + (i % levels) * 52;
      out[kid] = { x: radius * Math.cos(rad(angle)), y: radius * Math.sin(rad(angle)) };
    });
  }
  return out;
})();

const REVEAL: Relation[] = ['uses', 'demonstrates', 'hosted_on'];

/** Neighbours reached through evidence relations (not structural belongs_to links). */
export function evidenceNeighbours(id: string): string[] {
  const out = new Set<string>();
  for (const e of topology.edges) {
    if (!REVEAL.includes(e.relation)) continue;
    if (e.source === id) out.add(e.target);
    if (e.target === id) out.add(e.source);
  }
  return [...out];
}

export interface ViewState {
  expanded: ClusterId | null;
  selectedId: string | null;
  filter: Filter;
}

export function computeVisible({ expanded, selectedId, filter }: ViewState): Set<string> {
  const visible = new Set<string>(['core']);
  const filterCluster = filters.find((f) => f.id === filter)?.cluster;
  const clusters = filterCluster ? [filterCluster] : clusterIds;
  clusters.forEach((c) => visible.add(c));
  if (expanded && visible.has(expanded)) childrenOf(expanded).forEach((k) => visible.add(k));
  if (selectedId && getNode(selectedId)) {
    visible.add(selectedId);
    for (const nb of evidenceNeighbours(selectedId)) {
      visible.add(nb);
      const c = clusterOf(nb);
      if (c) visible.add(c);
    }
    const c = clusterOf(selectedId);
    if (c) visible.add(c);
  }
  return visible;
}

export function computeEdges(visible: Set<string>): PortfolioEdge[] {
  return topology.edges.filter((e) => visible.has(e.source) && visible.has(e.target));
}

export function activeEdgeIds(edges: PortfolioEdge[], ids: (string | null)[]): Set<string> {
  const set = new Set<string>();
  const live = ids.filter(Boolean) as string[];
  for (const e of edges) if (live.includes(e.source) || live.includes(e.target)) set.add(e.id);
  return set;
}

export interface Related {
  node: PortfolioNode;
  relation: Relation;
  direction: 'out' | 'in';
}

export function relatedNodes(id: string): Related[] {
  const list: Related[] = [];
  for (const e of topology.edges) {
    if (e.relation === 'belongs_to' && getNode(id)?.kind !== 'cluster') continue;
    if (e.source === id) {
      const node = getNode(e.target);
      if (node && node.kind !== 'core') list.push({ node, relation: e.relation, direction: 'out' });
    } else if (e.target === id) {
      const node = getNode(e.source);
      if (node && node.kind !== 'core') list.push({ node, relation: e.relation, direction: 'in' });
    }
  }
  return list;
}

/** Resolve a ?node= deep link. Unknown ids return null so the page falls back to the default view. */
export function resolveDeepLink(raw: string | null): { id: string; expanded: ClusterId | null } | null {
  if (!raw) return null;
  const n = getNode(raw);
  if (!n || n.kind === 'core') return null;
  const c = clusterOf(n.id);
  return { id: n.id, expanded: c ?? null };
}
