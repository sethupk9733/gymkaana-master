$scriptRoot = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
$workspaceRoot = Resolve-Path "$scriptRoot"

Write-Host "Scanning for git repositories under:$workspaceRoot" -ForegroundColor Cyan

$gitDirs = Get-ChildItem -Path $workspaceRoot -Directory -Force -Recurse -Filter .git -ErrorAction SilentlyContinue
if (-not $gitDirs) {
    Write-Error "No git repositories found under the workspace root."
    exit 1
}

$repoRoots = $gitDirs | ForEach-Object { Split-Path -Path $_.FullName -Parent } | Sort-Object -Unique

foreach ($repoRoot in $repoRoots) {
    Write-Host "`n---" -ForegroundColor DarkCyan
    Write-Host "Repository: $repoRoot" -ForegroundColor Yellow
    Push-Location $repoRoot

    $insideGit = git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Skipping path because it is not a git repository."
        Pop-Location
        continue
    }

    $branch = git branch --show-current 2>$null
    if (-not $branch) {
        Write-Warning "Unable to determine current branch. Skipping repository."
        Pop-Location
        continue
    }

    $remote = git remote get-url origin 2>$null
    if (-not $remote) {
        Write-Warning "Repository has no origin remote. Skipping push."
        Pop-Location
        continue
    }

    Write-Host "Current branch: $branch" -ForegroundColor Green
    Write-Host "Remote origin: $remote" -ForegroundColor Green

    git push --set-upstream origin $branch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed $branch to origin." -ForegroundColor Green
    } else {
        Write-Error "Push failed for repository: $repoRoot"
    }

    Pop-Location
}

Write-Host "`nPush operation complete for all detected git repositories." -ForegroundColor Cyan
