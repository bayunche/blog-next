## Context

The route and component audit shows that the current mobile issues come from shared layout assumptions, not a single broken page.

Public-site findings:

- The public shell mounts multiple independent fixed-position surfaces in the same bottom-right region: `FloatingToolbar`, `MusicPlayer`, and mobile `TableOfContents`. On narrow screens they can overlap each other and cover primary content.
- Several public components remain desktop-first even when they technically wrap: `Hero`, `TopicGrid`, `ArticleCard`, taxonomy headers, and archive timeline sections use large text, wide spacing, fixed offsets, or badge placements that become cramped or overlapping on phones.
- Public informational pages such as `/about`, `/friends`, and `/archives` inherit the same card spacing and multi-column assumptions, so defects repeat instead of remaining isolated.
- Search and article-reader overlays need a viewport-safe sizing rule on phones, especially around browser UI, bottom home indicators, and long content pages.

Backoffice findings:

- `AdminLayout` permanently reserves a `w-64` sidebar, which is not a viable shell on narrow screens.
- `AdminTable` depends on a desktop table presentation without a mobile overflow strategy.
- `ArticleEditor` contains multiple inline tool groups, upload panels, music-search results, and preview surfaces that need stacking and width constraints on mobile.
- Admin dashboard summary cards already collapse to one column, but the surrounding shell and management widgets remain desktop-biased.

The change therefore needs a cross-cutting responsive design that starts with shared shell rules and then applies route-specific adjustments where the content model truly differs.

## Goals / Non-Goals

**Goals**

- Make every currently routed public page family usable at narrow phone widths without horizontal overflow or overlapping critical UI.
- Preserve access to search, navigation, article reading, comments, music controls, and table of contents while ensuring floating utilities do not cover main content.
- Make authenticated backoffice navigation, tables, and article editing workable on narrow viewports without changing API contracts.
- Keep the current visual language and feature set wherever possible; the work is a responsive hardening pass, not a brand redesign.

**Non-Goals**

- Redesign the information architecture or content model of the public site or backoffice.
- Add backend-driven device detection, server-side rendering branches by device class, or database-stored responsive preferences.
- Change Koa API contracts, Sequelize models, MySQL schema, upload routing, GitHub OAuth behavior, or music-service backend behavior.
- Resolve the repository's unrelated global lint/build issues beyond documenting how they constrain validation.

## Decisions

### Decision: Establish a shared mobile-safe shell contract before touching individual pages

The implementation should first define a consistent responsive baseline for shared page chrome:

- top spacing under the fixed navbar
- bottom spacing reserved for floating controls and mobile browser safe areas
- max-width and padding rules for public content containers
- viewport-safe sizing rules for modal and overlay components

Why:

- the same shell defects currently repeat across many routes
- fixing route markup without fixing shell behavior will leave overlapping floating UI unresolved
- consistent spacing tokens reduce the chance that every page invents its own mobile workaround

Impacted areas:

- `src/app/globals.css`
- public shell composition (`AppChrome`, `Navbar`, `Footer`)
- shared overlays such as `SearchModal`

### Decision: Make floating reader utilities mutually compatible on mobile

On narrow viewports, floating reader utilities must no longer act as unrelated fixed layers. The implementation should make them coordinate through compact states, safe offsets, and single-purpose expansion patterns so that content remains tappable and readable.

Expected outcomes:

- `FloatingToolbar` uses smaller mobile footprint and viewport-safe positioning
- `MusicPlayer` defaults to a compact/minimized or edge-safe presentation on phones instead of a fixed `w-80` panel
- mobile `TableOfContents` avoids occupying the same bottom-right stack as other floating widgets
- route containers reserve enough bottom padding so expanded utilities do not cover the final content blocks

Why:

- the screenshots show direct content obstruction from current floating UI
- fixed-position overlaps affect every long page, not just one route

### Decision: Convert public content layouts to single-column-first composition

Public pages should default to a narrow-screen, single-column reading model and only promote secondary panels or side-by-side cards at larger breakpoints.

This applies to:

