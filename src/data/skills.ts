import type { Skill } from '../types';

const s = (
  id: string,
  label: string,
  group: Skill['group'],
  cluster: Skill['cluster'],
  evidence: Skill['evidence'],
  summary: string,
  inGraph = true,
): Skill => ({ id, label, group, cluster, evidence, summary, inGraph });

export const skills: Skill[] = [
  // GenAI and Agentic AI
  s('llm-apps', 'LLM apps & prompting', 'GenAI and Agentic AI', 'ai', 'project', 'LLM applications and prompt engineering, built in hands-on projects.'),
  s('rag', 'RAG', 'GenAI and Agentic AI', 'ai', 'project', 'Retrieval-augmented generation over documents and policies.'),
  s('graphrag', 'GraphRAG', 'GenAI and Agentic AI', 'ai', 'project', 'Retrieval that combines vector search with a Neo4j knowledge graph.'),
  s('faiss', 'FAISS', 'GenAI and Agentic AI', 'ai', 'project', 'Vector similarity search for retrieval.'),
  s('bm25-rrf', 'BM25 + RRF', 'GenAI and Agentic AI', 'ai', 'project', 'Keyword search fused with vector search using Reciprocal Rank Fusion.'),
  s('neo4j', 'Neo4j', 'GenAI and Agentic AI', 'ai', 'project', 'Knowledge graphs for retrieval, using Neo4j Aura.'),
  s('embeddings', 'Embeddings', 'GenAI and Agentic AI', 'ai', 'project', 'Text embeddings for vector indexes.', false),
  s('langchain', 'LangChain', 'GenAI and Agentic AI', 'ai', 'project', 'Chains, retrieval and graph transformers.'),
  s('crewai', 'CrewAI', 'GenAI and Agentic AI', 'ai', 'project', 'Sequential multi-agent workflows.'),
  s('autogen', 'AutoGen', 'GenAI and Agentic AI', 'ai', 'project', 'Manager-routed multi-agent conversations.'),
  s('mcp', 'MCP', 'GenAI and Agentic AI', 'ai', 'project', 'Model Context Protocol tools, including read-only ticket tools.'),
  s('tool-calling', 'Tool calling', 'GenAI and Agentic AI', 'ai', 'project', 'AI agents that call tools with structured inputs.', false),
  s('n8n', 'n8n', 'GenAI and Agentic AI', 'ai', 'project', 'Workflow automation with LLM steps.'),
  s('guardrails', 'Guardrails', 'GenAI and Agentic AI', 'ai', 'project', 'Citation checks, safety templates, escalation rules and confirmation steps.'),

  // Programming and APIs
  s('python', 'Python', 'Programming and APIs', 'infra', 'project', 'Primary language for AI and automation projects.'),
  s('fastapi', 'FastAPI', 'Programming and APIs', 'infra', 'project', 'Python web APIs.'),
  s('rest-json', 'REST / JSON', 'Programming and APIs', 'infra', 'project', 'API design and JSON data exchange.', false),
  s('streamlit', 'Streamlit', 'Programming and APIs', 'infra', 'project', 'Interactive front ends for AI applications.'),
  s('pydantic', 'Pydantic', 'Programming and APIs', 'infra', 'project', 'Data validation for structured outputs.', false),
  s('playwright', 'Playwright', 'Programming and APIs', 'infra', 'project', 'Browser automation, used for scraping government pages.'),
  s('git', 'Git / GitHub', 'Programming and APIs', 'infra', 'project', 'Version control and code hosting.', false),

  // Infrastructure and Cloud
  s('terraform', 'Terraform', 'Infrastructure and Cloud', 'infra', 'enterprise', 'Infrastructure as code for cloud-integrated DDI deployments.'),
  s('ansible', 'Ansible', 'Infrastructure and Cloud', 'infra', 'enterprise', 'Configuration automation for cloud-integrated DDI deployments.'),
  s('jenkins', 'Jenkins CI/CD', 'Infrastructure and Cloud', 'infra', 'enterprise', 'CI/CD pipelines for infrastructure-as-code initiatives.'),
  s('docker', 'Docker', 'Infrastructure and Cloud', 'infra', 'project', 'Containerized applications and Docker Compose packaging.'),
  s('traefik', 'Traefik', 'Infrastructure and Cloud', 'infra', 'project', 'Reverse proxy with HTTPS for self-hosted applications.'),
  s('vps', 'VPS deployment', 'Infrastructure and Cloud', 'infra', 'project', 'Deploying and running applications on a VPS.'),
  s('aws', 'AWS', 'Infrastructure and Cloud', 'infra', 'enterprise', 'EC2, VPC and Route 53 in cloud-integrated DDI deployments.'),
  s('kubernetes', 'Kubernetes', 'Infrastructure and Cloud', 'infra', 'lab', 'Hands-on labs only.'),

  // Networking and DDI
  s('infoblox', 'Infoblox NIOS / Grid', 'Networking and DDI', 'net', 'enterprise', 'Grid administration, HA pairs and upgrades.'),
  s('dns', 'DNS', 'Networking and DDI', 'net', 'enterprise', 'Authoritative and recursive DNS, views and records.'),
  s('dhcp', 'DHCP', 'Networking and DDI', 'net', 'enterprise', 'Scopes, failover and relay.'),
  s('ipam', 'IPAM', 'Networking and DDI', 'net', 'enterprise', 'IP address management and subnet redesign.'),
  s('migration', 'DNS/DHCP migration', 'Networking and DDI', 'net', 'enterprise', 'Migration and cutover planning, rollback and post-cutover validation.'),
  s('vlsm', 'TCP/IP & VLSM', 'Networking and DDI', 'net', 'enterprise', 'Subnet design with VLSM.'),
  s('routing-switching', 'Routing & switching', 'Networking and DDI', 'net', 'enterprise', 'Switching and routing support in data center network operations.'),
  s('firewall-wan-dmz', 'Firewall, WAN, DMZ', 'Networking and DDI', 'net', 'enterprise', 'Firewall, WAN link and DMZ segment support.'),
  s('noc', '24/7 NOC', 'Networking and DDI', 'net', 'enterprise', '24/7 NOC operations.'),
];

export const skillGroups: Skill['group'][] = [
  'GenAI and Agentic AI',
  'Programming and APIs',
  'Infrastructure and Cloud',
  'Networking and DDI',
];

export const evidenceLabel: Record<Skill['evidence'], string> = {
  enterprise: 'Enterprise experience',
  project: 'Project experience',
  lab: 'Hands-on labs',
};
