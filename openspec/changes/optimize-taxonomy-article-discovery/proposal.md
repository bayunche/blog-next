## Why

Public tag and category discovery is currently assembled from generic article-list responses instead of an explicit taxonomy contract.

- `src/app/tags/[name]/page.tsx` and `src/app/categories/[name]/page.tsx` call the shared article list endpoint directly, so taxonomy pages inherit list-oriented behavior that was never designed to carry canonical taxonomy metadata or related suggestions.
- Public taxonomy pages do not pass an explicit published-content filter, which means draft articles and draft-only taxonomy counts can leak into public browsing surfaces whenever the backend receives `type = null`.
- The tag page computes "related tags" from the first 50 returned articles on the frontend, then falls back to static metadata. That makes suggestions sample-biased, stale, and incapable of supporting consistent category discovery.
- Category navigation currently mixes display fallbacks with storage-backed filters. For example, article cards can link visitors to an uncategorized route even though the backend only matches stored category rows, so uncategorized public browsing is not modeled end-to-end.
- The current `/tag` and `/category` list endpoints are reused by both public navigation and admin management screens. Optimizing public taxonomy discovery therefore requires an architecture-level contract that preserves management behavior instead of silently changing a shared response.

This needs a single change across public pages and backend taxonomy retrieval so tag/category browsing becomes accurate, published-only, and stable.

## What Changes

- Introduce an explicit public taxonomy discovery contract for tag and category pages, backed by published-only article filtering and canonical taxonomy resolution.
- Centralize taxonomy normalization on the backend so public matching, counting, and display metadata use the same rules for whitespace, case, and uncategorized handling.
- Move related taxonomy computation from frontend best-effort sampling to backend-derived metadata built from the full matching published set.
- Update public tag/category pages and shared taxonomy entry points to consume public taxonomy responses instead of deriving page state from the generic article list contract.
- Preserve admin taxonomy management behavior by separating public taxonomy summary data from management-facing taxonomy list behavior, rather than changing admin counts and edit surfaces accidentally.
- Update OpenSpec capability docs for public taxonomy browsing and content API retrieval.

## Capabilities

### Modified Capabilities
- `public-blog`: strengthen public tag/category browsing so taxonomy pages and navigation chips reflect published content only, support uncategorized browsing, and show related taxonomy suggestions derived from current content.
- `content-api`: expand the public retrieval contract with explicit taxonomy discovery data and published-only taxonomy summary behavior for public navigation surfaces.

### Unchanged Capabilities
- `admin-backoffice`: no new management workflow is introduced; administrators still manage tags and categories through the existing backoffice flows, although implementation must preserve those flows while public taxonomy data is separated.
- `runtime-operations`: no new runtime service, deployment topology, or secret class is introduced for this change.
- MySQL schema, seeds, and migrations: no schema or data migration is planned because taxonomy discovery still relies on the existing article/category/tag tables.
- Upload, image-bed, music, and OAuth integrations: no functional contract change is intended.

## Impact

- Public frontend behavior (`src/`): directly affected. Tag pages, category pages, article cards, topic chips, footer taxonomy links, and any other public taxonomy entry points need to consume the new public taxonomy contract.
- Backoffice flows (`src/app/admin/`): no net UX change is intended, but implementation must keep management taxonomy lists and rename/delete flows stable while public taxonomy summary data is separated.
- Backend API and auth (`server/`): directly affected. Taxonomy retrieval logic needs shared normalization, published-only filtering, uncategorized support, and a public-facing response tailored to taxonomy browsing instead of generic article listing.
- MySQL schema, seeds, and migrations: intentionally unaffected. The change reads current tables differently but does not require schema updates.
- Asset uploads, image bed integration, and music-related integrations: unaffected.
- Build, lint, test, Docker, and runtime environment behavior: no Docker or environment contract change is expected. Targeted validation is still required, while the repository's known noisy `lint` scope and missing Windows `lightningcss` binary remain external validation limits.
- Security, secrets handling, rollback, observability, and documentation:
  - no new secret or auth flow is introduced
  - rollback is limited to reverting the public taxonomy API/page refactor
  - no new telemetry surface is planned, so manual public taxonomy verification remains important
  - OpenSpec docs become the source of truth for taxonomy browsing semantics

## Implementation Notes For Review

- The working tree already contains user-owned edits in `server/controllers/article.js`, `src/app/categories/[name]/page.tsx`, `src/app/tags/[name]/page.tsx`, `src/app/page.tsx`, `src/app/posts/page.tsx`, and `src/features/article/components/ArticleCard.tsx`. Implementation must merge with those edits rather than overwrite them.
- `openspec/changes/improve-responsive-layouts` already touches public taxonomy pages and shared article card presentation. If both changes are approved, implementation must reconcile overlapping public-page edits carefully.
- This proposal intentionally keeps URLs name-based for now. Introducing durable taxonomy slugs or a taxonomy registry table would widen scope into schema, redirects, and admin authoring rules, and should be proposed separately if needed later.
