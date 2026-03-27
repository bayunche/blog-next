## Context

The latest user feedback narrows the problem statement substantially: actual rendered content appears healthy, while terminal or log output appears garbled during inspection. That means the current risk is a mix of two possibilities:

- a display-only encoding mismatch in the local shell or log viewer; and
- a smaller set of real source-level defects where comments or strings have been merged or corrupted.

The repository already contains evidence that real source corruption can happen, because `server/controllers/article.js` previously had to be rebuilt after a confirmed runtime syntax failure. However, broad claims about public-page text are now too strong without source-aware verification outside the shell output path.

This makes the design more evidence-driven than the previous draft: first prove whether a file is actually corrupted at the source or runtime level, then repair only confirmed defects. The repository still has the same validation constraints: repo-wide lint is noisy, full local `npm run build` is blocked by the missing Windows `lightningcss` binary, and the working tree can contain unrelated user changes.

## Goals / Non-Goals

**Goals:**
- Distinguish terminal-display garbling from confirmed source-level corruption before editing application code.
- Remove confirmed encoding corruption from application-owned source that affects runtime behavior or operator-visible diagnostics.
- Restore swallowed routes or malformed backend source only when those defects are proven independent of shell display artifacts.
- Add a repeatable audit path so future contributors can verify text integrity without relying on potentially misleading terminal output.
- Keep the cleanup scoped and reviewable by prioritizing executable/backend/operator risk first.

**Non-Goals:**
- Rewriting healthy public-site or backoffice copy based only on terminal-rendered mojibake.
- Rewriting historical article bodies or metadata stored inside SQL dump snapshots unless they are actively consumed as runtime diagnostics.
- Performing a blind full-repo transcoding pass over vendor, generated, or binary assets.
- Standardizing all Chinese developer comments into English.
- Solving unrelated lint/build debt beyond what is needed to validate the encoding cleanup safely.

## Decisions

### 1. Verify source bytes and runtime behavior before treating shell output as corruption

The implementation will use source-aware inspection methods that do not depend on the current PowerShell rendering path before classifying a file as corrupted. Suspect findings from shell output will be confirmed via byte-level or explicit-encoding reads, targeted syntax checks, or runtime/module-loading behavior.

Alternative considered: trust shell-rendered mojibake as direct evidence of source corruption. Rejected because the user has already provided counter-evidence that visible site content is healthy, and a local code-page mismatch can mimic the same symptom.

### 2. Treat confirmed comment-merged code as correctness bugs, not cosmetic cleanup

Where source-aware inspection confirms that comments swallow `router.*(...)` calls or collapse literals into invalid syntax, the cleanup will restore the intended executable structure first. Candidate route chains in Koa router modules are the main high-risk area.

Alternative considered: defer swallowed-route fixes into separate behavior changes. Rejected because the corruption has already changed runtime behavior and therefore belongs inside the text-integrity remediation itself.

### 3. Add a lightweight audit routine that avoids shell-code-page ambiguity

The change will add a repository-local audit command or script that scans application-owned text files with explicit exclusions for `node_modules`, generated outputs, bundle image archives, and large data snapshots. The audit must run with an explicit encoding strategy so its output is more reliable than ad hoc terminal inspection.

Alternative considered: wire a hard repository-wide lint/CI gate immediately. Rejected for now because the current repo already has noisy lint/build constraints, and a hard gate would create operational churn before the baseline is cleaned up.

### 4. Prefer minimal, confirmed repairs over speculative copy rewriting

When the original wording is recoverable from confirmed source context, the cleanup will restore clear intended strings. When a file proves healthy at runtime and only looks garbled in the shell, the cleanup will avoid editing it and instead document the display-path limitation or fix the audit/logging path.

Alternative considered: attempt automated charset round-tripping or broad string replacement across suspect UI files. Rejected because the latest feedback suggests that would likely create unnecessary churn in healthy application code.

### 5. Exclude secret-like local config and historical data snapshots from automatic normalization

The change will not rewrite `openclaw.json`, vendor code, generated outputs, image archives, or SQL/article snapshot trees unless a specific file is proven to affect active runtime behavior or operator workflows. This minimizes risk around secrets, historical content, and large review-unfriendly diffs.

Alternative considered: include all text files under the repo root. Rejected because it would unnecessarily broaden scope and risk touching non-authoritative or secret-bearing files.

## Risks / Trade-offs

- [Audit heuristics miss some corruption or flag false positives] -> Keep the audit output review-based, document exclusions, and manually inspect the high-risk directories discovered during the initial pass.
- [Terminal rendering still misleads reviewers after the cleanup] -> Prefer explicit-encoding audit output and describe which checks prove a file healthy or unhealthy.
- [Original wording cannot always be reconstructed] -> Replace unrecoverable strings with concise neutral copy and note assumptions in the implementation summary.
- [Wide file touch increases merge conflict risk] -> Keep edits scoped to active source domains, avoid unrelated formatting churn, and respect existing user worktree changes.
- [Current repo-wide validation is incomplete] -> Use targeted syntax checks, route module loading, and selected page/build validations where feasible; record any gaps explicitly.
- [Operator docs may diverge between shell and PowerShell bundles] -> Decide during implementation whether to repair both delivery folders in the same pass or document an intentional follow-up.

## Migration Plan

1. Run a bounded audit over owned source trees and classify each suspect finding as display-only, source-corrupted, or unresolved.
2. Repair confirmed runtime-breaking/backend route or log-string defects first.
3. Add the repeatable audit routine and document its exclusions plus any known shell-display caveats.
4. Run targeted validation on repaired files, including syntax/module loading for backend route files and the new audit command itself.
5. Only expand into public/admin/runtime bundle text if a confirmed source-backed defect is reproduced there.

Rollback plan:

- Revert the encoding-cleanup commit(s) if a repaired string or route restoration introduces an unintended regression.
- Restore the previous offline delivery artifacts if any operator-facing bundle changes prove incorrect.
- Because no schema migration is planned, rollback remains source-only.

## Open Questions

- Which runtime or log outputs does the user consider authoritative for reproducing the garbled text: local PowerShell logs, container logs, app stderr, or bundle scripts?
- Should the implementation normalize both `dist/offline-bundle-sh-latest` and `dist/offline-bundle-ps1-latest` operator text in the same change if log/output-path issues are confirmed there?
