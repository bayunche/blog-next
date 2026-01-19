#!/bin/bash

echo "等待 MySQL 启动..."
# 等待 MySQL 可用
until mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1" &> /dev/null; do
    echo "MySQL 更新中..."
    sleep 3
done

echo "MySQL 已连接。"

# 检查数据库是否为空（通过检查是否存在关键表，例如 'users' 或 'Articles'）
# 注意：这里假设如果 'users' 表不存在，则数据库未初始化
TABLE_EXISTS=$(mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -sse "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$MYSQL_DATABASE' AND table_name = 'users';")

if [ "$TABLE_EXISTS" -eq 0 ]; then
    echo "检测到数据库为空或未完全初始化。"
    
    # 检查是否有备份文件
    LATEST_BACKUP=$(ls -t /backup/db_backup_*.sql 2>/dev/null | head -n 1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        echo "发现备份文件: $LATEST_BACKUP，正在自动恢复..."
        mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$LATEST_BACKUP"
        
        if [ $? -eq 0 ]; then
            echo "✅ 从备份恢复成功！"
        else
            echo "❌ 从备份恢复失败，将尝试使用默认初始化脚本。"
            RESTORE_FAILED=1
        fi
    else
        echo "未找到备份文件。"
    fi
    
    # 如果没有备份或恢复失败，且存在 init.sql，尝试执行 init.sql
    # 注意：通常 MySQL 容器会自动执行 /docker-entrypoint-initdb.d 下的脚本，
    # 但如果容器重启且数据卷已挂载但为空，MySQL 可能不会再次触发。
    # 这里我们手动通过 mysql client 执行作为双重保障。
    if [ -z "$LATEST_BACKUP" ] || [ -n "$RESTORE_FAILED" ]; then
        if [ -f "/docker-entrypoint-initdb.d/init.sql" ]; then
            echo "正在执行默认初始化脚本 init.sql..."
            mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < /docker-entrypoint-initdb.d/init.sql
            if [ $? -eq 0 ]; then
                echo "✅ 初始化脚本执行成功！"
            else
                echo "❌ 初始化脚本执行失败。"
            fi
        else
            echo "⚠️ 未找到 init.sql，跳过初始化。"
        fi
    fi
else
    echo "数据库已存在数据，跳过初始化。"
fi

# 设置定时任务 (每 12 小时执行一次)
echo "0 */12 * * * /scripts/backup.sh >> /var/log/db_backup.log 2>&1" > /etc/crontabs/root

echo "启动定时备份服务..."
# 以前台模式启动 crond
crond -f -d 8
