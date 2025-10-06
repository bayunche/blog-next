FROM mysql:8.0

# 安装必要工具（MySQL 8.0 官方镜像基于 Oracle Linux，使用 microdnf）
RUN microdnf install -y cronie gzip && \
    microdnf clean all

# 创建备份目录和日志目录
RUN mkdir -p /backups /scripts /var/log && \
    chmod 755 /backups /scripts

# 复制备份脚本和 cron 配置
COPY scripts/backup.sh /scripts/
COPY scripts/crontab /etc/cron.d/mysql-backup
COPY scripts/entrypoint-wrapper.sh /usr/local/bin/

# 设置脚本权限并修复 Windows 换行符
RUN chmod +x /scripts/backup.sh && \
    chmod +x /usr/local/bin/entrypoint-wrapper.sh && \
    chmod 0644 /etc/cron.d/mysql-backup && \
    touch /var/log/mysql-backup.log && \
    chmod 666 /var/log/mysql-backup.log && \
    # 移除 Windows 换行符 (CRLF -> LF)
    sed -i 's/\r$//' /scripts/backup.sh && \
    sed -i 's/\r$//' /usr/local/bin/entrypoint-wrapper.sh

# 使用自定义 entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint-wrapper.sh"]
CMD ["mysqld"]
