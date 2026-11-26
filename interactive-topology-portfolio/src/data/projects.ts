import type { Project, ReleaseStatus } from '../types';

export const releaseLabel: Record<ReleaseStatus, string> = {
  preview: 'Preview',
  demo: 'Live demo',
  private: 'No public demo',
  'in-development': 'In development',
  archived: 'Archived',
};

/**
 * Curated project data. Rules:
 *  - Only fields supported by the resume or owner-supplied text are filled in.
 *  - Demo/repo URLs are added only when provided; never guessed.
 *  - verifiedForPublication=false keeps an entry out of the public site.
 */
export const allProjects: Project[] = [
  {
    id: 'ai-customer-support',
    short: 'AI Customer Support',
    title: 'JUJU Tech AI Customer Support Platform',
    summary:
      'A four-stage agent pipeline classifies category, urgency and sentiment, retrieves approved policies, generates citation-checked resolutions and applies deterministic escalation rules.',
    category: 'Multi-agent AI / support automation',
    group: 'AI agents',
    stack: ['Python', 'LangChain', 'OpenAI', 'Streamlit'],
    skillIds: ['python', 'langchain', 'streamlit', 'rag', 'llm-apps'],
    demonstrates: ['guardrails'],
    releaseStatus: 'private',
    repoUrl: 'https://github.com/arul2589/AI_Customer_Support_Buildathon',
    evidence: ['Source code on GitHub'],
    guardrails: [
      'Sensitive or complex cases go to human review.',
      'Idempotent ticket logging keeps every response traceable to approved policy.',
    ],
    workflow: [
      'Classify the query: category, urgency and sentiment.',
      'Retrieve approved policies from markdown documents.',
      'Resolve with citation checks and safety templates.',
      'Escalate with deterministic rules.',
    ],
    verifiedForPublication: true,
  },
  {
    id: 'graph-rag',
    short: 'Knowledge Graph RAG',
    title: 'Knowledge Graph RAG Assistant',
    summary:
      'A PDF question-answering application that combines FAISS vector retrieval with a Neo4j knowledge graph. Uploaded PDFs are indexed on the fly, and answers show the supporting passages and graph facts.',
    category: 'GraphRAG / knowledge retrieval',
    group: 'GraphRAG',
    stack: ['Neo4j Aura', 'FAISS', 'LangChain', 'OpenAI', 'Streamlit', 'Docker', 'Traefik'],
    skillIds: ['neo4j', 'faiss', 'langchain', 'streamlit', 'docker', 'graphrag', 'rag', 'llm-apps'],
    hostedOn: ['vps', 'traefik'],
    releaseStatus: 'demo',
    reachability: 'unknown',
    demoUrl: 'https://app.jujutech.tech',
    evidence: ['Live demo'],
    deployment: 'Containerized with Docker and deployed on a VPS with HTTPS through Traefik.',
    verifiedForPublication: true,
  },
  {
    id: 'agricultural-graphrag',
    short: 'Agri-schemes GraphRAG',
    title: 'Tamil Nadu Agricultural Schemes GraphRAG Chatbot',
    summary:
      'Models departments, schemes and beneficiaries using data collected from 32+ government scheme pages. Combines vector indexing and graph traversal for conceptual and exact queries, with safety guardrails.',
    category: 'Public information / GraphRAG',
    group: 'GraphRAG',
    stack: ['Playwright', 'Neo4j AuraDB', 'LangChain', 'OpenAI embeddings', 'Streamlit'],
    skillIds: ['playwright', 'neo4j', 'langchain', 'streamlit', 'graphrag', 'embeddings'],
    demonstrates: ['guardrails'],
    releaseStatus: 'private',
    repoUrl: 'https://github.com/arul2589/RAG-Buildathon',
    evidence: ['Described in resume'],
    workflow: [
      'Scrape live government scheme pages with Playwright.',
      'Model departments, schemes and beneficiaries in Neo4j with LangChain graph transformers.',
      'Answer with a vector index plus graph traversal.',
    ],
    verifiedForPublication: true,
  },
  {
    id: 'multi-agent-support',
    short: 'Multi-agent support',
    title: 'Multi-Agent Support Assistants',
    summary:
      'AutoGen: a manager routes IT, HR, Admin, Accounts and Complaints queries using structured routing and read-only MCP ticket tools, and ticket creation requires explicit confirmation. CrewAI: three sequential agents over FAISS + BM25 hybrid retrieval with Reciprocal Rank Fusion, packaged with Docker Compose and covered by unit tests.',
    category: 'Agent orchestration / MCP',
    group: 'AI agents',
    stack: ['AutoGen', 'CrewAI', 'MCP', 'FAISS', 'BM25', 'Docker', 'Streamlit'],
    skillIds: ['autogen', 'crewai', 'mcp', 'faiss', 'bm25-rrf', 'docker', 'streamlit', 'rag'],
    demonstrates: ['guardrails'],
    releaseStatus: 'private',
    evidence: ['Described in resume'],
    guardrails: [
      'Ticket tools are read-only.',
      'Tickets are created only after explicit user confirmation.',
    ],
    verifiedForPublication: true,
  },
  {
    id: 'n8n-automation',
    short: 'n8n workflows',
    title: 'n8n AI Automation Workflows',
    summary:
      'A LinkedIn content drafting, review and approval pipeline; a Gmail digest agent; Telegram multi-agent assistants; and a CSV/Excel normalization and routing workflow.',
    category: 'Workflow automation',
    group: 'Automation',
    stack: ['n8n', 'OpenAI', 'LangChain', 'Gmail', 'Google Sheets', 'Slack', 'Telegram', 'JavaScript'],
    skillIds: ['n8n', 'langchain', 'llm-apps'],
    releaseStatus: 'private',
    evidence: ['Described in resume'],
    workflow: [
      'ETL: uploaded CSV/Excel files are normalized by an LLM into strict JSON.',
      'JavaScript validates the JSON.',
      'Routed Excel files are exported.',
    ],
    verifiedForPublication: true,
  },
  {
    id: 'juju-kids-academy',
    short: 'JUJU Kids Academy',
    title: 'JUJU Kids Academy',
    summary:
      'An AI-powered technology learning platform for children aged 5–16, designed to teach technology, coding, robotics and artificial intelligence through age-adaptive, interactive daily lessons. This is a public preview.',
    category: 'Education / learning platform',
    group: 'Education',
    stack: [],
    skillIds: [],
    releaseStatus: 'preview',
    reachability: 'unknown',
    demoUrl: 'https://kids.jujutech.tech',
    evidence: ['Public preview'],
    limitations:
      'Preview only. It does not claim that lessons, sign-in or an AI tutor are publicly operational.',
    verifiedForPublication: true,
  },
  {
    id: 'reviewlens',
    short: 'ReviewLens',
    title: 'ReviewLens',
    summary:
      'Reads exported AWS security group rules and IAM policies as JSON, flags risks such as open SSH, exposed databases and wildcard permissions with a severity, and gives the corrected rule and the fix command.',
    category: 'Cloud security review',
    group: 'Cloud',
    stack: [],
    skillIds: [],
    demonstrates: ['aws'],
    releaseStatus: 'demo',
    reachability: 'unknown',
    demoUrl: 'https://reviewlens.charu.tech',
    evidence: ['Description supplied by the owner', 'Live demo'],
    verifiedForPublication: true,
  },
  {
    id: 'cloudarchitect',
    short: 'CloudArchitect',
    title: 'CloudArchitect Crew',
    summary:
      'A live, invite-only web app where AI agents turn a plain-English requirement into an AWS architecture report with live-priced options, a recommendation, a diagram and validated Terraform.',
    category: 'Cloud architecture / agents',
    group: 'Cloud',
    stack: [],
    skillIds: [],
    demonstrates: ['aws'],
    releaseStatus: 'demo',
    reachability: 'unknown',
    demoUrl: 'https://cloudarchitect.charu.tech',
    evidence: ['Description supplied by the owner', 'Live (invite-only)'],
    limitations: 'Invite-only: the live app needs an invitation to sign in.',
    verifiedForPublication: true,
  },
];

export const projects: Project[] = allProjects.filter((p) => p.verifiedForPublication);

export const projectGroups: ('All' | Project['group'])[] = [
  'All',
  'AI agents',
  'GraphRAG',
  'Cloud',
  'Automation',
  'Education',
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
