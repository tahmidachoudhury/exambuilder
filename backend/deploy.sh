#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] Using compose file docker-compose.yml"  # or docker-compose.prod.yml

echo "[deploy] Pulling latest backend image..."
docker-compose pull exam-builder

echo "[deploy] Restarting backend container..."
docker-compose up -d exam-builder

echo "[deploy] Cleaning up old images..."
docker image prune -f

echo "[deploy] Done."
