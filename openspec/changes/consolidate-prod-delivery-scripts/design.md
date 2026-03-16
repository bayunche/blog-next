## Context

The repository currently exposes multiple runtime-delivery scripts that overlap in purpose:

- `build_docker_prod.sh` and `build_docker_prod.ps1` start the production compose stack with `.env.prod`
- `build.sh` already supports `--env prod`, `--no-start`, `--save`, `--push`, and compose startup/teardown flows
- `package_offline_docker.sh` and `package_offline_docker.ps1` assemble an offline bundle and therefore share some build/export concerns, but they also copy runtime files and generate import helpers

This overlap would be tolerable if the underlying image and compose contract were stable. It is not. The current scripts assume different image names:

- `build.sh` uses `sakurairo-web`, `sakurairo-server`, and `sakurairo-music-api`
- offline packaging assumes `blog-sakurairo-web`, `blog-sakurairo-server`, and `blog-sakurairo-music-api`
- `docker-compose.yml` currently builds the runtime services without explicit `image:` names, so the actual built image identity depends on compose project naming instead of a repository-owned contract

That means the problem is larger than duplicate shell code. Operators do not have one canonical production workflow, and secondary workflows such as image export or offline packaging can silently depend on the wrong image references.

## Goals / Non-Goals

**Goals**

- Provide one canonical production delivery entrypoint for build/deploy/export behavior.
- Remove duplicated production deployment logic from legacy scripts.
- Define stable runtime image references that all delivery workflows can share.
- Keep Linux/macOS and Windows operators supported without maintaining independent orchestration logic.
- Update documentation so the supported production workflow is obvious.

**Non-Goals**

- Redesign the application runtime architecture, compose topology, or service boundaries.
- Change `src/`, `src/app/admin/`, `server/`, or the MySQL schema.
- Rebuild the entire offline bundle workflow as part of this change.
- Solve the repository's unrelated lint noise or missing Windows `lightningcss` build dependency.

## Decisions

### Decision: Use one canonical production orchestrator for deploy and export

The repository should expose one canonical script path for production delivery behavior, with flags or sub-modes for:

- build and start production services
- build production images without starting services
- export the built production images

Why:

- the current `build.sh` already covers most of this behavior, so converging on one orchestrator reuses the existing direction instead of inventing a new tool
- operators should not have to decide between different scripts for "deploy prod" versus "build prod and export"
- keeping the same code path for deploy and export reduces behavior drift in env-file selection, compose overlay selection, and image tagging

Implementation direction:

- consolidate the production logic into a single canonical script
- if Windows needs a dedicated entrypoint, keep it as a thin wrapper around the same behavior model instead of a separate implementation tree

### Decision: Make runtime image names explicit in compose-managed services

The repository should declare stable image names for the built runtime services instead of relying on implicit compose project naming or container names.

Why:

- export and tagging logic must target the same built images every time
- compose project naming can vary with directory name or `COMPOSE_PROJECT_NAME`
- container names are not image names and should not be used as a substitute contract
- secondary workflows such as offline packaging need a stable reference that does not require duplicated naming assumptions

Implementation direction:

- define explicit image names in the compose-managed runtime services that are built locally
- make the canonical production script and any related export logic use those same image names

### Decision: Keep offline bundle assembly as a separate operator intent

Offline bundle generation should not be treated as identical to online production deployment, even though both flows may share build and image-resolution helpers.

Why:

- offline packaging also copies runtime directories, compose manifests, env snapshots, and import helpers
- forcing that behavior into the default production deploy path would widen the blast radius of a simple production rollout
- the user request is about consolidating production build/deploy/export entrypoints, not redesigning every delivery artifact

Implementation direction:

- keep offline packaging as a distinct command or thin wrapper
- require it to consume the same explicit runtime image references used by the canonical production delivery flow

### Decision: Prefer removal or wrapper conversion over long-term parallel scripts

After consolidation, redundant production scripts should either be removed or reduced to thin wrappers that call the canonical entrypoint.

Why:

- the current documentation drift exists because multiple scripts own similar orchestration logic
- parallel implementations in Bash and PowerShell are expensive to keep behaviorally identical
- thin wrappers preserve operator convenience without duplicating runtime decisions

## Alternatives Considered

### Alternative: Keep the current scripts and only update documentation

Rejected because documentation alone does not fix the current image-naming inconsistency or prevent the scripts from drifting further.

### Alternative: Merge deployment and offline packaging into one all-purpose script

Rejected for this scope because offline packaging has materially different operator intent and output structure. It should share contract and helper logic, not become the default deploy path.

### Alternative: Infer built image names from compose project naming at runtime

Rejected because compose project names vary by working directory and environment. Stable runtime image references must be repository-owned, not incidental.

### Alternative: Introduce a new task runner or build system just for deployment scripts

Rejected because the repository already has workable shell-based tooling. The immediate problem is contract drift, not lack of a new orchestration framework.

## Risks / Trade-offs

- [Operator habit breakage] Users familiar with legacy script names may need to switch to the canonical entrypoint. Mitigation: update docs clearly and use thin wrappers when appropriate.
- [Windows parity risk] If Windows keeps a wrapper rather than a separate implementation, the wrapper contract must still cover the same production behaviors. Mitigation: validate the wrapper invocation paths explicitly.
- [Image-name migration risk] Changing to explicit image names may affect local caches or any external notes that referenced implicit compose images. Mitigation: document the new names and keep them stable.
- [Secondary workflow compatibility] Offline packaging must be updated enough to consume the same image names, even if it is not otherwise redesigned. Mitigation: include compatibility validation in the implementation tasks.
- [Validation limits] Full repository `npm run build` and `npm run lint` remain noisy or blocked for unrelated reasons. Mitigation: run targeted script and compose validation plus any shell/PowerShell syntax checks that are practical in the local environment.

## Migration Plan

1. Define the canonical production delivery behavior and explicit runtime image names in the relevant scripts and compose manifests.
2. Converge legacy production script logic onto the canonical entrypoint.
3. Adjust export and any compatible secondary packaging flow to resolve the shared explicit image references.
4. Update deployment documentation to point at the canonical workflow and clearly separate offline packaging guidance.
5. Run targeted validation for production deploy, build-only, and export behavior without modifying application features.

Rollback strategy:

- restore the previous script entrypoints and compose image naming
- revert documentation to the prior production workflow
- no data rollback is required because the change is limited to runtime tooling

## Cross-System Impact Review

- Public frontend (`src/`): intentionally unaffected.
- Backoffice (`src/app/admin/`): intentionally unaffected.
- Backend API (`server/`): intentionally unaffected.
- MySQL/data: intentionally unaffected.
- Uploads/media/music integrations: intentionally unaffected functionally.
- Build/test/runtime/Docker: directly affected in script orchestration, compose image identity, export behavior, and documentation.
- Security/secrets: no new secrets are introduced; production env handling must remain explicit.
- Observability/docs: documentation changes are required; no new telemetry surface is planned.
