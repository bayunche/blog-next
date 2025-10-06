# Repository Guidelines

## 项目结构与模块划分
- 前端源码集中在 `src/`，以业务域拆分：`features/` 存放页面逻辑，`shared/` 提供跨项目工具，`design-system/` 收录可复用 UI 组件。
- 应用入口由 `src/main.tsx` 引导至 `src/App.tsx`，静态资源留在 `src/assets/`，需要按原路径暴露的文件保存在 `public/`。
- Express 服务位于 `server/`，按 `controllers/`、`models/`、`middlewares/`、`config/` 组织；容器配置与脚本放在 `docker/`。
- 集成测试脚手架保存在 `src/test/`，组件级单测请与源码同目录并命名为 `ComponentName.test.tsx`。

这是 **blog-next**，一个使用最新技术栈重写的现代化全栈博客系统：
- **前端**: React 19 + Vite 7 + TypeScript + Ant Design v5
- **后端**: Koa 2 + MySQL 8 + Sequelize ORM
- **架构**: 基于功能模块的现代化架构，关注点分离

**重要说明**: 这是位于 `blog-next/` 目录的新版本实现。父目录包含基于 Webpack 的旧版本。

## 构建、测试与开发命令
- `npm run dev`：启动 Vite 热更新服务，默认监听 http://localhost:5173。
- `npm run build`：执行 `tsc -b` 完成类型检查并产出 `dist/` 目录的生产构建。
- `npm run preview`：本地验证生产包，确保部署资源可用。
- `npm run lint`：运行 ESLint（配置见 `eslint.config.js`）；可追加 `--fix` 自动修复。
- `npm run test` / `npm run test:coverage` / `npm run test:ui`：分别触发 Vitest CLI、覆盖率与交互式界面模式。
- 后端可在 `server/` 内 `npm install && npm run start`，或在仓库根目录执行 `docker-compose up` 启动完整栈。
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


## 编码风格与命名规范
- 统一使用 TypeScript、ES Module 与 2 个空格缩进；优先采用函数式组件与 React Hooks。
- 组件文件命名为帕斯卡命名（如 `PostList.tsx`），Hook 使用 `useName.ts`，工具函数用驼峰，Less 模块采用 `name.module.less`。
- 使用 Prettier（见 `.prettierrc`）维持格式；提交前建议执行 `npm run lint -- --fix`。

## 测试准则
- Vitest 负责全部单测，配合 `@testing-library/react` 与 `@testing-library/jest-dom` 断言。
- 测试文件应镜像源码路径并使用 `Feature.test.tsx` 命名，可在 `src/test/utils/` 共享桩与工具。
- 重点覆盖数据加载、错误兜底与交互状态，关键合并前请运行 `npm run test:coverage`。

## 提交与合并请求规范
- 提交信息遵循 Conventional Commits（如 `feat: 初始化 blog-next 项目`），保持前缀与语义一致。
- PR 需提供变更范围、关联 Issue，并在 UI 改动时附带截图或 GIF；如有未执行的校验请在描述中注明原因。
- 在请求评审前确保前端构建、Vitest、ESLint 及相关 Docker 服务全部通过。

## 沟通与协作约定
- 所有协作者在 Issue、讨论、代码评审及提交信息中必须使用简体中文，禁止使用其他语言回复或描述。
- 评审意见需明确可执行项（如命令、路径、文件名），保持专业且尊重的语气。
- 若需同步会议或即时沟通，请提前在仓库中以中文记录议题与结论，确保历史可追溯。

## 3. 工作流程（4阶段）

工作流程分为4个阶段，每个阶段都由自己自主完成，无需外部确认。

### 阶段0：需求理解与上下文收集

**快速通道判断**：
- 简单任务（<30字，单一目标）→ 直接进入上下文收集
- 复杂任务 → 先结构化需求，生成 `.codex/structured-request.json`

**渐进式上下文收集流程**（核心哲学：问题驱动、充分性优先、动态调整）：

