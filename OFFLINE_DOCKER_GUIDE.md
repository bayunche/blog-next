# 离线 Docker 打包与导入说明

## 1. 目的

本文档用于说明 `blog-sakurairo` 项目的离线 Docker 打包、分发和导入流程，并记录 2026-03-13 的本地实测结果。

适用场景：
- 需要在**无法联网**的服务器或内网环境中部署项目。
- 需要将本地已经构建好的镜像、初始化 SQL 和运行目录一并打包后交付。

补充说明：
- 在线生产部署的统一入口是 `build.sh -e prod`。
- 离线打包不是在线部署的别名，而是独立交付流程。
- 两条流程现在共享同一组业务镜像名约定，避免导出和导入时出现镜像名漂移。

---

## 2. 当前离线包包含内容

离线包由以下脚本生成：
- `package_offline_docker.sh`
- `package_offline_docker.ps1`

生成后的目录中主要包含：
- `docker-compose.offline.yml`：离线环境专用 Compose 编排文件。
- `images/blog-sakurairo-images.tar`：导出的完整 Docker 镜像包。
- `.env.offline`：从本地复制出的运行环境变量文件。
- `docker/nginx/`：Nginx 配置。
- `docker/mysql/init/`：MySQL 初始化 SQL。
- `docker/mysql/backup/`：数据库备份目录。
- `docker/remark42/`：Remark42 持久化目录。
- `server/data/`：服务运行数据目录。
- `server/db/`：服务端数据库相关文件。
- `import-offline.sh`：Linux / macOS 导入脚本。
- `import-offline.ps1`：Windows PowerShell 导入脚本。

额外说明：
- 打包脚本会把 `server/db/prod_full_import.sql` 复制到离线包中的 `docker/mysql/init/99-prod_full_import.sql`。
- 这意味着离线环境首次启动 MySQL 时，会自动执行完整初始化导入。
- 如果某些本地目录不可读（例如个别挂载目录权限异常），脚本会记录 warning 并跳过，不再直接中断整个打包过程。
- 业务镜像统一使用以下名称：
  - `blog-sakurairo-server`
  - `blog-sakurairo-web`
  - `blog-sakurairo-music-api`
  - `blog-sakurairo-db-backup`

---

## 3. 前置要求

离线导入机器需要具备：
- 已安装 Docker
- 已安装 Docker Compose（支持 `docker compose`）
- 有足够磁盘空间存放镜像 tar 和运行卷数据

建议检查：
- `docker --version`
- `docker compose version`

注意端口占用：
- `80`
- `443`
- `3306`

离线编排 `docker-compose.offline.yml` 默认会占用以上端口。如果机器上已经有其他服务占用，需要先停止或修改映射。

---

## 4. 本地生成离线包

### 4.1 PowerShell 方式

在项目根目录执行：

```powershell
./package_offline_docker.ps1
```

如需指定输出目录：

```powershell
./package_offline_docker.ps1 .\dist\offline-bundle-custom
```

### 4.2 Shell 方式

在项目根目录执行：

```bash
bash ./package_offline_docker.sh
```

如需指定输出目录：

```bash
bash ./package_offline_docker.sh ./dist/offline-bundle-custom
```

### 4.3 打包脚本做了什么

脚本会自动完成以下动作：
- 基于当前项目源码构建本地业务镜像。
- 检查并准备基础镜像：`mysql:8.0`、`nginx:alpine`、`umputun/remark42:latest`。
- 复制离线运行所需目录与配置文件。
- 生成导入脚本 `import-offline.sh` / `import-offline.ps1`。
- 将所有镜像导出为一个 `tar` 文件，便于脱机分发。

---

## 5. 在离线环境导入

将整个离线包目录完整复制到目标机器，例如：

- `offline-bundle-ps1/`
- `offline-bundle-sh-clean/`

### 5.1 Windows PowerShell 导入

进入离线包目录后执行：

```powershell
./import-offline.ps1
```

脚本会自动执行：
- `docker load -i images/blog-sakurairo-images.tar`
- 如果当前目录不存在 `.env`，则将 `.env.offline` 复制为 `.env`
- 执行 `docker compose -f docker-compose.offline.yml up -d`
- 输出 `docker compose ps`

### 5.2 Linux / macOS 导入

进入离线包目录后执行：

```bash
bash ./import-offline.sh
```

脚本行为与 PowerShell 版本一致。

---

## 6. 导入后验证方式

### 6.1 查看容器状态

