
# 检查 Docker 是否运行
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 找不到 Docker。请先安装 Docker Desktop。" -ForegroundColor Red
    exit
}

# 检查 .env 文件
if (-not (Test-Path ".env")) {
    Write-Host "提示: 未找到 .env 文件，正在从 .env.docker 创建..." -ForegroundColor Yellow
    Copy-Item ".env.docker" ".env"
    Write-Host "请记得修改 .env 中的默认密码和密钥！" -ForegroundColor Cyan
}

function Show-Menu {
    Clear-Host
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "    Sakurairo Blog Docker 管理脚本" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "1. 🚀 构建并启动 (Build & Run)"
    Write-Host "2. 🛑 停止服务 (Stop)"
    Write-Host "3. 🔄 重启服务 (Restart)"
    Write-Host "4. 📋 查看日志 (Logs)"
    Write-Host "5. 🧹 清理并重构 (Clean Build)"
    Write-Host "q. ❌ 退出 (Quit)"
    Write-Host "==========================================" -ForegroundColor Cyan
}

while ($true) {
    Show-Menu
    $choice = Read-Host "请选择操作 [1-5, q]"

    switch ($choice) {
        "1" {
            Write-Host "`n🚀 正在构建并启动服务..." -ForegroundColor Green
            docker-compose up -d --build
            if ($?) { Write-Host "`n✅ 服务已启动！访问 http://localhost:3000" -ForegroundColor Green }
            Pause
        }
        "2" {
            Write-Host "`n🛑 正在停止服务..." -ForegroundColor Yellow
            docker-compose down
            Pause
        }
        "3" {
            Write-Host "`n🔄 正在重启..." -ForegroundColor Cyan
            docker-compose restart
            Pause
        }
        "4" {
            Write-Host "`n📋正在打开日志 (Ctrl+C 退出)..." -ForegroundColor Magenta
            docker-compose logs -f
        }
        "5" {
            Write-Host "`n🧹 正在清理并重新构建..." -ForegroundColor Yellow
            docker-compose down
            docker-compose up -d --build --force-recreate
            Pause
        }
        "q" {
            exit
        }
        Default {
            Write-Host "无效选择，请重试。" -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
}
