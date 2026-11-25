import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Briefcase, Brain, Cloud, FolderGit2, Network, Share2 } from 'lucide-react';
import type { ClusterId, NodeKind } from '../../types';

export interface ItemData extends Record<string, unknown> {
  nodeId: string;
  label: string;
  kind: NodeKind;
  color: string;
  selected: boolean;
  clusterId?: ClusterId;
  onSelect: (id: string, trigger: HTMLElement, viaKeyboard: boolean) => void;
  onHover: (id: string | null) => void;
}

type AppNode = Node<ItemData, 'item'>;

const icons: Record<ClusterId, typeof Brain> = {
  ai: Brain,
  net: Network,
  infra: Cloud,
  work: FolderGit2,
  career: Briefcase,
  contact: Share2,
};

const Handles = () => (
  <>
    <Handle type="source" position={Position.Top} isConnectable={false} />
    <Handle type="target" position={Position.Top} isConnectable={false} />
  </>
);

export function NodeButton({ data }: NodeProps<AppNode>) {
  const { nodeId, label, kind, color, selected, clusterId, onSelect, onHover } = data;
  const common = {
    type: 'button' as const,
    'data-node-btn': nodeId,
    'aria-pressed': selected,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => onSelect(nodeId, e.currentTarget, e.detail === 0),
    onMouseEnter: () => onHover(nodeId),
    onMouseLeave: () => onHover(null),
    onFocus: () => onHover(nodeId),
    onBlur: () => onHover(null),
  };

  if (kind === 'core') {
    return (
      <>
        <Handles />
        <button
          {...common}
          aria-label={`${label}, profile overview`}
          className="nopan nodrag grid h-28 w-28 place-items-center rounded-full border-2 border-ai bg-gradient-to-br from-ai/40 to-infra/30 text-center text-sm font-bold text-fg shadow-[0_0_40px_-6px_rgba(167,139,250,0.7)] hover:border-infra"
        >
          <span>
            Arulmurugan
            <br />S
          </span>
        </button>
      </>
    );
  }

  if (kind === 'cluster') {
    const Icon = icons[clusterId ?? 'ai'];
    return (
      <>
        <Handles />
        <button
          {...common}
          className="nopan nodrag flex h-[124px] w-[124px] flex-col items-center justify-center gap-1 rounded-full border-2 bg-surface px-2 text-center text-sm font-semibold leading-tight text-fg hover:bg-surface-2"
          style={{
            borderColor: color,
            boxShadow: selected ? `0 0 0 4px ${color}55, 0 0 30px -4px ${color}` : undefined,
            background: selected ? `${color}26` : undefined,
          }}
        >
          <Icon size={20} aria-hidden="true" style={{ color }} />
          <span>{label}</span>
        </button>
      </>
    );
  }

  return (
    <>
      <Handles />
      <button
        {...common}
        className={`nopan nodrag whitespace-nowrap rounded-full border px-3 py-1.5 text-left text-sm font-medium leading-tight transition-colors ${
          selected ? 'text-bg' : 'bg-surface text-fg hover:bg-surface-2'
        }`}
        style={{ borderColor: color, background: selected ? color : undefined }}
      >
        {label}
      </button>
    </>
  );
}

export function OrbitNode({ data }: NodeProps<Node<{ ring: 1 | 2 }, 'orbit'>>) {
  return <div aria-hidden="true" className={`orbit ${data.ring === 1 ? 'orbit-1' : 'orbit-2'}`} />;
}

export const nodeTypes = { item: NodeButton, orbit: OrbitNode };
