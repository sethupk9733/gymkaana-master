Write-Host "Staging, committing, and pushing all updates to git (including Water Intake and Streaks)..." -ForegroundColor Cyan

# Bypass AskPass credential helper to use native GCM
$env:GIT_ASKPASS = $null
$env:VSCODE_GIT_ASKPASS_NODE = $null
$env:VSCODE_GIT_ASKPASS_MAIN = $null
$env:VSCODE_GIT_ASKPASS_EXTRA_ARGS = $null

# 1. Backend API Repo
$backendPath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\backend-api"
if (Test-Path $backendPath) {
    Write-Host "--- Committing and Pushing Backend API ---" -ForegroundColor Yellow
    Push-Location $backendPath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    
    # Add all files
    git add models/User.js models/Challenge.js models/WaterLog.js controllers/workoutController.js routes/workoutRoutes.js
    
    $status = git status --porcelain
    if ($status) {
        git commit -m 'feat: Add Water Intake tracking, daily water target configurations, and dynamic workout streak calculator'
        git push origin main
        Write-Host "Backend API updates pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "No changes to commit in Backend API." -ForegroundColor Gray
    }
    Pop-Location
}

# 2. Marketplace Web App Repo
$marketplacePath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\marketplace-web-app"
if (Test-Path $marketplacePath) {
    Write-Host "--- Committing and Pushing Marketplace Web App ---" -ForegroundColor Yellow
    Push-Location $marketplacePath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    
    # Add files
    git add src/app/lib/api.ts src/app/components/ChallengeDashboardScreen.tsx src/app/components/DailyPassportScreen.tsx
    
    $status = git status --porcelain
    if ($status) {
        git commit -m 'feat: Integrate Create Challenge modal, Water Intake card logs, and Flame Streak indicator inside Daily Passport'
        git push origin main
        Write-Host "Marketplace Web App updates pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "No changes to commit in Marketplace Web App." -ForegroundColor Gray
    }
    Pop-Location
}

# 3. Main Master Repo (Monorepo)
Write-Host "--- Committing and Pushing Main Master Repo ---" -ForegroundColor Yellow
git config user.name "sethupk9733"
git config user.email "sethu9733@gmail.com"

# Stage all files
git add backend-api/models/User.js backend-api/models/Challenge.js backend-api/models/WaterLog.js backend-api/controllers/workoutController.js backend-api/routes/workoutRoutes.js
git add marketplace-web-app/src/app/lib/api.ts marketplace-web-app/src/app/components/ChallengeDashboardScreen.tsx marketplace-web-app/src/app/components/DailyPassportScreen.tsx

$status = git status --porcelain
if ($status -match '^[AMD]') {
    git commit -m "feat: Add daily passport water intake tracking, workout streaks visual, and header custom challenge creation modal"
    git push origin main
    Write-Host "Main Master Repo updates pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit in Main Master Repo." -ForegroundColor Gray
}

Write-Host "All Git operations completed." -ForegroundColor Cyan
