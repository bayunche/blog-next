$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outputDir = if ($args.Count -gt 0 -and $args[0]) {
    $args[0]
} else {
    Join-Path $root "dist/offline-bundle-$timestamp"
}

$imageArchive = 'blog-sakurairo-images.tar'
$images = @(
    'blog-sakurairo-server',
    'blog-sakurairo-web',
    'blog-sakurairo-music-api',
    'blog-sakurairo-db-backup',
    'mysql:8.0',
    'nginx:alpine',
    'umputun/remark42:latest'
)

function Write-Log {
    param([string]$Message)
    Write-Host "[offline-package] $Message"
}

function Copy-IfExists {
    param(
        [string]$SourcePath,
        [string]$TargetPath
    )

    if (Test-Path $SourcePath) {
        try {
            $parent = Split-Path -Parent $TargetPath
            if ($parent) {
                New-Item -ItemType Directory -Force -Path $parent | Out-Null
            }
            Copy-Item -Recurse -Force $SourcePath $TargetPath
        } catch {
            Write-Log "Warning: skip unreadable path $SourcePath"
        }
    }
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'docker is required'
}

docker compose version | Out-Null

Set-Location $root

if (-not (Test-Path '.env') -and (Test-Path '.env.docker')) {
    Copy-Item '.env.docker' '.env'
}

New-Item -ItemType Directory -Force -Path (Join-Path $outputDir 'images') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outputDir 'docker/mysql') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $outputDir 'server') | Out-Null

Write-Log 'Building local images'
docker compose -f docker-compose.yml build server web music-api db-backup

foreach ($image in @('mysql:8.0', 'nginx:alpine', 'umputun/remark42:latest')) {
    docker image inspect $image *> $null
    if (-not $?) {
        Write-Log "Pulling missing image: $image"
        docker pull $image
    }
}

Write-Log 'Copying runtime files'
Copy-Item 'docker-compose.offline.yml' (Join-Path $outputDir 'docker-compose.offline.yml')

if (Test-Path '.env') {
    Copy-Item '.env' (Join-Path $outputDir '.env.offline')
}

Copy-IfExists 'docker/nginx' (Join-Path $outputDir 'docker/nginx')
Copy-IfExists 'docker/remark42' (Join-Path $outputDir 'docker/remark42')
Copy-IfExists 'docker/mysql/init' (Join-Path $outputDir 'docker/mysql/init')
Copy-IfExists 'docker/mysql/backup' (Join-Path $outputDir 'docker/mysql/backup')
Copy-IfExists 'server/data' (Join-Path $outputDir 'server/data')
Copy-IfExists 'server/db' (Join-Path $outputDir 'server/db')

if (Test-Path 'server/db/prod_full_import.sql') {
    New-Item -ItemType Directory -Force -Path (Join-Path $outputDir 'docker/mysql/init') | Out-Null
    Copy-Item 'server/db/prod_full_import.sql' (Join-Path $outputDir 'docker/mysql/init/99-prod_full_import.sql')
}

$importSh = @'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_ARCHIVE="${ROOT_DIR}/images/blog-sakurairo-images.tar"

docker load -i "$IMAGE_ARCHIVE"

if [[ ! -f "${ROOT_DIR}/.env" && -f "${ROOT_DIR}/.env.offline" ]]; then
  cp "${ROOT_DIR}/.env.offline" "${ROOT_DIR}/.env"
fi

docker compose -f "${ROOT_DIR}/docker-compose.offline.yml" up -d
docker compose -f "${ROOT_DIR}/docker-compose.offline.yml" ps
'@
Set-Content -Path (Join-Path $outputDir 'import-offline.sh') -Value $importSh -Encoding UTF8

$importPs1 = @'
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
'@
Set-Content -Path (Join-Path $outputDir 'import-offline.ps1') -Value $importPs1 -Encoding UTF8

$readme = @"
# Sakurairo Offline Bundle

## Contents

- `docker-compose.offline.yml`: offline runtime compose file
- `images/$imageArchive`: exported Docker images
- `.env.offline`: copied local environment file used for packaging
- `docker/`, `server/`: runtime bind-mounted directories and SQL data

## Import on offline host

### Linux / macOS

`./import-offline.sh`

### Windows PowerShell

`.\import-offline.ps1`

## Notes

- The bundle copies your local `.env`; review secrets before distribution.
- If you need fresh article data, replace `server/db` or `docker/mysql/backup` before importing.
"@
Set-Content -Path (Join-Path $outputDir 'README-OFFLINE.md') -Value $readme -Encoding UTF8

Write-Log "Saving Docker images to $(Join-Path $outputDir "images/$imageArchive")"
docker save -o (Join-Path $outputDir "images/$imageArchive") $images

Write-Log "Offline bundle created at: $outputDir"
