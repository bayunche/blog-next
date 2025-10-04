# React Blog - 新一代博客系统

基于 **React 19** + **Vite 5** + **TypeScript** + **Ant Design v5** 构建的现代化博客系统

## 🎉 项目状态

✅ **Week 1：基础设施搭建** (已完成)

### 已完成任务（Day 1-5）

#### Day 1-2: 项目初始化
- [x] 创建项目脚手架（Vite 7 + React 19 + TypeScript）
- [x] 安装核心依赖（最新版本）
  - React 19.1.1
  - Vite 7.1.7
  - Ant Design 5.27.4
  - React Router 7.9.3
  - TanStack Query 5.90.2
  - Zustand 5.0.8
- [x] 配置 Vite（路径别名、Less 预处理器、代码分割策略）
- [x] 配置 TypeScript（严格模式、路径映射）
- [x] 配置 ESLint + Prettier（代码规范）
- [x] 创建环境变量配置
- [x] 创建项目目录结构

#### Day 3: 设计系统迁移
- [x] 创建设计令牌系统（colors, spacing, typography, shadows）
- [x] 配置 Ant Design v5 主题（Token API）
- [x] 创建 ThemeProvider（明/暗/自动主题）
- [x] 迁移全局样式（CSS 变量系统）

#### Day 4: 路由系统升级
- [x] 创建路由配置（Web + Admin）
- [x] 实现路由懒加载（Suspense）
- [x] 实现权限守卫（ProtectedRoute）
- [x] 实现错误边界（ErrorBoundary）

#### Day 5: 请求层与状态管理
- [x] 配置 Axios（拦截器、请求去重、加密）
- [x] 配置 TanStack Query（缓存策略、Query Keys）
- [x] 创建工具函数（storage, token, crypto）
- [x] 迁移 Zustand Stores（auth, theme, app）

## 📂 项目结构

```
blog-next/
├── src/
│   ├── app/                    # 应用配置层
│   │   ├── providers/         # 全局Providers
│   │   ├── routes/            # 路由配置
│   │   └── styles/            # 全局样式
│   ├── features/              # 功能模块（按领域划分）
│   │   ├── article/          # 文章功能
│   │   ├── auth/             # 认证功能
│   │   ├── comment/          # 评论功能
│   │   └── admin/            # 管理后台
│   ├── shared/               # 共享资源
│   │   ├── components/       # 通用组件
│   │   ├── hooks/           # 通用hooks
│   │   ├── utils/           # 工具函数
│   │   ├── api/             # API配置
│   │   ├── stores/          # 状态管理
│   │   ├── types/           # 类型定义
│   │   ├── constants/       # 常量定义
│   │   └── assets/          # 静态资源
│   └── design-system/        # 设计系统
│       ├── tokens/          # 设计令牌
│       ├── themes/          # 主题配置
│       └── components/      # UI组件库（MoeUI）
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── eslint.config.js         # ESLint 配置
└── .prettierrc              # Prettier 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 9.x 或 yarn >= 1.22.x

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📦 技术栈

### 核心框架

- **React 19.1.1** - 最新的 React 版本
- **TypeScript 5.8.3** - 类型安全
- **Vite 7.1.7** - 快速的构建工具

### UI 框架

- **Ant Design 5.27.4** - 企业级 UI 设计语言
- **@ant-design/icons 6.0.2** - 图标库
- **Less 4.4.1** - CSS 预处理器

### 路由与状态管理

- **React Router 7.9.3** - 路由管理
- **Zustand 5.0.8** - 轻量级状态管理
- **TanStack Query 5.90.2** - 强大的异步状态管理

### 工具库

- **Axios 1.12.2** - HTTP 客户端
- **Day.js 1.11.18** - 日期处理
- **DOMPurify 3.2.7** - XSS 防护

### 开发工具

- **ESLint 9.36.0** - 代码检查
- **Prettier 3.6.2** - 代码格式化
- **Vitest 3.2.4** - 单元测试
- **Testing Library 16.3.0** - React 组件测试

## 🎨 设计系统

项目采用自定义的 **Moe UI** 设计系统，特色：

- 🎀 萌系设计风格
- 🌈 毛玻璃效果
- 🎨 明暗主题切换
- 📱 响应式设计

### 主题配置

主色调：`#ff69b4` (粉色)
辅助色：`#87ceeb` (天蓝色)
圆角：`8px/16px/24px`
阴影：多层次阴影系统

## 🔧 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint + Prettier 规范
- 使用函数式组件和 Hooks
- 组件采用 PascalCase 命名
- 文件名使用 camelCase

### Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

## 📝 下一步计划

### Week 2：核心功能迁移

#### Day 6-7: 认证系统迁移
- [ ] 迁移登录/注册组件
- [ ] 实现认证 API Hooks
- [ ] 实现 GitHub OAuth 登录
- [ ] 集成 authStore

#### Day 8: 文章展示系统
- [ ] 迁移文章列表页
- [ ] 迁移文章详情页
- [ ] 实现 Markdown 渲染
- [ ] 实现文章 API Hooks

#### Day 9: 评论系统
- [ ] 迁移评论组件
- [ ] 实现嵌套回复
- [ ] 实现评论 API Hooks

#### Day 10: 分类标签系统
- [ ] 迁移分类页面
- [ ] 迁移标签云组件
- [ ] 实现归档页面

### 第三阶段：管理后台（Week 3）

- [ ] 管理后台布局
- [ ] 文章管理（CRUD）
- [ ] Markdown 编辑器
- [ ] 用户管理
- [ ] 系统监控

### 第四阶段：优化与测试（Week 4）

- [ ] 性能优化
- [ ] 单元测试
- [ ] E2E 测试
- [ ] 文档完善
- [ ] 部署配置

## 📚 相关文档

- [执行计划](../docs_claude/EXECUTION_PLAN.md) - 完整的迁移计划
- [技术审计](../docs_claude/specs/01_global_audit.md) - 现有项目分析
- [API 目录](../docs_claude/specs/02_api_catalog.md) - API 接口清单
- [新项目脚手架](../docs_claude/specs/03_new_scaffold.md) - 详细配置说明
- [测试计划](../docs_claude/specs/05_test_plan.md) - 完整测试策略

## 📄 License

MIT

## 👥 贡献者

欢迎贡献代码！

---

**注意**：这是一个正在积极开发中的项目，API 可能会发生变化。