if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 找不到 Docker。请先安装 Docker Desktop。" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env.prod")) {
    if (Test-Path ".env.prod.template") {
        Copy-Item ".env.prod.template" ".env.prod"
        Write-Host "提示: 已生成 .env.prod，请先填写真实生产凭据后重试。" -ForegroundColor Yellow
        Write-Host "编辑命令: notepad .env.prod" -ForegroundColor Cyan
    } else {
        Write-Host "错误: 未找到 .env.prod 与 .env.prod.template。" -ForegroundColor Red
    }
    exit 1
}

Write-Host "使用 .env.prod + docker-compose.prod.yml 启动生产部署..." -ForegroundColor Cyan
docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build

if ($?) {
    Write-Host "✅ 生产部署已启动" -ForegroundColor Green
    docker compose --env-file .env.prod -f docker-compose.yml -f docker-compose.prod.yml ps
}
