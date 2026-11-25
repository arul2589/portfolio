#!/usr/bin/env bash
# Run on the VPS from the project directory: bash deploy/deploy.sh
# Detects Traefik settings, refuses to clash with an existing charu.tech router, builds and starts
# the container, then verifies. It never stops or removes any other container.
set -euo pipefail
HOST="${PORTFOLIO_HOST:-charu.tech}"

command -v docker >/dev/null || { echo "docker not found"; exit 1; }
docker compose version >/dev/null || { echo "docker compose plugin not found"; exit 1; }

TRAEFIK=$(docker ps --format '{{.Names}} {{.Image}}' | awk '$2 ~ /traefik/ {print $1; exit}')
[ -n "$TRAEFIK" ] || { echo "No running Traefik container found. Stop here and check your setup."; exit 1; }
echo "Traefik container: $TRAEFIK"

NETWORK=$(docker inspect "$TRAEFIK" --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' | awk '{print $1}')
ARGS=$(docker inspect "$TRAEFIK" --format '{{join .Args " "}}')
ENTRY=$(echo "$ARGS" | grep -o 'entrypoints\.[A-Za-z0-9_-]*\.address=:443' | head -1 | cut -d. -f2 || true)
RESOLVER=$(echo "$ARGS" | grep -o 'certificatesresolvers\.[A-Za-z0-9_-]*' | head -1 | cut -d. -f2 || true)
echo "Detected: network=$NETWORK entrypoint=${ENTRY:-?} certresolver=${RESOLVER:-?}"
[ -n "$ENTRY" ] && [ -n "$RESOLVER" ] || { echo "Could not detect entrypoint/resolver (config may be in a file). Edit .env by hand, then run: docker compose up -d --build"; \
  printf 'PORTFOLIO_HOST=%s\nTRAEFIK_NETWORK=%s\nTRAEFIK_ENTRYPOINT=%s\nTRAEFIK_CERTRESOLVER=%s\n' "$HOST" "$NETWORK" "${ENTRY:-websecure}" "${RESOLVER:-letsencrypt}" > .env; exit 1; }

# Refuse if another container already routes this host.
CLASH=$(docker ps -q | xargs -r docker inspect --format '{{.Name}} {{range $k,$v := .Config.Labels}}{{$k}}={{$v}} {{end}}' \
  | grep -F "Host(\`$HOST\`)" | grep -v '/topology-portfolio ' | awk '{print $1}' || true)
if [ -n "$CLASH" ]; then
  echo "Another container already routes $HOST: $CLASH"
  echo "Not deploying. Decide whether to replace it (docker compose -f <its compose> down) and re-run."
  exit 1
fi

printf 'PORTFOLIO_HOST=%s\nTRAEFIK_NETWORK=%s\nTRAEFIK_ENTRYPOINT=%s\nTRAEFIK_CERTRESOLVER=%s\n' "$HOST" "$NETWORK" "$ENTRY" "$RESOLVER" > .env
echo "Wrote .env"

docker compose build
docker compose up -d

echo "Waiting for health..."
for i in $(seq 1 30); do
  s=$(docker inspect topology-portfolio --format '{{.State.Health.Status}}' 2>/dev/null || echo starting)
  [ "$s" = healthy ] && break; sleep 2
done
echo "container health: $s"
sleep 8   # let Traefik request the certificate
curl -sI "https://$HOST/" | grep -iE '^HTTP|content-security-policy|x-frame' || echo "HTTPS check failed (DNS or certificate may still be pending)"
curl -s -o /dev/null -w "/projects/graph-rag (SPA fallback): %{http_code}\n" "https://$HOST/projects/graph-rag" || true
echo "Rollback: docker compose down   (touches only this project)"
