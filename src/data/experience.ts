import type { ExperienceEntry } from '../types';

const ATT = 'AT&T Communication Services India Pvt. Ltd.';

/** Chronology follows the updated resume, newest first. */
export const experience: ExperienceEntry[] = [
  {
    id: 'hcl',
    short: 'Senior Specialist, HCL',
    period: 'Nov 2024 – Present',
    title: 'Senior Specialist',
    org: 'HCL Technologies Ltd',
    highlights: [
      'Manage Infoblox DNS, DHCP and IPAM operations across Grid environments.',
      'Support cloud-integrated DDI deployments using AWS, Terraform, Ansible and Jenkins.',
      'Contribute to network migration planning, automation and infrastructure-as-code initiatives.',
    ],
    note: 'Joined through the AT&T–HCL business transfer with continuity of service.',
  },
  {
    id: 'att-2024',
    short: 'Specialist, Network Design',
    period: 'Feb 2024 – Oct 2024',
    title: 'Specialist, Network Design Engineering',
    org: ATT,
    highlights: [
      'DDI operations, tickets and changes.',
      'Subnet splitting and IPAM redesign.',
    ],
  },
  {
    id: 'att-2023',
    short: 'Tech Specialist, Delivery',
    period: 'Jul 2023 – Jan 2024',
    title: 'Tech Specialist, Client Network Delivery',
    org: ATT,
    highlights: ['DNS, DHCP and IPAM services and changes.'],
  },
  {
    id: 'att-2016',
    short: 'Sr. Associate, Infoblox DDI',
    period: 'Jan 2016 – Jun 2023',
    title: 'Sr. Associate, Work Center Tech (Infoblox DDI)',
    org: ATT,
    highlights: [
      'Grid upgrades and HA pairs.',
      'DNS and DHCP migrations with rollback and post-cutover validation.',
      'VLSM subnet design, DNS records and views, DHCP failover and relay.',
      'Advanced troubleshooting and NOC support.',
    ],
  },
  {
    id: 'att-2011',
    short: 'Network Analyst, DC Ops',
    period: 'Aug 2011 – Dec 2015',
    title: 'Network Analyst (Data Center Network Operations)',
    org: ATT,
    highlights: [
      'Switching, routing, firewalls, WAN and DMZ support.',
      'Physical support and location administration.',
      'Hands-on knowledge of the physical network devices in the data center and how they are cabled and connected.',
    ],
  },
  {
    id: 'kaizen',
    short: 'Network Support Engineer',
    period: '24 Mar 2010 – 31 Jul 2011',
    title: 'Network Support Engineer',
    org: 'Kaizen IT Services Pvt. Ltd.',
    highlights: [
      'DNS and DHCP configuration support, DNS records, IP tracking and remote network troubleshooting.',
    ],
    note: 'Converted to an AT&T permanent employee on 1 Aug 2011.',
  },
];

export const certifications = [
  { id: 'cdat', label: 'Infoblox Core DDI Advanced Troubleshooting (CDAT)', year: '2020', status: 'active' },
  { id: 'cdic', label: 'Infoblox Core DDI Intermediate Configuration (CDIC)', year: '2018', status: 'active' },
  { id: 'cdbc', label: 'Infoblox Core DDI Basic Configuration (CDBC)', year: '2017', status: 'active' },
  { id: 'genai', label: 'Generative AI & Agentic AI program (Python, RAG, LangChain, CrewAI, AutoGen, n8n, FastAPI, AI agents)', year: '2026', status: 'completed' },
  { id: 'ccna', label: 'Cisco CCNA and CCNA Security (earlier certifications)', status: 'expired' },
] as const;

export const education = {
  degree: 'B.Sc. Electronics',
  school: 'V.L.B. Janakiammal College of Arts & Science, Coimbatore (Bharathiar University)',
} as const;
