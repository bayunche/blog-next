#!/bin/bash

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

if ! command -v docker &> /dev/null; then
  echo -e "${RED}错误: 未找到 docker 命令。请先安装 Docker。${NC}"
  exit 1
fi

if docker compose version &> /dev/null; then
  DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
  DOCKER_COMPOSE="docker-compose"
else
  echo -e "${RED}错误: 未找到 docker compose / docker-compose。${NC}"
  exit 1
fi

if [ ! -f .env.prod ]; then
  if [ -f .env.prod.template ]; then
    cp .env.prod.template .env.prod
    echo -e "${YELLOW}提示: 已生成 .env.prod，请先填写真实生产凭据后重试。${NC}"
    echo -e "${CYAN}编辑命令: nano .env.prod${NC}"
  else
    echo -e "${RED}错误: 未找到 .env.prod 与 .env.prod.template。${NC}"
  fi
  exit 1
fi

echo -e "${CYAN}使用 .env.prod + docker-compose.prod.yml 启动生产部署...${NC}"
$DOCKER_COMPOSE --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build

echo -e "${GREEN}✅ 生产部署已启动${NC}"
$DOCKER_COMPOSE --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml ps
