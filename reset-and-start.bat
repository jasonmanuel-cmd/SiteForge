@echo off
echo Clearing all Next.js caches...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo Cache cleared!
echo.
echo Starting dev server...
npm run dev
