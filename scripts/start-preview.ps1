$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previewUrl = 'http://127.0.0.1:3000'
$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    Write-Output "Port 3000 is already in use. Open $previewUrl or stop the existing server first."
    exit 0
}

$nodeExecutable = (Get-Command node -ErrorAction Stop).Source
$nextExecutable = Join-Path $projectRoot 'node_modules/next/dist/bin/next'
if (-not (Test-Path -LiteralPath $nextExecutable)) {
    throw 'Dependencies are missing. Run pnpm install in the project folder first.'
}
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot '.next/BUILD_ID'))) {
    Push-Location $projectRoot
    try {
        & $nodeExecutable $nextExecutable build
        if ($LASTEXITCODE -ne 0) { throw 'Production build failed.' }
    } finally { Pop-Location }
}

$logDirectory = Join-Path $projectRoot '.preview'
New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
$server = Start-Process -FilePath $nodeExecutable -ArgumentList @('"' + $nextExecutable + '"', 'start', '--hostname', '127.0.0.1', '--port', '3000') -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'server.log') -RedirectStandardError (Join-Path $logDirectory 'server-error.log') -PassThru
$server.Id | Set-Content (Join-Path $logDirectory 'server.pid')
for ($attempt = 0; $attempt -lt 20; $attempt++) {
    $server.Refresh()
    if ($server.HasExited) { throw "Preview server exited. See $logDirectory/server-error.log" }
    try {
        $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Output "Preview ready: $previewUrl (PID $($server.Id)). Runs independently of the current terminal."
            exit 0
        }
    } catch { Start-Sleep -Milliseconds 500 }
}
throw "Preview did not become ready. See $logDirectory/server-error.log"
