$currentDir = Get-Location
$sourceFile = Get-ChildItem -Path $currentDir -Filter "1001*.docx" | Select-Object -First 1

if (-not $sourceFile) {
    Write-Host "Error: DOCX file not found."
    exit
}

$sourcePath = $sourceFile.FullName
$tempZipPath = Join-Path $currentDir "temp_v2.zip"
$extractPath = Join-Path $currentDir "temp_v2_extract"

Write-Host "Source: $sourcePath"

# Cleanup
if (Test-Path $tempZipPath) { Remove-Item $tempZipPath -Force }
if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }

# Copy using .NET
[System.IO.File]::Copy($sourcePath, $tempZipPath)

# Extract
Expand-Archive -LiteralPath $tempZipPath -DestinationPath $extractPath -Force

$xmlPath = Join-Path $extractPath "word\document.xml"
if (-not (Test-Path $xmlPath)) {
    Write-Host "Error: document.xml not found at $xmlPath"
    exit
}

# Read using .NET
$xmlContent = [System.IO.File]::ReadAllText($xmlPath)

# Parse
$x = New-Object System.Xml.XmlDocument
$x.LoadXml($xmlContent)

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
    
    # Filter: Longer than 15 chars, not just numbers
    if ($cleanText.Length -gt 15 -and $cleanText -notmatch "^\d+$") {
        $hadithObj = @{
            id = $id
            text = $cleanText
            source = "Hadis-i Şerif"
        }
        $hadithList += $hadithObj
        $id++
    }
}

Write-Host "Extracted $($hadithList.Count) hadiths."

# Generate JS
$jsFile = Join-Path $currentDir "js\hadith-data.js"
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("const hadithCollection = [")

# Pick first 1001 (or all)
foreach ($h in $hadithList) {
    # Escape for JS
    $safeText = $h.text.Replace("\", "\\").Replace('"', '\"').Replace("`n", " ").Replace("`r", "")
    [void]$sb.AppendLine("    { id: $($h.id), text: `"$safeText`", source: `"$($h.source)`" },")
}

[void]$sb.AppendLine("];")
[void]$sb.AppendLine("if (typeof window !== 'undefined') { window.hadithCollection = hadithCollection; }")

[System.IO.File]::WriteAllText($jsFile, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Saved to $jsFile"

# Cleanup
Remove-Item $tempZipPath -Force
Remove-Item $extractPath -Recurse -Force
