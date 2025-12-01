@echo off
chcp 65001 >nul
echo 🚀 启动智能错误检测系统...
echo.

cd /d "%~dp0"

node intelligent-error-detector.js

pause
