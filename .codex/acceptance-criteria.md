# 验收契约 (Codex / 2025-10-06)

## 归档接口与页面
- 后端 GET /article/archives 返回 200，结构为 { years: ArchiveYear[]; total: number }，年份倒序，月份内文章包含 id/title/category/tags/viewCount/likeCount/commentCount/createdAt。
- 新增归档控制器经过单元测试覆盖：成功路径、空数据、数据库异常 500。
- 前端 useArchives 与 ArchivesPage 使用新的对象结构渲染年份、月份及总文章数，Vitest 覆盖加载、空态、正常态。

## Web 路由接入
- src/app/routes/routes.config.tsx 中 categories/:name、	ags/:name、bout、/login 指向真实组件，不再出现占位页面。
- 新增 GithubLoginingPage 可触发 useGithubAuth.startGithubAuth、展示加载或错误提示，并在缺失 VITE_GITHUB_CLIENT_ID 时给出友好提示。
- 路由配置提供 Vitest 快照/断言，验证这些路径的 element 类型及受保护路由行为。

## 后台统计与监控规划
- 梳理 /record 与 /monitor 相关后端能力，形成回归方案（步骤、接口、依赖）并写入 REIMPLEMENTATION_STATUS.md 对应条目。
- 为批量操作、监控页列出待实现子任务与风险，应至少覆盖 API 差距、前端组件待移植、实时通道校验。

## 文档与质量
- REIMPLEMENTATION_STATUS.md 勾选或更新上述条目标记，附最新进度说明。
- 新增或更新文档（若有）标注日期与执行者 Codex。
- 
pm run lint、
pm run test -- --run 均需通过，相关日志写入 .codex/testing.md 与 erification.md。
