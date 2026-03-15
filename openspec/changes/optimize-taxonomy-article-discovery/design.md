## Context

The current repository stores taxonomy as article-owned `tag` and `category` rows and exposes a generic article list endpoint plus simple aggregated `/tag` and `/category` list endpoints. Public tag/category pages then compose their own discovery behavior on top of those primitives.

That layering is now the source of the bug:

- the backend article list contract is optimized for broad article browsing, not taxonomy landing pages
- the frontend tag page derives related tags from only the first page of matches
- public callers do not always request published-only data
- uncategorized browsing is represented as a display fallback in the UI but not as a first-class backend taxonomy mode
- the same taxonomy summary endpoints are consumed by public surfaces and admin management screens, so changing them carelessly would regress backoffice behavior

The change therefore needs a taxonomy-specific design instead of another page-local workaround.

## Goals / Non-Goals

**Goals**

- Provide an explicit public taxonomy discovery contract for tag and category pages.
- Ensure public taxonomy responses include only published articles.
- Support uncategorized public browsing as a real query mode instead of a frontend-only label.
- Return related taxonomy suggestions from backend-derived data rather than page-local sampling.
- Keep public taxonomy summary counts aligned with published content without breaking admin taxonomy management.

**Non-Goals**

- Add new MySQL tables, migrations, or slug registries.
- Redesign the admin taxonomy CRUD experience.
- Rewrite the general article list contract for every use case in the application.
- Solve unrelated typography, responsive, or build-tooling issues outside the taxonomy browsing scope.
- Normalize historical taxonomy spellings through data migration in this change.

## Decisions

### Decision: Add a dedicated public taxonomy retrieval contract instead of stretching the generic article list endpoint further

Public taxonomy pages need canonical taxonomy metadata, related suggestions, uncategorized handling, and published-only guarantees. Those concerns are different enough from a generic article listing response that the public site should consume a taxonomy-oriented contract, even if it reuses shared backend query helpers internally.

Why:

- it avoids growing `/article/list` into a catch-all response with page-specific metadata
- it lets public tag/category pages request exactly the data they need
- it keeps admin and public taxonomy consumers from accidentally sharing incompatible count semantics

Expected response shape should cover at least:

- canonical taxonomy identity for the requested page
- paginated published article rows
- total count metadata
- related tags and/or related categories suitable for public discovery
- explicit handling for the uncategorized category view

### Decision: Centralize taxonomy normalization and canonical-name resolution on the backend

Matching by raw route name is too fragile because the repository already trims names in some places, lowercases in others, and derives display-only fallbacks for uncategorized content. The backend should own normalization for public taxonomy retrieval and return one canonical display name per normalized taxonomy key.

Implementation direction:

- normalize whitespace and case for matching
- keep a canonical display name for responses so the frontend does not invent its own route labels
- treat uncategorized as an explicit category mode that matches published articles without category relations

Why:

- it removes divergent frontend/backend taxonomy semantics
- it keeps article cards, taxonomy pages, and taxonomy summary chips aligned
- it avoids empty public pages caused by display aliases that do not correspond to stored rows

### Decision: Compute related taxonomy suggestions from the full published match set on the backend

The current frontend tag page derives related tags from the first 50 returned articles only. That undercounts larger taxonomies and fails completely when the first sample is too small or when category pages need similar discovery affordances.

The backend should therefore compute related suggestions using the full published match set for the requested taxonomy and return them as structured metadata.

Why:

- it eliminates page-size sampling bias
- it lets tag and category pages share one source of truth for related discovery
- it keeps fallback behavior consistent when a taxonomy is small, sparse, or recently renamed

Suggested outputs:

- tag pages: related tags and top categories from matching published articles
- category pages: related tags and adjacent/high-signal categories from matching published articles or normalized public summaries

### Decision: Separate public taxonomy summaries from management taxonomy lists

Public taxonomy navigation surfaces such as the home page, posts page filters, footer topic links, and article-card links should use counts derived from published content only. Admin screens, however, still need management-oriented taxonomy visibility and must not silently lose draft-only terms.

Why:

