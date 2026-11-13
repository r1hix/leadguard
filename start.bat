@echo off
REM LeadGuard Launcher for Windows (Command Prompt / PowerShell)
title LeadGuard CRM - SE 4525 (Musa, Emaan, Aqsa H.)
cd /d "%~dp0"

echo ================================================================
echo  Starting LeadGuard CRM (SE 4525) - Musa, Emaan, Aqsa H.
echo ================================================================

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js 20 or newer from https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo [INFO] Installing required dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
)

node scripts/launch.mjs %*
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Press any key to close this window.
    pause >nul
)

