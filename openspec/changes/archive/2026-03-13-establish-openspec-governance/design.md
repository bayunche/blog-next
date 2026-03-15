## Context

This repository combines a modern Next.js 16 + React 19 frontend with a legacy Koa + Sequelize 5 backend that still owns core content APIs, auth handling, and upload serving. The codebase already contains user-owned in-flight changes, tracked local-tooling configuration, and multiple build-health issues, which means uncontrolled edits can create hidden cross-stack regressions quickly.

Current audit findings that shaped this design:

- OpenSpec was not yet the canonical planning layer for the repository.
- `npm run lint` currently fails broadly because the lint scope includes active frontend code together with legacy server JavaScript, vendor bundles, and temp artifacts.
- `npm run build` currently fails because the local install is missing the Windows native `lightningcss` binary used by the current Tailwind/PostCSS chain.
- `openclaw.json` is tracked and contains secret-like local configuration, so future work must treat secret handling as a first-class risk.

## Goals / Non-Goals

**Goals:**
- Make OpenSpec the canonical planning mechanism for future repository changes.
- Capture baseline architecture specs so future changes can reason against the current system instead of chat history alone.
- Enforce a user-review gate before any implementation work begins.
- Preserve the bootstrap setup as a documented governance change rather than as undocumented repository drift.

**Non-Goals:**
- Fix the current lint or build failures in this bootstrap change.
- Refactor business features in the public site, admin site, or backend API.
- Rotate secrets or clean tracked local-tooling files without a dedicated approved remediation change.

## Decisions

### Decision: Treat OpenSpec as the only authoritative planning workflow

The repository already contains legacy planning artifacts under `.spec-workflow/`, but keeping multiple planning systems active would create ambiguity about which source of truth future changes must follow. OpenSpec becomes the canonical workflow because it is now installed officially, integrated with Codex and Claude, and structured around repository-local specs and changes.

Alternative considered:
- Keep both `.spec-workflow/` and OpenSpec active. Rejected because it would split source-of-truth planning state and weaken enforcement.

### Decision: Capture the current platform as baseline capability specs

Future proposals need an architecture baseline that covers the public site, admin backoffice, backend API, and runtime composition. Recording those domains under `openspec/specs/` gives future proposals a stable contract to diff against.

Alternative considered:
- Store only a narrative audit document without baseline specs. Rejected because future OpenSpec deltas need concrete capability names and current-state contracts.

### Decision: Enforce the approval gate through repository instructions and OpenSpec rules

OpenSpec itself provides the artifact structure, but repository-level enforcement still depends on the working instructions given to assistants. A root `AGENTS.md` plus project-specific OpenSpec rules makes the approval gate explicit and versioned with the repository.

Alternative considered:
- Rely on human convention without repository instructions. Rejected because the user explicitly requires deterministic proposal-first execution for every future code change.

## Risks / Trade-offs

- [Process overhead] More up-front documentation is required before each implementation. Mitigation: keep specs lightweight but mandatory, and use baseline capability scopes to avoid rewriting context each time.
- [Baseline drift] Source-of-truth specs can become stale if future changes are implemented without archiving or syncing. Mitigation: require OpenSpec usage for every future code change and keep archive/update steps in the workflow.
- [Unresolved repo debt] Current lint/build/security issues remain. Mitigation: record them as mandatory planning context so future proposals explicitly account for them.
- [Bootstrap exception] This setup change itself was performed to establish the process that future changes must follow. Mitigation: preserve this bootstrap as a documented OpenSpec change and avoid mixing it with unrelated product work.

## Migration Plan

1. Install the official OpenSpec CLI as a project dependency.
2. Initialize OpenSpec for Codex and Claude in the repository.
3. Add baseline specs for the current architecture.
4. Add repository instructions that require proposal -> review -> implementation.
5. Validate the OpenSpec artifacts and archive the governance change into the baseline spec set.

Rollback strategy:

- Remove `openspec/`, `.codex/skills/openspec-*`, `.claude/skills/openspec-*`, `.claude/commands/opsx/`, and `AGENTS.md`.
- Remove the `@fission-ai/openspec` dependency if the repository owner intentionally abandons OpenSpec.

## Open Questions

- Should the next approved change focus first on secret hygiene for tracked local-tooling files or on restoring lint/build health?
- Should the repository later enable the expanded OpenSpec workflow profile, including explicit verify/onboard commands, once the baseline process stabilizes?
