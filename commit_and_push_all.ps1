Write-Host "Starting Git Commit and Push process..." -ForegroundColor Cyan

# 1. Backend API Repo
$backendPath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\backend-api"
if (Test-Path $backendPath) {
    Write-Host "`n--- Committing and Pushing Backend API ---" -ForegroundColor Yellow
    Push-Location $backendPath
    
    # Configure user name/email locally just in case
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"

    # Add modified files
    git add controllers/gamificationController.js models/Challenge.js models/User.js routes/gamificationRoutes.js seed.js seedPartnerGyms.js server.js
    
    # Add new feature files
    git add controllers/workoutController.js models/WorkoutLog.js routes/workoutRoutes.js
    
    # Add helpers
    git add check_local_db.js create_gym_owners.js find_by_ids.js list_gyms_and_owners.js list_local_gyms.js migrate_local_to_atlas.js reset_passwords.js seedDummyWorkouts.js show_admins.js

    # Check status again to see if anything is staged
    $status = git status --porcelain
    if ($status -match '^[AMD]') {
        git commit -m "feat: Add daily passport, calorie tracking, intensity multiplier, and monthly interactive calendar stats"
        git push
        Write-Host "✅ Backend API changes committed and pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No changes to commit in Backend API." -ForegroundColor Gray
    }
    
    Pop-Location
}

# 2. Marketplace Web App Repo
$marketplacePath = "C:\Users\sethu\OneDrive\Desktop\gymkaana owner\marketplace-web-app"
if (Test-Path $marketplacePath) {
    Write-Host "`n--- Committing and Pushing Marketplace Web App ---" -ForegroundColor Yellow
    Push-Location $marketplacePath

    # Configure user name/email locally just in case
    git config user.name "sethupk9733"
    git config user.email "sethu9733@gmail.com"

    # Add modified files
    git add src/app/App.tsx src/app/components/ChallengeDashboardScreen.tsx src/app/components/HomeScreen.tsx src/app/lib/api.ts
    
    # Add new feature files
    git add src/app/components/DailyPassportScreen.tsx

    # Check status again
    $status = git status --porcelain
    if ($status -match '^[AMD]') {
        git commit -m "feat: Add daily passport calorie tracker UI, intensity slider, and monthly progress calendar heatmap with daily detail view"
        git push
        Write-Host "✅ Marketplace Web App changes committed and pushed successfully!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No changes to commit in Marketplace Web App." -ForegroundColor Gray
    }

    Pop-Location
}

Write-Host "`nAll Git operations complete." -ForegroundColor Cyan
