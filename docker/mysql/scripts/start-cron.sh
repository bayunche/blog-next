#!/bin/bash
# MySQL 容器启动时配置并启动 cron 服务

set -e

echo "$(date '+%Y-%m-%d %H:%M:%S') - 配置 cron 定时任务..."

# 检查 cron 是否已安装
if ! command -v crond &> /dev/null; then
    echo "安装 cron..."
    microdnf install -y cronie > /dev/null
fi

# 复制 crontab 配置
if [ -f /scripts/crontab ]; then
    crontab /scripts/crontab
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Crontab 配置成功"
    crontab -l
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - 警告: /scripts/crontab 文件不存在"
fi

# 启动 cron 服务
echo "$(date '+%Y-%m-%d %H:%M:%S') - 启动 cron 服务..."
crond

echo "$(date '+%Y-%m-%d %H:%M:%S') - Cron 服务已启动"
