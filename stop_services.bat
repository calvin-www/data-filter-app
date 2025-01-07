@echo off
echo Stopping services on development ports...

:: Kill process on port 3000 (Next.js)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Stopping process on port 3000 (PID: %%a)
    taskkill /F /PID %%a 2>nul
)

:: Kill process on port 8000 (Python backend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    echo Stopping process on port 8000 (PID: %%a)
    taskkill /F /PID %%a 2>nul
)

:: Kill process on port 8080 (Python backend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do (
    echo Stopping process on port 8080 (PID: %%a)
    taskkill /F /PID %%a 2>nul
)

:: Kill any remaining Python processes
taskkill /F /IM python.exe 2>nul
taskkill /F /IM python3.exe 2>nul

:: Kill any remaining Node processes
taskkill /F /IM node.exe 2>nul

echo Done!
timeout /t 2
