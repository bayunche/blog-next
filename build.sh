#!/usr/bin/env bash
# =============================================================================
# Sakurairo Blog — Docker 构建 & 部署脚本
# =============================================================================
# 用法: ./build.sh [选项]
#
#   -e, --env <dev|prod>      指定环境 (默认: prod)
#   -c, --clean               强制不使用缓存重新构建
#   -s, --save [目录]         构建后将镜像导出为 .tar.gz (默认输出到 ./dist/)
#   -p, --push <registry>     构建后推送镜像到指定 registry，例:
#                               --push registry.example.com/sakurairo
#   -t, --tag <标签>          镜像标签 (默认: 日期时间，如 20260302-1530)
#       --no-start            只构建镜像，不启动 compose 服务
#   -d, --down                停止并移除当前运行的容器后退出
#   -l, --logs                启动后跟踪所有服务日志
#   -h, --help                显示此帮助
#
# 示例:
#   ./build.sh                        # 生产环境构建并启动
#   ./build.sh -e dev                 # 开发环境构建并启动
#   ./build.sh --clean --save         # 无缓存重构并导出镜像压缩包
#   ./build.sh --push ghcr.io/myname  # 构建后推送到 ghcr.io
#   ./build.sh --no-start --save      # 只打包，不启动
#   ./build.sh -d                     # 停止所有服务
# =============================================================================

set -euo pipefail

# ── 颜色 ─────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── 工具函数 ──────────────────────────────────────────────────────────────────
log_info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
log_ok()      { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_step()    { echo -e "\n${BOLD}${CYAN}▶ $*${NC}"; }
log_section() {
    echo
    echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $*${NC}"
    echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
}

die() { log_error "$*"; exit 1; }

# ── 默认参数 ──────────────────────────────────────────────────────────────────
ENV="prod"
CLEAN=false
SAVE=false
SAVE_DIR="./dist"
PUSH=false
PUSH_REGISTRY=""
NO_START=false
DOWN=false
FOLLOW_LOGS=false
TAG=$(date +"%Y%m%d-%H%M")

# ── 参数解析 ──────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
    case "$1" in
        -e|--env)
            ENV="${2:-}"; shift 2
            [[ "$ENV" == "dev" || "$ENV" == "prod" ]] \
                || die "--env 必须为 dev 或 prod，当前: $ENV"
            ;;
        -c|--clean)   CLEAN=true;  shift ;;
        -s|--save)
            SAVE=true
            if [[ -n "${2:-}" && "${2:0:1}" != "-" ]]; then
                SAVE_DIR="$2"; shift
            fi
            shift
            ;;
        -p|--push)
            PUSH=true; PUSH_REGISTRY="${2:-}"
            [[ -n "$PUSH_REGISTRY" ]] || die "--push 需要指定 registry 地址"
            shift 2
            ;;
        -t|--tag)     TAG="${2:-}"; shift 2 ;;
        --no-start)   NO_START=true; shift ;;
        -d|--down)    DOWN=true;     shift ;;
        -l|--logs)    FOLLOW_LOGS=true; shift ;;
        -h|--help)
            # 输出两个 "# ====" 分隔线之间的帮助注释块
            awk '/用法/{found=1} found && /^# =/{exit} found{sub(/^# ?/,""); print}' "$0"
            exit 0
            ;;
        *) die "未知参数: $1。使用 --help 查看帮助。" ;;
    esac
done

# ── 项目根目录（脚本所在位置）────────────────────────────────────────────────
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# ── 镜像名 ────────────────────────────────────────────────────────────────────
WEB_IMAGE="sakurairo-web"
SERVER_IMAGE="sakurairo-server"
MUSIC_IMAGE="sakurairo-music-api"

# ═══════════════════════════════════════════════════════════════════════════════
log_section "Sakurairo Blog Docker 构建脚本  [环境: ${ENV}  标签: ${TAG}]"

# ── 1. 检查依赖 ───────────────────────────────────────────────────────────────
log_step "检查运行环境"

command -v docker &>/dev/null || die "未找到 docker，请先安装 Docker Engine。"

