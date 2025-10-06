#!/bin/bash
# MySQL 自动备份脚本

set -e

# 配置
BACKUP_DIR="/backups"
MYSQL_USER="${MYSQL_USER:-react_blog}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-change_me}"
MYSQL_DATABASE="${MYSQL_DATABASE:-react_blog}"
KEEP_DAYS=30  # 保留最近30天的备份

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 生成备份文件名（带时间戳）
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

# 执行备份
echo "$(date '+%Y-%m-%d %H:%M:%S') - 开始备份数据库: $MYSQL_DATABASE"
mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --hex-blob \
    --opt \
    "$MYSQL_DATABASE" > "$BACKUP_FILE"

# 压缩备份文件
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

echo "$(date '+%Y-%m-%d %H:%M:%S') - 备份完成: $BACKUP_FILE"
echo "$(date '+%Y-%m-%d %H:%M:%S') - 文件大小: $(du -h "$BACKUP_FILE" | cut -f1)"

# 删除旧备份（保留最近 KEEP_DAYS 天）
echo "$(date '+%Y-%m-%d %H:%M:%S') - 清理旧备份（保留最近 ${KEEP_DAYS} 天）"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$KEEP_DAYS -delete

# 列出当前所有备份
echo "$(date '+%Y-%m-%d %H:%M:%S') - 当前备份列表:"
ls -lh "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null || echo "暂无备份文件"

echo "$(date '+%Y-%m-%d %H:%M:%S') - 备份任务完成"
