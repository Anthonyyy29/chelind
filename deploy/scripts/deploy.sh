#!/usr/bin/env bash
# Dijalankan DI SERVER lewat SSH oleh GitHub Actions (lihat
# .github/workflows/deploy.yml). Bisa juga dipanggil manual:
#   ssh deploy@vps 'bash /home/deploy/chelind/deploy/scripts/deploy.sh'
set -euo pipefail

cd /home/deploy/chelind

git fetch origin main
git reset --hard origin/main

# Migration, cache clear, dan refresh asset public/ semua sudah otomatis
# lewat docker/php/entrypoint.sh tiap container "app" start — tidak perlu
# diulang manual di sini.
docker compose -f docker-compose.prod.yml up -d --build
