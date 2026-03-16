#!/usr/bin/env bash
# =============================================================================
# Sakurairo Blog Docker unified build script
# =============================================================================
# Usage:
#   ./build.sh                 Interactive mode when no flags are provided
#   ./build.sh [options]       Direct non-interactive execution
#
# Options:
#   -e, --env <dev|prod>      Select target environment
#   -c, --clean               Build without Docker cache
#   -s, --save [dir]          Export built images, default output is ./dist
#   -p, --push <registry>     Push tagged images to the target registry
#   -t, --tag <tag>           Override the generated image tag
#       --no-start            Build and export only, do not start services
#   -d, --down                Stop the selected environment stack
#   -l, --logs                Follow service logs after startup
#   -h, --help                Show help
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log_info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_step()  { echo -e "\n${BOLD}${CYAN}==>${NC} $*"; }

die() {
    log_error "$*"
    exit 1
}

show_help() {
    cat <<'EOF'
=============================================================================
Sakurairo Blog Docker unified build script
=============================================================================
Usage:
  ./build.sh                 Interactive mode when no flags are provided
  ./build.sh [options]       Direct non-interactive execution

Options:
  -e, --env <dev|prod>      Select target environment
  -c, --clean               Build without Docker cache
  -s, --save [dir]          Export built images, default output is ./dist
  -p, --push <registry>     Push tagged images to the target registry
  -t, --tag <tag>           Override the generated image tag
      --no-start            Build and export only, do not start services
  -d, --down                Stop the selected environment stack
  -l, --logs                Follow service logs after startup
  -h, --help                Show help

Examples:
  ./build.sh
  ./build.sh -e prod
  ./build.sh -e dev --no-start
  ./build.sh -e prod --save
  ./build.sh -e prod --no-start --save ./dist/prod-images
  ./build.sh -e prod --down
=============================================================================
EOF
}

prompt_yes_no() {
    local prompt="$1"
    local default="$2"
    local answer=""

    while true; do
        if [[ "$default" == "y" ]]; then
            read -r -p "$prompt [Y/n]: " answer
            answer="${answer:-y}"
        else
            read -r -p "$prompt [y/N]: " answer
            answer="${answer:-n}"
        fi

        case "${answer,,}" in
            y|yes)
                return 0
                ;;
            n|no)
                return 1
                ;;
            *)
                log_warn "Please answer y or n."
                ;;
        esac
    done
}

interactive_setup() {
    local env_choice=""
    local action_choice=""
    local export_dir=""

    log_step "No flags detected. Entering interactive mode"

    while true; do
        echo "Select environment:"
        echo "  1) prod"
        echo "  2) dev"
        echo "  q) quit"
        read -r -p "Choice [1]: " env_choice
        env_choice="${env_choice:-1}"

        case "${env_choice,,}" in
            1)
                ENVIRONMENT="prod"
                break
                ;;
            2)
                ENVIRONMENT="dev"
                break
                ;;
            q)
                exit 0
                ;;
            *)
                log_warn "Invalid choice. Select 1, 2, or q."
                ;;
        esac
    done

    echo
    while true; do
        echo "Select action:"
        echo "  1) Build and start services"
        echo "  2) Build only"
        echo "  3) Stop services"
        echo "  q) quit"
        read -r -p "Choice [1]: " action_choice
        action_choice="${action_choice:-1}"

        case "${action_choice,,}" in
            1)
                DOWN=false
                NO_START=false
                break
                ;;
            2)
                DOWN=false
                NO_START=true
                break
                ;;
            3)
                DOWN=true
                NO_START=true
                SAVE=false
                FOLLOW_LOGS=false
                CLEAN=false
                break
                ;;
            q)
                exit 0
                ;;
            *)
                log_warn "Invalid choice. Select 1, 2, 3, or q."
                ;;
        esac
    done

    if ! $DOWN; then
        if prompt_yes_no "Use clean build?" "n"; then
            CLEAN=true
        fi

        if prompt_yes_no "Export images after build?" "n"; then
            SAVE=true
            read -r -p "Export directory [./dist]: " export_dir
            SAVE_DIR="${export_dir:-./dist}"
        fi

        if ! $NO_START; then
            if prompt_yes_no "Follow logs after startup?" "n"; then
                FOLLOW_LOGS=true
            fi
        fi
    fi

    echo
    log_info "Interactive selection complete"
    log_info "Environment: $ENVIRONMENT"
    if $DOWN; then
        log_info "Action: stop services"
    elif $NO_START; then
        log_info "Action: build only"
    else
        log_info "Action: build and start services"
    fi
    log_info "Clean build: $CLEAN"
    log_info "Export images: $SAVE"
    if $SAVE; then
        log_info "Export dir: $SAVE_DIR"
    fi
}

