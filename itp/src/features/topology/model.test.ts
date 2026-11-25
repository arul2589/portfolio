import { describe, expect, it } from 'vitest';
import { computeEdges, computeVisible, evidenceNeighbours, positions, resolveDeepLink } from './model';
import { topology } from '../../data/topology';

describe('topology model', () => {
  it('initial view shows only the core and six clusters', () => {
    const v = computeVisible({ expanded: null, selectedId: null, filter: 'all' });
    expect([...v].sort()).toEqual(['ai', 'career', 'contact', 'core', 'infra', 'net', 'work']);
  });

  it('expanding one cluster reveals only its children', () => {
    const v = computeVisible({ expanded: 'work', selectedId: null, filter: 'all' });
    expect(v.has('graph-rag')).toBe(true);
    expect(v.has('docker')).toBe(false);
  });

  it('selecting a project reveals only skills the project documents', () => {
    const nb = evidenceNeighbours('juju-kids-academy');
    expect(nb).toEqual([]);
    const rag = evidenceNeighbours('graph-rag');
    expect(rag).toContain('neo4j');
    expect(rag).not.toContain('crewai');
    expect(rag).not.toContain('bm25-rrf');
  });

  it('does not connect Kubernetes (lab only) to any project', () => {
    expect(topology.edges.some((e) => e.source === 'kubernetes' && e.relation !== 'belongs_to')).toBe(false);
    expect(topology.edges.some((e) => e.target === 'kubernetes' && e.relation !== 'belongs_to')).toBe(false);
  });

  it('edges only connect visible nodes', () => {
    const v = computeVisible({ expanded: 'ai', selectedId: 'graph-rag', filter: 'all' });
    for (const e of computeEdges(v)) {
      expect(v.has(e.source) && v.has(e.target)).toBe(true);
    }
  });

  it('filter limits visible clusters', () => {
    const v = computeVisible({ expanded: 'net', selectedId: null, filter: 'net' });
    expect(v.has('ai')).toBe(false);
    expect(v.has('infoblox')).toBe(true);
  });

  it('deep links resolve known ids and ignore unknown ones', () => {
    expect(resolveDeepLink('graph-rag')).toEqual({ id: 'graph-rag', expanded: 'work' });
    expect(resolveDeepLink('nope')).toBeNull();
    expect(resolveDeepLink(null)).toBeNull();
    expect(resolveDeepLink('core')).toBeNull();
  });

  it('every node has a position', () => {
    for (const n of topology.nodes) expect(positions[n.id]).toBeDefined();
  });
});
