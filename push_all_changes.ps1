Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🚀 Pushing All Gymkaana Updates to Git..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Bypass AskPass credential helper
$env:GIT_ASKPASS = $null
$env:VSCODE_GIT_ASKPASS_NODE = $null
$env:VSCODE_GIT_ASKPASS_MAIN = $null
$env:VSCODE_GIT_ASKPASS_EXTRA_ARGS = $null

$commitMsg = "feat: Add end-to-end Blog System, dynamic landing data API and automated sitemap generator"

# 1. Backend API Repo
$backendPath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\backend-api"
if (Test-Path $backendPath) {
    Write-Host "`n--- Committing and Pushing Backend API ---" -ForegroundColor Yellow
    Push-Location $backendPath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    git add .
    $status = git status --porcelain
    if ($status) {
        git commit -m $commitMsg
        git push origin main
        Write-Host "✅ Backend API pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No changes in Backend API." -ForegroundColor Gray
    }
    Pop-Location
}

# 2. Admin Web App Repo
$adminPath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\admin-web-app"
if (Test-Path $adminPath) {
    Write-Host "`n--- Committing and Pushing Admin Web App ---" -ForegroundColor Yellow
    Push-Location $adminPath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    git add .
    $status = git status --porcelain
    if ($status) {
        git commit -m $commitMsg
        git push origin main
        Write-Host "✅ Admin Web App pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No changes in Admin Web App." -ForegroundColor Gray
    }
    Pop-Location
}

# 3. Marketplace Web App Repo
$marketplacePath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\marketplace-web-app"
if (Test-Path $marketplacePath) {
    Write-Host "`n--- Committing and Pushing Marketplace Web App ---" -ForegroundColor Yellow
    Push-Location $marketplacePath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    git add .
    $status = git status --porcelain
    if ($status) {
        git commit -m $commitMsg
        git push origin main
        Write-Host "✅ Marketplace Web App pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No changes in Marketplace Web App." -ForegroundColor Gray
    }
    Pop-Location
}

# 4. Landing Page Repo
$landingPath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\landing-page"
if (Test-Path $landingPath) {
    Write-Host "`n--- Committing and Pushing Landing Page ---" -ForegroundColor Yellow
    Push-Location $landingPath
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"
    git add .
    $status = git status --porcelain
    if ($status) {
        git commit -m $commitMsg
        git push origin main
        Write-Host "✅ Landing Page pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No changes in Landing Page." -ForegroundColor Gray
    }
    Pop-Location
}

# 5. Main Root Repo (Monorepo)
Write-Host "`n--- Committing and Pushing Main Master Repo ---" -ForegroundColor Yellow
git config user.name "sethupk9733"
git config user.email "sethu9733@gmail.com"
git add .
$status = git status --porcelain
if ($status) {
    git commit -m $commitMsg
    git push origin main
    Write-Host "✅ Main Master Repo pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No changes in Main Master Repo." -ForegroundColor Gray
}

Write-Host "`n🎉 All Git repositories successfully committed and pushed!" -ForegroundColor Cyan
