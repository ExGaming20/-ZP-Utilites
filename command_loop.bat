@echo off
title ZP Command Console
setlocal enabledelayedexpansion

set "ROOT_DIR=%~dp0"
set "COMMANDS_DIR=%ROOT_DIR%Commands"

echo ===============================================
echo   ZP ID Generator - Command Console
echo   Commands folder: %COMMANDS_DIR%
echo   Type a command (e.g., "help") to run it.
echo   Type "exit" or "quit" to stop the server and close.
echo ===============================================
echo.

:commandLoop
set /p "userCmd=Command> "

if /i "!userCmd!"=="exit" goto stopServer
if /i "!userCmd!"=="quit" goto stopServer

set "userCmd=!userCmd:"=!"

set "found="
for %%x in (.bat .cmd .exe) do (
    if exist "%COMMANDS_DIR%\!userCmd!%%x" (
        set "found=%COMMANDS_DIR%\!userCmd!%%x"
        goto runCommand
    )
)

if not defined found (
    echo [ERROR] No command named "!userCmd!" found in "%COMMANDS_DIR%"
    echo         (tried !userCmd!.bat, !userCmd!.cmd, !userCmd!.exe)
    goto commandLoop
)

:runCommand
echo.
echo Running: !found!
call "!found!"
echo.
echo Command finished.
goto commandLoop

:stopServer
echo.
echo Stopping server...
taskkill /FI "WINDOWTITLE eq ZP_Node_Server*" /T >nul 2>nul
echo Done. Exiting.
exit /b 0