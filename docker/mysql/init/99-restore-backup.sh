#!/bin/bash
# 智能数据导入脚本
# 优先导入最新备份,如果没有备份则导入原始数据

set -e

echo "=========================================="
echo "开始执行智能数据导入..."
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 配置
BACKUP_DIR="/backups"
ORIGINAL_DATA="/docker-entrypoint-initdb.d/02-data-final.sql"
MYSQL_USER="${MYSQL_USER:-react_blog}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-change_me}"
MYSQL_DATABASE="${MYSQL_DATABASE:-react_blog}"

# 等待 MySQL 完全启动
echo "等待 MySQL 服务完全启动..."
sleep 10

# 检查是否已有数据（如果表已存在则跳过导入）
TABLE_COUNT=$(mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SHOW TABLES;" 2>/dev/null | wc -l)

if [ "$TABLE_COUNT" -gt 1 ]; then
    echo "数据库已包含 $((TABLE_COUNT - 1)) 个表，跳过数据导入"
    exit 0
fi

# 查找最新的备份文件
if [ -d "$BACKUP_DIR" ]; then
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | head -1)

    if [ -n "$LATEST_BACKUP" ]; then
        echo "找到最新备份: $LATEST_BACKUP"
        echo "备份文件大小: $(du -h "$LATEST_BACKUP" | cut -f1)"
        echo "备份时间: $(stat -c %y "$LATEST_BACKUP" 2>/dev/null || stat -f "%Sm" "$LATEST_BACKUP")"

        echo "开始导入最新备份..."
        gunzip -c "$LATEST_BACKUP" | mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"

        echo "✓ 最新备份导入成功！"
        exit 0
    else
        echo "备份目录为空，未找到备份文件"
    fi
else
    echo "备份目录不存在: $BACKUP_DIR"
fi

# 如果没有备份，导入原始数据
if [ -f "$ORIGINAL_DATA" ]; then
    echo "未找到备份，开始导入原始数据: $ORIGINAL_DATA"
    echo "文件大小: $(du -h "$ORIGINAL_DATA" | cut -f1)"

    mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$ORIGINAL_DATA"

    echo "✓ 原始数据导入成功！"
else
    echo "⚠ 警告: 未找到原始数据文件: $ORIGINAL_DATA"
    echo "数据库将保持为空"
fi

echo "=========================================="
echo "数据导入完成"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
