$currentDir = Get-Location
$sourcePath = "$currentDir\temp_hadis.docx"
$tempZipPath = "$currentDir\temp_v3.zip"
$extractPath = "$currentDir\temp_v3_extract"

Write-Host "Source: $sourcePath"

# Cleanup
if (Test-Path $tempZipPath) { Remove-Item $tempZipPath -Force }
if (Test-Path $extractPath) { Remove-Item $extractPath -Recurse -Force }

# Copy
Copy-Item $sourcePath $tempZipPath

# Extract
Expand-Archive -LiteralPath $tempZipPath -DestinationPath $extractPath -Force

$xmlPath = "$extractPath\word\document.xml"
if (-not (Test-Path $xmlPath)) {
    Write-Host "Error: document.xml not found."
    exit
}

# Read
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
    
    # Filter
    if ($cleanText.Length -gt 15) {
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
$jsFile = "$currentDir\js\hadith-data.js"
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("const hadithCollection = [")

foreach ($h in $hadithList) {
    # Escape
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

# Rename original back to safe name
Move-Item $sourcePath "$currentDir\1001_HADIS.docx" -Force
