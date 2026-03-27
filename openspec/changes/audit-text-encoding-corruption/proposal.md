## Why

Recent investigation and user feedback indicate that the primary symptom is not necessarily public-site copy corruption, but garbled terminal or log output during local inspection and runtime debugging. Some files also look suspicious in shell output, so the real problem now is ambiguity: we need to separate display-layer encoding issues from confirmed source-level corruption before making broad text changes.

This needs a bounded audit now because a terminal-decoding issue and a real source corruption bug look similar in raw inspection output, but they require very different fixes. Without first classifying which findings are real, future work risks rewriting healthy user-facing copy or missing backend files that are genuinely broken.

## What Changes

- Audit application-owned text-bearing source and runtime output paths to distinguish terminal-display garbling from confirmed source-level encoding corruption.
- Verify the small set of backend files that currently look suspicious in shell output and repair only the ones whose source bytes or runtime behavior are actually wrong.
- Repair confirmed backend/operator-facing log strings or route/module source only where the issue is reproducible outside the terminal display artifact.
- Add a lightweight, repository-local text integrity audit routine with explicit exclusions for vendor, generated, and snapshot data trees so future review can re-run the check without relying on shell code-page behavior.
- Preserve public-site and backoffice copy unless a source-backed, runtime-visible encoding defect is confirmed during the audit.
- Record residual risk for files that still look suspicious in terminal output but are proven healthy at runtime.

## Capabilities

### New Capabilities
- `text-integrity-audit`: Provide a supported repository-local audit routine for detecting likely encoding corruption in application-owned source files.

### Modified Capabilities
- `content-api`: Backend route modules and operator-visible API/runtime strings must not lose behavior or readability because of confirmed encoding-corrupted source text.
- `runtime-operations`: Supported local/runtime audit workflows and operator-facing logs must remain readable enough to diagnose the system without terminal-decoding ambiguity.

## Impact

- Frontend public behavior: expected to remain unchanged unless the audit proves a user-visible encoding defect in source, in which case that scope will be called out explicitly before implementation.
- Backoffice flows: expected to remain unchanged unless a confirmed source-level defect is reproduced there.
- Backend API: affects `server/router/**`, selected controllers/models, and maintained runtime messages only where source-aware verification confirms a real defect instead of terminal display noise.
- MySQL schema and data: no schema migration is intended; historical SQL/article content snapshots remain out of scope unless they directly affect active runtime diagnostics.
- Uploads, image bed, music integrations: no contract changes are intended, but route verification may restore any endpoint proven to be disabled by comment-merged source.
- Build, lint, test, Docker, runtime: targeted syntax/module checks and source-audit verification will be used; full repo lint/build remains constrained by known pre-existing environment issues.
- Security and secrets: no secret rotation or config rewriting is planned; `openclaw.json` and other secret-like local values remain untouched.
- Observability and docs: local inspection and operator diagnosis become the main focus, especially where shell/log output is currently misleading.
