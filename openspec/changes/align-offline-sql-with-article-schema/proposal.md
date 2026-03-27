## Why

The freshly exported offline shell bundle starts successfully, but the imported MySQL schema does not match the current backend article model. After a manual SQL import, article queries fail with `SequelizeDatabaseError: Unknown column 'article.cardCover' in 'field list'` because the shipped `prod_full_import.sql` adds `cover`, `description`, `likeCount`, `musicId`, and `musicName`, yet still omits `cardCover`.

The repository now has multiple SQL candidates with different strengths:

- `server/db/prod_full_import.sql` contains the broadest article/content data set and is the best base candidate for a full initialization dump.
- historical backup snapshots under `dist/.../docker/mysql/backup/` reflect later schema evolution patterns and can be used as references for field ordering and table shape.
- `server/db/article_structure.sql` is useful as a structure reference but not sufficient as a full initialized dataset.

This makes the issue broader than a single missing column. The supported offline delivery path needs one repository-owned SQL artifact that both initializes the expected content data and restores a schema compatible with the shipped backend image.

## What Changes

- Inventory the repository SQL candidates and select the correct base dump for a full offline initialization path.
- Compare that base dump against the older prod-export snapshots and current backend article model to identify schema drift in article metadata fields, starting with `cardCover`.
- Produce a repository-owned full initialization SQL artifact that preserves the intended data set while aligning the article schema with the backend currently shipped in production/offline images.
- Ensure the manual offline SQL import path uses that corrected initialization artifact instead of a schema-incomplete dump.
- Add a lightweight validation step for the offline SQL path so future bundle refreshes can detect article-schema drift before distribution.
- Refresh the existing shell offline bundle contents after the SQL/schema repair so `dist/offline-bundle-sh-latest` carries the corrected import assets.

## Capabilities

### Modified Capabilities
- `content-api`: article list/detail queries must remain compatible with schemas produced by the supported offline SQL import assets.
- `runtime-operations`: offline bundle import workflows must restore a schema and data set that match the backend image shipped in the same bundle.
- `admin-backoffice`: article-edit metadata already supported by the editor, such as card-cover imagery, must remain readable after offline restoration.

### Unchanged Capabilities
- Public frontend layout and presentation remain unchanged.
- Authentication, OAuth, uploads, image-bed credentials, and music service integration contracts do not change.
- No secret values should be rotated, exposed, or restructured.

## Impact

- `src/` public frontend behavior: no intentional UI redesign; the benefit is that article listing pages stop failing after offline restore.
- `src/app/admin/` backoffice flows: no new authoring workflow is introduced, but existing article metadata remains compatible with restored offline databases.
- `server/` Koa routes/controllers/models/auth: article query paths continue unchanged; the repair targets the delivered schema inputs and validation around them.
- MySQL schema, seed, and migration implications: directly affected. Repository-owned SQL dumps/bootstrap files must be reconciled so the chosen full initialization artifact contains both the intended data set and the article extension columns already expected by the model.
- Asset uploads, image bed integration, and music-related integrations: unaffected except that article records using card-cover metadata can be read successfully after restore.
- Build, lint, test, Docker, and runtime environment behavior: offline packaging and validation are directly affected; full repo lint/build remains subject to existing known limits, so validation will stay targeted.
- Security, secrets handling, rollback, observability, and documentation:
- No secrets change.
- Rollback is limited to reverting the SQL/bootstrap alignment and bundle refresh if a new import regression is introduced.
- Documentation and operator guidance for offline import must remain consistent with the corrected full initialization SQL path.