if docker compose version &>/dev/null 2>&1; then
    DC="docker compose"
elif command -v docker-compose &>/dev/null; then
    DC="docker-compose"
else
    die "未找到 docker compose / docker-compose，请升级 Docker 或单独安装 docker-compose。"
fi
log_ok "Docker: $(docker --version | awk '{print $3}' | tr -d ',')"
log_ok "Compose: $($DC version --short 2>/dev/null || $DC version | head -1)"

# ── 2. 停止服务（--down）────────────────────────────────────────────────────
if $DOWN; then
    log_step "停止并移除当前容器"
    if [[ "$ENV" == "prod" ]]; then
        $DC --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml down
    else
        $DC -f docker-compose.dev.yml down
    fi
    log_ok "服务已停止。"
    exit 0
fi

# ── 3. 环境变量文件检查 ───────────────────────────────────────────────────────
log_step "检查环境变量文件"

if [[ "$ENV" == "prod" ]]; then
    ENV_FILE=".env.prod"
    if [[ ! -f "$ENV_FILE" ]]; then
        if [[ -f ".env.prod.template" ]]; then
            cp .env.prod.template "$ENV_FILE"
            log_warn "已从模板生成 $ENV_FILE，请先填写真实生产凭据后重新运行！"
            log_info "编辑命令: nano $ENV_FILE"
            exit 1
        else
            die "未找到 $ENV_FILE 或 .env.prod.template，请手动创建。"
        fi
    fi
    log_ok "使用环境文件: $ENV_FILE"
else
    ENV_FILE=".env"
    if [[ ! -f "$ENV_FILE" ]]; then
        if [[ -f ".env.docker" ]]; then
            cp .env.docker "$ENV_FILE"
            log_warn "已从 .env.docker 创建 $ENV_FILE，请检查其中的配置。"
        else
            log_warn "未找到 $ENV_FILE，将使用 docker-compose 默认值继续。"
        fi
    fi
fi

# ── 4. 构建 Docker 镜像 ───────────────────────────────────────────────────────
log_step "构建 Docker 镜像"

# 组装 compose 文件参数
if [[ "$ENV" == "prod" ]]; then
    COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
    COMPOSE_ENV="--env-file $ENV_FILE"
else
    COMPOSE_FILES="-f docker-compose.dev.yml"
    COMPOSE_ENV=""
fi

BUILD_OPTS="--build"
$CLEAN && BUILD_OPTS="$BUILD_OPTS --no-cache"

BUILD_CMD="$DC $COMPOSE_ENV $COMPOSE_FILES build $($CLEAN && echo '--no-cache' || true)"

log_info "执行: $BUILD_CMD"
echo

BUILD_START=$(date +%s)
if $CLEAN; then
    $DC $COMPOSE_ENV $COMPOSE_FILES build --no-cache
else
    $DC $COMPOSE_ENV $COMPOSE_FILES build
fi
BUILD_END=$(date +%s)
BUILD_ELAPSED=$((BUILD_END - BUILD_START))
log_ok "镜像构建完成，耗时 ${BUILD_ELAPSED}s"

# ── 5. 打标签 ────────────────────────────────────────────────────────────────
log_step "为镜像打版本标签 (:${TAG})"

for img in "$WEB_IMAGE" "$SERVER_IMAGE" "$MUSIC_IMAGE"; do
    if docker image inspect "$img" &>/dev/null; then
        docker tag "$img" "${img}:${TAG}"
        docker tag "$img" "${img}:latest"
        log_ok "  ${img}:${TAG}  ${img}:latest"
    else
        log_warn "  镜像 $img 不存在，跳过（可能该服务使用公共镜像）"
    fi
done

