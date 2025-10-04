# Docker 部署指南

本文档说明如何使用 Docker 部署 Blog Next 项目。

## 目录结构

```
blog-next/
├── docker-compose.yml          # Docker Compose 配置
├── Dockerfile.web              # 前端构建配置
├── .dockerignore               # Docker 忽略文件
├── .env.example                # 环境变量示例
└── docker/
    ├── nginx/                  # Nginx 配置
    │   ├── nginx.conf          # Nginx 主配置
    │   └── conf.d/
    │       └── default.conf    # 站点配置
    ├── backups/                # 数据库备份目录
    └── mysql/
        └── init/               # MySQL 初始化脚本
```

## 快速开始

### 1. 准备环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，配置必要的环境变量
nano .env
```

**重要环境变量说明：**

- `MYSQL_ROOT_PASSWORD`: MySQL root 密码（必须修改）
- `MYSQL_PASSWORD`: 应用数据库密码（必须修改）
- `TOKEN_SECRET`: JWT 密钥（必须修改，至少 32 字符）
- `GITHUB_CLIENT_ID`: GitHub OAuth 客户端 ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth 客户端密钥
- `ADMIN_GITHUB_LOGIN_NAME`: 管理员 GitHub 用户名

### 2. 构建并启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 3. 访问应用

- 前端应用: http://localhost
- API 接口: http://localhost/api
- MySQL: localhost:3306

## 服务说明

### Web (前端)

- 基于 Nginx Alpine 镜像
- 端口: 80, 443
- 构建步骤:
  1. 使用 Node.js 22 构建 Vite 应用
  2. 复制构建产物到 Nginx
  3. 配置反向代理到后端 API

### Server (后端)

- 基于 Node.js 22 Alpine 镜像
- 端口: 6060 (内部)
- 通过 Nginx 反向代理访问
- 健康检查: 每 30 秒

### MySQL

- 版本: MySQL 8.0
- 端口: 3306
- 数据持久化: Docker Volume `mysql_data`
- 健康检查: 每 10 秒

## 常用命令

### 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 仅启动特定服务
docker-compose up -d web
```

### 停止服务

```bash
# 停止所有服务
docker-compose stop

# 停止特定服务
docker-compose stop web
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart server
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f server

# 查看最后 100 行日志
docker-compose logs --tail=100 web
```

### 进入容器

```bash
# 进入 web 容器
docker-compose exec web sh

# 进入 server 容器
docker-compose exec server sh

# 进入 mysql 容器
docker-compose exec mysql bash
```

### 重新构建

```bash
# 重新构建所有镜像
docker-compose build

# 重新构建特定服务
docker-compose build web

# 重新构建并启动
docker-compose up -d --build
```

### 清理资源

```bash
# 停止并删除容器
docker-compose down

# 停止并删除容器、网络、卷
docker-compose down -v

# 删除所有未使用的镜像
docker image prune -a
```

## 数据备份与恢复

### 备份数据库

```bash
# 进入 server 容器
docker-compose exec server sh

# 手动备份
mysqldump -h mysql -u react_blog -p react_blog > /app/backups/backup_$(date +%Y%m%d_%H%M%S).sql

# 或从宿主机执行
docker-compose exec mysql mysqldump -u react_blog -p react_blog > ./docker/backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### 恢复数据库

```bash
# 从宿主机恢复
docker-compose exec -T mysql mysql -u react_blog -p react_blog < ./docker/backups/backup_file.sql
```

## 生产环境配置

### 1. HTTPS 配置

编辑 `docker/nginx/conf.d/default.conf`，取消 HTTPS server 块的注释并配置证书：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    
    # ... 其他配置
}
```

将 SSL 证书放置在 `docker/nginx/certs/` 目录。

### 2. 性能优化

- 启用 Nginx Gzip 压缩 (已配置)
- 配置静态资源缓存 (已配置)
- 调整 MySQL 内存参数
- 使用 CDN 加速静态资源

### 3. 安全加固

- 修改所有默认密码
- 限制 MySQL 端口仅内网访问
- 配置防火墙规则
- 定期更新镜像
- 启用 HTTPS
- 配置 rate limiting

### 4. 监控和日志

```bash
# 监控容器资源使用
docker stats

# 实时查看日志
docker-compose logs -f

# 配置日志轮转
# 编辑 /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 故障排查

### 服务无法启动

```bash
# 查看服务状态
docker-compose ps

# 查看详细日志
docker-compose logs service_name

# 检查配置文件
docker-compose config
```

### 数据库连接失败

1. 检查 MySQL 服务是否健康: `docker-compose ps mysql`
2. 检查环境变量配置: `docker-compose config`
3. 查看服务器日志: `docker-compose logs server`
4. 进入容器测试连接: `docker-compose exec server sh`

### 前端页面无法访问

1. 检查 Nginx 配置: `docker-compose exec web nginx -t`
2. 查看 Nginx 日志: `docker-compose logs web`
3. 检查构建产物: `docker-compose exec web ls /usr/share/nginx/html`

### 端口冲突

如果端口 80、443 或 3306 被占用：

```yaml
# 修改 docker-compose.yml 中的端口映射
ports:
  - "8080:80"  # 使用 8080 替代 80
```

## 版本更新

### 更新应用代码

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建镜像
docker-compose build

# 3. 重启服务
docker-compose up -d

# 4. 验证更新
docker-compose logs -f
```

### 更新依赖

```bash
# 重新构建不使用缓存
docker-compose build --no-cache

# 重启服务
docker-compose up -d
```

## 开发环境

如果需要在 Docker 中进行开发：

```bash
# 使用 volume 挂载源代码（添加到 docker-compose.yml）
volumes:
  - ./src:/app/src
  - ./public:/app/public

# 使用开发模式启动
docker-compose -f docker-compose.dev.yml up
```

## 资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)

## 支持

如遇到问题，请检查：
1. 环境变量配置是否正确
2. 端口是否被占用
3. Docker 和 Docker Compose 版本是否符合要求
4. 系统资源是否充足

最低系统要求：
- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM
- 10GB 磁盘空间
