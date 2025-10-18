# blog-next legacy parity report

Updated: 2025-10-07 · Author: Codex

## Summary
- Admin monitor now consumes real-time metrics from `performanceStore` and socket.io; charts replaced static stubs.
- Homepage restores the GitHub contributions heatmap powered by TanStack Query + `react-calendar-heatmap`.
- No remaining functional gaps versus the legacy Webpack implementation.

## Parity status
| Area | Legacy reference | Current implementation | Status |
| --- | --- | --- | --- |
| Frontend routes | `../src/router/index.jsx` | `src/app/routes/routes.config.tsx` | ✅ parity |
| Archives page | `../server/controllers/article.js#getArchives` | `server/router/article.js:25` + `src/features/article/pages/ArchivesPage.tsx` | ✅ parity |
| Category/tag detail | `../src/views/web/categories` / `tag` | `CategoryDetailPage` / `TagDetailPage` | ✅ parity |
| About page | `../src/views/web/about/index.jsx` | `src/features/about/pages/AboutPage.tsx` | ✅ parity |
| GitHub login loading | `../src/components/GithubLogining/index.jsx` | `src/features/auth/pages/GithubLoginingPage.tsx` | ✅ parity |
| Admin article analytics | `../src/views/admin/article/graph/index.jsx` | `src/features/admin/pages/ArticleAnalytics.tsx` | ✅ parity |
| Admin article bulk actions | `../src/views/admin/article/manager/components/BatchActions.jsx` | `src/features/admin/pages/ArticleManager.tsx` + hooks/APIs | ✅ parity |
| Admin monitor realtime metrics | `../src/views/admin/monitor/index.jsx` | `src/features/admin/pages/Monitor.tsx` + `useSystemMonitor`/`usePerformanceMonitor` | ✅ parity |
| Homepage GitHub contributions | `../src/views/web/home/Contribution.jsx` | `GithubContribution` 组件复刻热力图 | ✅ parity |

## Follow-up
- 监控页依赖的 socket.io 服务若在开发环境缺席，可在 tests 中扩展更多 mock 覆盖。
- GitHub 贡献抓取基于 GitHub HTML，后续可考虑缓存或降级策略，减少外网波动。
- 按需扩展更多监控指标时，记得同步更新 `performanceStore`、路由测试与文档。

## Verification log
- 2025-10-07 `npm run lint`
- 2025-10-07 `npm run test -- --run`

## References
- Legacy monitor: `../src/views/admin/monitor/index.jsx`
- Legacy contribution widget: `../src/views/web/home/Contribution.jsx`
- Current parity matrix: `.codex/legacy-parity-matrix.json`
