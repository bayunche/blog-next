# Sakurairo Docker 部署说明

## 统一入口

项目的统一构建入口是：

```bash
./build.sh
```

现在有两种使用方式：

1. 不带参数运行  
   进入交互式模式，在运行中选择：
   - 目标环境：`prod` / `dev`
   - 操作类型：构建并启动、仅构建、停止服务
   - 是否使用无缓存构建
   - 是否在构建完成后导出镜像

2. 带参数运行  
   继续保持非交互模式，适合脚本化执行。

## 常见命令

### 生产环境

```bash
./build.sh -e prod
./build.sh -e prod --no-start
./build.sh -e prod --save
./build.sh -e prod --no-start --save
./build.sh -e prod --down
```

### 开发环境

```bash
./build.sh -e dev
./build.sh -e dev --no-start
./build.sh -e dev --save
./build.sh -e dev --no-start --save
./build.sh -e dev --down
```

## 导出镜像

`--save` 表示在构建完成后导出镜像。

它和是否启动服务是两个独立维度：

- `./build.sh -e prod --save`
  - 构建
  - 导出镜像
  - 启动服务

- `./build.sh -e prod --no-start --save`
  - 构建
  - 导出镜像
  - 不启动服务

默认导出目录是 `./dist`，文件名类似：

```text
blog-sakurairo-prod-20260316-1200.tar.gz
blog-sakurairo-dev-20260316-1200.tar.gz
```

如果要指定目录：

```bash
./build.sh -e prod --save ./dist/prod-images
./build.sh -e dev --save ./dist/dev-images
```

## 交互模式说明

直接运行：

```bash
./build.sh
```

脚本会提示你依次选择：

- 环境
- 操作类型
- 是否 clean build
- 是否导出镜像
- 如果需要启动，是否跟随日志

这样即使不记参数，也能在运行中切换到不同处理分支。

## 稳定镜像名

生产环境业务镜像：

```text
blog-sakurairo-server
blog-sakurairo-web
blog-sakurairo-music-api
blog-sakurairo-db-backup
```

开发环境业务镜像：

```text
blog-sakurairo-server-dev
blog-sakurairo-web-dev
blog-sakurairo-music-api-dev
```

离线打包脚本也复用这组镜像命名约定。

## 环境文件

### 生产环境

生产环境依赖 `.env.prod`。

如果文件不存在，脚本会尝试从 `.env.prod.template` 复制出模板，然后提示你补齐真实配置后重新执行。

### 开发环境

开发环境优先使用 `.env`。

如果 `.env` 不存在但 `.env.docker` 存在，脚本会自动复制一份 `.env`。

## 兼容包装层

以下脚本仍然保留，但已经不再维护独立逻辑，只负责转发：

- `build_docker_prod.sh`
- `build_docker_prod.ps1`

推荐直接使用 `build.sh`。

## Windows 说明

PowerShell 下推荐：

```powershell
bash ./build.sh
bash ./build.sh -e prod --save
```

也可以继续使用兼容包装层：

```powershell
./build_docker_prod.ps1
```

它会尝试自动找到本机可用的 `bash`。

## 离线打包

离线交付仍然是单独流程，不和在线部署混用。

请参考：

- [OFFLINE_DOCKER_GUIDE.md](./OFFLINE_DOCKER_GUIDE.md)

## 建议验证

建议至少验证以下几种场景：

```bash
./build.sh
./build.sh -e prod
./build.sh -e dev --no-start
./build.sh -e prod --save
./build.sh -e dev --no-start --save
docker compose --env-file .env.prod.template -f docker-compose.yml -f docker-compose.prod.yml config
docker compose -f docker-compose.dev.yml config
```
