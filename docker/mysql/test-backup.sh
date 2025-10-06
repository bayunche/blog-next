#!/bin/bash
# MySQL 备份系统测试脚本

set -e

echo "=========================================="
echo "MySQL 备份系统测试"
echo "=========================================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_step() {
    echo -e "\n${YELLOW}[测试] $1${NC}"
}

test_pass() {
    echo -e "${GREEN}✓ $1${NC}"
}

test_fail() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# 1. 检查 Docker 服务
test_step "检查 Docker Compose 配置"
if docker-compose config > /dev/null 2>&1; then
    test_pass "Docker Compose 配置正确"
else
    test_fail "Docker Compose 配置错误"
fi

# 2. 启动 MySQL 服务
test_step "启动 MySQL 服务"
docker-compose up -d mysql
sleep 5

# 3. 等待 MySQL 就绪
test_step "等待 MySQL 服务就绪"
max_wait=60
waited=0
while ! docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
    if [ $waited -ge $max_wait ]; then
        test_fail "MySQL 启动超时"
    fi
    echo "等待中... ($waited 秒)"
    sleep 2
    waited=$((waited + 2))
done
test_pass "MySQL 服务已就绪"

# 4. 检查 Cron 服务
test_step "检查 Cron 服务状态"
if docker-compose exec -T mysql pgrep crond > /dev/null; then
    test_pass "Cron 服务正在运行"
else
    test_fail "Cron 服务未运行"
fi

# 5. 检查 Crontab 配置
test_step "检查 Crontab 配置"
if docker-compose exec -T mysql crontab -l | grep -q "backup.sh"; then
    test_pass "Crontab 配置正确"
    docker-compose exec -T mysql crontab -l
else
    test_fail "Crontab 配置缺失"
fi

# 6. 手动执行备份
test_step "执行手动备份测试"
docker-compose exec -T mysql /scripts/backup.sh
if [ $? -eq 0 ]; then
    test_pass "手动备份执行成功"
else
    test_fail "手动备份执行失败"
fi

# 7. 验证备份文件
test_step "验证备份文件"
backup_count=$(docker-compose exec -T mysql sh -c 'ls -1 /backups/backup_*.sql.gz 2>/dev/null | wc -l')
if [ "$backup_count" -gt 0 ]; then
    test_pass "找到 $backup_count 个备份文件"
    docker-compose exec -T mysql ls -lh /backups/
else
    test_fail "未找到备份文件"
fi

# 8. 检查备份文件完整性
test_step "检查备份文件完整性"
latest_backup=$(docker-compose exec -T mysql sh -c 'ls -t /backups/backup_*.sql.gz 2>/dev/null | head -1' | tr -d '\r')
if docker-compose exec -T mysql gunzip -t "$latest_backup" 2>/dev/null; then
    test_pass "备份文件完整性校验通过"
else
    test_fail "备份文件损坏"
fi

# 9. 检查数据库表
test_step "检查数据库表"
table_count=$(docker-compose exec -T mysql mysql -u react_blog -pchange_me react_blog -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$table_count" -gt 1 ]; then
    test_pass "数据库包含 $((table_count - 1)) 个表"
else
    test_fail "数据库为空"
fi

# 10. 测试数据恢复（可选）
echo -e "\n${YELLOW}是否要测试数据恢复流程？这将删除并重新创建数据库（y/N）${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    test_step "测试数据恢复流程"

    # 停止并删除容器和数据
    echo "停止服务并删除数据..."
    docker-compose down -v

    # 重新启动
    echo "重新启动服务..."
    docker-compose up -d mysql

    # 等待启动
    sleep 10
    max_wait=60
    waited=0
    while ! docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
        if [ $waited -ge $max_wait ]; then
            test_fail "MySQL 启动超时"
        fi
        echo "等待中... ($waited 秒)"
        sleep 2
        waited=$((waited + 2))
    done

    # 检查是否恢复了数据
    table_count=$(docker-compose exec -T mysql mysql -u react_blog -pchange_me react_blog -e "SHOW TABLES;" 2>/dev/null | wc -l)
    if [ "$table_count" -gt 1 ]; then
        test_pass "数据恢复成功，包含 $((table_count - 1)) 个表"
    else
        test_fail "数据恢复失败"
    fi
fi

# 完成
echo -e "\n=========================================="
echo -e "${GREEN}所有测试通过！✓${NC}"
echo "=========================================="
echo ""
echo "备份系统配置摘要："
echo "- 定时备份: 每天 02:00 和每周日 03:00"
echo "- 备份保留: 30 天"
echo "- 备份位置: ./docker/backups/"
echo "- 当前备份数: $backup_count"
echo ""
echo "查看备份日志: docker-compose exec mysql tail -f /var/log/mysql-backup.log"
echo "查看所有备份: docker-compose exec mysql ls -lh /backups/"
echo ""
