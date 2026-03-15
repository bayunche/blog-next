## Why

The public site currently exposes reader-facing theme management controls even though the product direction has already converged on a dark-only experience. Leaving the desktop/mobile theme toggles and the floating theme-color picker in place creates a misleading UI, keeps unnecessary client-side state in circulation, and preserves unsupported presentation paths that can drift away from the actual design baseline.

This change aligns the public reading experience with the current product decision: the site should render in its supported dark presentation by default, without offering reader-controlled theme or accent-color customization.

## What Changes

- Remove public-reader theme management controls from the navigation and floating toolbar.
- Retire client-side persistence for reader theme and primary-color preferences in the public experience.
- Standardize the public site on a single supported dark presentation, including third-party discussion styling.
- Update the `public-blog` capability spec so the source of truth no longer promises persisted reader theme/color preferences.

## Capabilities

### Modified Capabilities
- `public-blog`: replace persisted theme/color personalization with a fixed dark presentation and simplified mobile/desktop controls

### Unchanged Capabilities
- `admin-backoffice`: no change to authenticated editorial workflows
- `content-api`: no change to public content endpoints, protected management endpoints, or upload serving
- `runtime-operations`: no new runtime service, environment variable, or deployment dependency

## Impact

- Public frontend behavior (`src/`): public pages load in the supported dark presentation only; desktop/mobile theme toggles, quick-settings entry points, and theme-color choices are removed from reader UI.
- Backoffice flows (`src/app/admin/`): no intended functional or visual change.
- Backend API and auth (`server/`): no route, controller, model, auth, or rewrite changes are expected.
- MySQL schema, seeds, and migrations: no schema or data migration is required because theme/color preferences are currently client-side only.
- Uploads, image bed, and music-related integrations: unchanged; the change only affects reader-facing presentation controls.
- Build, lint, test, Docker, and runtime behavior: no Docker or env contract change is intended; targeted frontend validation is required, while known repository-wide `lint` and `build` issues remain external risks.
- Security and secrets handling: reduced client-side preference persistence lowers incidental browser-stored state; no secret files or auth flows should be modified.
- Rollback and observability: rollback is limited to restoring the removed controls and preference logic; no new telemetry surface is introduced, so manual UI verification remains the main validation mechanism.
- Documentation: OpenSpec baseline documentation for the public blog must be updated to describe dark-only behavior as the supported contract.
