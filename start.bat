@echo off
title ZP ID Generator Startup

set "ROOT=%~dp0"

echo.
echo ==========================
echo Starting ZP Utilities
echo ==========================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

if not exist "%ROOT%Server\server.js" (
    echo ERROR: Server\server.js not found.
    pause
    exit /b 1
)

start "ZP Node Server" cmd /k "cd /d "%ROOT%Server" && node server.js"

timeout /t 2 /nobreak >nul

start http://localhost:8080/

if exist "%ROOT%command_loop.bat" (
    start "" "%ROOT%command_loop.bat"
)

exit