- hero sections and call-to-action groups
- taxonomy/topic cards and article cards
- archive timeline offsets
- about/friends card grids
- article detail header, metadata, related content, and side content

Why:

- current markup often starts from a desktop composition and adds wrapping later
- single-column-first composition is more predictable for 320px to 430px widths
- it reduces badge overlap, truncated headings, and oversized empty gutters

### Decision: Add a separate backoffice mobile strategy instead of reusing the public shell pattern

The admin app has different constraints than the public reader experience. It needs authenticated navigation, dense data views, and editor tools. The implementation should therefore use an admin-specific responsive strategy:

- collapse sidebar navigation into a mobile drawer or header trigger
- allow management tables to scroll horizontally or adapt into more compact list/card views where practical
- stack editor metadata, upload controls, and music search vertically with mobile-friendly action spacing

Why:

- the public shell solutions do not address authenticated dense-management workflows
- backoffice tasks must remain usable on tablets and phones without permanently sacrificing desktop efficiency

## Alternatives Considered

### Alternative: Patch only the screenshots and route files the user explicitly showed

Rejected because the defects are caused by shared layout components and repeated utility patterns. Fixing only the visible topic/about pages would leave the same overlap and narrow-width issues in article pages, archives, search overlays, and backoffice screens.

### Alternative: Hide music player, floating toolbar, and table of contents on mobile

Rejected because it would reduce reader functionality instead of making it usable. The request is to support responsive layout, not to remove major reader tools from phones. Compact and coordinated mobile states are safer than silent feature removal.

### Alternative: Keep the admin desktop sidebar on mobile and rely on horizontal scrolling

Rejected because it would waste too much viewport width before content is even rendered. Mobile admin usability requires a different navigation presentation, not only more scrolling.

## Risks / Trade-offs

- [Shared-component regression] Many public routes share the same components, so a shell change can create wide blast radius. Mitigation: implement shared utilities first, then verify each route family explicitly.
- [Overlay coordination complexity] Multiple floating widgets may need lightweight cross-component coordination or stricter viewport rules. Mitigation: design mobile states around a predictable bottom-safe stack and avoid simultaneous expanded panels.
- [Ant Design responsiveness] Admin table/editor screens rely on Ant Design defaults that are desktop-oriented. Mitigation: document whether each view uses responsive props, overflow wrappers, or layout overrides.
- [OpenSpec overlap] `simplify-public-theme-to-dark-only` also targets navigation and floating public controls. Mitigation: if both changes are approved, implementation must either sequence them or merge overlapping shell edits carefully.
- [Validation limits] Full `npm run lint` and `npm run build` remain blocked by known repository issues. Mitigation: run targeted frontend checks where possible and capture manual viewport verification steps in the implementation notes.

## Migration Plan

1. Introduce shared responsive shell tokens/utilities for public and admin containers, overlays, and safe-area spacing.
2. Refactor shared floating utilities and mobile navigation so they no longer collide on narrow screens.
3. Update public route families and reusable public cards/sections to single-column-first layouts.
4. Update admin navigation, management tables, and article editor layouts for narrow screens.
5. Verify target route families on representative narrow and medium viewport widths and document residual risk.

Rollback strategy:

- Revert the responsive-layout refactor in the public and admin frontends.
- No data rollback, API rollback, schema rollback, or deployment rollback is required because the change is presentation-only.

## Cross-System Impact Review

- Public frontend (`src/`): directly affected across shared shell, public routes, floating reader utilities, and overlays.
- Backoffice (`src/app/admin/`): directly affected in authenticated shell, dashboard/listing pages, and editor surfaces.
- Backend API (`server/`): intentionally unaffected; current endpoints and auth behavior remain the contract.
- MySQL/data: intentionally unaffected; no schema, seed, or migration work is needed.
- Uploads/media/image bed/music integrations: frontend presentation changes only; no runtime integration contract change is expected.
- Build/test/runtime/Docker: no deployment or runtime boundary change is intended; validation remains frontend-focused.
- Security/secrets: no secret-handling change is involved, and tracked local configuration files must remain untouched.
- Observability/docs: no new telemetry is added; OpenSpec docs become the primary source of the responsive behavior contract.
