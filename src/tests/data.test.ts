import { describe, expect, it } from 'vitest';
import { allProjects, projects } from '../data/projects';
import { skills } from '../data/skills';
import { experience } from '../data/experience';
import { topology } from '../data/topology';
import { profile } from '../data/profile';

const unique = (a: string[]) => new Set(a).size === a.length;

describe('content data', () => {
  it('node, edge, project and skill ids are unique', () => {
    expect(unique(topology.nodes.map((n) => n.id))).toBe(true);
    expect(unique(topology.edges.map((e) => e.id))).toBe(true);
    expect(unique(allProjects.map((p) => p.id))).toBe(true);
    expect(unique(skills.map((s) => s.id))).toBe(true);
  });

  it('every edge endpoint exists', () => {
    const ids = new Set(topology.nodes.map((n) => n.id));
    for (const e of topology.edges) {
      expect(ids.has(e.source), e.id).toBe(true);
      expect(ids.has(e.target), e.id).toBe(true);
    }
  });

  it('every project references existing skills', () => {
    const ids = new Set(skills.map((s) => s.id));
    for (const p of allProjects) {
      for (const s of [...p.skillIds, ...(p.demonstrates ?? []), ...(p.hostedOn ?? [])]) {
        expect(ids.has(s), `${p.id} -> ${s}`).toBe(true);
      }
    }
  });

  it('all URLs are https', () => {
    const urls = [
      profile.github,
      profile.linkedin,
      profile.siteUrl,
      ...allProjects.flatMap((p) => [p.demoUrl, p.repoUrl].filter(Boolean) as string[]),
    ];
    for (const u of urls) expect(u.startsWith('https://'), u).toBe(true);
  });

  it('unverified projects stay out of the public catalog', () => {
    expect(projects.every((p) => p.verifiedForPublication)).toBe(true);
    expect(allProjects.length).toBeGreaterThanOrEqual(projects.length);
  });

  it('projects without documented evidence expose no stack or demo claims', () => {
    const kids = projects.find((p) => p.id === 'juju-kids-academy')!;
    expect(kids.releaseStatus).toBe('preview');
    expect(kids.stack).toEqual([]);
    const support = projects.find((p) => p.id === 'ai-customer-support')!;
    expect(support.demoUrl).toBeUndefined();
  });

  it('matches the resume chronology exactly', () => {
    expect(experience.map((e) => [e.period, e.title])).toEqual([
      ['Nov 2024 – Present', 'Senior Specialist'],
      ['Feb 2024 – Oct 2024', 'Specialist, Network Design Engineering'],
      ['Jul 2023 – Jan 2024', 'Tech Specialist, Client Network Delivery'],
      ['Jan 2016 – Jun 2023', 'Sr. Associate, Work Center Tech (Infoblox DDI)'],
      ['Aug 2011 – Dec 2015', 'Network Analyst (Data Center Network Operations)'],
      ['24 Mar 2010 – 31 Jul 2011', 'Network Support Engineer'],
    ]);
  });

  it('publishes only the owner-approved email and phone, and only through profile', () => {
    const blob = JSON.stringify({ allProjects, experience, skills, topology });
    expect(blob).not.toMatch(/\+?91[\s-]?\d{5}/);
    expect(blob).not.toMatch(/[\w.-]+@[\w-]+\.[a-z]{2,}/i);
    expect(profile.email).toBe('arulmurugan@live.in');
    expect(profile.phoneHref).toBe('tel:+918124681717');
  });

  it('has no invented skill percentages', () => {
    expect(JSON.stringify(skills)).not.toMatch(/\d+\s?%/);
  });
});
