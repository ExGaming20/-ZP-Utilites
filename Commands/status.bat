@echo off
tasklist /FI "WINDOWTITLE eq ZP_Node_Server*" 2>nul | find "cmd.exe" >nul
if errorlevel 1 (
    echo [STATUS] ZP Node server is NOT running.
) else (
    echo [STATUS] ZP Node server is running.
)