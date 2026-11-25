# Interactive Network Topology Portfolio

Portfolio for **Arulmurugan S**, intended for **https://charu.tech**. It presents infrastructure, networking and GenAI work as an explorable network graph, with a normal list/case-study fallback.

React + Vite + TypeScript + Tailwind v4 + React Flow (`@xyflow/react`) + React Router. No backend, database, LLM/chatbot, analytics or tracking. All content is typed local data in `src/data/`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | install |
| `npm run dev` | dev server |
| `npm run typecheck` / `npm run lint` | static checks |
| `npm test` | Vitest unit/data tests |
| `npm run build` | typecheck + production build to `dist/` |
| `npm run preview` | serve `dist/` with the real CSP/security headers from `deploy/nginx.conf` |
| `npm run e2e` | Playwright: routes, topology, responsive overflow, axe, CSP/console errors |
| `npm run verify` | everything above |

If Playwright cannot find its browser, set `CHROME_PATH=/path/to/chrome`.

## Layout

- `src/data/` curated content (profile, skills, projects, experience, topology builder)
- `src/features/topology/` graph model, layout, nodes, detail panel, list view
- `src/pages/` routes: `/`, `/topology`, `/projects`, `/projects/:slug`, `/experience`, `/stack`, `/infrastructure`, `/contact`, `*`
- `deploy/nginx.conf` CSP + security headers, SPA fallback
- `Dockerfile`, `compose.yml`, `.env.example` deployment (see `docs/DEPLOYMENT.md`)

## Docs

`MASTER_PLAN.md` (honest phase tracker), `docs/SECURITY.md`, `docs/DEPLOYMENT.md`, `docs/CONTENT_VERIFICATION.md`.

## Editing content

Add a project in `src/data/projects.ts`. Set `verifiedForPublication: true` only after confirming every claim and URL (see CONTENT_VERIFICATION). Unverified entries are excluded from the site, graph and tests. Data tests fail on duplicate IDs, dangling edges, non-https URLs, percentages, phone/email.
