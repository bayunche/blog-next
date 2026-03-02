# Sakurairo Blog Docker 部署指南

## 📋 目录结构

```
blog-sakurairo/
├── docker/
│   ├── nginx/
│   │   ├── nginx.conf        # Nginx 主配置
│   │   ├── default.conf      # 站点配置
│   │   └── ssl/              # SSL 证书目录（可选）
│   └── mysql/
│       └── init/             # 数据库初始化脚本
├── server/                   # 后端代码
│   └── Dockerfile
├── Dockerfile.frontend       # 前端 Dockerfile
├── docker-compose.yml        # 完整部署（含 Nginx + Remark42）
├── docker-compose.dev.yml    # 开发部署（不含 Nginx）
├── docker-compose.prod.yml   # 生产部署覆盖层（prod 凭据注入）
├── .env.docker               # 开发环境变量模板
├── .env.prod.template        # 生产环境变量模板
├── build_docker.sh           # 开发/默认部署脚本（Linux/Mac）
├── build_docker_prod.sh      # 生产部署脚本（Linux/Mac）
└── .dockerignore
```

---

## 🚀 快速启动

### 1. 准备环境变量

```bash
# 开发环境：复制环境变量模板
cp .env.docker .env

# 编辑配置（必须修改敏感信息）
nano .env
```

**必须修改的配置项：**
- `MYSQL_ROOT_PASSWORD` - MySQL root 密码
- `MYSQL_PASSWORD` - 应用数据库密码
- `TOKEN_SECRET` - JWT 密钥（生产环境务必修改）

### 2. 启动服务

```bash
# 1a. (推荐) 使用自动脚本
./build_docker.sh   # Linux/Mac
./build_docker.ps1  # Windows

# 1b. (手动) 完整部署（默认，含 Nginx + Remark42）
docker compose up -d --build

# 1c. (手动) 开发部署（不含 Nginx）
docker compose -f docker-compose.dev.yml up -d --build

# 1d. (推荐) 生产部署脚本
./build_docker_prod.sh      # Linux/Mac
./build_docker_prod.ps1     # Windows

# 1e. (手动) 生产部署（使用 prod 覆盖层 + prod 环境文件）
cp .env.prod.template .env.prod
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

### 3. 访问应用

- **完整部署（`docker-compose.yml`）**
  - Nginx 入口: http://localhost
  - 前端直连: http://localhost:3002
  - 后端 API 直连: http://localhost:6062
  - 评论系统直连: http://localhost:8080
  - 评论系统经 Nginx: http://localhost/comments/
- **开发部署（`docker-compose.dev.yml`）**
  - 前端: http://localhost:3000
  - 后端 API: http://localhost:6060
  - 评论系统: http://localhost:8080

---

## 🔧 服务说明

| 服务 | 端口 | 说明 |
|------|------|------|
| mysql | 3306 | MySQL 8.0 数据库 |
| server | 6062 -> 6060 | Node.js 后端 API（完整部署） |
| web | 3002 -> 3000 | Next.js 前端（完整部署） |
| music-api | 3003 | 网易云音乐 API |
| remark42 | 8080 | 评论系统 |
| nginx | 80/443 | 反向代理 |

---

## 📦 常用命令

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（清空数据库）
docker compose down -v

# 重新构建单个服务
docker compose build web
docker compose build server

# 查看特定服务日志
docker compose logs -f web
docker compose logs -f server
docker compose logs -f mysql
docker compose logs -f remark42

# 进入容器调试
docker compose exec server sh
docker compose exec mysql mysql -u root -p
```

---

## 🌐 生产环境部署

### 1. 配置 HTTPS（推荐）

```bash
# 将 SSL 证书放入 docker/nginx/ssl/
cp your_cert.pem docker/nginx/ssl/cert.pem
cp your_key.pem docker/nginx/ssl/key.pem
```

编辑 `docker/nginx/default.conf`，取消 HTTPS server 块的注释。

### 2. 使用外部数据库

如果使用云数据库（如 RDS），修改 `.env.prod`：

```env
MYSQL_HOST=your-rds-endpoint.com
MYSQL_PORT=3306
MYSQL_DATABASE=sakurairo_blog
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
```

然后在 `docker-compose.yml` 中注释掉 `mysql` 服务。

### 3. 准备生产环境变量（推荐）

```bash
cp .env.prod.template .env.prod
nano .env.prod
```

### 4. 配置 GitHub OAuth（生产凭据）

```env
GITHUB_CLIENT_ID_PROD=your_prod_client_id
GITHUB_CLIENT_SECRET_PROD=your_prod_client_secret
ADMIN_GITHUB_LOGIN_NAME_PROD=your_admin_github_username
GITHUB_REDIRECT_URI_PROD=https://your-domain.com/api/conn/github/callback
NEXT_PUBLIC_GITHUB_CLIENT_ID_PROD=your_prod_client_id
NEXT_PUBLIC_GITHUB_REDIRECT_URI_PROD=https://your-domain.com/api/conn/github/callback
```

### 5. 启动生产部署

```bash
# 方式 A：脚本
./build_docker_prod.sh

# 方式 B：手动
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## 🔍 健康检查

```bash
# 检查所有服务状态
docker compose ps

# 检查 Nginx 健康端点
curl http://localhost/health

# 检查后端 API
curl http://localhost/api/article/list

# 检查评论脚本
curl -I http://localhost:8080/web/embed.js
```

---

## ⚠️ 故障排除

### MySQL 连接失败

```bash
# 检查 MySQL 是否启动
docker compose logs mysql

# 等待 MySQL 完全启动（约 30 秒）
docker compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
```

### 前端构建失败

```bash
# 检查构建日志
docker compose logs web

# 清理并重新构建
docker compose down
docker system prune -f
docker compose up -d --build
```

### 端口冲突

```bash
# 检查端口占用
netstat -tulpn | grep :80
netstat -tulpn | grep :3306

# 修改 docker-compose.yml 中的端口映射
```

---

## 📊 资源需求

| 服务 | CPU | 内存 |
|------|-----|------|
| MySQL | 0.5 核 | 512MB |
| Server | 0.25 核 | 256MB |
| Web | 0.5 核 | 512MB |
| Nginx | 0.1 核 | 64MB |
| **总计** | **~1.5 核** | **~1.3GB** |

---

## 🔄 备份与恢复

### 备份数据库

```bash
docker compose exec mysql mysqldump -u root -p sakurairo_blog > backup.sql
```

### 恢复数据库

```bash
docker compose exec -T mysql mysql -u root -p sakurairo_blog < backup.sql
```
