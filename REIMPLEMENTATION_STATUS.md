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

## In Progress
- [ ] Replace the admin monitor mock data with live socket.io metrics and collected frontend performance stats.
- [ ] Recreate the GitHub contribution heatmap section that lived in legacy `views/web/home/Contribution.jsx`.

## Regressions / Missing
- [ ] Monitor page (`src/features/admin/pages/Monitor.tsx`) still renders hard-coded stats instead of live data.
- [ ] Homepage lacks the GitHub contribution chart and related API call from the legacy implementation.

## Next Steps
1. Wire `Monitor` to the `useSystemMonitor` and `usePerformanceMonitor` hooks and ensure real socket.io events feed the UI.
2. Implement the GitHub contribution widget (API client, query hook, and UI) on the home page.
3. Run Vitest/E2E coverage on the new monitor and home modules to guard against regressions.