resolve_prod_env_file() {
    if [[ -f ".env.prod" ]]; then
        echo ".env.prod"
        return
    fi

    if [[ -f ".env.prod.template" ]]; then
        cp ".env.prod.template" ".env.prod"
        log_warn "Created .env.prod from .env.prod.template. Fill in real values and rerun."
        log_info "Edit with: nano .env.prod"
        exit 1
    fi

    die ".env.prod or .env.prod.template is required for prod"
}

resolve_dev_env_file() {
    if [[ -f ".env" ]]; then
        echo ".env"
        return
    fi

    if [[ -f ".env.docker" ]]; then
        cp ".env.docker" ".env"
        log_warn "Created .env from .env.docker. Review the copied defaults before continuing."
        echo ".env"
        return
    fi

    log_warn "No .env or .env.docker found. Compose defaults will be used."
    echo ""
}

configure_runtime_contract() {
    COMPOSE_ARGS=()
    IMAGES=()

    if [[ "$ENVIRONMENT" == "prod" ]]; then
        local prod_env_file="${1:-}"
        if [[ -n "$prod_env_file" ]]; then
            COMPOSE_ARGS+=(--env-file "$prod_env_file")
        fi
        COMPOSE_ARGS+=(-f docker-compose.yml -f docker-compose.prod.yml)
        IMAGES=(
            "blog-sakurairo-server"
            "blog-sakurairo-web"
            "blog-sakurairo-music-api"
            "blog-sakurairo-db-backup"
        )
    else
        COMPOSE_ARGS+=(-f docker-compose.dev.yml)
        IMAGES=(
            "blog-sakurairo-server-dev"
            "blog-sakurairo-web-dev"
            "blog-sakurairo-music-api-dev"
        )
    fi
}

compose() {
    "${DOCKER_COMPOSE[@]}" "${COMPOSE_ARGS[@]}" "$@"
}

ORIGINAL_ARG_COUNT=$#

ENVIRONMENT="prod"
CLEAN=false
SAVE=false
SAVE_DIR="./dist"
PUSH=false
PUSH_REGISTRY=""
NO_START=false
DOWN=false
FOLLOW_LOGS=false
TAG="$(date +"%Y%m%d-%H%M")"

if [[ "$ORIGINAL_ARG_COUNT" -eq 0 ]]; then
    interactive_setup
else
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -e|--env)
                ENVIRONMENT="${2:-}"
                [[ "$ENVIRONMENT" == "dev" || "$ENVIRONMENT" == "prod" ]] || die "--env only accepts dev or prod, got: $ENVIRONMENT"
                shift 2
                ;;
            -c|--clean)
                CLEAN=true
                shift
                ;;
            -s|--save)
                SAVE=true
                if [[ -n "${2:-}" && "${2:0:1}" != "-" ]]; then
                    SAVE_DIR="$2"
                    shift
                fi
                shift
                ;;
            -p|--push)
                PUSH=true
                PUSH_REGISTRY="${2:-}"
                [[ -n "$PUSH_REGISTRY" ]] || die "--push requires a registry"
                shift 2
                ;;
            -t|--tag)
                TAG="${2:-}"
                [[ -n "$TAG" ]] || die "--tag cannot be empty"
                shift 2
                ;;
            --no-start)
                NO_START=true
                shift
                ;;
            -d|--down)
                DOWN=true
                shift
                ;;
            -l|--logs)
                FOLLOW_LOGS=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                die "Unknown argument: $1"
                ;;
        esac
    done
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

if ! command -v docker >/dev/null 2>&1; then
    die "docker is required"
fi

if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE=(docker-compose)
else
    die "docker compose or docker-compose is required"
fi

log_step "Checking runtime prerequisites"
log_ok "Docker: $(docker --version | awk '{print $3}' | tr -d ',')"
log_ok "Compose: $("${DOCKER_COMPOSE[@]}" version --short 2>/dev/null || "${DOCKER_COMPOSE[@]}" version | head -1)"

if $DOWN; then
    local_prod_env=""
    if [[ "$ENVIRONMENT" == "prod" && -f ".env.prod" ]]; then
        local_prod_env=".env.prod"
    fi
    configure_runtime_contract "$local_prod_env"
    log_step "Stopping ${ENVIRONMENT} stack"
    compose down
    log_ok "Services stopped"
    exit 0
