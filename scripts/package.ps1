$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content (Join-Path $projectRoot 'manifest.json') -Raw | ConvertFrom-Json
$releaseDirectory = Join-Path $projectRoot 'releases'
$stagingDirectory = Join-Path $releaseDirectory $manifest.name
$archivePath = Join-Path $releaseDirectory ("{0}-v{1}.zip" -f $manifest.name, $manifest.version)

Remove-Item $stagingDirectory -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $archivePath -Force -ErrorAction SilentlyContinue
New-Item $stagingDirectory -ItemType Directory -Force | Out-Null

$packageItems = @(
    'manifest.json',
    'background.js',
    'content.js',
    'popup.html',
    'popup.js',
    'styles.css',
    'icons'
)

foreach ($item in $packageItems) {
    Copy-Item (Join-Path $projectRoot $item) (Join-Path $stagingDirectory $item) -Recurse -Force
}

New-Item $releaseDirectory -ItemType Directory -Force | Out-Null
Compress-Archive -Path (Join-Path $stagingDirectory '*') -DestinationPath $archivePath
Remove-Item $stagingDirectory -Recurse -Force

Write-Output "Created $archivePath"