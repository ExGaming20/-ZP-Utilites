@echo off
echo Restarting ZP Node server...
call "%~dp0stop.bat"
timeout /t 2 /nobreak >nul
cd /d "%~dp0..\Server"
start "ZP_Node_Server" cmd /c "node server.js"
echo Server restarted.