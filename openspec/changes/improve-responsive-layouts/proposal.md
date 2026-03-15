## Why

The current Next.js site has responsive issues that are no longer isolated to one or two pages. The mobile screenshots already show systemic failures:

- fixed-position reader utilities cover cards and article text instead of respecting mobile-safe areas
- desktop-biased card headers, badges, and timeline offsets compress or overlap on narrow screens
- shared public layout components assume desktop spacing and widths, so the same defects repeat across taxonomy pages, article detail pages, and informational pages
- the authenticated admin shell still reserves a desktop sidebar width and desktop table/editor composition, which makes narrow-viewport management workflows fragile

This means a page-by-page patch is not enough. The repository needs a single responsive-layout change that audits every active route family, updates shared layout contracts, and makes mobile behavior a maintained product constraint instead of an accidental by-product of desktop styling.

## What Changes

- Audit and remediate responsive behavior across all current public routes:
  `/`, `/posts`, `/posts/{id}`, `/categories/{name}`, `/tags/{name}`, `/archives`, `/about`, `/friends`, and `/login`.
- Audit and remediate responsive behavior across all current authenticated backoffice routes:
  `/admin`, `/admin/articles`, `/admin/articles/create`, `/admin/articles/edit/{id}`, `/admin/categories`, and `/admin/tags`.
- Introduce a shared responsive shell contract for top spacing, bottom safe-area spacing, overlay stacking, modal sizing, and mobile-first container behavior.
- Rework shared public components that currently create cross-page mobile defects, including navigation, floating toolbar, music player, table of contents, search modal, hero sections, topic cards, article cards, and desktop side content patterns.
- Rework backoffice navigation, table/list presentation, and editor composition so narrow-viewport management remains usable without horizontal clipping or inaccessible controls.
- Update the `public-blog` and `admin-backoffice` OpenSpec capabilities so responsive behavior is explicit in the source of truth.

## Capabilities

### Modified Capabilities
- `public-blog`: strengthen the public reading contract so all supported public pages remain readable and operable on narrow viewports, including floating reader utilities.
- `admin-backoffice`: strengthen the management contract so authenticated admin navigation, lists, and article editing remain usable on narrow viewports.

### Unchanged Capabilities
- `content-api`: no change to article, taxonomy, auth-protected management, or upload-serving API contracts.
- `runtime-operations`: no new environment variables, deployment behavior, rewrite rules, or runtime services are introduced.
- MySQL schema and data model: no schema, seed, or migration change is expected.

## Impact

- Public frontend behavior (`src/`): directly affected. The change will touch shared shell/layout behavior and route-specific presentation for public reading, taxonomy browsing, archives, about/friends pages, search, and article detail flows.
- Backoffice flows (`src/app/admin/`): directly affected. Mobile navigation, table/list management, dashboard summaries, and article create/edit screens will be restructured for narrow viewports.
- Backend API and auth (`server/`): no intended route, controller, model, auth, or rewrite changes are expected. Frontend requests continue using current API contracts.
- MySQL schema, seeds, and migrations: no schema or data migration work is expected because the change is presentation-only.
- Asset uploads, image bed integration, and music-related integrations: upload and music APIs remain unchanged, but their frontend surfaces must become mobile-safe. This includes article-editor upload controls and the public music player chrome.
- Build, lint, test, Docker, and runtime behavior: no Docker or runtime contract change is intended. Targeted frontend validation is required, while the repository's known `lint` noise and missing `lightningcss` build dependency remain external risks.
- Security and secrets handling: no secret rotation or credential changes are involved, and tracked local config such as `openclaw.json` must remain untouched.
- Rollback and observability: rollback is limited to reverting the responsive layout refactor. No new telemetry surface is introduced, so manual multi-viewport verification remains the primary validation method.
- Documentation: OpenSpec capability docs must explicitly state mobile-friendly expectations for both the public site and the admin backoffice.

## Implementation Notes For Review

- The route audit indicates the highest-risk shared offenders are fixed-position UI surfaces (`FloatingToolbar`, `MusicPlayer`, `TableOfContents`) and desktop-first containers (`Hero`, `TopicGrid`, `ArticleCard`, `Sidebar`, `AdminLayout`, `AdminTable`, `ArticleEditor`).
- There is already an active OpenSpec change at `openspec/changes/simplify-public-theme-to-dark-only` that also touches public shell components such as navigation and floating utilities. If both changes are approved, implementation must reconcile that overlap instead of letting the two changes drift independently.
