## Context

The current blog already separates public rendering, admin authoring, and backend API concerns, but article-media handling sits across all three layers:

- the Koa backend exposes a provider-backed upload route and a local file-upload route
- the admin article editor uses those routes for cover uploads but does not yet provide a managed inline-image workflow for Markdown content
- public list/detail pages can render local or external images, but Next.js host allowlisting is still wired around the older Chevereto-specific configuration path

PicUI changes the integration boundary in a useful way because it publishes a documented REST API with Bearer-token authentication and a normalized JSON response. That makes it a better fit than the previously explored `imagehub.cc`, but it also raises a new security requirement: the permanent PicUI token must stay server-side and must not sit behind an unauthenticated proxy route.

## Goals / Non-Goals

**Goals**

- Support PicUI as a first-class article image-storage provider for this repository.
- Keep the permanent PicUI credential on the backend only.
- Make managed uploads usable from the admin article editor for both summary media (`cover`, `cardCover`) and inline Markdown images.
- Preserve a controlled local fallback path so article authoring can continue if the external provider is unavailable.
- Ensure public pages can render externally hosted article images without fragile runtime assumptions.

**Non-Goals**

- Add a database-backed media asset registry, media library, or remote-delete synchronization in this change.
- Change article content storage from URL strings to relational media references.
- Replace the current Koa/Next architecture with direct browser-only provider uploads using permanent credentials.
- Modify comment, music, or GitHub OAuth contracts.
- Solve the repository's unrelated global lint/build failures beyond documenting how they limit verification.

## Decisions

### Decision: Keep the permanent PicUI token server-side and broker uploads through authenticated backend endpoints

The PicUI token is an account credential, not a public upload code. The backend must therefore own the permanent credential and call the PicUI API on behalf of authenticated administrators.

Why:

- the token can access account-level API features such as profile and strategy lookup
- exposing it to the browser would allow misuse outside the intended article-management scope
- the repository already uses backend-mediated upload helpers, so this aligns with the existing trust boundary

Impacted areas:

- Koa upload controller logic
- admin auth middleware coverage
- runtime environment configuration

### Decision: Add PicUI as a provider adapter behind the existing image-bed abstraction, but normalize responses to a provider-agnostic internal contract

The current upload utility is already modeled as an abstraction layer. We should keep that shape, add a PicUI adapter, and convert PicUI's response into a common internal format instead of letting frontend code depend on provider-specific field names.

Normalized fields should include at least:

- canonical image URL
- display URL
- thumbnail URL when available
- Markdown snippet or enough data to generate one
- delete URL for future use, even if it is not persisted in this scope

Why:

- this minimizes frontend churn for existing cover/card-cover flows
- it keeps the door open for future provider changes without another editor rewrite
- it lets inline Markdown insertion share the same upload helper used by cover uploads

### Decision: Keep article records URL-only in this change and do not add a media asset table

This change will not introduce a new MySQL table or attach article records to provider-specific media entities. Articles will continue storing resolved URLs in `cover`, `cardCover`, and Markdown content.

Why:

- no schema change is required to get safe provider-backed uploads working
- the repository already stores article media as URLs
- adding remote-delete bookkeeping now would widen blast radius into schema, migrations, deletion workflows, and editorial data semantics

Trade-off:

- orphaned remote images remain possible if an editor deletes or replaces article URLs later
- cleanup automation would need a follow-up change

### Decision: Extend the admin editor with managed inline Markdown image upload using the same protected upload helper and explicit local fallback

The current editor already has a reusable upload helper pattern for `cover` and `cardCover`. That helper should be generalized so the editor can also upload an inline image and insert standard Markdown at the current cursor location.

Why:

- it closes the biggest authoring gap between "cover uploads work" and "article images still require manual copy/paste"
- it gives administrators a single mental model for all article-media uploads
- it lets fallback messaging stay consistent across summary media and inline content

Implementation direction:

- keep the existing explicit fallback approach rather than hiding fallback decisions server-side
- when PicUI upload succeeds, insert a standard Markdown image string using the normalized URL
- when PicUI upload fails but local fallback succeeds, insert the locally served URL and surface that fallback clearly in the editor UI

