# run-verrif.ps1 — Verification complete autonome (mode nuit)
#
# USAGE :
#   .\run-verrif.ps1              → mode full (defaut)
#   .\run-verrif.ps1 -mode safe   → corrige seulement les critiques
#   .\run-verrif.ps1 -mode full   → corrige tout (critique > warning > suggestion)
#   .\run-verrif.ps1 -mode scan   → scan seul, aucune correction
#
# NIVEAUX DE CORRECTION (mode full) :
#   Niveau 1 : Critiques (build, tests, bugs, WatermelonDB)
#   Niveau 2 : Warnings (any, console.log, hardcoded, code mort)
#   Niveau 3 : Suggestions (nommage, TODOs, optimisations)
#   Chaque niveau est verifie avant de passer au suivant
#   Rollback par niveau si une correction casse le build/tests

param(
    [ValidateSet("safe", "full", "scan")]
    [string]$mode = "full"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# --- Desactiver la mise en veille ---
powercfg /change standby-timeout-ac 0
powercfg /change monitor-timeout-ac 5
Write-Host "[NUIT] Mise en veille desactivee, ecran off dans 5min" -ForegroundColor Magenta

$timestamp = Get-Date -Format "yyyyMMdd-HHmm"
$verifDir = "docs/bmad/verrif/$timestamp"
mkdir -Force $verifDir | Out-Null
mkdir -Force "docs/bmad/git-history" | Out-Null

$statusFile = "$verifDir/STATUS.md"
$scoreFile = "docs/bmad/verrif/HEALTH.md"

# ============================================================
# FONCTIONS UTILITAIRES
# ============================================================

function Write-Status {
    param($phase, $result)
    Add-Content $statusFile "| $phase | $result | $(Get-Date -Format 'HH:mm:ss') |"
}

function Run-Passe {
    param($num, $name, $command, $tools)
    
    Write-Host "`n[$num] $name" -ForegroundColor Yellow
    
    try {
        $output = Invoke-Expression "claude -p `"$command`" --allowedTools $tools" 2>&1
        if ($LASTEXITCODE -ne 0) { throw "Exit code: $LASTEXITCODE" }
        Write-Host $output
        Write-Status "$num - $name" "OK"
        return $true
    }
    catch {
        Write-Host "[ERREUR] $num echouee: $_" -ForegroundColor Red
        Write-Status "$num - $name" "ECHEC - $_"
        return $false
    }
}

function Run-QuickCheck {
    param($label)
    Write-Host "`n--- QUICK CHECK $label ---" -ForegroundColor Cyan

    $cmdCheck = "Lance npx tsc --noEmit et npm test dans mobile/. Si les deux passent sans erreur, reponds exactement CLEAN. Sinon reponds DIRTY suivi de la liste des erreurs. Rien d autre. Ne me pose aucune question."
    
    try {
        $output = claude -p $cmdCheck --allowedTools "Bash(npx:*)" "Bash(npm:*)" "Read" 2>&1
        $outputStr = $output -join " "
        if ($outputStr -match "CLEAN") {
            Write-Host "[CHECK] CLEAN" -ForegroundColor Green
            Write-Status "CHECK $label" "CLEAN"
            return $true
        } else {
            Write-Host "[CHECK] DIRTY" -ForegroundColor Red
            Write-Status "CHECK $label" "DIRTY"
            return $false
        }
    }
    catch {
        Write-Host "[ERREUR] Quick check echoue: $_" -ForegroundColor Red
        Write-Status "CHECK $label" "ECHEC - $_"
        return $false
    }
}

function Run-FixLevel {
    param($level, $levelName, $description)

    Write-Host "`n========== FIX NIVEAU $level - $levelName ==========" -ForegroundColor Cyan

    # Sauvegarder l'etat avant ce niveau pour rollback
    git stash push -m "verrif-before-level$level-$timestamp" --include-untracked --quiet 2>$null
    git stash pop --quiet 2>$null
    # Sauvegarder la liste des fichiers modifies avant ce niveau
    $filesBefore = git diff --name-only 2>$null

    $cmdFix = "Relis tous les rapports dans docs/bmad/verrif/$timestamp/. Corrige UNIQUEMENT les problemes de niveau $levelName : $description. NE FAIS AUCUN COMMIT. Modifie les fichiers sans commiter. Ne modifie PAS le comportement fonctionnel. Si une correction est risquee, ne la fais pas et note pourquoi. Sauvegarde le rapport dans docs/bmad/verrif/$timestamp/07-fix-niveau$level.md. Ne me pose aucune question."
    
    $fixOk = Run-Passe "FIX-N$level" $levelName $cmdFix '"Bash(mkdir:*)" "Bash(npx:*)" "Bash(npm:*)" "Write" "Read" "Edit"'
    
    if (-not $fixOk) {
        Write-Status "FIX-N$level" "ECHEC - pas de correction"
        return $false
    }

    # Verifier que les corrections n'ont rien casse
    $clean = Run-QuickCheck "apres niveau $level"
    
    if (-not $clean) {
        # ROLLBACK : annuler les modifications de ce niveau
        Write-Host "[ROLLBACK] Niveau $level a casse le build/tests, annulation..." -ForegroundColor Red
        
        # Revert les fichiers modifies par ce niveau
        $filesAfter = git diff --name-only 2>$null
        $newFiles = $filesAfter | Where-Object { $filesBefore -notcontains $_ }
        foreach ($f in $newFiles) {
            git checkout -- $f 2>$null
        }
        
        Write-Status "FIX-N$level" "ROLLBACK - corrections annulees"
        return $false
    }

    Write-Status "FIX-N$level" "OK - corrections appliquees"
    return $true
}

function Calculate-Score {
    Write-Host "`n========== SCORE DE SANTE ==========" -ForegroundColor Cyan

    $cmdScore = @"
Analyse l'etat du projet et donne un score de sante sur 100. Reponds UNIQUEMENT avec un JSON, rien d'autre :
{"score": X, "build": X, "tests": X, "bugs": X, "qualite": X, "coverage": X}

Criteres (chaque sous-score sur 20) :
- build : 20 si tsc clean, 0 si erreurs
- tests : 20 si tous passent, -2 par test fail
- bugs : 20 si aucun bug silencieux, -3 par bug critique, -1 par warning
- qualite : 20 si pas de code mort/any/hardcoded, -1 par probleme
- coverage : 0 a 20 proportionnel au % de couverture (11% = 2, 50% = 10, 100% = 20)

Base-toi sur les rapports dans docs/bmad/verrif/$timestamp/. Ne me pose aucune question.
"@

    try {
        $output = claude -p $cmdScore --allowedTools "Read" 2>&1
        $outputStr = ($output -join " ").Trim()
        
        # Extraire le JSON
        if ($outputStr -match '\{[^}]+\}') {
            $json = $Matches[0]
            $scoreData = $json | ConvertFrom-Json
            $score = $scoreData.score

            Write-Host "[SCORE] Sante du projet : $score/100" -ForegroundColor $(if ($score -ge 80) {"Green"} elseif ($score -ge 50) {"Yellow"} else {"Red"})
            Write-Host "  Build: $($scoreData.build)/20 | Tests: $($scoreData.tests)/20 | Bugs: $($scoreData.bugs)/20 | Qualite: $($scoreData.qualite)/20 | Coverage: $($scoreData.coverage)/20"
            
            Write-Status "SCORE" "$score/100"

            # Ajouter au fichier historique des scores
            $scoreEntry = "| $timestamp | $score | $($scoreData.build) | $($scoreData.tests) | $($scoreData.bugs) | $($scoreData.qualite) | $($scoreData.coverage) | $mode |"
            
            if (-not (Test-Path $scoreFile)) {
                @"
# Historique de sante du projet WEGOGYM

| Run | Score | Build | Tests | Bugs | Qualite | Coverage | Mode |
|-----|-------|-------|-------|------|---------|----------|------|
"@ | Set-Content $scoreFile
            }
            Add-Content $scoreFile $scoreEntry
            
            return $score
        }
    }
    catch {
        Write-Host "[ERREUR] Calcul du score echoue: $_" -ForegroundColor Red
        Write-Status "SCORE" "ECHEC"
    }
    return -1
}

# ============================================================
# FONCTIONS DE SCAN
# ============================================================

function Run-Scan {
    Write-Host "`n========== SCAN ==========" -ForegroundColor Cyan
    
    $cmd1 = (Get-Content .claude/commands/verrif-build.md -Raw) -replace '"', '\"'
    $cmd2 = (Get-Content .claude/commands/verrif-tests.md -Raw) -replace '"', '\"'
    $cmd3 = (Get-Content .claude/commands/verrif-code-review.md -Raw) -replace '"', '\"'
    $cmd4 = (Get-Content .claude/commands/verrif-bugs.md -Raw) -replace '"', '\"'
    $cmd5 = (Get-Content .claude/commands/verrif-db.md -Raw) -replace '"', '\"'
    $cmd6 = (Get-Content .claude/commands/verrif-qualite.md -Raw) -replace '"', '\"'

    Run-Passe "SCAN-1" "Build & TypeScript" $cmd1 '"Bash(mkdir:*)" "Bash(npx:*)" "Bash(npm:*)" "Write" "Read"' | Out-Null
    Run-Passe "SCAN-2" "Tests" $cmd2 '"Bash(mkdir:*)" "Bash(npx:*)" "Bash(npm:*)" "Write" "Read"' | Out-Null
    Run-Passe "SCAN-3" "Code Review" $cmd3 '"Bash(mkdir:*)" "Write" "Read"' | Out-Null
    Run-Passe "SCAN-4" "Bugs silencieux" $cmd4 '"Bash(mkdir:*)" "Write" "Read"' | Out-Null
    Run-Passe "SCAN-5" "Coherence WatermelonDB" $cmd5 '"Write" "Read"' | Out-Null
    Run-Passe "SCAN-6" "Code mort & qualite" $cmd6 '"Write" "Read"' | Out-Null
}

# ============================================================
# MAIN
# ============================================================

@"
# Statut du run verrif $timestamp
# Mode : $mode

| Passe | Resultat | Heure |
|-------|----------|-------|
"@ | Set-Content $statusFile

Write-Host "[RUN] Verrif $timestamp - Mode $mode" -ForegroundColor Cyan

# --- SCAN ---
Run-Scan

# --- SCORE AVANT corrections ---
$scoreBefore = Calculate-Score

# --- MODE SCAN : on s'arrete la ---
if ($mode -eq "scan") {
    Add-Content $statusFile @"

## RESULTAT : SCAN UNIQUEMENT (mode scan)
## Score : $scoreBefore/100
Aucune correction appliquee.
"@
    powercfg /change standby-timeout-ac 30
    powercfg /change monitor-timeout-ac 10
    Write-Host "`n[NUIT] Mise en veille reactivee (30min)" -ForegroundColor Magenta
    Write-Host "[OK] Scan termine. Score: $scoreBefore/100" -ForegroundColor Green
    exit 0
}

# --- CORRECTIONS PAR NIVEAU ---
Write-Host "`n========== CORRECTIONS PAR NIVEAU ==========" -ForegroundColor Cyan

# Niveau 1 : Critiques
$n1ok = Run-FixLevel 1 "CRITIQUES" "erreurs de build TypeScript, tests qui fail, bugs silencieux (mutations hors write, fuites memoire, async sans catch), incoherences WatermelonDB schema vs modeles"

# Niveau 2 : Warnings (seulement si mode full ET niveau 1 ok)
$n2ok = $false
if ($mode -eq "full" -and $n1ok) {
    $n2ok = Run-FixLevel 2 "WARNINGS" "any TypeScript restants, console.log hors __DEV__, couleurs et valeurs hardcodees au lieu des tokens du theme, code mort (imports, fonctions, styles inutilises)"
} elseif ($mode -eq "safe") {
    Write-Host "`n[SKIP] Niveau 2 (mode safe)" -ForegroundColor DarkYellow
    Write-Status "FIX-N2" "SKIP - mode safe"
}

# Niveau 3 : Suggestions (seulement si mode full ET niveau 2 ok)
$n3ok = $false
if ($mode -eq "full" -and $n2ok) {
    $n3ok = Run-FixLevel 3 "SUGGESTIONS" "incoherences de nommage (camelCase/snake_case), code commente ou TODOs oublies, optimisations mineures de performance"
} elseif ($mode -eq "safe" -or -not $n2ok) {
    Write-Host "`n[SKIP] Niveau 3" -ForegroundColor DarkYellow
    Write-Status "FIX-N3" "SKIP"
}

# --- VERIFICATION FINALE ---
$finalClean = Run-QuickCheck "FINAL"

# --- SCORE APRES corrections ---
$scoreAfter = Calculate-Score

if ($finalClean) {
    # --- CLEAN : commit + push ---
    Write-Host "`n[OK] Projet clean ! Commit & push..." -ForegroundColor Green

    $cmdPush = "Le code a ete verifie et corrige. Commit et push : 1) git add les fichiers corriges + les rapports dans docs/bmad/verrif/ + docs/bmad/git-history/ 2) Ne stage PAS node_modules, .env, builds, keystores, coverage 3) Fais des commits atomiques par type : fix(scope) pour les bugs, refactor(scope) pour la qualite, chore(verrif) pour les rapports 4) git push origin (branche courante) 5) Sauvegarde un rapport dans docs/bmad/git-history/$timestamp-verrif.md. Ne me pose aucune question."

    Run-Passe "PUSH" "Git commit & push" $cmdPush '"Bash(mkdir:*)" "Bash(git:*)" "Bash(npx:*)" "Bash(npm:*)" "Write" "Read"' | Out-Null

    Add-Content $statusFile @"

## RESULTAT : CLEAN ET PUSH
## Score : $scoreBefore → $scoreAfter / 100
## Niveaux appliques : N1$(if($n2ok){" + N2"})$(if($n3ok){" + N3"})

Corrections verifiees (build + tests) puis commitees et pushees.
"@
    Write-Host "[OK] Run termine. Score: $scoreBefore -> $scoreAfter/100" -ForegroundColor Green

} else {
    # --- PAS CLEAN : revert code, garder rapports ---
    Write-Host "`n[STOP] Pas clean apres corrections. Annulation du code..." -ForegroundColor Red
    
    git checkout -- mobile/ 2>$null

    Add-Content $statusFile @"

## RESULTAT : PAS CLEAN - AUCUN COMMIT
## Score : $scoreBefore → $scoreAfter / 100
## Niveaux tentes : N1$(if($n1ok){" OK"}else{" FAIL"}) | N2$(if($n2ok){" OK"}else{" FAIL/SKIP"}) | N3$(if($n3ok){" OK"}else{" FAIL/SKIP"})

**Les corrections automatiques n'ont pas suffi.**
**Le code a ete revert. Les rapports sont conserves.**

### Action requise le matin :
1. /morning pour voir l'etat
2. Lis les rapports dans docs/bmad/verrif/$timestamp/
3. /fix [description] pour corriger manuellement
4. /review pour verifier
5. /gitgo quand c'est clean
"@
    Write-Host "[STOP] Aucun commit. Rapport dans $statusFile" -ForegroundColor Red
}

# --- Reactiver la mise en veille ---
powercfg /change standby-timeout-ac 30
powercfg /change monitor-timeout-ac 10
Write-Host "`n[NUIT] Mise en veille reactivee (30min)" -ForegroundColor Magenta