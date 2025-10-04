# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是 **blog-next**，一个使用最新技术栈重写的现代化全栈博客系统：
- **前端**: React 19 + Vite 7 + TypeScript + Ant Design v5
- **后端**: Koa 2 + MySQL 8 + Sequelize ORM
- **架构**: 基于功能模块的现代化架构，关注点分离

**重要说明**: 这是位于 `blog-next/` 目录的新版本实现。父目录包含基于 Webpack 的旧版本。

## 架构说明

### 前端架构（现代化特性模块）

```
src/
├── app/                    # 应用配置层
│   ├── providers/         # 全局 Providers（React Query, Theme, Router）
│   ├── routes/            # 路由配置，支持懒加载
│   └── styles/            # 全局样式和 CSS 变量
├── features/              # 功能模块（按领域划分）
│   ├── article/          # 文章功能
│   ├── auth/             # 认证功能
│   ├── comment/          # 评论系统
│   └── admin/            # 管理后台
├── shared/               # 共享资源
│   ├── components/       # 可复用 UI 组件
│   ├── hooks/           # 自定义 React Hooks
│   ├── utils/           # 工具函数
│   ├── api/             # API 客户端配置
│   ├── stores/          # Zustand 状态管理
│   ├── types/           # TypeScript 类型定义
│   └── constants/       # 应用常量
└── design-system/        # 设计系统（Moe UI）
    ├── tokens/          # 设计令牌（颜色、间距等）
    ├── themes/          # 主题配置
    └── components/      # 样式化 UI 组件
```

### 后端架构

```
server/
├── controllers/   # 请求处理器
├── models/       # Sequelize 数据模型
├── router/       # 路由定义
├── middlewares/  # Koa 中间件
├── utils/        # 工具函数
└── config/       # 配置文件
```

## 常用开发命令

### 本地开发

```bash
# 安装依赖
npm install

# 启动前端开发服务器（端口 3000）
npm run dev

# 启动后端开发服务器（端口 6060）
cd server && npm run dev

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 构建

```bash
# 生产环境构建
npm run build

# Docker 构建（不执行 TypeScript 类型检查）
npm run build:docker

# 构建并生成包分析报告
npm run build:analyze

# 预览生产构建
npm run preview
```

### Docker 开发与测试

```bash
# 启动所有服务（web + server + mysql）
docker-compose up -d

# 查看服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f web      # 前端
docker-compose logs -f server   # 后端
docker-compose logs -f mysql    # 数据库

# 停止所有服务
docker-compose down

# 停止服务并删除数据卷（会删除所有数据）
docker-compose down -v

# 重新构建特定服务
docker-compose build --no-cache web
docker-compose build --no-cache server

# 进入容器执行命令
docker-compose exec web sh       # 进入前端容器
docker-compose exec server sh    # 进入后端容器
docker-compose exec mysql bash   # 进入数据库容器

# 在容器中运行测试
docker-compose exec web npm test              # 前端测试
docker-compose exec web npm run test:coverage # 测试覆盖率
docker-compose exec server npm test           # 后端测试
```

### 测试

```bash
# 本地运行测试（watch 模式）
npm test

# 测试 UI 界面
npm run test:ui

# 生成测试覆盖率报告
npm run test:coverage

