## Why

The current production image rebuild surfaced a backoffice regression in `src/app/admin/components/ArticleEditor.tsx`: the inline-image upload callback references `uploadArticleImageFile` before that callback is declared. In local browsing this can stay hidden until the admin bundle is type-checked, but during the production `web` image build it stops Next.js compilation entirely.

This is not a request to expand article-media scope. The repository already accepted managed cover, card-cover, and inline upload behavior through the PicUI-oriented change work. The immediate need is to restore deployable behavior by removing the callback ordering regression without altering the intended editorial workflow.

During deployment validation, an additional server-side regression surfaced: `server/controllers/article.js` contains corrupted default About-page strings that break JavaScript parsing, causing the Koa service to crash on startup and produce `502` responses behind Nginx. That turns this change from a frontend-only build repair into a deployability recovery pass spanning the admin bundle, the backend boot path, and the refreshed offline delivery artifact.

## What Changes

- Repair the `ArticleEditor` callback/hook structure so the inline upload command no longer references an uninitialized block-scoped callback during production compilation.
- Preserve the current managed upload behavior for `cover`, `cardCover`, and inline Markdown images rather than redesigning the editor surface.
- Re-run targeted production build validation for the frontend image so the repository can confirm the admin editor no longer blocks deployment.
- Repair the `server/controllers/article.js` syntax corruption that currently crashes the Koa API during startup, while preserving the existing About-page bootstrap behavior.
- Rebuild the production `server` image after the syntax repair so runtime delivery artifacts no longer ship a server that exits on boot.
- Refresh the existing offline distribution bundle image archive so `dist/offline-bundle-sh-latest` carries the rebuilt production image set instead of the stale pre-fix image tar.
- Add a standalone operator-run SQL import helper script to `dist/offline-bundle-sh-latest` so database restoration does not depend only on first-run MySQL init hooks.
- Update OpenSpec capability deltas for admin authoring and runtime buildability to reflect that managed article-media controls must remain production-build compatible.

## Capabilities

### Modified Capabilities
- `admin-backoffice`: article authoring with managed media uploads must remain loadable after production compilation of the admin bundle.
- `content-api`: the article controller must remain syntactically valid so the API can boot and serve article routes, including About-page initialization.
- `runtime-operations`: the production frontend and backend images must remain deployable after approved changes are added to the shared application stack.
- `runtime-operations`: the offline shell bundle must provide both first-run SQL initialization and a supported manual import script for re-seeding an existing MySQL volume.

### Unchanged Capabilities
- `public-blog`: no reader-facing article rendering or navigation behavior is intended to change.
- `engineering-governance`: OpenSpec review gating remains unchanged.
- MySQL schema, seeds, and migrations: intentionally unaffected; this is a frontend build-compatibility fix only.
- Upload persistence, image-bed credentials, and music integrations: intentionally unaffected beyond preserving the already approved editor behavior.

## Impact

- Public frontend behavior (`src/`): no intended reader-visible change; the main effect is that the shared Next.js production build can complete again.
- Backoffice flows (`src/app/admin/`): directly affected. The article editor keeps its existing upload affordances, but their internal callback wiring is stabilized so the screen remains available in production bundles.
- Backend API and auth (`server/`): directly affected in a narrow way. The article controller source must parse cleanly again so the Koa process can boot, initialize the About page if needed, and continue serving existing article routes without altering route contracts or auth rules.
- MySQL schema, seeds, and migrations: no schema or data work is required.
- Asset uploads, image bed integration, and music-related integrations: existing behavior is preserved; no new provider capability or secret-handling surface is introduced.
- Build, lint, test, Docker, and runtime behavior: directly affected through production frontend build validation plus backend syntax/startup validation. The `web` and `server` image rebuilds are the primary acceptance checks for this fix, the existing offline bundle image archive must be refreshed to carry the rebuilt production stack, and the bundle now needs a dedicated manual SQL import helper for operational recovery workflows.
- Security, secrets handling, rollback, observability, and documentation:
- No secret values should be changed, logged, or restructured.
- Rollback is limited to reverting the editor callback refactor and the controller string/syntax repair if either introduces a new regression.
- No new telemetry surface is planned; targeted build validation remains the main confidence signal.
- Documentation/runtime-tooling impact is limited to the OpenSpec delta capturing the requirement that admin upload controls and offline delivery artifacts stay aligned with the current approved production build output, including a manual SQL import helper.

## Implementation Notes For Review

- This fix overlaps the unarchived `integrate-picui-article-image-bed` change because the current regression sits in the inline-image upload workflow introduced there. The goal here is to stabilize that accepted behavior, not redesign it.
- The known repository note about missing local Windows `lightningcss` remains true for some local host builds, but the current production Docker rebuild already proved there is also a real TypeScript regression in the admin editor. This change addresses that code-level blocker only.
- The offline deployment check also proved that the currently shipped `server` image can boot with a syntax error in `server/controllers/article.js`, because that file is copied into the image without a parse-time validation step during build. This change therefore includes a targeted backend syntax repair and image refresh.
