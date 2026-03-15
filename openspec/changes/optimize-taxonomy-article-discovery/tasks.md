## 1. Backend Taxonomy Contract

- [x] 1.1 Add shared backend taxonomy query helpers that normalize names, resolve canonical display values, filter to published articles for public retrieval, and model the uncategorized category view explicitly.
- [x] 1.2 Add or refactor the public taxonomy detail contract for tag/category pages so responses include canonical taxonomy metadata, paginated published article rows, total counts, and related taxonomy suggestions.
- [x] 1.3 Separate public taxonomy summary behavior from management taxonomy lists so public category/tag counts stay published-only without regressing admin taxonomy management screens.

## 2. Public Frontend Integration

- [x] 2.1 Update public tag and category pages to consume the new taxonomy detail data instead of deriving page state from the generic article list response.
- [x] 2.2 Update shared public taxonomy entry points such as article-card links, topic chips, footer taxonomy links, and posts-page taxonomy filters so they use canonical public taxonomy names/counts and preserve uncategorized navigation.

## 3. Validation

- [x] 3.1 Run targeted backend/frontend validation for the affected taxonomy files and document residual risk from the repository's known `lint` and `build` blockers if full checks remain unavailable.
- [ ] 3.2 Manually verify public tag/category browsing against representative cases, including renamed/normalized taxonomy names, uncategorized articles, related suggestions, and draft-only taxonomy data staying out of public navigation.

## Validation Notes

- Targeted backend syntax validation passed with `node --check` for `server/utils/taxonomy.js`, `server/controllers/tag.js`, `server/router/tag.js`, and `server/router/category.js`.
- Targeted frontend lint validation passed for the touched public taxonomy files and API helpers using `npx eslint src/app/page.tsx src/app/posts/page.tsx src/app/tags/[name]/page.tsx src/app/categories/[name]/page.tsx src/shared/api/category.ts src/shared/api/tag.ts src/shared/components/Footer.tsx src/shared/components/SearchModal.tsx src/components/Sidebar.tsx src/app/about/page.tsx src/app/posts/[id]/page.tsx`.
- Full `npx tsc --noEmit --pretty false` remains blocked by pre-existing `src/app/admin/components/ArticleEditor.tsx` errors unrelated to this taxonomy change.
- Runtime taxonomy helper verification could not complete in this environment because Sequelize resolves the MySQL host as `mysql`, which is not reachable from the current CLI session (`SequelizeHostNotFoundError: getaddrinfo ENOTFOUND mysql`).
- Manual browser verification remains pending because this CLI session does not provide an interactive browser connected to a reachable application/database stack.
