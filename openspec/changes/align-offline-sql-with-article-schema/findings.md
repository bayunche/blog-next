# Offline SQL Baseline Findings

## Chosen Baseline

- `server/db/prod_full_import.sql`
  - This is the correct baseline for a fully initialized offline SQL artifact because it preserves the broadest repository-owned article/content data set.
  - It already carried post-dump `ALTER TABLE article` statements intended to align an older dump structure with newer runtime expectations, which made it the safest base to normalize rather than replacing it with a smaller snapshot.

## Comparison References

- `dist/offline-bundle-sh-latest/docker/mysql/backup/dev_before_import_20260310_220549.sql`
  - Useful as a later-schema reference showing `cover`, `description`, `likeCount`, `musicId`, and `musicName` already present directly in the `article` table definition.
- `dist/offline-bundle-sh-latest/docker/mysql/backup/pre_import_20260228_154545.sql`
  - Useful as an earlier production-adjacent snapshot showing the same later-generation article metadata shape, though with a much smaller content set.
- `server/db/article_structure.sql`
  - Useful as a structure-only reference, but not suitable as the delivery baseline because it does not carry the intended initialized article data set.

## Applied Outcome

- `server/db/prod_full_import.sql`
  - Updated so the article extension patch also adds `cardCover`.
- `server/db/prod_full_init.sql`
  - Added as the repository-owned full initialization SQL artifact for offline delivery.
  - It currently mirrors the corrected `prod_full_import.sql` content so operators can use a clearly named, single-file initialization dump.
- `dist/offline-bundle-sh-latest/import-sql.sh`
  - Now defaults to `server/db/prod_full_init.sql`.
- `dist/offline-bundle-sh-latest/docker/mysql/init/99-prod_full_init.sql`
  - Refreshed so the offline bundle ships the corrected initialization SQL by default.

## Residual Risk

- The full initialization SQL is still a normalized legacy dump, not a formal migration history.
  - Future article-schema changes should continue updating the offline SQL validation step so delivery artifacts do not drift from the runtime model.
