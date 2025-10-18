# Legacy Parity Checklist

## Completed
- [x] Align fragment route naming (`/fragment` vs `/fragments`) so both hit `FragmentPage`.
- [x] Reimplemented fragment CRUD in the admin area with React 19 + TanStack Query + Ant Design.
- [x] Share article page (`/article/share/:uuid`) reproduces the legacy read-only flow.
- [x] Welcome and 404 pages rebuilt with parity and Vitest coverage.
- [x] Category/tag/about/login routes now mount real pages (see `src/app/routes/routes.config.tsx`).
- [x] `GET /article/archives` restored on the Koa backend and consumed by `ArchivesPage`.
- [x] Admin article analytics page (`/admin/article/graph`) rebuilt with @ant-design/plots.
- [x] Article manager bulk actions restored (export, visibility, pin/unpin, share) using new hooks and APIs.
- [x] GitHub login loading UX reintroduced via `GithubLoginingPage` and router wiring.
- [x] Admin monitor page now renders live CPU/内存/FPS/导航数据，接入 `useSystemMonitor` + `usePerformanceStore`（`src/features/admin/pages/Monitor.tsx`）。
- [x] Homepage embeds GitHub contribution heatmap via TanStack Query + `react-calendar-heatmap`（`GithubContribution` 组件）。

## In Progress
- [ ] None — parity gaps已全部补齐。本节如有新增缺口再补充。

## Regressions / Missing
- 无

## Important Notes

- **重要说明**: 这是位于 `blog-next/` 目录的新版本实现，使用现代化技术栈（React 19 + Vite 7 + TypeScript + Ant Design v5）重写。父目录包含基于 Webpack 的旧版本，本项目已完全重新实现了旧版本的所有核心功能，并在此基础上进行了现代化重构和功能增强。

## Next Steps

1. 持续关注 socket.io 数据源与 GitHub 抓取接口的稳定性（可在测试环境增加模拟服务）。
2. 若未来扩展指标，可在 `performanceStore` 中补充更多字段并编写对应测试。