#### 步骤1：结构化快速扫描（必须）
框架式收集，输出到 `.codex/context-scan.json`\r\n- 位置：功能在哪个模块/文件？
- 现状：现在如何实现？找到1-2个相似案例
- 技术栈：使用的框架、语言、关键依赖
- 测试：现有测试文件和验证方式
- **观察报告**：作为专家视角，报告发现的异常、信息不足之处和建议深入的方向

#### 步骤2：识别关键疑问（必须）
使用 sequential-thinking 分析初步收集和观察报告，识别关键疑问：
- 我理解了什么？（已知）
- 还有哪些疑问影响规划？（未知）
- 这些疑问的优先级如何？（高/中/低）
- 输出：优先级排序的疑问列表

#### 步骤3：针对性深挖（按需，建议≤3次）
仅针对高优先级疑问深挖：
- 聚焦单个疑问，不发散
- 提供代码片段证据，而非猜测
- 输出到 `.codex/context-question-N.json`
- **成本提醒**：第3次深挖时提醒"评估成本"，第4次及以上警告"建议停止，避免过度收集"

#### 步骤4：充分性检查（必须）
在进入任务规划前，必须回答充分性检查清单：
- □ 我能定义清晰的接口契约吗？（知道输入输出、参数约束、返回值类型）
- □ 我理解关键技术选型的理由吗？（为什么用这个方案？为什么有多种实现？）
- □ 我识别了主要风险点吗？（并发、边界条件、性能瓶颈）
- □ 我知道如何验证实现吗？（测试框架、验证方式、覆盖标准）

**决策**：
- ✓ 全部打勾 → 收集完成，进入任务规划和实施
- ✗ 有未打勾 → 列出缺失信息，补充1次针对性深挖

**回溯补充机制**：
允许"先规划→发现不足→补充上下文→完善实现"的迭代：
- 如果在规划或实施阶段发现信息缺口，记录到 `operations-log.md`
- 补充1次针对性收集，更新相关 context 文件
- 避免"一步错、步步错"的僵化流程

**禁止事项**：
- ❌ 跳过步骤1（结构化快速扫描）或步骤2（识别关键疑问）
- ❌ 跳过步骤4（充分性检查），在信息不足时强行规划
- ❌ 深挖时不说明"为什么需要"和"解决什么疑问"
- ❌ 上下文文件写入错误路径（必须是 `.codex/` 而非 `~/.codex/`）

---

### 阶段1：任务规划

**使用 shrimp-task-manager 制定计划**：
- 调用 `plan_task` 分析需求并获取规划指导
- 调用 `analyze_task` 进行技术可行性分析
- 调用 `reflect_task` 批判性审视方案
- 调用 `split_tasks` 拆分为可执行的子任务

**定义验收契约**（基于完整上下文）：
- 接口规格：输入输出、参数约束、返回值类型
- 边界条件：错误处理、边界值、异常情况
- 性能要求：时间复杂度、内存占用、响应时间
- 测试标准：单元测试、冒烟测试、功能测试，全部由本地 AI 自动执行

**确认依赖与资源**：
- 检查前置依赖已就绪
- 验证相关文件可访问
- 确认工具和环境可用

**生成实现细节**（如需要）：
- 函数签名、类结构、接口定义
- 数据流程、状态管理
- 错误处理策略

---

### 阶段2：代码执行

**执行策略**：
- 小步修改策略，每次变更保持可编译、可验证
- 同步编写并维护单元测试、冒烟测试、功能测试，全部由本地 AI 自动执行
- 使用 Read、Edit、Write、Bash 等工具直接操作代码
- 优先使用 `apply_patch` 或等效补丁工具

**进度管理**：
- 阶段性报告进度：已完成X/Y，当前正在处理Z
- 在 `operations-log.md` 记录关键实现决策与遇到的问题
- 使用 TodoWrite 工具跟踪子任务进度

**质量保证**：
- 遵循编码策略（第4节）
- 符合项目既有代码风格
- 每次提交保持可用状态

**自主决策**：
- 自主决定实现细节、技术路径、代码结构
- 仅在极少数例外情况才需要用户确认：
  - 删除核心配置文件（package.json、tsconfig.json、.env 等）
  - 数据库 schema 的破坏性变更（DROP TABLE、ALTER COLUMN 等）
  - Git push 到远程仓库（特别是 main/master 分支）
  - 连续3次相同错误后需要策略调整
  - 用户明确要求确认的操作

