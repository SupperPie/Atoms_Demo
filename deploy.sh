#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# 一键部署 / 更新：拉取最新代码并重建镜像
git pull --ff-only
docker compose up -d --build
docker compose ps
