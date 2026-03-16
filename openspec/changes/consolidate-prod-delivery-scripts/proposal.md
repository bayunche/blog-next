## Why

Production delivery now has overlapping script entrypoints with no stable contract for operators:

- `build_docker_prod.sh` and `build_docker_prod.ps1` perform a production `docker compose up -d --build` flow.
- `build.sh` already covers production-vs-development selection, build-only execution, image export, image push, and service startup.
- Documentation still points operators at the older script names, so the repository presents multiple "official" ways to do the same production build/deploy work.
- The image-export path is not backed by one shared image-naming contract. `build.sh` assumes `sakurairo-*` image names, while the offline packaging flow and offline compose manifest assume `blog-sakurairo-*`, and the main compose manifest does not currently define explicit image names for the built services.

This needs to be treated as one runtime-operations change rather than as ad hoc script cleanup, because the drift now affects deployment behavior, image export behavior, documentation, and the reliability of any secondary workflow that expects the same built images.

## What Changes

- Define one canonical production delivery entrypoint that supports the production build/deploy flow and the production build/export flow.
- Converge redundant production script logic onto that canonical entrypoint and reduce remaining OS-specific scripts to thin wrappers only when they are still required for operator ergonomics.
- Make runtime image references explicit and shared so deployment, export, and related packaging workflows resolve the same built images.
- Update runtime-operations requirements and operator documentation so the supported production workflow is unambiguous.
- Keep offline bundle assembly out of the primary merge scope, but align it with the same image-reference contract so it does not maintain a conflicting naming convention.

## Capabilities

### Modified Capabilities
- `runtime-operations`: production delivery gains a single documented entrypoint for build/deploy/export behavior, and runtime image identity becomes an explicit contract instead of an implicit side effect of compose project naming.

### Unchanged Capabilities
- `public-blog`: no frontend behavior change is planned.
- `admin-backoffice`: no backoffice flow change is planned.
- `content-api`: no Koa route, controller, model, or auth behavior change is planned.
- `engineering-governance`: OpenSpec review gating remains unchanged.
- MySQL schema, seeds, and migrations: no database change is planned.
- Asset uploads, image-bed integration, and music-related integrations: no functional integration change is planned beyond keeping runtime packaging references consistent.

## Impact

- Public frontend behavior (`src/`): intentionally unaffected. The public site should continue to consume the same runtime endpoints and assets after the script consolidation.
- Backoffice flows (`src/app/admin/`): intentionally unaffected. Admin authoring and taxonomy management flows should not change.
- Backend API and auth (`server/`): intentionally unaffected. The Koa service contract and authentication boundaries remain the same.
- MySQL schema, seeds, and migrations: intentionally unaffected. No schema, data, or migration work is required.
- Asset uploads, image bed integration, and music-related integrations: intentionally unaffected at the feature level. Only runtime image/build orchestration is touched.
- Build, lint, test, Docker, and runtime environment behavior: directly affected. Compose image naming, script entrypoints, and operator docs change. Validation must focus on script behavior and compose resolution, while the repository's known `npm run build` and `npm run lint` issues remain separate baseline risks.
- Security, secrets handling, rollback, observability, and documentation:
  - No new secret source is introduced, but production env-file handling must stay explicit so script consolidation does not accidentally broaden where credentials are copied or exported.
  - Rollback is a script/documentation rollback only; no application data rollback is required.
  - No new observability surface is planned.
  - Deployment documentation must clearly separate online production deploy from offline/distributable image packaging.

## Implementation Notes For Review

- The main repository concern is not simply "too many files"; it is that script responsibilities and image names have already drifted. The approved implementation should fix the contract first, then remove duplication.
- The consolidation target is the production deploy/export path. Full redesign of the offline bundle generator is not part of this request, although that workflow must remain compatible with the shared image-reference contract.
- The existing `build.sh` is the natural candidate for the canonical production entrypoint because it already exposes production selection, non-starting build behavior, and export/push flags. The design phase will define whether the final user-facing name stays `build.sh` or moves to a renamed canonical wrapper.
