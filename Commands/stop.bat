@echo off
echo Stopping ZP Node server...
taskkill /FI "WINDOWTITLE eq ZP_Node_Server*" /T >nul 2>nul
if errorlevel 1 (
    echo Server was not running.
) else (
    echo Server stopped.
)