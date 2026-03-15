## Why

The repository already contains a partial "image bed" upload abstraction, but it is not yet a safe or complete fit for the current article workflow.

- The existing backend adapter only understands a Chevereto-style provider, while the selected provider for this change is PicUI with a different API contract and authentication model.
- The current admin article editor only has integrated upload behavior for `cover` and `cardCover`; inline Markdown images still depend on manual URL handling instead of a managed article-media workflow.
- The provider-backed upload route is not currently covered by the same admin auth boundary as article-management routes, which would turn a server-held PicUI token into a public upload proxy if this were implemented without a governance pass.
- Frontend runtime image-host configuration and deployment manifests still model Chevereto-specific values, so external article media would remain only partially integrated even if uploads succeeded.

This needs to be handled as a single architecture-owned change across backend upload brokering, admin authoring UX, public rendering behavior, and runtime configuration rather than as an isolated endpoint patch.

## What Changes

- Add PicUI support to the backend image-bed abstraction using a server-held Bearer token and configurable strategy, permission, and optional album defaults.
- Bring provider-backed article-media uploads under authenticated admin management flows and normalize PicUI responses into a stable internal shape that the frontend can use for cover, card-cover, and inline Markdown images.
- Extend the admin article editor so managed uploads work for both article summary media (`cover`, `cardCover`) and inline article images inserted into Markdown content.
- Preserve an explicit local-upload fallback path for article media so administrators can keep authoring when the configured external provider is unavailable or intentionally disabled.
- Update runtime and deployment contracts so backend secrets remain server-only while the frontend can still allowlist the configured external image host for public cover rendering.
- Update OpenSpec capabilities for backoffice authoring, content API media upload brokering, public article rendering, and runtime integration boundaries.

## Capabilities

### Modified Capabilities
- `admin-backoffice`: article authoring gains managed external-media upload behavior for cover, card-cover, and inline article images.
- `content-api`: protected management upload behavior expands to broker article media to a configured external image-storage provider while preserving controlled local fallback.
- `public-blog`: public lists and article detail pages explicitly support externally hosted article images from configured image providers.
- `runtime-operations`: runtime configuration expands to cover PicUI API credentials, provider defaults, and public-host allowlisting without exposing secrets to the browser.

### Unchanged Capabilities
- `engineering-governance`: OpenSpec-first change control remains unchanged.
- MySQL schema, seeds, and migrations: no schema or migration change is planned in this scope because articles continue storing resolved image URLs.
- Music-related integrations: no music-service contract changes are expected.

## Impact

- Public frontend behavior (`src/`): directly affected. Article cards, article headers, and article body images may render from a configured external host instead of only local uploads, and the frontend build must recognize that host for Next.js image rendering where applicable.
- Backoffice flows (`src/app/admin/`): directly affected. Article create/edit screens gain a managed image-upload workflow for both cover media and inline Markdown content, with clearer fallback messaging when the external provider cannot be used.
- Backend API and auth (`server/`): directly affected. Media-upload brokering gains a PicUI adapter and the provider-backed upload route must join the protected management auth boundary.
- MySQL schema, seeds, and migrations: intentionally unaffected in this change. Article records continue storing URL strings only; no media asset table or delete-token persistence is added yet.
- Asset uploads, image bed integration, and music-related integrations: directly affected for article media. Existing local upload serving under `/public/uploads/*` remains the fallback boundary; music integrations are intentionally unaffected.
- Build, lint, test, Docker, and runtime environment behavior: frontend build-time image-host configuration and Docker/env templates must be updated. Targeted validation is required, while the repository's known `lint` noise and missing `lightningcss` build dependency remain external validation limits.
- Security, secrets handling, rollback, observability, and documentation:
  - PicUI credentials must remain server-only and must not be written into tracked config or shipped to the browser.
  - The upload route must reject unauthenticated callers before any external upload is attempted.
  - Rollback is limited to reverting the PicUI integration and restoring the previous upload behavior; no data rollback is required.
  - No new telemetry surface is planned, so manual upload/render verification remains the primary validation mechanism.
  - Runtime/env documentation must explain the new PicUI-related variables and the public-host allowlist requirement.

## Implementation Notes For Review

- A user-supplied PicUI Bearer token was validated out of band during exploration and proved that the provider and strategy lookup are live. That credential must not be committed, echoed into artifacts beyond abstract mention, or reused in client-visible configuration.
- This change intentionally does not add remote media lifecycle bookkeeping such as storing PicUI `delete_url` values in MySQL. The initial scope focuses on safe upload, authoring usability, and public rendering. Remote cleanup automation can be proposed later if needed.
- `openspec/changes/improve-responsive-layouts` also targets `ArticleEditor`. If both changes are approved, implementation will need to merge editor-surface changes carefully to avoid overlapping patch conflicts.
