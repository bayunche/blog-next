# blog-next legacy parity report

Updated: 2025-10-06 · Author: Codex

## Summary
- The rewrite now covers fragment flows, article list/detail/share, archives, category/tag/about/login routes, and admin article analytics with bulk actions.
- Two legacy experiences are still missing: real-time data on the admin monitor page and the GitHub contribution heatmap on the homepage.
- Once the monitor is connected to socket.io and the contribution widget is restored, the project will reach functional parity with the Webpack-based legacy app.

## Parity status
| Area | Legacy reference | Current implementation | Status |
| --- | --- | --- | --- |
| Frontend routes | `../src/router/index.jsx` | `src/app/routes/routes.config.tsx` | ✅ real pages wired |
| Archives page | `../server/controllers/article.js#getArchives` | `server/router/article.js:25` + `src/features/article/pages/ArchivesPage.tsx` | ✅ restored |
| Category/tag detail | `../src/views/web/categories` / `tag` | `CategoryDetailPage` / `TagDetailPage` | ✅ restored |
| About page | `../src/views/web/about/index.jsx` | `src/features/about/pages/AboutPage.tsx` | ✅ restored |
| GitHub login loading | `../src/components/GithubLogining/index.jsx` | `src/features/auth/pages/GithubLoginingPage.tsx` | ✅ restored |
| Admin article analytics | `../src/views/admin/article/graph/index.jsx` | `src/features/admin/pages/ArticleAnalytics.tsx` + @ant-design/plots | ✅ restored |
| Admin article bulk actions | `../src/views/admin/article/manager/components/BatchActions.jsx` | `src/features/admin/pages/ArticleManager.tsx` + new hooks/APIs | ✅ restored |
| Admin monitor realtime metrics | `../src/views/admin/monitor/index.jsx` (socket.io) | `src/features/admin/pages/Monitor.tsx` (mock data) | ⚠️ missing |
| Homepage GitHub contributions | `../src/views/web/home/Contribution.jsx` | — | ⚠️ missing |

## Outstanding work
1. **Admin monitor data**
   - Connect `Monitor.tsx` to the existing `useSystemMonitor` / `usePerformanceMonitor` hooks and surface socket.io events.
   - Add integration tests or stories to exercise live updates.
2. **GitHub contribution heatmap**
   - Reintroduce the `/user/github/contributions` API client and TanStack Query hook.
   - Implement a contribution component (e.g. react-calendar-heatmap) and mount it on the home page.
   - Cover the component with Vitest snapshots and loading/error states.

## Verification plan
- After implementing the above, run `npm run test` and targeted Vitest suites for the monitor and home modules.
- Perform manual QA by running `npm run dev` (frontend) and `cd server && npm run dev` to confirm live updates and contribution data render correctly.
- Update this report and `REIMPLEMENTATION_STATUS.md` when parity is achieved.

## References
- Legacy monitor: `../src/views/admin/monitor/index.jsx`
- Legacy contribution widget: `../src/views/web/home/Contribution.jsx`
- Current parity matrix: `.codex/legacy-parity-matrix.json`
