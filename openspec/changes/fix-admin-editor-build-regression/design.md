## Context

The admin article editor now includes managed upload flows for cover images, card-cover images, and inline Markdown image insertion. That capability crosses rich-editor commands, async upload helpers, and React hook memoization. The current regression occurs because `handleInlineImageUpload` is memoized with a dependency on `uploadArticleImageFile` before `uploadArticleImageFile` is declared as a block-scoped callback.

JavaScript runtime semantics would eventually initialize both callbacks during component setup, but TypeScript correctly rejects the lexical reference because the dependency array closes over a variable before its declaration. In practice, that means the shared Next.js production build cannot compile the admin bundle, which in turn blocks the `web` Docker image from being produced.

Deployment validation also exposed a second regression in the backend runtime path: `server/controllers/article.js` contains corrupted string literals in `initAboutPage()`, leaving an unterminated string that causes `node app.js` to abort during module loading. Because the Koa service fails before startup completes, Nginx returns `502` even though the image itself builds successfully.

The operator also requested a dedicated SQL import script. The current offline delivery flow relies on `docker-entrypoint-initdb.d` SQL hooks, which only run on first initialization of an empty MySQL data volume. That is not sufficient when someone needs to re-import the delivered dump into an already-initialized deployment.

## Goals / Non-Goals

**Goals**

- Remove the block-scoped callback ordering regression in `ArticleEditor`.
- Preserve the existing editorial upload UX and error/fallback messaging.
- Prove the frontend production bundle can compile again through targeted build validation.
- Restore syntactic validity of the article controller so the Koa API can start normally again.
- Rebuild the backend image and offline bundle artifact so deployment outputs match the repaired source tree.
- Refresh the checked-in offline shell bundle artifact so operators using `dist/offline-bundle-sh-latest` receive the rebuilt production images.
- Provide an operator-run SQL import helper script in the offline shell bundle so the shipped dump can be loaded on demand into a running MySQL service.
- Keep the blast radius confined to the admin editor and build verification.

**Non-Goals**

- Redesign the article editor UI or media workflow.
- Change PicUI, local upload, or backend upload contracts.
- Introduce schema, migration, or seed updates.
- Redesign About-page bootstrap behavior or article-controller route logic beyond repairing the broken syntax.
- Solve unrelated repository-wide lint noise or every other pre-existing build risk beyond this blocking regression.
- Replace the existing first-run SQL initialization mechanism; the new script is an explicit fallback path, not a new default bootstrap behavior.

## Decisions

### Decision: Reorder or structurally lift the shared upload helper before dependent memoized callbacks

The cleanest fix is to ensure `uploadArticleImageFile` is declared before any memoized callback or command configuration that depends on it. This keeps the current React hook model intact while removing the lexical reference error that stops TypeScript compilation.

Why:

- it resolves the immediate build blocker at the source
- it preserves the current upload helper contract used by cover, card-cover, and inline image flows
- it avoids unnecessary surface changes across the editor UI

Impacted areas:

- `ArticleEditor` hook/callback ordering
- inline-image command creation
- shared upload helper reuse across editor media controls

### Decision: Keep the inline-image command behavior unchanged once the callback wiring is corrected

The current user-facing workflow already matches the intended product direction: an administrator chooses an image file, the upload helper attempts provider-backed upload first, and the editor inserts Markdown using the resolved URL. This change should not alter button placement, messaging semantics, or fallback logic unless required to keep behavior correct.

Why:

- the user asked for a targeted error fix, not a workflow redesign
- minimizing behavior change reduces regression risk in the editor
- the overlapping image-bed change remains the functional owner of the upload experience

### Decision: Repair the controller syntax by restoring plain valid default About-page strings, not by removing the bootstrap path

The backend failure sits in the default data inserted by `initAboutPage()`. The right fix is to restore valid JavaScript string literals so the existing bootstrap path still works, rather than commenting out the About-page initialization or changing controller flow.

Why:

- it removes the startup crash at the true source
- it preserves the current contract that a missing About page is auto-seeded
- it avoids turning a syntax repair into a behavioral change for content bootstrapping

### Decision: Validate with the same production-oriented build path that exposed the regression

Because the failures surfaced during actual deployment validation, acceptance should include the same or equivalent production build/runtime paths instead of relying only on lighter static checks.

Why:

- it confirms the actual deployment blocker is removed
- it catches any additional admin-bundle compile issue hidden behind the current error
- it keeps validation aligned with the operational symptom that triggered this change
- it ensures the backend not only builds, but also parses cleanly enough to start

### Decision: Refresh the existing offline shell bundle in place instead of regenerating a brand-new distribution structure

The repository already contains a known delivery directory at `dist/offline-bundle-sh-latest`. For this scoped repair, the safest delivery action is to replace the image archive inside that existing bundle with the rebuilt production stack rather than reshaping the rest of the bundle layout.

Why:

- it preserves the operator-facing import flow and file paths already in use
- it limits the delivery delta to the images affected by the build-regression fix
- it avoids accidental drift in unrelated offline bundle contents such as SQL, env templates, and helper scripts

### Decision: Add a standalone import script that wraps the shipped compose/env/SQL paths

The manual import path should be packaged as a first-party script inside `dist/offline-bundle-sh-latest`, alongside the existing `import-offline.sh`, so operators can load `server/db/prod_full_import.sql` into the running MySQL service without hand-crafting the `docker exec` command.

