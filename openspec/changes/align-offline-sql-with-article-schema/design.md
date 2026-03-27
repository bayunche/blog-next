# Design

## Context

The application model currently defines article fields such as `cardCover`, `cover`, `description`, `likeCount`, `musicId`, and `musicName`. The offline shell bundle includes a manual SQL import path that loads `server/db/prod_full_import.sql` into MySQL. That dump already appends several post-table `ALTER TABLE` statements for newer article fields, but it does not append `cardCover`, causing schema drift as soon as the shipped backend queries the restored data.

At the same time, the repository contains multiple SQL assets:

- `server/db/prod_full_import.sql`: the most complete content dump and likely best base for a “fully initialized” import.
- `server/db/article_structure.sql`: a structure-focused reference without the desired content data.
- historical snapshots such as `dist/.../docker/mysql/backup/dev_before_import_20260310_220549.sql` and `pre_import_20260228_154545.sql`: smaller but useful references for later schema evolution.

## Goals

- Make the supported offline SQL import path produce an article schema compatible with the current backend model.
- Select and normalize one repository-owned full initialization SQL artifact that includes the intended content data set and correct article metadata columns.
- Keep the fix bounded to repository-owned SQL/bootstrap assets and offline delivery validation rather than redesigning database migration strategy.
- Ensure the existing shell offline bundle can be refreshed with corrected import assets after the repair.

## Non-Goals

- Introducing a full migration framework for the legacy Koa service.
- Redesigning article metadata semantics or changing the query contract.
- Reworking the Windows offline bundle unless the same SQL asset is shared there and requires the same update.

## Proposed Approach

1. Inventory the repository-owned SQL candidates and confirm which one should serve as the full initialization baseline for offline restore.
2. Update the chosen SQL artifact, plus any mirrored bundle-copied SQL/bootstrap assets, so `article.cardCover` is created alongside the other already-supported extension columns and the resulting dump stays self-consistent.
3. Review any schema helper or runtime bootstrap path already present in the backend and keep it aligned with the delivered SQL files rather than using it as the only repair mechanism.
4. Add a targeted validation command or script step that checks the shipped SQL/bootstrap assets for the required article extension columns expected by the backend model.
5. Refresh `dist/offline-bundle-sh-latest` so the corrected SQL files and any updated validation/documentation artifacts are included in the delivered bundle.

## Alternatives Considered

### Alternative: Rely only on runtime `ensureSchema()` at server startup

Rejected because the current failure occurs during offline restore and should be fixed in the delivered import path itself. Depending solely on runtime repair would leave operators with a brittle recovery path and would not improve the correctness of the shipped SQL assets.

### Alternative: Create a brand-new synthetic seed SQL from scratch

Rejected for this scope because the user explicitly wants us to find the correct existing SQL, then optimize it using older prod-export references. Starting from scratch would add avoidable risk of losing real content data or missing legacy relations embedded in the existing dump.

### Alternative: Remove `cardCover` from the backend query/model

Rejected because `cardCover` is already used in both admin and public codepaths, and removing it would roll back an already accepted content capability rather than repairing the broken restore artifact.

## Risks And Mitigations

- Risk: SQL dumps and model fields drift again later.
  - Mitigation: add targeted schema-alignment validation for the offline SQL path and keep it tied to the shipped article extension fields.
- Risk: Choosing the wrong base dump could discard intended production content.
  - Mitigation: compare repository SQL candidates by data completeness and schema evolution, then document the chosen baseline explicitly.
- Risk: Updating only one dump leaves another supported import file stale.
  - Mitigation: inspect all repository-owned SQL inputs copied into the offline bundle and align each supported article bootstrap path consistently.
- Risk: Offline bundle refresh could overwrite operator helper scripts.
  - Mitigation: validate the refreshed bundle still includes `import-offline.sh`, `import-sql.sh`, and the corrected SQL files.

## Validation Plan

- Run targeted checks against the corrected SQL/bootstrap files to confirm required article columns are present.
- Re-run the offline bundle refresh for `dist/offline-bundle-sh-latest`.
- Verify the refreshed bundle still contains the import scripts plus corrected SQL assets.

## Rollback

If the repair introduces an unexpected import regression, revert the SQL/bootstrap alignment changes and restore the previous offline bundle contents while keeping the model/runtime code unchanged.
