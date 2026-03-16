$ErrorActionPreference = 'Stop'

function Resolve-Bash {
    $gitCandidates = @(
        (Join-Path $env:ProgramFiles 'Git\bin\bash.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'Git\bin\bash.exe'),
        (Join-Path $env:ProgramFiles 'Git\usr\bin\bash.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'Git\usr\bin\bash.exe')
    ) | Where-Object { $_ }

    foreach ($candidate in $gitCandidates) {
        if (Test-Path $candidate) {
            return @{
                Path = $candidate
                PathStyle = 'git'
            }
        }
    }

    $bashCommand = Get-Command bash -ErrorAction SilentlyContinue
    if ($bashCommand) {
        $pathStyle = 'git'
        if ($bashCommand.Source -match 'System32\\bash.exe' -or $bashCommand.Source -match 'wsl.exe') {
            $pathStyle = 'wsl'
        }

        return @{
            Path = $bashCommand.Source
            PathStyle = $pathStyle
        }
    }

    return $null
}

function Convert-ToBashPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$WindowsPath,
        [Parameter(Mandatory = $true)]
        [string]$PathStyle
    )

    $normalized = $WindowsPath -replace '\\', '/'
    if ($normalized -match '^(?<drive>[A-Za-z]):(?<rest>/.*)$') {
        $drive = $Matches.drive.ToLower()
        $rest = $Matches.rest
        if ($PathStyle -eq 'wsl') {
            return "/mnt/$drive$rest"
        }
        return "/$drive$rest"
    }

    return $normalized
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$buildScript = Join-Path $scriptRoot 'build.sh'
$bashInfo = Resolve-Bash

if (-not $bashInfo) {
    throw 'bash is required. Install Git Bash or use WSL to run bash ./build.sh -e prod.'
}

$bashScriptPath = Convert-ToBashPath -WindowsPath $buildScript -PathStyle $bashInfo.PathStyle

Write-Host 'build_docker_prod.ps1 is now a compatibility wrapper. Prefer bash ./build.sh -e prod' -ForegroundColor Yellow

& $bashInfo.Path $bashScriptPath '-e' 'prod' @args
exit $LASTEXITCODE
