@echo off
REM Blog Next Docker 快速启动脚本 (Windows)

echo =========================================
echo   Blog Next Docker 部署脚本
echo =========================================

REM 检查 Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 错误: Docker 未安装
    pause
    exit /b 1
)

REM 检查 .env 文件
if not exist .env (
    echo 警告: .env 文件不存在，从 .env.example 复制...
    copy .env.example .env
    echo.
    echo 请编辑 .env 文件配置必要的环境变量:
    echo   - MYSQL_ROOT_PASSWORD
    echo   - MYSQL_PASSWORD
    echo   - TOKEN_SECRET
    echo   - GITHUB_CLIENT_ID
    echo   - GITHUB_CLIENT_SECRET
    echo   - ADMIN_GITHUB_LOGIN_NAME
    echo.
    pause
)

REM 停止已运行的容器
echo.
echo 停止已运行的容器...
docker-compose down 2>nul

REM 构建镜像
echo.
echo 构建 Docker 镜像...
docker-compose build --no-cache

REM 启动服务
echo.
echo 启动服务...
docker-compose up -d

REM 等待服务启动
echo.
echo 等待服务启动...
timeout /t 5 /nobreak >nul

REM 检查服务状态
echo.
echo 检查服务状态...
docker-compose ps

REM 显示信息
echo.
echo =========================================
echo   部署完成！
echo =========================================
echo.
echo 服务访问地址:
echo   - 前端应用: http://localhost
echo   - API 接口: http://localhost/api
echo   - MySQL: localhost:3306
echo.
echo 查看日志:
echo   docker-compose logs -f
echo.
echo 停止服务:
echo   docker-compose down
echo.

REM 询问是否查看日志
set /p REPLY="是否查看实时日志? (y/n) "
if /i "%REPLY%"=="y" (
    docker-compose logs -f
)

pause
