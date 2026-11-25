# Master plan and honest status

Spec: Interactive-Network-Topology-Portfolio.md v1.0. Status values: **Done** (executed and passing here), **Partial**, **Not done**. Nothing is marked done unless it was actually run in this environment.

| Phase | Scope | Status | Evidence / gap |
| --- | --- | --- | --- |
| P0 | Scaffold, tooling, docs skeleton | Done | `npm run typecheck`, `lint`, `build` pass |
| P1 | Typed data model + curated content | Done | 17 Vitest data tests pass |
| P2 | App shell, routes, a11y basics | Done | route tests, skip link, focus on route change |
| P3 | Topology graph (clusters, expand, filters, controls, detail panel, deep links, list view) | Done | Playwright topology tests pass |
| P4 | Content pages (projects, experience, stack, infrastructure, contact) | Done | direct-load, 404, overflow tests pass |
| P5 | Accessibility | Partial | axe WCAG 2.x A/AA clean on 9 views at desktop width. No manual screen-reader or keyboard-only audit; axe cannot prove WCAG conformance |
| P6 | Security headers / CSP | Done | tests run against the real headers from `deploy/nginx.conf`; zero CSP console errors |
| P7 | Container + compose | Partial | Dockerfile/compose written and YAML-parsed. **Image never built, container never run** (no Docker daemon available) |
| P8 | CI | Partial | workflow written; never executed on GitHub |
| P9 | Deploy to VPS, real-browser/device QA, Lighthouse | Not done | needs owner approval and access; Lighthouse not run |

## Open decisions

- CloudArchitect Crew is published (owner-supplied description, invite-only).
- SG-Offline-RAG repo is linked on ReviewLens (assumption: confirm it belongs there). Knowledge Graph RAG still has no repo URL.
- Whether to name the IBM project/customers (currently omitted).
- Email and phone are published on /contact only, at the owner's request (spec default was LinkedIn + GitHub only).
- Custom 404 and OG image are basic; replace `public/og.png` with a designed one if wanted.
