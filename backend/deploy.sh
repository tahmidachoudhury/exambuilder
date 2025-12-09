#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] Using compose file docker-compose.yml"  # or docker-compose.prod.yml

echo "[deploy] Pulling latest latest images..."
docker-compose pull

echo "[deploy] Starting all services..."
docker-compose up -d 

echo "[deploy] Cleaning up old images..."
docker image prune -f

echo "[deploy] Done."
