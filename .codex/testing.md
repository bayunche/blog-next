# Testing Log

- Date: 2026-03-16
- Executor: Codex

## Commands Run

- `bash -n build.sh`
- `bash -n build_docker_prod.sh`
- `bash -n package_offline_docker.sh`
- `bash build.sh --help`
- `bash build_docker_prod.sh --help`
- `powershell -ExecutionPolicy Bypass -File .\build_docker_prod.ps1 --help`
- PowerShell parser validation for `build_docker_prod.ps1` and `package_offline_docker.ps1`
- `docker compose --env-file .env.prod.template -f docker-compose.yml -f docker-compose.prod.yml config`
- `docker compose -f docker-compose.dev.yml config`
- Fake Docker harness validation for:
  - `build.sh -e prod`
  - `build.sh -e prod --no-start`
  - `build.sh -e prod --no-start --save`

## Results

- Canonical production script help output is available and wrapper scripts forward to it.
- Bash and PowerShell scripts parse successfully.
- Production and development Compose manifests resolve successfully with the new explicit image names.
- Fake Docker validation confirms deploy, build-only, and export control flow without mutating the real local runtime.
- `package_offline_docker.sh` was normalized during this change so Bash can parse it correctly in the current environment.