# ── 6. 导出镜像（--save）─────────────────────────────────────────────────────
if $SAVE; then
    log_step "导出镜像到 ${SAVE_DIR}/"
    mkdir -p "$SAVE_DIR"

    IMAGES_TO_SAVE=()
    for img in "$WEB_IMAGE" "$SERVER_IMAGE" "$MUSIC_IMAGE"; do
        if docker image inspect "$img" &>/dev/null; then
            IMAGES_TO_SAVE+=("$img:${TAG}")
        fi
    done

    if [[ ${#IMAGES_TO_SAVE[@]} -eq 0 ]]; then
        log_warn "没有可导出的自定义镜像，跳过。"
    else
        ARCHIVE="${SAVE_DIR}/sakurairo-${TAG}.tar.gz"
        log_info "正在导出: ${IMAGES_TO_SAVE[*]}"
        log_info "输出文件: $ARCHIVE"

        docker save "${IMAGES_TO_SAVE[@]}" | gzip -9 > "$ARCHIVE"

        SIZE=$(du -sh "$ARCHIVE" | cut -f1)
        log_ok "导出完成：$ARCHIVE（$SIZE）"
        log_info "恢复命令: docker load < $ARCHIVE"
    fi
fi

# ── 7. 推送到 Registry（--push）─────────────────────────────────────────────
if $PUSH; then
    log_step "推送镜像到 ${PUSH_REGISTRY}"

    # 检查 docker 登录状态
    if ! docker info 2>/dev/null | grep -q "Username"; then
        log_warn "可能未登录 registry，尝试继续推送..."
    fi

    for img in "$WEB_IMAGE" "$SERVER_IMAGE" "$MUSIC_IMAGE"; do
        if ! docker image inspect "$img" &>/dev/null; then
            continue
        fi
        REMOTE="${PUSH_REGISTRY}/${img}"
        docker tag "${img}:${TAG}" "${REMOTE}:${TAG}"
        docker tag "${img}:${TAG}" "${REMOTE}:latest"
        log_info "推送 ${REMOTE}:${TAG} ..."
        docker push "${REMOTE}:${TAG}"
        log_info "推送 ${REMOTE}:latest ..."
        docker push "${REMOTE}:latest"
        log_ok "  已推送: $REMOTE"
    done
fi

# ── 8. 启动服务 ───────────────────────────────────────────────────────────────
if ! $NO_START; then
    log_step "启动所有服务"

    $DC $COMPOSE_ENV $COMPOSE_FILES up -d --force-recreate

    # 等待关键服务就绪
    log_info "等待服务启动..."
    sleep 4

    echo
    log_info "当前容器状态:"
    $DC $COMPOSE_ENV $COMPOSE_FILES ps
fi

# ── 9. 摘要 ──────────────────────────────────────────────────────────────────
log_section "构建完成"

echo -e "  ${BOLD}环境:${NC}      $ENV"
echo -e "  ${BOLD}镜像标签:${NC}  $TAG"
echo -e "  ${BOLD}构建耗时:${NC}  ${BUILD_ELAPSED}s"
$SAVE    && echo -e "  ${BOLD}导出文件:${NC}  ${SAVE_DIR}/sakurairo-${TAG}.tar.gz"
$PUSH    && echo -e "  ${BOLD}Registry:${NC}  $PUSH_REGISTRY"
$NO_START || echo -e "  ${BOLD}服务地址:${NC}"
if ! $NO_START; then
    echo -e "    前端 (Next.js): ${CYAN}http://localhost:3002${NC}"
    echo -e "    后端 (API)    : ${CYAN}http://localhost:6062${NC}"
    echo -e "    音乐 API      : ${CYAN}http://localhost:3003${NC}"
    echo -e "    Nginx         : ${CYAN}http://localhost:80${NC}"
fi
echo
echo -e "  ${BOLD}常用命令:${NC}"
echo -e "    查看日志:  $DC $COMPOSE_ENV $COMPOSE_FILES logs -f"
echo -e "    停止服务:  $DC $COMPOSE_ENV $COMPOSE_FILES down"
echo -e "    停止清理:  $DC $COMPOSE_ENV $COMPOSE_FILES down -v"
echo

# ── 10. 跟踪日志（--logs）────────────────────────────────────────────────────
if $FOLLOW_LOGS && ! $NO_START; then
    log_step "跟踪服务日志 (Ctrl+C 退出)..."
    $DC $COMPOSE_ENV $COMPOSE_FILES logs -f
fi
