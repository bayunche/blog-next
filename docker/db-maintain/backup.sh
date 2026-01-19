#!/bin/bash

# 配置
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="db_backup_${DATE}.sql"
MAX_BACKUPS=14 # 保留最近 14 个备份（约 7 天）

echo "[$(date)] 开始数据库备份..."

# 确保备份目录存在
mkdir -p $BACKUP_DIR

# 执行备份
mysqldump -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" > "$BACKUP_DIR/$FILENAME"

if [ $? -eq 0 ]; then
    echo "[$(date)] 备份成功: $FILENAME"
    
    # 清理旧备份
    ls -t $BACKUP_DIR/db_backup_*.sql | tail -n +$(($MAX_BACKUPS + 1)) | xargs -r rm --
else
    echo "[$(date)] 备份失败!"
fi
