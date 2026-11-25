import type { ClusterId, PortfolioEdge, PortfolioNode } from '../types';
import { profile } from './profile';
import { skills } from './skills';
import { projects } from './projects';
import { experience } from './experience';

export const clusterMeta: Record<
  ClusterId,
  { label: string; summary: string; angle: number; filterLabel: string }
> = {
  ai: {
    label: 'GenAI & Agentic AI',
    summary: 'RAG, GraphRAG, multi-agent frameworks, MCP, n8n and guardrails, applied in hands-on projects.',
    angle: -120,
    filterLabel: 'AI',
  },
  work: {
    label: 'Projects',
    summary: 'AI agents, GraphRAG, workflow automation and cloud tools. Select a project to see the skills it documents.',
    angle: -60,
    filterLabel: 'Projects',
  },
  career: {
    label: 'Career backbone',
    summary: '16+ years from network support to Infoblox DDI and infrastructure automation.',
    angle: 0,
    filterLabel: 'Experience',
  },
  contact: {
    label: 'Public contact',
    summary: 'GitHub and LinkedIn.',
    angle: 60,
    filterLabel: 'Contact',
  },
  infra: {
    label: 'Infrastructure & automation',
    summary: 'Terraform, Ansible, Jenkins, Docker, Traefik, AWS and the Python tooling around them.',
    angle: 120,
    filterLabel: 'Infrastructure',
  },
  net: {
    label: 'Networking & DDI',
    summary: '10+ years of Infoblox DNS, DHCP and IPAM plus routing, switching, firewalls and NOC work.',
    angle: 180,
    filterLabel: 'Networking',
  },
};

export const clusterIds = Object.keys(clusterMeta) as ClusterId[];

export const relationLabel = {
  belongs_to: 'belongs to',
  uses: 'uses',
  demonstrates: 'demonstrates',
  hosted_on: 'hosted on',
  career_stage: 'career stage',
  contact_link: 'contact link',
} as const;

export function buildTopology(): { nodes: PortfolioNode[]; edges: PortfolioEdge[] } {
  const nodes: PortfolioNode[] = [];
  const edges: PortfolioEdge[] = [];
  const edge = (source: string, target: string, relation: PortfolioEdge['relation']) =>
    edges.push({ id: `${relation}:${source}>${target}`, source, target, relation });

  nodes.push({
    id: 'core',
    label: profile.name,
    kind: 'core',
    summary: profile.supporting,
  });

  for (const id of clusterIds) {
    nodes.push({
      id,
      label: clusterMeta[id].label,
      kind: 'cluster',
      summary: clusterMeta[id].summary,
      cluster: id,
    });
    edge(id, 'core', 'belongs_to');
  }

  const skillIds = new Set<string>();
  for (const sk of skills.filter((x) => x.inGraph)) {
    skillIds.add(sk.id);
    nodes.push({
      id: sk.id,
      label: sk.label,
      kind: 'skill',
      summary: sk.summary,
      entityId: sk.id,
      cluster: sk.cluster,
      evidence: sk.evidence,
      href: '/stack',
    });
    edge(sk.id, sk.cluster, 'belongs_to');
  }

  for (const p of projects) {
    nodes.push({
      id: p.id,
      label: p.short ?? p.title,
      title: p.title,
      kind: 'project',
      summary: p.summary,
      entityId: p.id,
      cluster: 'work',
      href: `/projects/${p.id}`,
    });
    edge(p.id, 'work', 'belongs_to');
    for (const s of p.skillIds) if (skillIds.has(s)) edge(p.id, s, 'uses');
    for (const s of p.demonstrates ?? []) if (skillIds.has(s)) edge(p.id, s, 'demonstrates');
    for (const s of p.hostedOn ?? []) if (skillIds.has(s)) edge(p.id, s, 'hosted_on');
  }

  for (const e of experience) {
    nodes.push({
      id: e.id,
      label: e.short ?? e.title,
      title: e.title,
      kind: 'experience',
      summary: `${e.period}. ${e.org}. ${e.highlights.join(' ')}`,
      entityId: e.id,
      cluster: 'career',
      href: '/experience',
    });
    edge(e.id, 'career', 'belongs_to');
  }
  // Chronological chain: earlier role -> later role (experience is stored newest first).
  for (let i = experience.length - 1; i > 0; i--) {
    edge(experience[i].id, experience[i - 1].id, 'career_stage');
  }

  nodes.push(
    {
      id: 'certifications',
      label: 'Certifications',
      kind: 'experience',
      summary: 'Infoblox CDAT (2020), CDIC (2018) and CDBC (2017), plus a Generative AI & Agentic AI program completed in 2026.',
      cluster: 'career',
      href: '/experience',
    },
    {
      id: 'education',
      label: 'Education',
      kind: 'experience',
      summary: 'B.Sc. Electronics, V.L.B. Janakiammal College of Arts & Science, Coimbatore (Bharathiar University).',
      cluster: 'career',
      href: '/experience',
    },
    {
      id: 'github',
      label: 'GitHub',
      kind: 'contact',
      summary: 'Source code for AI and automation projects.',
      cluster: 'contact',
      href: profile.github,
      external: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      kind: 'contact',
      summary: 'Professional profile.',
      cluster: 'contact',
      href: profile.linkedin,
      external: true,
    },
  );
  edge('certifications', 'career', 'belongs_to');
  edge('education', 'career', 'belongs_to');
  edge('github', 'contact', 'contact_link');
  edge('linkedin', 'contact', 'contact_link');

  return { nodes, edges };
}

export const topology = buildTopology();
