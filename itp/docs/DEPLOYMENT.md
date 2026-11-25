# Deployment (needs owner approval; nothing has been deployed)

Prereqs: existing Traefik v3 with a `websecure` entrypoint, Let's Encrypt resolver, DNS for `charu.tech` pointing at the VPS.

**Quick path:** copy the project to the VPS (e.g. `scp interactive-topology-portfolio.zip`, unzip), `cd itp`, then `bash deploy/deploy.sh`. It auto-detects Traefik settings and stops if another container already serves the domain. The manual steps follow.

1. Check names: `docker network ls` and your Traefik static config for the network, entrypoint and cert resolver; set them in `.env` (copy `.env.example`).
2. Make sure nothing else already routes `charu.tech`: the earlier v1 site used container/router name `portfolio`. Stop/remove it first **only if you want to replace it**; this compose uses `topology-portfolio`.
3. `docker compose build` then `docker compose up -d`.
4. Verify: `docker ps` shows healthy; `curl -I https://charu.tech` shows the CSP header; open `/topology`, refresh on `/projects/graph-rag` (SPA fallback), check `/healthz` internally.
5. Rollback: `docker compose down` (keeps other services untouched).

Not verified here: image build, container start, Traefik routing, certificate issuance.

## Deployed 2026-11-26

First deploy done on the Hostinger VPS (Traefik v3 in host network mode, entrypoint `websecure`, resolver `letsencrypt`). The image built and the container reached healthy. `compose.yml` originally joined the external Traefik network, which fails when that network is `host`; it now uses its own project network instead.