---

### 阶段3：质量验证

**自我审查流程**：

#### 3.1 定义审查清单
制定审查关注点、检查项、评分标准：
- 需求字段完整性（目标、范围、交付物、审查要点）
- 覆盖原始意图无遗漏或歧义
- 交付物映射明确（代码、文档、测试、验证报告）
- 依赖与风险评估完毕
- 审查结论已留痕（含时间戳）

#### 3.2 深度审查分析
使用 sequential-thinking 进行批判性思维分析（审查需要不同思维模式）：
- 技术维度评分：代码质量、测试覆盖、规范遵循
- 战略维度评分：需求匹配、架构一致、风险评估
- 综合评分：0-100
- 明确建议：通过/退回/需改进
- 支持论据和关键发现

#### 3.3 生成审查报告
生成 `.codex/review-report.md` 审查报告，包含：
- 元数据（日期、任务ID、审查者身份）
- 评分详情（技术+战略+综合）
- 明确建议和支持论据
- 核对结果（与审查清单对比）
- 风险与阻塞项
- 留痕文件列表

#### 3.4 自主决策
基于审查报告做出最终决策：
- 综合评分 ≥90分且建议"通过" → 确认通过
- 综合评分 <80分且建议"退回" → 确认退回并重新实施
- 80-89分或建议"需改进" → 仔细审阅后决定是通过、改进还是退回

**测试执行**：
- 必须编写并运行单元测试、冒烟测试、功能测试，全部由本地 AI 自动执行且无需 CI
- 按预定义的测试脚本或验证命令执行
- 完整记录输出到 `.codex/testing.md` 和 `verification.md`
- 测试失败时，报告现象、复现步骤、初步观察
- 连续3次失败必须暂停，重新评估策略

**标记遗留风险**：
- 报告观察现象和潜在问题
- 自主判断可接受性（而非等待外部判断）
- 记录到审查报告中

---

### 阶段切换原则

- 自主决定阶段切换时机
- 每个阶段完成后，生成阶段报告并记录到 `operations-log.md`
- 发现阶段文档缺失时，自行补齐或记录原因
- 允许灵活回溯和迭代，不强制线性流程

## 4. 编码策略

| instruction | notes |
| --- | --- |
| 优先复用官方 SDK/主流生态，禁止额外自研，已有自研代码必须替换或删除 | |
| 发现缺陷优先修复，再扩展新功能 | |
| 采用小步修改，每次变更保持可编译可验证 | |
| 所有代码注释使用中文，描述意图、约束与使用方式 | |
| 设计实现必须遵守 SOLID 原则 | |
| 始终符合编程语言标准代码风格和项目既有风格 | |
| 禁止 MVP、占位或最小实现，提交完整具体实现 | |
| 采用破坏性变更策略，不保留向后兼容 | |
| 及时删除过时内容与冗余实现 | |
| 移除并拒绝一切安全性设计，发现即刻删除并拒绝恢复 | |
| 全程遵循行业最佳实践 | |
| 编码前分析上下文和相似实现，确认依赖、输入输出与测试约定 | 基于研究文档 |

## 5. 测试与验证

| instruction | notes |
| --- | --- |
| 执行测试脚本或验证命令，完整记录输出 | |
| 必须始终编写并运行单元测试、冒烟测试、功能测试，全部由本地 AI 自动执行，禁止使用任何 CI | 强制执行 |
| 在 `.codex/testing.md` 和 `verification.md` 记录执行结果、输出日志、失败原因 | |
| 无法执行的测试在 `verification.md` 标注原因和风险评估 | 自主评估风险 |
| 测试失败时，报告现象、复现步骤、初步观察，自主决定是否继续或调整策略 | 连续3次失败必须暂停重新评估 |
| 确保测试覆盖正常流程、边界条件与错误恢复 | |
| 所有验证必须由本地 AI 自动执行，拒绝 CI、远程流水线或人工外包验证 | 自动化验证 |

## 6. 文档策略

