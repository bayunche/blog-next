## Why

The current public site is effectively locked into dark mode even though the active `public-blog` specification requires persisted theme preferences. The root layout hard-codes the document to `data-theme="dark"`, there is no reader-facing theme toggle in the top-right navigation area, and there is no `prefers-color-scheme` handling for first-time visitors.

That leaves three product gaps:

- readers cannot switch between light mode and dark mode
- first-time visitors do not get a theme that follows their operating-system preference
- returning visitors cannot have a saved manual choice restored on load

This change restores theme choice as an explicit public-site capability and aligns the implementation with the existing product contract.

## What Changes

- Add a public-site theme switcher button in the top-right navigation area on desktop and mobile.
- Support three theme states in the public experience: `system`, `light`, and `dark`.
- Default first-time visitors to `system`, using the browser's `prefers-color-scheme` result to resolve the active theme.
- Persist a reader's explicit theme choice in browser storage and restore it before the public UI fully paints.
- Update global theme tokens so both light and dark presentations are first-class supported modes instead of a dark-only baseline.
- Keep the change scoped to the public blog experience; admin workflows, backend routes, database schema, uploads, and external service contracts remain unchanged.

## Capabilities

### Modified Capabilities
- `public-blog`: strengthen the public reading contract so readers can switch between light and dark themes, follow system theme by default, and have explicit theme preferences restored on later visits.

### Unchanged Capabilities
- `admin-backoffice`: no functional change to authenticated editorial workflows or admin navigation contracts.
- `content-api`: no change to article, taxonomy, auth-protected management, or upload-serving API contracts.
- `runtime-operations`: no new environment variables, deployment behavior, runtime services, or Docker changes are introduced.
- MySQL schema and data model: no schema, seed, or migration work is required because theme preference remains client-side only.

## Impact

- Public frontend behavior (`src/`): directly affected. The root layout, global CSS theme tokens, shared public chrome, and comment/embed theme wiring must be updated together so the active theme is coherent across all public routes.
- Backoffice flows (`src/app/admin/`): intentionally unchanged for this change. Admin pages may continue using the existing visual baseline unless a later approved change expands theme support there.
- Backend API and auth (`server/`): no Koa route, controller, model, auth, or rewrite changes are expected.
- MySQL schema, seeds, and migrations: no schema or data migration work is required because theme preference stays in browser storage.
- Asset uploads, image bed integration, and music-related integrations: no service contract change is expected, but reader-facing surfaces such as the music player must respect the active public theme.
- Build, lint, test, Docker, and runtime behavior: no Docker or runtime contract change is intended. Targeted frontend validation is required, while the repository's known `lint` noise and missing `lightningcss` build dependency remain external risks.
- Security and secrets handling: no secret rotation or credential changes are involved, and tracked local configuration such as `openclaw.json` must remain untouched.
- Rollback and observability: rollback is limited to removing the theme switcher and restoring a fixed theme baseline. No new backend telemetry is introduced, so manual UI verification remains the primary validation method.
- Documentation: the `public-blog` OpenSpec baseline must explicitly describe the right-top theme control, system-theme default, and persisted manual selection behavior.

## Implementation Notes For Review

- There is an existing unarchived change at `openspec/changes/simplify-public-theme-to-dark-only` whose direction conflicts with this request. This proposal intentionally supersedes that dark-only direction for the public reading experience.
- The requested "button in the top-right corner" is interpreted as the public navbar action cluster on desktop and the same action cluster within the mobile header/menu experience.
- To avoid a flash of the wrong theme on first paint, the implementation will need an early theme bootstrap step rather than a client-only post-hydration switch.
