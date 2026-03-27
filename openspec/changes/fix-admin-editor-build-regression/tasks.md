## 1. Admin Editor Stabilization

- [x] 1.1 Refactor `src/app/admin/components/ArticleEditor.tsx` so shared upload callbacks are declared before any memoized inline-image handler or editor command that depends on them.
- [x] 1.2 Preserve the existing `cover`, `cardCover`, and inline Markdown image upload behavior, including provider/local fallback messaging and retry flows.
- [x] 1.3 Repair the syntax-corrupted default About-page strings in `server/controllers/article.js` so the Koa API can parse and boot again without changing route behavior.

## 2. Production Build Validation

- [x] 2.1 Re-run the targeted production frontend build path that previously failed (`docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml build web`) and confirm the admin editor no longer blocks the `web` image build.
- [x] 2.2 Re-run targeted backend syntax/runtime validation (`node --check server/controllers/article.js` and production `server` image rebuild) so the repaired API no longer crashes on startup.
- [x] 2.3 Add a standalone import-SQL helper script to `dist/offline-bundle-sh-latest` so operators can manually load the shipped dump into MySQL after deployment.
- [x] 2.4 Replace `dist/offline-bundle-sh-latest/images/blog-sakurairo-images.tar` with an archive built from the validated rebuilt production image set so the existing offline shell bundle ships the fixed images.
- [x] 2.5 Record any residual validation risk if the build or startup checks reveal another pre-existing blocker after these regressions are removed.

## Validation Notes

- Fixed the original production build blocker by converting `uploadArticleImageFile` into a hoisted function declaration so `handleInlineImageUpload` no longer depends on a later block-scoped callback.
- The same production build then exposed two additional `ArticleEditor`-adjacent typing issues: optional `Upload` callbacks (`onSuccess` / `onError`) were invoked unsafely, and `articleApi.create` / `articleApi.update` accepted response-shaped `Article` input types instead of the editor's write payload shape. Both were corrected within this change.
- Validation completed successfully with `docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml build web`; the `blog-sakurairo-web:latest` image was rebuilt successfully.
- Rebuilt `server/controllers/article.js` into a clean, parseable version while preserving the active response shape additions (`cardCover`, `musicId`, `musicName`, normalized `category/categories/tags`, and the `getArchives` endpoint) so the Koa API can boot again after the offline deployment surfaced `SyntaxError: Invalid or unexpected token`.
- Validation completed successfully with `node --check server/controllers/article.js` and `node -e "require('./server/controllers/article')"`; the controller now parses and loads locally. Loading still emits the existing Sequelize operator deprecation warning, but it no longer crashes module startup.
- Validation completed successfully with `docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml build server`; the `blog-sakurairo-server:latest` image was rebuilt successfully.
- Validation also completed successfully inside the rebuilt image with `docker run --rm blog-sakurairo-server:latest node --check /app/controllers/article.js` and `docker run --rm blog-sakurairo-server:latest node -e "process.chdir('/app'); require('./controllers/article'); console.log('image-controller-ok')"`, confirming the packaged server image contains the repaired controller.
- Added `dist/offline-bundle-sh-latest/import-sql.sh` and documented it in `dist/offline-bundle-sh-latest/README-OFFLINE.md`; `bash -n dist/offline-bundle-sh-latest/import-sql.sh` completed successfully.
- Refreshed `dist/offline-bundle-sh-latest/images/blog-sakurairo-images.tar` from the validated production image set (`blog-sakurairo-web:latest`, `blog-sakurairo-server:latest`, `blog-sakurairo-music-api:latest`, `blog-sakurairo-db-backup:latest`, `mysql:8.0`, `nginx:alpine`, and `umputun/remark42:latest`).
- Residual risk: `server/router/article.js` still contains a pre-existing mojibake comment merge on line 28 that effectively comments out `.get('/output/all')` and `.get('/output/:id')`. This does not block server startup or the approved offline bundle repair, but those export routes should be corrected in a follow-up approved change.
