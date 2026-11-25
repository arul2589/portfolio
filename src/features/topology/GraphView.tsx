import { useEffect, useMemo } from 'react';
import { ReactFlow, useReactFlow, type Edge, type Node } from '@xyflow/react';
import { topology } from '../../data/topology';
import { accent, activeEdgeIds, clusterOf, computeEdges, positions } from './model';
import { nodeTypes, type ItemData } from './nodes';
import type { ClusterId } from '../../types';

interface Props {
  visible: Set<string>;
  selectedId: string | null;
  hovered: string | null;
  fitToken: number;
  onSelect: ItemData['onSelect'];
  onHover: ItemData['onHover'];
}

function FitOnDemand({ token }: { token: number }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const id = requestAnimationFrame(() => fitView({ padding: 0.06, duration: 0 }));
    return () => cancelAnimationFrame(id);
  }, [token, fitView]);
  return null;
}

export function GraphView({ visible, selectedId, hovered, fitToken, onSelect, onHover }: Props) {
  const { getNodes } = useReactFlow();
  const structural = useMemo(() => computeEdges(visible), [visible]);

  // Nodes do not depend on hover. Rebuilding them on every hover made React Flow re-measure and
  // briefly hide them, which swallowed fast clicks. Measured sizes are carried over on rebuild.
  const nodes = useMemo(() => {
    const measured = new Map(getNodes().map((n) => [n.id, n.measured]));
    const flowNodes: Node[] = [
      { id: 'orbit-1', type: 'orbit', position: { x: 0, y: 0 }, data: { ring: 1 }, draggable: false, selectable: false, focusable: false, zIndex: -1 },
      { id: 'orbit-2', type: 'orbit', position: { x: 0, y: 0 }, data: { ring: 2 }, draggable: false, selectable: false, focusable: false, zIndex: -1 },
    ];
    for (const n of topology.nodes) {
      if (!visible.has(n.id)) continue;
      const cluster = clusterOf(n.id) as ClusterId | undefined;
      const data: ItemData = {
        nodeId: n.id,
        label: n.label,
        kind: n.kind,
        color: cluster ? accent[cluster] : '#A78BFA',
        selected: selectedId === n.id,
        clusterId: n.kind === 'cluster' ? (n.id as ClusterId) : undefined,
        onSelect,
        onHover,
      };
      flowNodes.push({
        id: n.id,
        type: 'item',
        position: positions[n.id],
        data,
        draggable: false,
        selectable: false,
        focusable: false,
        zIndex: n.kind === 'core' ? 3 : n.kind === 'cluster' ? 2 : 1,
        measured: measured.get(n.id),
      });
    }
    return flowNodes;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getNodes is read, not a trigger
  }, [visible, selectedId, onSelect, onHover]);

  const edges = useMemo(() => {
    const active = activeEdgeIds(structural, [selectedId, hovered]);
    const anyActive = active.size > 0;
    const flowEdges: Edge[] = structural.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'straight',
      selectable: false,
      focusable: false,
      className: `edge-${e.relation} ${active.has(e.id) ? 'edge-active' : anyActive ? 'edge-dim' : ''}`,
    }));
    return flowEdges;
  }, [structural, selectedId, hovered]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodeOrigin={[0.5, 0.5]}
      fitView
      fitViewOptions={{ padding: 0.06 }}
      minZoom={0.2}
      maxZoom={1.8}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      zoomOnScroll={false}
      preventScrolling={false}
      proOptions={{ hideAttribution: false }}
    >
      <FitOnDemand token={fitToken} />
    </ReactFlow>
  );
}
