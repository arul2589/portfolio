export type ReleaseStatus = 'preview' | 'demo' | 'private' | 'in-development' | 'archived';
export type Reachability = 'unknown' | 'reachable' | 'unreachable';
export type EvidenceLevel = 'enterprise' | 'project' | 'lab';
export type ClusterId = 'ai' | 'net' | 'infra' | 'work' | 'career' | 'contact';
export type ProjectGroup = 'AI agents' | 'GraphRAG' | 'Cloud' | 'Automation' | 'Education';
export type SkillGroup =
  | 'GenAI and Agentic AI'
  | 'Programming and APIs'
  | 'Infrastructure and Cloud'
  | 'Networking and DDI';

export interface Skill {
  id: string;
  label: string;
  group: SkillGroup;
  /** Graph cluster this skill hangs from. */
  cluster: 'ai' | 'net' | 'infra';
  evidence: EvidenceLevel;
  summary: string;
  /** Skills with inGraph=false are listed on /stack but not drawn as graph nodes. */
  inGraph: boolean;
}

export interface Project {
  id: string;
  title: string;
  /** Short label used on graph nodes. */
  short?: string;
  summary: string;
  category: string;
  group: ProjectGroup;
  stack: string[];
  /** Skills the project documents as part of its stack. */
  skillIds: string[];
  /** Skills the project demonstrates without it being a listed stack item. */
  demonstrates?: string[];
  /** Skills describing where the project is hosted (documented only). */
  hostedOn?: string[];
  releaseStatus: ReleaseStatus;
  reachability?: Reachability;
  lastCheckedAt?: string;
  demoUrl?: string;
  repoUrl?: string;
  evidence: string[];
  guardrails?: string[];
  workflow?: string[];
  deployment?: string;
  limitations?: string;
  verifiedForPublication: boolean;
}

export interface ExperienceEntry {
  id: string;
  period: string;
  title: string;
  short?: string;
  org: string;
  highlights: string[];
  note?: string;
}

export interface Certification {
  id: string;
  label: string;
  year?: string;
  status: 'active' | 'expired' | 'completed';
}

export type NodeKind = 'core' | 'cluster' | 'project' | 'skill' | 'experience' | 'contact';
export type Relation =
  | 'belongs_to'
  | 'uses'
  | 'demonstrates'
  | 'hosted_on'
  | 'career_stage'
  | 'contact_link';

export interface PortfolioNode {
  id: string;
  label: string;
  /** Full name shown in the detail panel when the node label is abbreviated. */
  title?: string;
  kind: NodeKind;
  summary: string;
  entityId?: string;
  cluster?: ClusterId;
  evidence?: EvidenceLevel;
  href?: string;
  external?: boolean;
}

export interface PortfolioEdge {
  id: string;
  source: string;
  target: string;
  relation: Relation;
}