```bash
docker compose -f docker-compose.offline.yml ps
```

正常情况下应看到以下服务启动：
- `mysql`
- `server`
- `web`
- `music-api`
- `nginx`
- `remark42`
- `db-backup`

### 6.2 访问页面

默认可访问：
- 首页：`http://localhost/`
- 登录页：`http://localhost/login`
- 评论代理：`http://localhost/comments`

### 6.3 检查数据库是否完成初始化

可进入 MySQL 容器检查：

```bash
docker exec -it sakurairo-mysql mysql -uroot -p
```

再执行：

```sql
USE sakurairo_blog;
SHOW TABLES;
SELECT COUNT(*) FROM article;
SELECT COUNT(*) FROM category;
SELECT COUNT(*) FROM tag;
```

---

## 7. 本次实测结果（2026-03-13）

本次已在本机对两套离线导入脚本做**实际验证**，不是仅做静态检查。

### 7.1 已验证的离线包

- `dist/offline-bundle-ps1`
- `dist/offline-bundle-sh-clean`

### 7.2 实测过程

验证前，为避免离线编排占用冲突端口，临时停止了本地开发环境中的：
- `sakurairo-nginx-dev`
- `sakurairo-mysql-dev`

随后分别执行：
- `powershell.exe -ExecutionPolicy Bypass -File dist/offline-bundle-ps1/import-offline.ps1`
- `bash dist/offline-bundle-sh-clean/import-offline.sh`

两套脚本都成功完成以下动作：
- 成功 `docker load` 镜像包
- 成功创建并启动离线 Compose 服务
- 成功初始化 MySQL
- 成功执行 `99-prod_full_import.sql`
- 成功通过 `http://localhost/` 返回 `HTTP 200`

### 7.3 数据校验结果

离线导入后的数据库实测统计：
- `article`：14 条
- `category`：12 条
- `tag`：28 条

同时抽查了对前端改动敏感的接口返回：
- `GET /api/category/list`
- `GET /api/tag/list`
- `GET /api/article/list?page=1&pageSize=2`

抽查结果确认：
- 分类列表可正常返回聚合后的分类数据。
- 标签列表可正常返回聚合后的标签数据。
- 文章列表返回中同时包含：
  - `categories`
  - `tags`
  - 稳定的主分类字段 `category`

这与前面针对前端页面改动所做的后台兼容处理是一致的。

### 7.4 验证结束后的恢复操作

验证完成后已执行：
- 关闭离线导入环境并删除测试卷
- 恢复本地开发容器 `sakurairo-nginx-dev`
- 恢复本地开发容器 `sakurairo-mysql-dev`

因此当前仓库的开发环境端口已恢复。

---

## 8. 常见问题

### 8.1 端口冲突

如果出现类似报错：
- `port is already allocated`
- `bind: address already in use`

说明 `80`、`443` 或 `3306` 已被占用。

处理方式：
- 停止现有占用服务
- 或修改 `docker-compose.offline.yml` 中端口映射

### 8.2 首次导入数据不完整

离线导入依赖 MySQL 首次初始化时执行 `docker/mysql/init/` 下的 SQL。

如果之前已经启动过并保留了卷，MySQL 不会再次执行初始化脚本。

处理方式：

```bash
docker compose -f docker-compose.offline.yml down -v
```

然后重新执行导入脚本。

### 8.3 `.env` 配置不符合目标环境

导入脚本会在当前目录没有 `.env` 时，将 `.env.offline` 复制为 `.env`。

如果目标环境需要修改域名、GitHub OAuth、图床或 Remark42 参数，应该在首次 `up -d` 前先调整 `.env.offline`，或者导入后直接修改 `.env` 再重启容器。

### 8.4 Remark42 目录未完整复制

如果打包机器上的 `docker/remark42` 目录存在权限问题或不可读，打包脚本会打印 warning 并跳过对应目录。

这不会阻止离线包生成，但会影响评论系统的历史数据迁移。

建议：
- 打包前检查该目录权限
- 确认离线包中 `docker/remark42/` 内容是否完整

---

## 9. 建议的交付方式

建议最终交付以下内容给离线环境运维人员：
- 整个离线包目录
- 本文档 `OFFLINE_DOCKER_GUIDE.md`
- 如有需要，额外提供一份经脱敏处理的 `.env` 示例说明

如果后续还要做正式交付，建议再补一份：
- 目标服务器部署检查清单
- 端口/域名/证书对应关系说明
- 备份与回滚说明
