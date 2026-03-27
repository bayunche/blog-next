# Text Integrity Findings

## Classification

### Source-corrupted

- `server/router/article.js`
  - Historical comment corruption had swallowed route registrations for `/output/all` and `/output/:id`.
- `server/router/category.js`
  - Historical comment corruption had swallowed `router.delete('/:name', deleteCategory)`.
- `server/router/tag.js`
  - Historical comment corruption had swallowed `router.delete('/:name', deleteTag)`.
- `server/models/article.js`
  - Historical comment corruption had swallowed persisted model fields including `viewCount`, `likeCount`, `type`, `top`, `musicId`, `musicName`, and `uuid`.
- `src/app/archives/page.tsx`
  - Historical malformed literals and JSX caused broken metadata text and invalid render output.
- `server/db/article_structure.sql`
  - Column comments for `cover`, `description`, and `likeCount` were stored as mojibake in repository source.

### Display-only

- `server/controllers/article.js`
  - The currently reported `/app/controllers/article.js:93` location resolves to a normal `sequelize.fn('LOWER', ...)` expression in repository source, so the cited error does not reproduce from the current file contents.
- Operator shell output on Windows / mixed-codepage terminals
  - Some prior pasted logs likely reflected terminal rendering or an outdated container image rather than current repository bytes.

### Unresolved

- None at the end of this repair pass.

## Residual Risk

- Mixed code-page terminals or stale container layers can still display garbled Chinese logs even after source repair.
  - Operators should prefer UTF-8 capable shells and rebuild or reload deployment artifacts after pulling the repaired source.
- The supported audit is intentionally conservative.
  - It now catches the confirmed mojibake and comment-merge classes without scanning vendor trees or historical SQL dumps, so future review is still required for any newly observed text anomaly outside those classes.

## Explicit Exclusions

- `server/node_modules/`, top-level `node_modules/`
  - Vendor code is excluded from audit and repair scope.
- `server/netease_api/`
  - Embedded third-party service tree is treated as external source, not authoritative application code for this change.
- `dist/`, `.next/`, `coverage/`, `public/uploads/`
  - Build outputs, generated artifacts, and uploaded content are excluded from repository text-integrity enforcement.
- `server/test.sql`, `server/db/test.sql`, `server/db/prod_full_import.sql`
  - Historical snapshot or environment bootstrap dumps are excluded from the supported audit so large content blobs do not drown out authoritative source findings.