fi

ENV_FILE=""
if [[ "$ENVIRONMENT" == "prod" ]]; then
    log_step "Resolving production env file"
    ENV_FILE="$(resolve_prod_env_file)"
else
    log_step "Resolving development env file"
    ENV_FILE="$(resolve_dev_env_file)"
fi

if [[ -n "$ENV_FILE" ]]; then
    log_ok "Using env file: $ENV_FILE"
fi

configure_runtime_contract "$ENV_FILE"

BUILD_SUFFIX=""
if $CLEAN; then
    BUILD_SUFFIX=" --no-cache"
fi
log_step "Building Docker images"
log_info "Running: ${DOCKER_COMPOSE[*]} ${COMPOSE_ARGS[*]} build${BUILD_SUFFIX}"

BUILD_START="$(date +%s)"
if $CLEAN; then
    compose build --no-cache
else
    compose build
fi
BUILD_END="$(date +%s)"
BUILD_ELAPSED="$((BUILD_END - BUILD_START))"
log_ok "Build finished in ${BUILD_ELAPSED}s"

log_step "Tagging local images"
for image_name in "${IMAGES[@]}"; do
    if docker image inspect "$image_name" >/dev/null 2>&1; then
        docker tag "$image_name" "${image_name}:${TAG}"
        docker tag "$image_name" "${image_name}:latest"
        log_ok "${image_name}:${TAG} and ${image_name}:latest"
    else
        log_warn "Skipping missing image: ${image_name}"
    fi
done

ARCHIVE_PATH=""
if $SAVE; then
    command -v gzip >/dev/null 2>&1 || die "gzip is required to export images"

    mkdir -p "$SAVE_DIR"
    IMAGES_TO_SAVE=()
    for image_name in "${IMAGES[@]}"; do
        if docker image inspect "$image_name" >/dev/null 2>&1; then
            IMAGES_TO_SAVE+=("${image_name}:${TAG}")
        fi
    done

    log_step "Exporting tagged images"
    if [[ ${#IMAGES_TO_SAVE[@]} -eq 0 ]]; then
        log_warn "No images available for export"
    else
        ARCHIVE_PATH="${SAVE_DIR}/blog-sakurairo-${ENVIRONMENT}-${TAG}.tar.gz"
        log_info "Saving: ${IMAGES_TO_SAVE[*]}"
        docker save "${IMAGES_TO_SAVE[@]}" | gzip -9 > "$ARCHIVE_PATH"
        log_ok "Archive created at $ARCHIVE_PATH"
    fi
fi

if $PUSH; then
    log_step "Pushing tagged images to ${PUSH_REGISTRY}"
    if ! docker info 2>/dev/null | grep -q "Username"; then
        log_warn "No logged-in registry user detected. Push may fail."
    fi

    for image_name in "${IMAGES[@]}"; do
        if ! docker image inspect "$image_name" >/dev/null 2>&1; then
            log_warn "Skipping push for missing image: ${image_name}"
            continue
        fi

        remote_image="${PUSH_REGISTRY}/${image_name}"
        docker tag "${image_name}:${TAG}" "${remote_image}:${TAG}"
        docker tag "${image_name}:${TAG}" "${remote_image}:latest"
        docker push "${remote_image}:${TAG}"
        docker push "${remote_image}:latest"
        log_ok "Pushed ${remote_image}"
    done
fi

if ! $NO_START; then
    log_step "Starting services"
    compose up -d --force-recreate
    sleep 4
    compose ps
fi

echo
echo -e "${BOLD}Build Summary${NC}"
echo -e "  Environment: ${ENVIRONMENT}"
echo -e "  Tag:         ${TAG}"
echo -e "  Duration:    ${BUILD_ELAPSED}s"
if [[ -n "$ARCHIVE_PATH" ]]; then
    echo -e "  Archive:     ${ARCHIVE_PATH}"
fi
if $PUSH; then
    echo -e "  Registry:    ${PUSH_REGISTRY}"
fi
if ! $NO_START; then
    echo -e "  Endpoint:    http://localhost"
fi

echo
echo -e "${BOLD}Useful Commands${NC}"
echo -e "  Logs:        ${DOCKER_COMPOSE[*]} ${COMPOSE_ARGS[*]} logs -f"
echo -e "  Stop:        ${DOCKER_COMPOSE[*]} ${COMPOSE_ARGS[*]} down"

if $FOLLOW_LOGS && ! $NO_START; then
    log_step "Following service logs"
    compose logs -f
fi
