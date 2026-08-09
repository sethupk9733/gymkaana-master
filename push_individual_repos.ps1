Write-Host "Starting push to individual repositories (no database changes)..." -ForegroundColor Cyan

# Bypass AskPass credential helper to use native GCM
$env:GIT_ASKPASS = $null
$env:VSCODE_GIT_ASKPASS_NODE = $null
$env:VSCODE_GIT_ASKPASS_MAIN = $null
$env:VSCODE_GIT_ASKPASS_EXTRA_ARGS = $null

# 1. Push backend-api updates
$backendPath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\backend-api"
if (Test-Path $backendPath) {
    Write-Host "--- Pushing Backend API Repo ---" -ForegroundColor Yellow
    Push-Location $backendPath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    git push origin main
    Pop-Location
}

# 2. Commit and push marketplace-web-app updates
$marketplacePath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\marketplace-web-app"
if (Test-Path $marketplacePath) {
    Write-Host "--- Committing and Pushing Marketplace Web App Repo ---" -ForegroundColor Yellow
    Push-Location $marketplacePath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    
    git add src/app/App.tsx src/app/components/ChallengeDashboardScreen.tsx src/app/components/HomeScreen.tsx src/app/lib/api.ts src/app/components/DailyPassportScreen.tsx
    
    $status = git status --porcelain
    if ($status) {
        git commit -m 'feat: Add daily passport calorie tracker UI, intensity slider, and monthly progress calendar heatmap with daily detail view'
        git push origin main
        Write-Host "Marketplace Web App updates pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "No changes to commit in Marketplace Web App." -ForegroundColor Gray
    }
    Pop-Location
}

Write-Host "Individual repository updates completed." -ForegroundColor Cyan
