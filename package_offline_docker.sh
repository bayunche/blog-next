#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
OUTPUT_DIR="${1:-${ROOT_DIR}/dist/offline-bundle-${TIMESTAMP}}"
IMAGE_ARCHIVE="blog-sakurairo-images.tar"

IMAGES=(
  "blog-sakurairo-server"
  "blog-sakurairo-web"
  "blog-sakurairo-music-api"
  "blog-sakurairo-db-backup"
  "mysql:8.0"
  "nginx:alpine"
  "umputun/remark42:latest"
)

log() {
  echo "[offline-package] $*"
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

copy_if_exists() {
  local source_path="$1"
  local target_path="$2"

  if [[ -e "$source_path" ]]; then
    mkdir -p "$(dirname "$target_path")"
    if [[ -d "$source_path" ]]; then
      mkdir -p "$target_path"
      if ! cp -R "$source_path"/. "$target_path"/ 2>/dev/null; then
        log "Warning: skip unreadable path $source_path"
      fi
      return
    fi
    if ! cp -R "$source_path" "$target_path" 2>/dev/null; then
      log "Warning: skip unreadable path $source_path"
    fi
  fi
}

require_cmd docker

if ! docker compose version >/dev/null 2>&1; then
  echo "docker compose is required" >&2
  exit 1
fi

cd "$ROOT_DIR"

if [[ ! -f .env && -f .env.docker ]]; then
  cp .env.docker .env
fi

mkdir -p "$OUTPUT_DIR/images" "$OUTPUT_DIR/docker/mysql" "$OUTPUT_DIR/docker" "$OUTPUT_DIR/server"

log "Running backend API test gate"
npm --prefix server run test:api

log "Backend API test gate passed"

log "Building local images"
docker compose -f docker-compose.yml build server web music-api db-backup

for image in "mysql:8.0" "nginx:alpine" "umputun/remark42:latest"; do
  if ! docker image inspect "$image" >/dev/null 2>&1; then
    log "Pulling missing image: $image"
    docker pull "$image"
  fi
done

log "Copying runtime files"
cp docker-compose.offline.yml "$OUTPUT_DIR/docker-compose.offline.yml"

if [[ -f .env ]]; then
  cp .env "$OUTPUT_DIR/.env.offline"
fi

copy_if_exists "docker/nginx" "$OUTPUT_DIR/docker/nginx"
copy_if_exists "docker/remark42" "$OUTPUT_DIR/docker/remark42"
copy_if_exists "docker/mysql/init" "$OUTPUT_DIR/docker/mysql/init"
copy_if_exists "docker/mysql/backup" "$OUTPUT_DIR/docker/mysql/backup"
copy_if_exists "server/data" "$OUTPUT_DIR/server/data"
copy_if_exists "server/db" "$OUTPUT_DIR/server/db"

if [[ -f "server/db/prod_full_init.sql" ]]; then
  mkdir -p "$OUTPUT_DIR/docker/mysql/init"
  cp "server/db/prod_full_init.sql" "$OUTPUT_DIR/docker/mysql/init/99-prod_full_init.sql"
elif [[ -f "server/db/prod_full_import.sql" ]]; then
  mkdir -p "$OUTPUT_DIR/docker/mysql/init"
  cp "server/db/prod_full_import.sql" "$OUTPUT_DIR/docker/mysql/init/99-prod_full_import.sql"
fi

cat > "$OUTPUT_DIR/import-offline.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_ARCHIVE="${ROOT_DIR}/images/blog-sakurairo-images.tar"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required" >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "docker compose is required" >&2
  exit 1
fi

docker load -i "$IMAGE_ARCHIVE"

if [[ ! -f "${ROOT_DIR}/.env" && -f "${ROOT_DIR}/.env.offline" ]]; then
  cp "${ROOT_DIR}/.env.offline" "${ROOT_DIR}/.env"
fi

docker compose -f "${ROOT_DIR}/docker-compose.offline.yml" up -d
docker compose -f "${ROOT_DIR}/docker-compose.offline.yml" ps
EOF
chmod +x "$OUTPUT_DIR/import-offline.sh"

cat > "$OUTPUT_DIR/import-offline.ps1" <<'EOF'
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$imageArchive = Join-Path $root 'images/blog-sakurairo-images.tar'

docker load -i $imageArchive

$offlineEnv = Join-Path $root '.env.offline'
$runtimeEnv = Join-Path $root '.env'
if (-not (Test-Path $runtimeEnv) -and (Test-Path $offlineEnv)) {
    Copy-Item $offlineEnv $runtimeEnv
}

docker compose -f (Join-Path $root 'docker-compose.offline.yml') up -d
docker compose -f (Join-Path $root 'docker-compose.offline.yml') ps
EOF

cat > "$OUTPUT_DIR/import-sql.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.offline.yml"
DEFAULT_SQL_FILE="${ROOT_DIR}/server/db/prod_full_init.sql"
ENV_FILE="${ROOT_DIR}/.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  ENV_FILE="${ROOT_DIR}/.env.offline"
fi

if [[ $# -gt 1 ]]; then
  echo "Usage: ./import-sql.sh [sql-file]" >&2
  exit 1
fi

SQL_INPUT="${1:-${DEFAULT_SQL_FILE}}"
if [[ "${SQL_INPUT}" = /* ]]; then
  SQL_FILE="${SQL_INPUT}"
else
  SQL_FILE="${ROOT_DIR}/${SQL_INPUT#./}"
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required" >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "docker compose is required" >&2
  exit 1
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "Offline compose file not found: ${COMPOSE_FILE}" >&2
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Runtime env file not found. Expected ${ROOT_DIR}/.env or ${ROOT_DIR}/.env.offline" >&2
  exit 1
fi

if [[ ! -f "${SQL_FILE}" ]]; then
  echo "SQL file not found: ${SQL_FILE}" >&2
  exit 1
fi

echo "Using env file: ${ENV_FILE}"
echo "Using SQL file: ${SQL_FILE}"

docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d mysql

echo "Waiting for MySQL to become ready..."
READY=0
for _ in $(seq 1 60); do
  if docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T mysql sh -lc 'mysqladmin ping -h localhost -uroot -p"$MYSQL_ROOT_PASSWORD" --silent' >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 2
done

if [[ "${READY}" != "1" ]]; then
  echo "MySQL did not become ready in time" >&2
  exit 1
fi

echo "Importing SQL dump into the running MySQL service..."
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T mysql sh -lc 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot "$MYSQL_DATABASE"' < "${SQL_FILE}"

echo "SQL import completed successfully."
EOF
chmod +x "$OUTPUT_DIR/import-sql.sh"

cat > "$OUTPUT_DIR/README-OFFLINE.md" <<'EOF'
# Sakurairo Offline Bundle

## Contents

- `docker-compose.offline.yml`: offline runtime compose file
- `images/blog-sakurairo-images.tar`: exported Docker images
- `.env.offline`: copied local environment file used for packaging
- `docker/`, `server/`: runtime bind-mounted directories and SQL data

## Import on offline host

### Linux / macOS

`./import-offline.sh`

Manual SQL import:

`./import-sql.sh`

Or specify another dump:

`./import-sql.sh ./server/db/prod_full_init.sql`

### Windows PowerShell

`.\\import-offline.ps1`

## Notes

- The bundle copies your local `.env`; review secrets before distribution.
- If you need fresh article data, replace `server/db` or `docker/mysql/backup` before importing.
EOF

log "Saving Docker images to ${OUTPUT_DIR}/images/${IMAGE_ARCHIVE}"
docker save -o "$OUTPUT_DIR/images/${IMAGE_ARCHIVE}" "${IMAGES[@]}"

log "Offline bundle created at: $OUTPUT_DIR"
