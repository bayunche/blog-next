#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: 未找到 docker 命令。请先安装 Docker。${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    # 尝试使用 docker compose (v2)
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    else
        echo -e "${RED}错误: 未找到 docker-compose 或 docker compose。${NC}"
        exit 1
    fi
else
    DOCKER_COMPOSE="docker-compose"
fi

# 检查 .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}提示: 未找到 .env 文件，正在从 .env.docker 创建...${NC}"
    cp .env.docker .env
    echo -e "${CYAN}请记得修改 .env 中的默认密码和密钥！${NC}"
fi

show_menu() {
    clear
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}    Sakurairo Blog Docker 管理脚本${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo "1. 🚀 构建并启动 (Build & Run)"
    echo "2. 🛑 停止服务 (Stop)"
    echo "3. 🔄 重启服务 (Restart)"
    echo "4. 📋 查看日志 (Logs)"
    echo "5. 🧹 清理并重构 (Clean Build)"
    echo "q. ❌ 退出 (Quit)"
    echo -e "${CYAN}==========================================${NC}"
}

while true; do
    show_menu
    read -p "请选择操作 [1-5, q]: " choice

    case $choice in
        1)
            echo -e "\n${CYAN}📦 正在检查依赖...${NC}"
            if [ ! -d "node_modules" ]; then
                echo -e "${YELLOW}Installing dependencies...${NC}"
                npm install
            fi

            echo -e "\n${CYAN}🔨 正在本地构建 Next.js 应用...${NC}"
            export NODE_ENV=production
            npm run build
            if [ $? -ne 0 ]; then
                echo -e "${RED}构建失败！${NC}"
                read -p "按回车键继续..."
                continue
            fi

            echo -e "\n${GREEN}🚀 正在构建并启动 Docker 服务...${NC}"
            $DOCKER_COMPOSE up -d --build
            echo -e "\n${GREEN}✅ 服务已启动！${NC}"
            read -p "按回车键继续..."
            ;;
        2)
            echo -e "\n${YELLOW}🛑 正在停止服务...${NC}"
            $DOCKER_COMPOSE down
            read -p "按回车键继续..."
            ;;
        3)
            echo -e "\n${CYAN}🔄 正在重启...${NC}"
            $DOCKER_COMPOSE restart
            read -p "按回车键继续..."
            ;;
        4)
            echo -e "\n${CYAN}📋 正在打开日志 (Ctrl+C 退出)...${NC}"
            $DOCKER_COMPOSE logs -f
            ;;
        5)
            echo -e "\n${YELLOW}🧹 正在清理并重新构建...${NC}"
            $DOCKER_COMPOSE down
            $DOCKER_COMPOSE up -d --build --force-recreate
            read -p "按回车键继续..."
            ;;
        q)
            exit 0
            ;;
        *)
            echo -e "${RED}无效选择，请重试。${NC}"
            sleep 1
            ;;
    esac
done
