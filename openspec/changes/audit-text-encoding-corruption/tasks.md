## 1. Audit And Classification

- [x] 1.1 Inventory suspicious text findings in application-owned source and classify each one as `display-only`, `source-corrupted`, or `unresolved`.
- [x] 1.2 Record explicit exclusions for vendor, generated, binary, and historical snapshot files so the cleanup remains bounded and reviewable.

## 2. Confirmed Backend And Log Repair

- [x] 2.1 Repair only the backend/router/controller/model files whose source bytes or runtime behavior confirm real encoding corruption or comment-merged code.
- [x] 2.2 Repair confirmed operator-visible log or status strings whose garbling reproduces outside the terminal display artifact.
- [x] 2.3 Re-verify repaired backend modules with targeted syntax/loading checks so route availability and startup safety are preserved.

## 3. Prevention And Residual Risk

- [x] 3.1 Add a repeatable repository-local text integrity audit command/script with documented exclusions and explicit encoding assumptions.
- [x] 3.2 Re-check whether public/admin/runtime bundle text still needs changes after source-aware verification, and leave those domains untouched if no real defect is confirmed.
- [x] 3.3 Run targeted validation for the repaired domains and record residual risk for any shell-only display issues that remain outside application source.
