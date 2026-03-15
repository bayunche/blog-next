## Why

This repository is a brownfield system with a mixed modern frontend and legacy backend, but it currently has no enforced proposal-first workflow. The lack of a canonical planning gate makes architectural drift, unsafe edits, and local-risk leakage more likely.

## What Changes

- Introduce official OpenSpec into the repository as the canonical planning workflow.
- Capture the current system in baseline source-of-truth specs so future proposals can reason from the existing architecture.
- Add a repository-level operating contract that forbids code changes before the user reviews the OpenSpec proposal package.
- Record the current audit findings and make them mandatory context for future proposals.

## Capabilities

### New Capabilities
- `engineering-governance`: repository-level change governance that requires OpenSpec proposal, design, tasking, and explicit user review before implementation

### Modified Capabilities
- None.

## Impact

- Tooling: `@fission-ai/openspec`, `openspec/`, `.codex/skills/`, `.claude/skills/`, `.claude/commands/`
- Governance: new root `AGENTS.md` plus stricter OpenSpec project context and artifact rules
- Documentation/source of truth: baseline specs for public blog, backoffice, backend API, and runtime operations
- Runtime behavior: no intended product-facing runtime change in this bootstrap change