# Docker 中运行测试（推荐用于 CI/CD）
docker-compose up -d
docker-compose exec web npm test
docker-compose exec web npm run test:coverage
```

**注意**: 测试环境也需要在 Docker 中构建和运行，确保环境一致性。

## 核心技术栈

### 状态管理
- **TanStack Query (React Query)**: 服务端状态管理、缓存和数据获取
- **Zustand**: 客户端状态管理（认证、主题、应用状态）
- 原则：API 数据使用 React Query；UI 状态使用 Zustand

### 路由
- **React Router v7**: 声明式路由，支持懒加载
- 路由配置在 `src/app/routes/`
- 受保护路由使用 `ProtectedRoute` 组件进行权限检查

### 样式
- **Ant Design v5**: 组件库，使用 Token API 实现主题定制
- **Less**: CSS 预处理器，支持 CSS Modules
- **设计系统**: 自定义 "Moe UI" 设计系统，粉色/蓝色配色
- 主题令牌定义在 `src/design-system/tokens/`

### API 通信
- **Axios**: HTTP 客户端，配置了拦截器用于认证和错误处理
- 请求去重和加密已配置
- 基础 URL 通过 `VITE_API_BASE_URL` 环境变量配置
- 开发环境 API 代理配置在 `vite.config.ts`

## 配置文件

### 前端配置

**vite.config.ts**: Vite 构建配置
- 路径别名（`@app`, `@features`, `@shared`, `@design-system` 等）
- 开发环境 API 代理到后端
- 构建优化（代码分割、压缩、Tree Shaking）
- Less 预处理器配置，包含 Ant Design 主题变量

**tsconfig.json**: TypeScript 严格模式配置，包含路径映射

**环境变量** (.env):
- `VITE_API_BASE_URL`: 后端 API 地址
- `VITE_APP_TITLE`: 应用标题
- `VITE_GITHUB_CLIENT_ID`: GitHub OAuth 客户端 ID

### 后端配置

**server/config/index.js**:
- `DATABASE`: MySQL 连接设置（从 .env 读取）
- `GITHUB`: OAuth 认证凭证
- `EMAIL_NOTICE`: 邮件通知设置
- `TOKEN`: JWT 密钥和过期时间
- `PORT`: 服务器端口（默认 6060）

**环境变量** (.env):
- `MYSQL_*`: 数据库凭证
- `TOKEN_SECRET`: JWT 密钥（至少 32 字符）
- `GITHUB_CLIENT_ID/SECRET`: OAuth 认证凭证
- `ADMIN_GITHUB_LOGIN_NAME`: 管理员用户名
- `EMAIL_NOTICE_*`: 邮件通知配置

## 数据模型

- **User**: GitHub OAuth 登录，基于角色的权限
- **Article**: Markdown 内容，关联分类和标签
- **Category**: 文章分类
- **Tag**: 文章标签系统
- **Comment**: 嵌套评论/回复系统
- **Fragment**: 短文/碎片功能

数据库初始化脚本位于 `docker/mysql/init/`

## 开发规范

### 组件组织
- **页面组件**: 创建在 `src/features/[domain]/pages/`
- **可复用组件**: 创建在 `src/shared/components/`
- 每个组件文件夹应包含：
  - 组件文件（`.tsx`）
  - 常量文件（`constants.ts`）如需要
  - 工具文件（`utils.ts`）用于业务逻辑
  - 样式文件（`.less`）
  - 通过 `index.ts` 导出

### 代码风格
- 使用 TypeScript 严格模式
- 仅使用函数式组件和 Hooks
- 组件使用 PascalCase 命名，文件/函数使用 camelCase
- 优先使用命名导出而非默认导出
- UI 逻辑与业务逻辑解耦
- 事件处理器命名：使用描述性动词 + 对象（如 `submitForm` 而非 `handleClick`）

### API Hooks 模式
- 所有 API 调用使用 TanStack Query
- Query keys 定义在 `src/shared/api/queryKeys.ts`
- Mutations 在适当时处理乐观更新
- 示例：
  ```typescript
  const { data, isLoading } = useQuery({
    queryKey: ['articles', id],
    queryFn: () => fetchArticle(id)
  })
  ```

### 状态管理
- 服务端数据 → React Query
- 用户认证 → Zustand auth store
- 主题 → Zustand theme store
- 应用 UI 状态 → Zustand app store
- 本地组件状态 → useState/useReducer

### 认证流程
- GitHub OAuth 登录
- JWT 存储在 localStorage（加密）
- 认证状态由 Zustand 管理
- 管理员路由需要 `role = 1`
- 受保护路由使用 `ProtectedRoute` 包装

### 性能优化
- 基于路由的代码分割（懒加载）
- 使用 `LazyLoad` 组件实现图片懒加载
- 使用 `useMemo`/`useCallback` 优化昂贵操作
- 使用 `npm run build:analyze` 进行包分析

## 路径别名

在导入时使用这些别名（配置在 `vite.config.ts`）：

```typescript
@/           → src/
@app/        → src/app/
@features/   → src/features/
@shared/     → src/shared/
@design-system/ → src/design-system/
@components/ → src/shared/components/
@utils/      → src/shared/utils/
@hooks/      → src/shared/hooks/
@api/        → src/shared/api/
@stores/     → src/shared/stores/
@types/      → src/shared/types/
@assets/     → src/shared/assets/
```

## 测试策略

- **Vitest**: 单元测试框架
- **Testing Library**: React 组件测试
- 测试文件与组件放在一起（`*.test.tsx`）
- 使用 MSW (Mock Service Worker) 模式模拟 API 调用
- **Docker 测试环境**: 测试应在 Docker 容器中运行以确保环境一致性

### Docker 测试流程
```bash
# 1. 启动测试环境
docker-compose up -d

# 2. 在容器中运行测试
docker-compose exec web npm test

# 3. 生成覆盖率报告
docker-compose exec web npm run test:coverage

# 4. 查看测试结果
docker-compose logs web
```

## 部署

### Docker 部署（推荐）
1. 配置 `.env` 文件（从 `.env.example` 复制）
2. 运行 `docker-compose up -d`
3. 服务说明：
   - Web (Nginx): 端口 80/443
   - Server (Koa): 端口 6060（内部）
   - MySQL: 端口 3306

详细说明见 [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)

### 手动部署
1. 构建前端: `npm run build`
2. 启动后端: `cd server && npm run dev`
3. 使用 nginx/serve 提供 `dist/` 文件夹
4. 配置 MySQL 数据库

## 迁移状态

本项目正在从基于 Webpack 的旧版本迁移：
- ✅ 第一周: 基础设施（Vite, TypeScript, 路由, 状态管理）
- 🔄 第二周: 核心功能（认证、文章、评论）
- 📅 第三周: 管理后台
- 📅 第四周: 优化与测试

查看 [README.md](./README.md) 了解详细迁移进度。

## 相关文档

- [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md) - Docker 部署指南
- [README.md](./README.md) - 项目概述和设置
- [.env.example](./.env.example) - 环境变量模板
- 父目录 [CLAUDE.md](../CLAUDE.md) - 旧版本项目指南

## 开发注意事项

### Docker 优先
- 开发和测试都应优先使用 Docker 环境
- 确保本地和 CI/CD 环境一致
- 数据库测试必须在 Docker 中运行

### 构建差异
- 本地构建: `npm run build`（包含 TypeScript 类型检查）
- Docker 构建: `npm run build:docker`（跳过类型检查以加快速度）

### 数据库初始化
- 首次启动 Docker 会自动执行 `docker/mysql/init/` 中的 SQL 脚本
- 重新初始化需要 `docker-compose down -v` 删除数据卷

### 健康检查
- Web 服务: 每 30 秒检查一次
- Server 服务: 依赖 MySQL 健康才能启动
- 查看状态: `docker-compose ps`
