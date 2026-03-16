## 1. Canonical Production Entry Point

- [x] 1.1 Define the canonical production delivery script behavior for deploy, build-only, and export flows, using one shared set of production compose/env selections.
- [x] 1.2 Convert redundant production deployment scripts into thin wrappers or remove them once the canonical entrypoint is in place.

## 2. Shared Runtime Image Contract

- [x] 2.1 Make the locally built runtime service images explicit in compose-managed configuration instead of relying on implicit compose project naming.
- [x] 2.2 Update export logic and any related secondary packaging workflow to resolve those same explicit image names consistently.

## 3. Documentation And Operator Guidance

- [x] 3.1 Update deployment documentation to point to the canonical production workflow and remove conflicting "official" entrypoints.
- [x] 3.2 Clarify that offline bundle packaging is a separate operator workflow even when it reuses the same runtime image contract.

## 4. Validation

- [x] 4.1 Run targeted validation for the canonical production deploy path, the build-without-start path, and the export path.
- [x] 4.2 Run practical syntax or dry-run validation for any retained Bash and PowerShell wrappers plus compose resolution, and document residual risk from the repository's known global lint/build issues.

## 5. Interactive Default Mode

- [x] 5.1 Update `build.sh` so running it without flags enters an interactive selection flow for environment and post-build action, while explicit flags remain non-interactive.
- [x] 5.2 Update deployment documentation and validation notes to cover the interactive no-flag workflow for both dev and prod branches.

## Validation Notes

- `bash build.sh --help` prints the canonical production/development entrypoint help text.
- `bash build_docker_prod.sh --help` and `powershell -ExecutionPolicy Bypass -File .\build_docker_prod.ps1 --help` both route to the canonical `build.sh -e prod` help output, confirming the compatibility wrappers resolve correctly.
- `bash -n build.sh`, `bash -n build_docker_prod.sh`, and `bash -n package_offline_docker.sh` all pass syntax checks after normalizing the offline packaging shell script line endings.
- PowerShell parser validation passes for `build_docker_prod.ps1` and `package_offline_docker.ps1`.
- `docker compose --env-file .env.prod.template -f docker-compose.yml -f docker-compose.prod.yml config` and `docker compose -f docker-compose.dev.yml config` both pass after introducing explicit image names and removing obsolete Compose `version` fields.
- A fake Docker harness was used to exercise `build.sh -e prod`, `build.sh -e prod --no-start`, and `build.sh -e prod --no-start --save`, verifying that the canonical script selects the production compose stack, suppresses startup for build-only mode, and exports the tagged `blog-sakurairo-*` images including `blog-sakurairo-db-backup`.
- A no-flag interactive fake Docker harness was used to verify three guided branches: `prod` build+start with export enabled, `dev` build-only with clean build enabled, and `prod` stop-services mode. Explicit flag-driven export behavior remained non-interactive.
- Residual repository risk remains unchanged: full application `npm run build` and `npm run lint` were not used as acceptance gates for this runtime-script change because the repository still carries known unrelated build/lint issues.
