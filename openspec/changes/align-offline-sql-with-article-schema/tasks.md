## 1. Schema Alignment

- [x] 1.1 Inventory every repository-owned SQL/bootstrap file copied into the supported offline shell bundle, compare them with the older prod-export snapshots, and document which one is the correct full initialization baseline.
- [x] 1.2 Update the supported SQL/bootstrap assets so the offline restore path includes `article.cardCover` and remains aligned with the currently queried article metadata fields.
- [x] 1.3 Produce the repository-owned full initialization SQL artifact that preserves the chosen baseline data set while aligning article schema with the shipped backend model.

## 2. Validation And Bundle Refresh

- [x] 2.1 Add or update a targeted validation step that checks the shipped SQL/bootstrap assets for required article extension columns.
- [x] 2.2 Refresh `dist/offline-bundle-sh-latest` so the corrected SQL assets and helper scripts are packaged together.
- [x] 2.3 Re-verify the refreshed bundle contents and record any residual risk.
