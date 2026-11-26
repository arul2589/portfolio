# Master plan and honest status

Spec: Interactive-Network-Topology-Portfolio.md v1.0. Status values: **Done** (executed and passing here), **Partial**, **Not done**. Nothing is marked done unless it was actually run in this environment.

| Phase | Scope | Status | Evidence / gap |
| --- | --- | --- | --- |
| P0 | Scaffold, tooling, docs skeleton | Done | `npm run typecheck`, `lint`, `build` pass |
| P1 | Typed data model + curated content | Done | 17 Vitest data tests pass |
| P2 | App shell, routes, a11y basics | Done | route tests, skip link, focus on route change |
| P3 | Topology: force-directed knowledge graph (touch any node to expand/fold its connections, drag nodes, filters, controls, detail panel, deep links, list view) | Done | Playwright topology tests pass |
| P4 | Content pages (projects, experience, stack, infrastructure, contact) | Done | direct-load, 404, overflow tests pass |
| P5 | Accessibility | Partial | axe WCAG 2.x A/AA clean on 9 views at desktop width. No manual screen-reader or keyboard-only audit; axe cannot prove WCAG conformance |
| P6 | Security headers / CSP | Done | tests run against the real headers from `deploy/nginx.conf`; zero CSP console errors |
| P7 | Container + compose | Done | built and running on the VPS, health check passes |
| P8 | CI | Partial | workflow written; never executed on GitHub |
| P9 | Deploy to VPS, real-browser/device QA, Lighthouse | Partial | deployed to https://charu.tech and loads over HTTPS (deep link checked). Lighthouse and device QA not done |

## Open decisions

- CloudArchitect Crew is published (owner-supplied description, invite-only).
- ReviewLens has no repo link: SG-Offline-RAG is not in the public GitHub repo list (private or renamed). The Tamil Nadu schemes project links to RAG-Buildathon (matched by its README; confirm). Knowledge Graph RAG, Multi-agent and n8n have no repo URL yet.
- Whether to name the IBM project/customers (currently omitted).
- Email and phone are published on /contact only, at the owner's request (spec default was LinkedIn + GitHub only).
- Custom 404 and OG image are basic; replace `public/og.png` with a designed one if wanted.
