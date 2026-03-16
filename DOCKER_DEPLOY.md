# Sakurairo Blog Docker 部署说明

## 1. 当前约定

生产环境构建、部署、导出镜像的统一入口已经收敛到：

```bash
./build.sh -e prod
```

这个脚本同时负责：
- 选择生产环境 compose 组合：`docker-compose.yml + docker-compose.prod.yml`
- 检查并准备 `.env.prod`
- 构建本地业务镜像
- 按需启动服务、导出镜像、推送镜像

兼容包装层仍然保留，但不再是首选入口：
- `build_docker_prod.sh`
- `build_docker_prod.ps1`

它们现在只负责转发到 `build.sh -e prod`。

离线交付仍然是独立流程，请看 [OFFLINE_DOCKER_GUIDE.md](./OFFLINE_DOCKER_GUIDE.md)。

## 2. 稳定镜像名

在线部署与镜像导出共用以下显式镜像名：

```text
blog-sakurairo-server
blog-sakurairo-web
blog-sakurairo-music-api
blog-sakurairo-db-backup
```

开发环境使用独立镜像名，避免与生产镜像互相覆盖：

```text
blog-sakurairo-server-dev
blog-sakurairo-web-dev
blog-sakurairo-music-api-dev
```

## 3. 环境文件

生产环境需要 `.env.prod`。

如果项目根目录不存在 `.env.prod`，`build.sh -e prod` 会尝试从 `.env.prod.template` 复制出一份模板并终止执行，等待你填入真实配置。

常见需要确认的配置：
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `TOKEN_SECRET`
- GitHub OAuth 相关 `*_PROD` 变量
- Remark42、图床等生产环境变量

## 4. 生产环境常用命令

### 4.1 构建并启动生产环境

```bash
./build.sh -e prod
```

### 4.2 只构建，不启动

```bash
./build.sh -e prod --no-start
```

### 4.3 构建并导出生产镜像

```bash
./build.sh -e prod --no-start --save
```

默认导出目录为 `./dist`，导出文件名类似：

```text
dist/blog-sakurairo-prod-20260316-1200.tar.gz
```

### 4.4 无缓存重建

```bash
./build.sh -e prod --clean
```

### 4.5 推送到远端 Registry

```bash
./build.sh -e prod --push ghcr.io/your-org
```

### 4.6 停止生产环境

```bash
./build.sh -e prod --down
```

### 4.7 启动后跟随日志

```bash
./build.sh -e prod --logs
```

## 5. 开发环境入口

如果只是本地开发环境构建，可以继续使用：

```bash
./build.sh -e dev
```

项目中原有的开发辅助脚本仍可保留使用，但生产环境的推荐入口不再是 `build_docker_prod.*`。

## 6. Windows 使用方式

推荐使用 Git Bash、WSL 或其他带 Bash 的终端，直接执行：

```powershell
bash ./build.sh -e prod
```

兼容包装层仍可使用：

```powershell
./build_docker_prod.ps1
```

它会尝试查找本机的 `bash` 并转发到统一脚本。如果系统没有 Bash，请先安装 Git for Windows 或改用 WSL。

## 7. 手动 compose 命令

如果你需要手动执行 compose，生产环境对应的组合是：

```bash
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

查看状态：

```bash
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml ps
```

查看日志：

```bash
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

停止服务：

```bash
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml down
```

## 8. 验证建议

生产环境交付脚本调整后，建议至少验证：
- `./build.sh -e prod --help`
- `./build.sh -e prod --no-start`
- `./build.sh -e prod --no-start --save`
- `docker compose --env-file .env.prod.template -f docker-compose.yml -f docker-compose.prod.yml config`

如果要做离线交付验证，请使用 `package_offline_docker.sh` 或 `package_offline_docker.ps1`，不要把离线打包与在线部署混在同一条流程里。
