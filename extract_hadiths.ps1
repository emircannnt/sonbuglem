$currentDir = Get-Location

# Find file
$file = Get-ChildItem -Path $currentDir -Filter "1001*.docx" | Select-Object -First 1

if (-not $file) {
    Write-Host "Error: DOCX file not found."
    exit
}

$sourcePath = $file.FullName
$tempZipPath = Join-Path $currentDir "temp_hadith.zip"
$extractPath = Join-Path $currentDir "temp_hadith_extract"

Write-Host "Source: $sourcePath"
Write-Host "Temp Zip: $tempZipPath"

# Cleanup
if (Test-Path -LiteralPath $tempZipPath) { Remove-Item -LiteralPath $tempZipPath -Force }
if (Test-Path -LiteralPath $extractPath) { Remove-Item -LiteralPath $extractPath -Recurse -Force }

# Copy
Copy-Item -LiteralPath $sourcePath -Destination $tempZipPath
if (-not (Test-Path -LiteralPath $tempZipPath)) {
    Write-Host "Error: Failed to copy file to temp zip."
    exit
}

# Extract
Expand-Archive -LiteralPath $tempZipPath -DestinationPath $extractPath -Force

$xmlPath = Join-Path $extractPath "word\document.xml"
if (-not (Test-Path -LiteralPath $xmlPath)) {
    Write-Host "Error: document.xml not found."
    exit
}

# Parse
[xml]$x = Get-Content -LiteralPath $xmlPath
$ns = New-Object System.Xml.XmlNamespaceManager($x.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

$paragraphs = $x.SelectNodes("//w:p", $ns)
$hadithList = @()
$id = 1

foreach ($p in $paragraphs) {
    $textNodes = $p.SelectNodes(".//w:t", $ns)
    $text = ""
    foreach($t in $textNodes) { $text += $t.InnerText }
    
    $cleanText = $text.Trim()
    
    # Filter: Not empty, not just numbers, longer than 15 chars
    if ($cleanText.Length -gt 15 -and $cleanText -notmatch "^\d+$") {
        # Create object
        $hadithList += @{
            id = $id
            text = $cleanText
            source = "Hadis-i Şerif"
        }
        $id++
    }
}

Write-Host "Extracted $($hadithList.Count) hadiths."

# Generate JS
$jsFile = Join-Path $currentDir "js\hadith-data.js"
$content = "const hadithCollection = [" + [Environment]::NewLine
foreach ($h in $hadithList) {
    $safeText = $h.text.Replace("\", "\\").Replace('"', '\"').Replace("`n", " ").Replace("`r", "")
    $content += "    { id: $($h.id), text: `"$safeText`", source: `"$($h.source)`" }," + [Environment]::NewLine
}
$content += "];" + [Environment]::NewLine
$content += "if (typeof window !== 'undefined') { window.hadithCollection = hadithCollection; }"

Set-Content -LiteralPath $jsFile -Value $content -Encoding UTF8
Write-Host "Saved to $jsFile"

# Cleanup
Remove-Item -LiteralPath $tempZipPath -Force
Remove-Item -LiteralPath $extractPath -Recurse -Force
