@echo off
chcp 65001 >nul
echo ========================================
echo   同心济世博士联盟 - 详细代码功能测试系统
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js已安装

echo 🚀 启动详细代码功能测试系统...
node detailed-function-test.js

pause