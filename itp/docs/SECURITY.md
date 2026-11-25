# Security

- Email and phone are published on /contact at the owner's request; expect scraper spam. Remove `email`/`phone` from `src/data/profile.ts` and the Contact cards to revert.
- Static site only: no server code, database, cookies, forms or third-party scripts/fonts/analytics.
- CSP (in `deploy/nginx.conf`): `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`, plus nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy.
- Note: nginx drops server-level `add_header` inside a `location` that defines its own, so locations use `expires` only.
- Container: unprivileged nginx, non-root, read-only filesystem, `cap_drop: ALL`, `no-new-privileges`, no Docker socket, no published ports (Traefik routes to 8080 over its network).
- Deep links (`?node=`) are looked up against a fixed ID list and never rendered as HTML; unknown values show a notice.
- External links use `rel="noopener noreferrer"`.
- Public demos linked from this site (e.g. app.jujutech.tech) are separate apps. Several call paid LLM APIs; put auth and rate limits on them before promoting the portfolio.
- HSTS is expected from Traefik/edge config; confirm it is enabled.
