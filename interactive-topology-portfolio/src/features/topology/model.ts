import type { ClusterId, PortfolioEdge, PortfolioNode, Relation } from '../../types';
import { clusterIds, topology } from '../../data/topology';

export type Filter = 'all' | 'projects' | 'ai' | 'infra' | 'net' | 'experience';

export const filters: { id: Filter; label: string; cluster?: ClusterId }[] = [
  { id: 'all', label: 'All' },
  { id: 'projects', label: 'Projects', cluster: 'work' },
  { id: 'ai', label: 'AI', cluster: 'ai' },
  { id: 'infra', label: 'Infrastructure', cluster: 'infra' },
  { id: 'net', label: 'Networking', cluster: 'net' },
  { id: 'experience', label: 'Experience', cluster: 'career' },
];

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

export type SelectHandler = (id: string, trigger: HTMLElement, viaKeyboard: boolean) => void;

/** Nodes that appear when `id` is expanded: a cluster reveals its items, any other node reveals everything it connects to. */
export function neighboursOf(id: string): string[] {
  const n = getNode(id);
  if (!n || n.kind === 'core') return [];
  if (n.kind === 'cluster') return childrenOf(n.id as ClusterId);
  const out = new Set<string>();
  for (const e of topology.edges) {
    if (e.source === id) out.add(e.target);
    else if (e.target === id) out.add(e.source);
  }
  out.delete('core');
  return [...out];
}

export const isExpandable = (id: string) => neighboursOf(id).length > 0;

/**
 * Visible nodes: the core, the (filtered) clusters, and the neighbours of every expanded node that is itself visible.
 * Collapsing a node therefore also hides anything that was only reachable through it.
 */
export function computeVisible(expanded: ReadonlySet<string>, filter: Filter): Set<string> {
  const visible = new Set<string>(['core']);
  const filterCluster = filters.find((f) => f.id === filter)?.cluster;
  (filterCluster ? [filterCluster] : clusterIds).forEach((c) => visible.add(c));
  let grew = true;
  while (grew) {
    grew = false;
    for (const id of expanded) {
      if (!visible.has(id)) continue;
      for (const nb of neighboursOf(id)) {
        if (!visible.has(nb)) {
          visible.add(nb);
          grew = true;
        }
      }
    }
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

/** Resolve a ?node= deep link into the set of nodes to expand. Unknown ids return null so the page falls back to the default view. */
export function resolveDeepLink(raw: string | null): { id: string; expanded: string[] } | null {
  if (!raw) return null;
  const n = getNode(raw);
  if (!n || n.kind === 'core') return null;
  const c = clusterOf(n.id);
  return { id: n.id, expanded: [...new Set([...(c ? [c] : []), n.id])] };
}