- public readers should not be sent to empty or draft-only taxonomy pages
- admin taxonomy management must remain complete and stable
- a separated contract avoids hidden behavioral regressions in backoffice tables

This separation can be achieved by either:

- adding dedicated public summary endpoints, or
- keeping one endpoint family with an explicit public/admin scope

The implementation should choose the version that minimizes churn while preserving a clear contract boundary.

### Decision: Keep the current schema and name-based routes in this change

The current issue can be fixed by improving query semantics and public contracts. Adding slug columns, redirect maps, or taxonomy registry tables would widen blast radius into schema migrations, admin editing rules, and public URL migration behavior.

Why:

- the immediate bug is about retrieval semantics, not missing relational capacity
- schema changes would slow delivery and complicate rollback
- the repository already has overlapping in-flight changes on public pages, so scope discipline matters here

Trade-off:

- name-based URLs still inherit some historical spelling variance
- a future change may still be worth proposing if durable slugs become a product need

## Alternatives Considered

### Alternative: Only pass `type: true` from the taxonomy pages and keep all related-tag logic on the frontend

Rejected because it would fix only one leak. It would not address uncategorized browsing, sample-biased related suggestions, public/admin taxonomy-count separation, or canonical taxonomy resolution.

### Alternative: Reuse the existing `/tag` and `/category` list endpoints for all public and admin surfaces with new published-only semantics

Rejected because those endpoints are already consumed by admin management pages. Changing them in place risks hiding draft-only terms from backoffice workflows or forcing the admin UI to inherit public-only count logic.

### Alternative: Introduce slug columns and a taxonomy registry table immediately

Rejected for this scope because the user reported a browsing/query problem, not a schema limitation. A slug/table migration would widen risk into database changes, redirects, backfill logic, and admin authoring behavior.

## Risks / Trade-offs

- [Overlap with in-flight page work] Public taxonomy pages and shared article-card links are already being edited in other changes and uncommitted worktree changes. Mitigation: keep implementation staged by domain and merge carefully.
- [Canonical-name ambiguity] Historical data may contain multiple spellings or casing variants that normalize to the same key. Mitigation: define a deterministic canonical display-name rule in backend helpers and document it in implementation notes.
- [Public/admin contract drift] If public and management taxonomy summaries are not clearly separated, admin pages may accidentally inherit published-only counts. Mitigation: preserve or explicitly scope management endpoints before switching public callers.
- [Validation limits] Full repository `lint` and `build` remain blocked by known issues. Mitigation: run targeted validation for affected backend/frontend files and document residual risk.

## Migration Plan

1. Introduce shared backend helpers for taxonomy normalization, canonical-name resolution, published-only matching, and uncategorized support.
2. Add the public taxonomy detail/summary contract or equivalent scoped API behavior while preserving management taxonomy behavior.
3. Update public taxonomy pages and public taxonomy-entry surfaces to consume the new contract.
4. Verify that admin taxonomy management still sees the expected records and that public taxonomy pages no longer surface draft-only or uncategorized mismatches.

Rollback strategy:

- revert the public taxonomy API/helper changes
- revert the public page integration that consumes the new responses
- continue using the previous public browsing behavior without any database rollback

## Cross-System Impact Review

- Public frontend (`src/`): directly affected in tag/category pages, article cards, topic navigation, footer topic links, and any other public taxonomy entry point that currently relies on generic list data.
- Backoffice (`src/app/admin/`): no new UX is intended, but management taxonomy callers must remain on management semantics while public callers move to published-only data.
- Backend API (`server/`): directly affected through shared taxonomy query helpers and public taxonomy retrieval endpoints or scoped handlers.
- MySQL/data: unchanged schema; the change relies on current article/category/tag relations and uncategorized detection by absence of category rows.
- Upload/image-bed/music/auth integrations: unaffected.
- Build/test/runtime/Docker: no runtime contract change is expected; validation remains targeted because of existing repo-wide blockers.
- Security/secrets: unaffected; no new secret class or permission boundary is introduced.
- Observability/docs: no new telemetry is planned; OpenSpec artifacts and targeted manual verification become the primary documentation for the new taxonomy behavior.
