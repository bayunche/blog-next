# Sakurairo Blog Docker Build Script
# This script builds the frontend locally and then builds the Docker image.

# 1. 检查依赖
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed. Please install Node.js first."
    exit 1
}

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "docker is not installed. Please install Docker first."
    exit 1
}

# 2. 构建前端
Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed."
    exit 1
}

# 3. 构建 Docker 镜像
Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t blog-sakurairo:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed."
    exit 1
}

Write-Host "`nSuccessfully built blog-sakurairo:latest" -ForegroundColor Green
Write-Host "You can run it with: docker-compose up -d"
