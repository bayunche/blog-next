# Blog-Next Docker 部署文档

这是一个完整的 Docker 化博客项目，包含前端(React)、后端(Koa)和数据库(MySQL 8.0)。

## 快速开始

### 1. 环境准备

确保已安装：
- Docker (>= 20.10)
- Docker Compose (>= 2.0)

### 2. 配置环境变量

复制环境变量示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，修改以下关键配置：

```bash
# MySQL 配置
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=react_blog
MYSQL_USER=react_blog
MYSQL_PASSWORD=your_secure_password

# JWT Token 配置
TOKEN_SECRET=your_super_secret_token_at_least_32_characters_long

# GitHub OAuth 配置（可选）
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
ADMIN_GITHUB_LOGIN_NAME=your_github_username

# 邮件通知配置（可选）
EMAIL_NOTICE_ENABLE=false
EMAIL_NOTICE_USER=your_email@example.com
EMAIL_NOTICE_PASS=your_email_authorization_code
```

### 3. 启动服务

首次启动（会自动构建镜像并导入数据库）：
```bash
docker-compose up -d
```

查看日志：
```bash
docker-compose logs -f
```

停止服务：
```bash
docker-compose down
```

停止服务并删除数据卷（**警告：会删除所有数据**）：
```bash
docker-compose down -v
```

### 4. 访问应用

- 前端应用: http://localhost
- 后端 API: http://localhost/api
- MySQL: localhost:3306

## 服务说明

### Web 服务 (Nginx)
- 端口: 80, 443
- 功能: 托管前端静态文件，代理后端 API 请求
- 健康检查: 每30秒检查一次

### Server 服务 (Koa)
- 内部端口: 6060
- 功能: 提供 REST API，处理业务逻辑
- 依赖: MySQL 服务必须健康才能启动

### MySQL 服务
- 端口: 3306
- 版本: MySQL 8.0
- 数据持久化: 使用 Docker volume `mysql_data`
- 自动初始化: 首次启动时自动执行 `docker/mysql/init/` 目录下的 SQL 脚本

## 数据库初始化

数据库会在首次启动时自动初始化：

1. **01-init.sql**: 基础配置和字符集设置
2. **02-data.sql**: 完整的表结构和测试数据

如果需要重新初始化数据库：
```bash
# 停止并删除数据卷
docker-compose down -v

# 重新启动（会重新执行初始化脚本）
docker-compose up -d
```

## 故障排查

### 查看服务状态
```bash
docker-compose ps
```

### 查看特定服务日志
```bash
docker-compose logs -f web      # 前端日志
docker-compose logs -f server   # 后端日志
docker-compose logs -f mysql    # 数据库日志
```

### 进入容器调试
```bash
docker-compose exec web sh       # 进入 web 容器
docker-compose exec server sh    # 进入 server 容器
docker-compose exec mysql bash   # 进入 mysql 容器
```

### 检查数据库连接
```bash
docker-compose exec mysql mysql -u react_blog -p react_blog
# 输入密码后可以执行 SQL 查询
```

### 重新构建特定服务
```bash
docker-compose build --no-cache web
docker-compose build --no-cache server
```

## 网络架构

所有服务都运行在 `blog-network` 网络中：

```
Internet
    ↓
Web (Nginx:80/443)
    ↓
    ├─→ Static Files (/usr/share/nginx/html)
    ├─→ API Proxy (/api → server:6060)
    └─→ Server (Koa:6060)
           ↓
        MySQL (3306)
```

## 备份与恢复

### 自动备份系统

项目已配置完整的自动备份系统：

- ✅ **自动定时备份**: 每天凌晨 2:00 自动备份，每周日 3:00 额外备份
- ✅ **智能数据导入**: 容器启动时自动导入最新备份
- ✅ **备份保留策略**: 自动清理 30 天前的旧备份
- ✅ **压缩存储**: 备份文件 gzip 压缩

详细说明请查看：[MySQL 备份系统文档](./docker/mysql/README.md)

### 快速操作

**查看备份文件**：
```bash
docker-compose exec mysql ls -lh /backups/
```

**手动执行备份**：
```bash
docker-compose exec mysql /scripts/backup.sh
```

**查看备份日志**：
```bash
docker-compose exec mysql tail -f /var/log/mysql-backup.log
```

**手动恢复备份**：
```bash
# 恢复特定备份
gunzip -c ./docker/backups/backup_20241005_020000.sql.gz | docker-compose exec -T mysql mysql -u react_blog -p react_blog
```

**测试备份系统**：
```bash
# 运行自动化测试脚本
bash docker/mysql/test-backup.sh
```

## 生产环境建议

1. **修改默认密码**: 务必修改 `.env` 中的所有默认密码
2. **启用 HTTPS**: 在 `docker/nginx/certs/` 目录放置 SSL 证书
3. **限制端口暴露**: 生产环境建议不暴露 MySQL 3306 端口
4. **自动备份已启用**: 系统已配置每日自动备份，建议额外配置远程备份到 OSS/S3
5. **监控日志**: 使用日志聚合工具监控应用运行状态，包括备份日志
6. **资源限制**: 在 docker-compose.yml 中添加 CPU 和内存限制
7. **备份告警**: 配置备份失败告警通知

## 更新应用

拉取最新代码后：
```bash
# 重新构建镜像
docker-compose build

# 重启服务
docker-compose up -d
```

## 项目结构

```
blog-next/
├── docker/                  # Docker 配置
│   ├── mysql/
│   │   ├── Dockerfile      # 自定义 MySQL 镜像
│   │   ├── init/           # 数据库初始化脚本
│   │   │   ├── 01-init.sql
│   │   │   ├── 02-data-final.sql
│   │   │   └── 99-restore-backup.sh
│   │   ├── scripts/        # 备份脚本
│   │   │   ├── backup.sh
│   │   │   ├── crontab
│   │   │   └── entrypoint-wrapper.sh
│   │   ├── test-backup.sh  # 备份系统测试脚本
│   │   └── README.md       # 备份系统文档
│   ├── nginx/
│   │   ├── conf.d/         # Nginx 站点配置
│   │   └── certs/          # SSL 证书（可选）
│   └── backups/            # 数据库备份存储目录（自动生成）
├── server/                  # 后端源代码
├── src/                     # 前端源代码
├── docker-compose.yml       # Docker Compose 配置
├── Dockerfile.web          # Web 服务 Dockerfile
└── .env                    # 环境变量配置
```
