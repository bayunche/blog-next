# Repository Operating Contract

This repository uses OpenSpec as the canonical change-management workflow.

## Canonical Planning System

- OpenSpec lives in `openspec/`.
- `openspec/specs/` is the source of truth for current behavior and operational constraints.
- `openspec/changes/` contains proposed changes that have not yet been archived.
- The legacy `.spec-workflow/` directory is not authoritative for this repository. Do not use it as the primary planning system unless the user explicitly asks for it.

## Mandatory Workflow For Every Future Code Change

1. Read `openspec/config.yaml` and every affected spec under `openspec/specs/`.
2. Create or update a single change in `openspec/changes/<kebab-case-change>/` with:
   - `proposal.md`
   - `specs/<capability>/spec.md` delta files
   - `design.md`
   - `tasks.md`
3. Present the proposal package to the user for review.
4. Wait for explicit user approval before editing application code, server code, database schema, dependencies, environment configuration, Docker manifests, or deployment scripts.
5. If scope changes during implementation, stop, update the OpenSpec artifacts, and get approval again before continuing.

If no approved OpenSpec change exists, the only allowed edits are:

- OpenSpec artifacts in `openspec/`
- This `AGENTS.md`
- Tooling needed to keep the OpenSpec workflow operational when explicitly requested by the user

## Proposal Standard

Every proposal must be written from an architecture-owner perspective.

At minimum, proposals and designs must evaluate impact on:

- `src/` public frontend behavior
- `src/app/admin/` backoffice flows
- `server/` Koa routes, controllers, models, and auth
- MySQL schema, seed, and migration implications
- asset uploads, image bed integration, and music-related integrations
- build, lint, test, Docker, and runtime environment behavior
- security, secrets handling, rollback, observability, and documentation

Proposals must not be framed as isolated file edits. They must explain system-wide effects, constraints, alternatives, and blast radius.

## Approval Gate

- Do not implement after a proposal is drafted until the user has reviewed it.
- Do not treat "continue", "go on", or broad conversation flow as approval if the user is still giving feedback on the proposal itself.
- If the user asks to skip planning, explain that this repository requires OpenSpec-first delivery and keep the discussion in proposal mode until approved.

## Task Execution Rules

- Keep `tasks.md` current while implementing.
- Mark tasks complete only after the corresponding code and validation are complete.
- Run targeted validation for the affected area before closing the change.
- Summarize residual risk if a check cannot run or if an existing repo issue remains unresolved.

## Project Architecture Context

- Public site: Next.js 16 App Router in `src/` with React 19, Tailwind 4, TanStack Query, Zustand, and custom presentation components.
- Backoffice: admin pages inside the same Next.js app, including article editing and taxonomy management.
- Backend API: legacy Koa + Sequelize 5 service in `server/`, consumed through Next.js rewrites from `/api/*`.
- Data/runtime: MySQL-backed content, upload serving from `/public/uploads/*`, GitHub OAuth, optional image bed integration, and a music-related API/service.

## Known Repository Risks

- `openclaw.json` is tracked and contains secret-like local configuration fields. Treat secret handling as a high-risk topic and do not expose, rotate, or rewrite those values without an approved change.
- `npm run lint` is currently noisy and fails because the lint scope includes legacy server code, vendor assets, and temporary artifacts in addition to active frontend code.
- `npm run build` currently fails because the local install is missing the Windows native `lightningcss` binary required by the current Tailwind/PostCSS toolchain.
- The working tree may contain user-owned uncommitted changes. Never overwrite unrelated edits.

## Operating Principle

For this repository, planning quality is part of the implementation. OpenSpec is not optional process overhead; it is the required gate before code changes.
