Write-Host "Staging and committing all changes in main root repository..." -ForegroundColor Cyan

# Configure Git local user just in case
git config user.name "sethupk9733"
git config user.email "sethu9733@gmail.com"

# Stage all modified and untracked files
git add backend-api/controllers/gamificationController.js
git add backend-api/models/Challenge.js
git add backend-api/models/User.js
git add backend-api/routes/gamificationRoutes.js
git add backend-api/seed.js
git add backend-api/seedPartnerGyms.js
git add backend-api/server.js
git add backend-api/controllers/workoutController.js
git add backend-api/models/WorkoutLog.js
git add backend-api/routes/workoutRoutes.js
git add backend-api/check_local_db.js
git add backend-api/create_gym_owners.js
git add backend-api/find_by_ids.js
git add backend-api/list_gyms_and_owners.js
git add backend-api/list_local_gyms.js
git add backend-api/migrate_local_to_atlas.js
git add backend-api/reset_passwords.js
git add backend-api/seedDummyWorkouts.js
git add backend-api/show_admins.js

git add marketplace-web-app/src/app/App.tsx
git add marketplace-web-app/src/app/components/ChallengeDashboardScreen.tsx
git add marketplace-web-app/src/app/components/HomeScreen.tsx
git add marketplace-web-app/src/app/lib/api.ts
git add marketplace-web-app/src/app/components/DailyPassportScreen.tsx

# Check what is staged
$status = git status --porcelain
if ($status -match '^[AMD]') {
    Write-Host "Staged files found. Committing..." -ForegroundColor Green
    git commit -m "feat: Implement daily passport, workout log with intensity calories calculator, and monthly interactive calendar stats"
    Write-Host "Pushing to origin main..." -ForegroundColor Green
    git push origin main
} else {
    Write-Host "No modifications staged for commit." -ForegroundColor Yellow
}
