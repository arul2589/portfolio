import { describe, expect, it } from 'vitest';
import { computeEdges, computeVisible, isExpandable, neighboursOf, resolveDeepLink } from './model';
import { topology } from '../../data/topology';

const none = new Set<string>();

describe('topology model', () => {
  it('initial view shows only the core and six clusters', () => {
    expect([...computeVisible(none, 'all')].sort()).toEqual(['ai', 'career', 'contact', 'core', 'infra', 'net', 'work']);
  });

  it('expanding a cluster reveals only its items', () => {
    const v = computeVisible(new Set(['work']), 'all');
    expect(v.has('graph-rag')).toBe(true);
    expect(v.has('docker')).toBe(false);
  });

  it('expanding a project reveals the skills it documents, and only those', () => {
    const rag = neighboursOf('graph-rag');
    expect(rag).toContain('neo4j');
    expect(rag).not.toContain('crewai');
    expect(rag).not.toContain('bm25-rrf');
    expect(neighboursOf('juju-kids-academy').filter((id) => id !== 'work')).toEqual([]);
  });

  it('expanding a skill reveals the projects that use it (graph traversal)', () => {
    expect(neighboursOf('neo4j')).toContain('graph-rag');
  });

  it('collapsing a parent hides nodes only reachable through it', () => {
    const open = computeVisible(new Set(['work', 'graph-rag']), 'all');
    expect(open.has('neo4j')).toBe(true);
    const folded = computeVisible(new Set(['graph-rag']), 'all'); // cluster folded, project expansion is orphaned
    expect(folded.has('graph-rag')).toBe(false);
    expect(folded.has('neo4j')).toBe(false);
  });

  it('does not connect Kubernetes (lab only) to any project', () => {
    expect(topology.edges.some((e) => e.source === 'kubernetes' && e.relation !== 'belongs_to')).toBe(false);
    expect(topology.edges.some((e) => e.target === 'kubernetes' && e.relation !== 'belongs_to')).toBe(false);
  });

  it('edges only connect visible nodes', () => {
    const v = computeVisible(new Set(['ai', 'work', 'graph-rag']), 'all');
    for (const e of computeEdges(v)) expect(v.has(e.source) && v.has(e.target)).toBe(true);
  });

  it('filter limits visible clusters', () => {
    const v = computeVisible(new Set(['net']), 'net');
    expect(v.has('ai')).toBe(false);
    expect(v.has('infoblox')).toBe(true);
  });

  it('core is never expandable; clusters are', () => {
    expect(isExpandable('core')).toBe(false);
    expect(isExpandable('work')).toBe(true);
  });

  it('deep links resolve known ids and ignore unknown ones', () => {
    expect(resolveDeepLink('graph-rag')).toEqual({ id: 'graph-rag', expanded: ['work', 'graph-rag'] });
    expect(resolveDeepLink('ai')).toEqual({ id: 'ai', expanded: ['ai'] });
    expect(resolveDeepLink('nope')).toBeNull();
    expect(resolveDeepLink(null)).toBeNull();
    expect(resolveDeepLink('core')).toBeNull();
  });
});
