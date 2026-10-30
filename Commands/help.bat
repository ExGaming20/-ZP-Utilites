@echo off
echo ===============================================
echo Available commands in this folder:
dir /b "%~dp0" | findstr /i "\.bat$" | findstr /v "help.bat"
echo.
echo Global commands (run from project root):
echo   start.bat         - Launches everything (server, browser, command console)
echo   command_loop.bat  - Command console (already running if you used start.bat)
echo.
echo Type "exit" in the command console to stop the server.
echo ===============================================