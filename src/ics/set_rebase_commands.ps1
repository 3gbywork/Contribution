function Set-Rebase-Commands {
    param (
        $inFile,
        $outFile
    )

    $reg = "DTSTART:([0-9]*)"

    $commands = ""
    Get-Content -Path $inFile -Encoding UTF8 | ForEach-Object {
        if ($_ -match $reg) {
            $time = ([datetime]$Matches[1].Insert(6, '-').Insert(4, '-')).ToString("yyyy-MM-dd") + [datetime]::Now.ToString(" HH:mm:ss")
            $command = ("GIT_COMMITTER_DATE='{0}' GIT_AUTHOR_DATE='{0}' git commit --amend --no-edit --date '{0}' && git rebase --continue" -f ($time))
            $commands += $command + "`r`n"
        }
    }

    $commands | Out-File -FilePath $outFile -Encoding utf8
}

