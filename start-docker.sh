#!/bin/bash

# Blog Next Docker 快速启动脚本
set -e

echo "========================================="
echo "  Blog Next Docker 部署脚本"
echo "========================================="

# 检查 Docker 和 Docker Compose
if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "错误: Docker Compose 未安装"
    exit 1
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "警告: .env 文件不存在，从 .env.example 复制..."
    cp .env.example .env
    echo ""
    echo "请编辑 .env 文件配置必要的环境变量："
    echo "  - MYSQL_ROOT_PASSWORD"
    echo "  - MYSQL_PASSWORD"
    echo "  - TOKEN_SECRET"
    echo "  - GITHUB_CLIENT_ID"
    echo "  - GITHUB_CLIENT_SECRET"
    echo "  - ADMIN_GITHUB_LOGIN_NAME"
    echo ""
    read -p "按 Enter 继续，或按 Ctrl+C 退出并编辑 .env 文件..."
fi

# 停止已运行的容器
echo ""
echo "停止已运行的容器..."
docker-compose down 2>/dev/null || true

# 构建镜像
echo ""
echo "构建 Docker 镜像..."
docker-compose build --no-cache

# 启动服务
echo ""
echo "启动服务..."
docker-compose up -d

# 等待服务启动
echo ""
echo "等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "检查服务状态..."
docker-compose ps

# 显示日志
echo ""
echo "========================================="
echo "  部署完成！"
echo "========================================="
echo ""
echo "服务访问地址："
echo "  - 前端应用: http://localhost"
echo "  - API 接口: http://localhost/api"
echo "  - MySQL: localhost:3306"
echo ""
echo "查看日志："
echo "  docker-compose logs -f"
echo ""
echo "停止服务："
echo "  docker-compose down"
echo ""

# 询问是否查看日志
read -p "是否查看实时日志? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi
