## Context

The public Next.js application currently combines CSS-variable-based theming with a client `ThemeProvider`, navigation theme toggles, and a floating quick-settings panel that includes both light/dark switching and reader-selectable accent colors. The current product direction, however, is already dark-only. That makes the existing theming surface misleading in two ways:

- it exposes UI controls for presentation states the product no longer supports
- it keeps client-side persistence (`localStorage` theme and primary-color keys) and runtime branching that are no longer needed for reader experience

The implementation footprint is confined to the public frontend, but the design still needs to evaluate cross-system effects because the site shares runtime composition with comment integration, upload rewrites, the admin app shell, and legacy backend services.

## Goals / Non-Goals

**Goals:**
- Make the public site render in a single supported dark presentation.
- Remove reader-facing theme-management affordances that no longer reflect supported behavior.
- Remove dead or misleading client-side theme/color preference persistence from the public experience.
- Preserve public browsing, article reading, comments, floating utility actions, and mobile navigation without reintroducing light-mode assumptions.

**Non-Goals:**
- Redesign the broader public visual system beyond removing unsupported theme controls.
- Change admin/backoffice theming requirements.
- Introduce backend storage for appearance preferences.
- Modify Koa API contracts, database schema, upload/media routing, music integrations, or deployment configuration.

## Decisions

### Decision: Standardize the public shell on a fixed dark theme

The public site should render in the supported dark presentation without consulting saved reader preference or `prefers-color-scheme` detection. The simplest reliable approach is to make the root presentation contract deterministic and dark-first, rather than preserving an abstract light/dark toggle mechanism that no longer has a supported light branch.

Why:
- avoids UI drift between actual supported design and exposed controls
- removes unsupported states from QA scope
- reduces first-render ambiguity created by client-only theme restoration

Impacted areas:
- global theming setup in the public app shell
- any component that currently branches on `theme`
- comment/discussion embed configuration that currently mirrors site theme

### Decision: Remove the floating quick-settings panel instead of leaving a reduced shell

The floating settings panel currently exists primarily to expose theme toggling and accent-color selection. Once those controls are removed, preserving the gear-triggered panel would leave a hollow affordance with no clear user value. The floating utility surface should therefore keep only the actions that remain meaningful, such as back-to-top.

Why:
- avoids an empty or confusing settings affordance
- simplifies mobile and touch interactions
- reduces reader-visible control clutter

Impacted areas:
- floating toolbar component structure
- motion/visibility behavior for the toolbar
- mobile ergonomics for public pages

### Decision: Keep third-party discussion styling pinned to dark mode

The discussion integration should continue matching the site presentation, but it no longer needs to depend on a dynamic theme context. The embed configuration should be pinned to the supported dark presentation so article detail pages remain visually consistent after the theme state abstraction is removed or simplified.

Why:
- preserves compatibility with the external comment service
- avoids runtime errors if the theme context becomes narrower or is removed
- keeps article pages visually coherent with the fixed site presentation

Impacted areas:
- comment embed initialization
- article detail verification

## Alternatives Considered

### Alternative: Hide only the theme-color palette and keep the theme provider/toggle infrastructure

Rejected because it would leave a light/dark toggle path available even though the product is now dark-only. It also preserves stale `localStorage` state, unsupported rendering paths, and extra branching complexity that future work could accidentally rely on.

### Alternative: Keep the floating settings button and repurpose it later

Rejected for this change because there is no approved replacement settings scope today. Keeping the entry point without meaningful supported options would create a dead-end interaction and obscure the intent of the cleanup.

## Risks / Trade-offs

- [Refactor coupling] Components that currently read `useTheme()` may break if the provider contract is reduced or removed. Mitigation: audit every current consumer and replace dynamic theme branching with deterministic dark behavior before removing shared context.
- [Styling regressions] Some styles may still rely on `dark:` variants or `data-theme` selectors being present. Mitigation: preserve the root dark marker consistently and verify home/article/mobile flows.
- [Third-party mismatch] Comment integration could fall back to a light skin if not updated alongside the theme cleanup. Mitigation: explicitly pin discussion configuration to dark mode during the refactor.
- [Validation limits] Repository-wide `npm run lint` and `npm run build` are already known to fail for unrelated reasons. Mitigation: run targeted validation where possible and document residual risk in the implementation summary.

## Migration Plan

1. Update the public theming contract to a deterministic dark-only presentation.
2. Remove public-reader theme toggles and the floating theme-color/settings surface.
3. Update comment/discussion integration so it no longer depends on reader theme selection.
4. Verify desktop and mobile public pages still expose search/navigation/back-to-top behavior correctly.
5. Record validation results and residual repository-wide risks in the change execution notes.

Rollback strategy:

- Restore the removed public controls and client-side preference logic if the product later decides to support multiple reader themes again.
- Reintroduce the broader theme provider contract only if a future approved change explicitly restores multi-theme behavior.

## Cross-System Impact Review

- Public frontend (`src/`): directly affected; navigation controls, floating utilities, theme state, and comment styling must be updated together.
- Backoffice (`src/app/admin/`): intentionally unaffected; admin content editing/auth flows remain outside this reader-facing cleanup.
- Backend API (`server/`): intentionally unaffected; no Koa route, controller, model, or auth changes are required.
- MySQL/data: intentionally unaffected; no schema, seed, or migration work is needed.
- Upload/media/image bed/music: intentionally unaffected; these integrations remain presentation-adjacent but not theme-controlled.
- Build/test/runtime/Docker: no runtime contract or deployment manifest change is expected; only frontend validation scope changes.
- Security/secrets: no secret rotation or exposure is involved; the change should not touch tracked local configuration such as `openclaw.json`.
- Observability/docs: no new monitoring surface is added; documentation/spec updates are required so future work no longer assumes theme persistence.