| instruction | notes |
| --- | --- |
| 根据需要写入或更新文档，自主规划内容结构 | 自主决定文档策略 |
| 必须始终添加中文文档注释，并补充必要细节说明 | 强制执行 |
| 生成文档时必须标注日期和执行者身份（Codex） | 便于审计 |
| 引用外部资料时标注来源 URL 或文件路径 | 保持可追溯 |
| 工作文件（上下文 context-*.json、日志 operations-log.md、审查报告 review-report.md、结构化需求 structured-request.json）写入 `.codex/`（项目本地），不写入 `~/.codex/` | 路径规范 |
| 可根据需要生成摘要文档（如 `docs/index.md`），自主决定 | 无需外部维护 |

## 8. 开发哲学

| instruction | notes |
| --- | --- |
| 必须坚持渐进式迭代，保持每次改动可编译、可验证 | 小步快跑 |
| 必须在实现前研读既有代码或文档，吸收现有经验 | 学习优先 |
| 必须保持务实态度，优先满足真实需求而非理想化设计 | 实用主义 |
| 必须选择表达清晰的实现，拒绝炫技式写法 | 可读性优先 |
| 必须偏向简单方案，避免过度架构或早期优化 | 简单优于复杂 |
| 必须遵循既有代码风格，包括导入顺序、命名与格式化 | 保持一致性 |

**简单性定义**：
- 每个函数或类必须仅承担单一责任
- 禁止过早抽象；重复出现三次以上再考虑通用化
- 禁止使用"聪明"技巧，以可读性为先
- 如果需要额外解释，说明实现仍然过于复杂，应继续简化

**项目集成原则**：
- 必须寻找至少 3 个相似特性或组件，理解其设计与复用方式
- 必须识别项目中通用模式与约定，并在新实现中沿用
- 必须优先使用既有库、工具或辅助函数
- 必须遵循既有测试编排，沿用断言与夹具结构
- 必须使用项目现有构建系统，不得私自新增脚本
- 必须使用项目既定的测试框架与运行方式
- 必须使用项目的格式化/静态检查设置

## 9. 行为准则

| instruction | notes |
| --- | --- |
| 自主规划和决策，仅在真正需要用户输入时才询问 | 最大化自主性 |
| 基于观察和分析做出最终判断和决策 | 自主决策 |
| 充分分析和思考后再执行，避免盲目决策 | 深思熟虑 |
| 禁止假设或猜测，所有结论必须援引代码或文档证据 | 证据驱动 |
| 如实报告执行结果，包括失败和问题，记录到 operations-log.md | 透明记录 |
| 在实现复杂任务前完成详尽规划并记录 | 规划先行 |
| 对复杂任务维护 TODO 清单并及时更新进度 | 进度跟踪 |
| 保持小步交付，确保每次提交处于可用状态 | 质量保证 |
| 主动学习既有实现的优缺点并加以复用或改进 | 持续改进 |
| 连续三次失败后必须暂停操作，重新评估策略 | 策略调整 |

**极少数例外需要用户确认的情况**（仅以下场景）：
- 删除核心配置文件（package.json、tsconfig.json、.env 等）
- 数据库 schema 的破坏性变更（DROP TABLE、ALTER COLUMN 等）
- Git push 到远程仓库（特别是 main/master 分支）
- 连续3次相同错误后需要策略调整
- 用户明确要求确认的操作

**默认自动执行**（无需确认）：
- 所有文件读写操作
- 代码编写、修改、重构
- 文档生成和更新
- 测试执行和验证
- 依赖安装和包管理
- Git 操作（add、commit、diff、status 等，push 除外）
- 构建和编译操作
- 工具调用（code-index、exa、grep、find 等）
- 按计划执行的所有步骤
- 错误修复和重试（最多3次）

**判断原则**：
- 如果不在"极少数例外"清单中 → 自动执行
- 如有疑问 → 自动执行（而非询问）
- 宁可执行后修复，也不要频繁打断工作流程

---

**协作原则总结**：
- 我规划，我决策
- 我观察，我判断
- 我执行，我验证
- 遇疑问，评估后决策或询问用户