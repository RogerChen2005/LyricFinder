Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Building frontend..."
Push-Location frontEnd
npm run build
Pop-Location

Write-Host "Building backend..."
Push-Location backEnd
npx tsc
Pop-Location

Write-Host "Assembling build\..."
if (Test-Path build) { Remove-Item -Recurse -Force build }
New-Item -ItemType Directory -Force build\static, build\cookies, build\temp | Out-Null

Copy-Item -Recurse backEnd\dist\* build\
Copy-Item -Recurse frontEnd\static\* build\static\
Copy-Item backEnd\package.json build\
Copy-Item backEnd\pnpm-lock.yaml build\
if (Test-Path backEnd\cookies\*) { Copy-Item backEnd\cookies\* build\cookies\ }

Write-Host "Done. Run with: cd build; pnpm install --prod; node src\index.js"
