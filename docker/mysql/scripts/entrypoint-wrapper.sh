#!/bin/bash
# MySQL 容器 entrypoint 包装器
# 启动 cron 服务并执行原始 MySQL entrypoint

set -e

echo "=========================================="
echo "MySQL 容器启动中..."
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 修复 init 脚本的 Windows 换行符（如果存在）
if [ -d /docker-entrypoint-initdb.d ]; then
    echo "修复初始化脚本换行符..."
    find /docker-entrypoint-initdb.d -type f -name "*.sh" -exec sed -i 's/\r$//' {} \; 2>/dev/null || true
fi

# 启动 cron 服务（后台运行）
echo "启动 cron 服务..."
crond
echo "✓ Cron 服务已启动"

# 显示 crontab 配置
echo "当前定时任务配置:"
cat /etc/cron.d/mysql-backup

# 执行原始的 MySQL entrypoint
echo "启动 MySQL 服务..."
exec docker-entrypoint.sh "$@"
