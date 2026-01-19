FROM alpine:3.18

# 安装 MySQL 客户端和必要的工具
RUN apk add --no-cache mysql-client bash tzdata

# 设置时区
ENV TZ=Asia/Shanghai

WORKDIR /scripts

# 复制脚本
COPY entrypoint.sh /scripts/entrypoint.sh
COPY backup.sh /scripts/backup.sh

# 设置权限
RUN chmod +x /scripts/entrypoint.sh /scripts/backup.sh

ENTRYPOINT ["/scripts/entrypoint.sh"]