Why:

- it reduces operator error in offline/manual restore workflows
- it complements the first-run MySQL init hook instead of replacing it
- it keeps the import process aligned with the exact directory layout being delivered

## Alternatives Considered

### Alternative: Suppress the error by weakening TypeScript or changing build settings

Rejected because the failure points to a real callback-ordering bug in application code. Lowering type safety would hide the symptom instead of restoring a reliable production build.

### Alternative: Bypass the server crash by removing the article controller import or disabling About-page bootstrap

Rejected because the runtime failure is caused by corrupted source text, not an intentionally unsupported feature. Removing controller behavior would widen blast radius into API routing and content bootstrap semantics.

### Alternative: Remove the inline-image upload command temporarily

Rejected because it would roll back approved editor functionality and widen the user-visible impact of what should be a narrow build-stability repair.

### Alternative: Fold this work into the existing `integrate-picui-article-image-bed` change instead of a standalone fix

Considered, but rejected for execution planning because the current request is specifically to remove an urgent deployment blocker. A narrowly scoped follow-up change makes the build regression, validation, and approval boundary easier to review without reopening the whole provider-integration design.

### Alternative: Regenerate a fresh offline bundle from scratch and replace both `ps1` and `sh` distributions

Rejected for this scope because the user explicitly requested updating `dist/offline-bundle-sh-latest`. Rebuilding every offline bundle variant would widen blast radius into broader delivery artifact churn without adding value to this immediate repair.

### Alternative: Ask operators to run ad hoc `docker exec mysql < dump.sql` commands manually

Rejected because the user explicitly asked for a standalone script, and the offline bundle already follows a helper-script model for import/startup workflows.

## Risks / Trade-offs

- [Hidden neighboring type issues] Once this callback-ordering error is fixed, the production build may reveal additional admin-editor compile issues. Mitigation: use the real production build path as validation and document any newly exposed blockers immediately.
- [Behavior drift] Refactoring callback order could accidentally change retry/fallback behavior if helper state capture changes. Mitigation: keep the helper contract unchanged and validate upload-affordance wiring after the refactor.
- [Overlap with unarchived editor work] `ArticleEditor` is still touched by `integrate-picui-article-image-bed` and earlier responsive work. Mitigation: confine edits to the minimum hook-ordering area and keep the OpenSpec record explicit about that overlap.
- [Environment noise] Local host builds may still hit the known `lightningcss` dependency issue outside Docker. Mitigation: prioritize the Docker-based production build path that already reproduces the current regression in a controlled way.
- [Backend source corruption] Repairing one broken string literal may reveal other encoding-damaged controller lines nearby. Mitigation: run targeted syntax validation against `server/controllers/article.js` after the repair and rebuild the `server` image before refreshing delivery artifacts.
- [Artifact drift] The offline bundle can become inconsistent if only source images are rebuilt but the checked-in image tar remains stale. Mitigation: replace the bundle's `images/blog-sakurairo-images.tar` from the validated rebuilt production image set after build success.
- [Import-script drift] A manual import helper can drift from the bundle layout or env contract. Mitigation: keep it in the bundle root, point it at the shipped compose file and SQL path, and validate the script syntax before delivery.

## Migration Plan

1. Refactor the `ArticleEditor` callback ordering so shared upload helpers are declared before dependent memoized callbacks and editor commands.
2. Verify that cover, card-cover, and inline-image handlers still use the same upload helper and error messaging flow.
3. Repair the syntax-corrupted About-page bootstrap strings in `server/controllers/article.js`.
4. Re-run targeted production frontend build validation through the `web` image path and targeted backend syntax/runtime validation for the `server` path.
5. Add a standalone SQL import helper script to `dist/offline-bundle-sh-latest` so operators can manually import the shipped dump into MySQL after deployment.
6. Rebuild the validated `server` image and refresh `dist/offline-bundle-sh-latest/images/blog-sakurairo-images.tar` so the offline shell bundle matches the repaired production stack.
7. Record any residual risk if another pre-existing blocker appears after these regressions are removed.

Rollback strategy:

- revert the callback-ordering refactor in `ArticleEditor`
- restore the prior editor structure if the fix unexpectedly alters upload behavior
- no database, backend, or environment rollback is required

## Cross-System Impact Review

- Public frontend (`src/`): deployment buildability is directly affected because the admin bundle ships in the same Next.js application, but public reader behavior is intentionally unchanged.
- Backoffice (`src/app/admin/`): directly affected; the article editor must remain production-build compatible while preserving existing managed upload actions.
- Backend API (`server/`): intentionally unaffected; no upload endpoint or auth-boundary change is required.
- MySQL/data: intentionally unaffected; no schema, seed, or migration work is needed.
- Uploads/media/image bed/music: existing article-media behavior is preserved; this change only stabilizes the editor-side callback wiring.
- Build/test/runtime/Docker: directly affected through targeted production image rebuild validation, backend syntax/startup validation, and the follow-up refresh of the existing offline shell bundle image archive.
- Security/secrets: intentionally unaffected; no secret material should be edited or re-exposed.
- Observability/docs: no new runtime telemetry is added; OpenSpec artifacts are the primary documentation update.