### Decision: Separate provider API configuration from public image-host configuration

PicUI's documented API base is `https://picui.cn/api/v1`, but the actual public image URL may be the site host or another configured CDN host. The runtime contract should therefore separate:

- backend API target and token
- frontend/public image host allowlisting

Why:

- Next.js image allowlisting is build-time and host-specific
- the public host used in rendered article cards may differ from the API base path
- separating these concerns avoids overloading one provider URL variable for incompatible purposes

Expected runtime contract additions:

- a PicUI API base URL
- a PicUI Bearer token
- optional PicUI defaults such as strategy ID, album ID, and permission
- a provider-agnostic public image host URL for frontend host allowlisting

## Alternatives Considered

### Alternative: Reuse the current Chevereto-only integration and switch to `imagehub.cc`

Rejected because the explored provider had weaker public API discoverability and a paid-only API path, while PicUI provides a documented REST contract and a validated Bearer-token flow that matches the repository's security model more cleanly.

### Alternative: Upload directly from the browser to PicUI with the permanent token

Rejected because it would expose an account credential in frontend code or browser traffic that is easier to repurpose outside the intended admin authoring flow.

### Alternative: Collapse PicUI upload and local fallback into one opaque backend endpoint

Rejected for this scope because it hides whether the article image came from the external provider or the local fallback path. Keeping the explicit two-step fallback in the editor preserves operator visibility and keeps local uploads intentionally separate from provider-backed media.

### Alternative: Add a media asset table and persist PicUI delete URLs immediately

Rejected because it would force schema work, expand deletion semantics, and slow down delivery of the core value: safe upload and better editorial usability.

## Risks / Trade-offs

- [Auth gap regression] If provider-backed upload routes are not brought under admin auth, the server becomes a public PicUI upload proxy. Mitigation: update auth routing rules before implementation is considered complete.
- [Returned host mismatch] PicUI may return image URLs from a host different from the API base or site root. Mitigation: treat the public image host as explicit runtime configuration and validate it against actual upload results.
- [Rate-limit/provider availability] PicUI exposes rate-limit headers and may reject or throttle requests. Mitigation: preserve local fallback and surface actionable error messages in the editor.
- [Editor overlap with responsive work] `ArticleEditor` is already in scope for responsive-layout hardening. Mitigation: keep image-upload changes localized and coordinate with the responsive change if both are implemented together.
- [Validation limits] Full repository `lint` and `build` checks remain blocked by known issues. Mitigation: run targeted backend/frontend validation where possible and document residual risk.

## Migration Plan

1. Add runtime/env contract for PicUI provider configuration and frontend public-host allowlisting.
2. Implement the PicUI provider adapter and response normalization in the backend upload abstraction.
3. Bring provider-backed upload routes under admin auth and keep the protected local upload fallback path intact.
4. Update the admin article editor so cover, card-cover, and inline Markdown images use the managed upload helper.
5. Verify public list/detail rendering with externally hosted cover images and verify admin upload flows with both provider success and local fallback behavior.

Rollback strategy:

- revert the PicUI adapter and editor changes
- restore the previous provider configuration path
- continue using local uploads or the previous provider path without any database rollback

## Cross-System Impact Review

- Public frontend (`src/`): directly affected in article cards, article headers, and any other `next/image` surfaces that render externally hosted article cover media.
- Backoffice (`src/app/admin/`): directly affected in article create/edit flows, including summary-media uploads and inline Markdown authoring.
- Backend API (`server/`): directly affected in upload adapter logic, controller response normalization, and auth coverage for upload routes.
- MySQL/data: intentionally unaffected; article records remain URL-based.
- Uploads/media/image bed/music integrations: article media handling changes materially; local upload serving remains a fallback boundary; music integrations remain unchanged.
- Build/test/runtime/Docker: runtime manifests and build-time host allowlisting change; validation remains targeted because of known repo-wide blockers.
- Security/secrets: directly affected; the permanent PicUI token must remain server-only and out of tracked configuration.
- Observability/docs: no new telemetry surface is introduced; runtime/env docs and OpenSpec specs become the primary documentation for the new integration contract.
