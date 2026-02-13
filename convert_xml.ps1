
# Set encoding to UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Paths
$quranPath = "quran-uthmani.xml"
$transPath = "tr.yazir.xml"
$outputPath = "js/quran-data.js"

Write-Host "Reading XML files..."

# Load XML files
[xml]$quranXml = Get-Content -Path $quranPath -Encoding UTF8
[xml]$transXml = Get-Content -Path $transPath -Encoding UTF8

$quranData = @()

Write-Host "Processing Surahs..."

# Iterate through surahs
foreach ($sura in $quranXml.quran.sura) {
    $index = $sura.index
    $name = $sura.name
    
    # Find translation surah
    $transSura = $transXml.quran.sura | Where-Object { $_.index -eq $index }
    
    $ayahs = @()
    
    foreach ($aya in $sura.aya) {
        $ayaIndex = $aya.index
        $arabic = $aya.text
        
        # Find translation aya
        $transText = "Çeviri bulunamadı."
        if ($transSura) {
            $transAya = $transSura.aya | Where-Object { $_.index -eq $ayaIndex }
            if ($transAya) {
                $transText = $transAya.text
            }
        }
        
        $ayahObject = @{
            i = [int]$ayaIndex
            a = $arabic
            t = $transText
        }
        $ayahs += $ayahObject
    }
    
    $surahObject = @{
        id = [int]$index
        name = $name
        ayahs = $ayahs
    }
    
    $quranData += $surahObject
}

Write-Host "Converting to JSON..."
$json = $quranData | ConvertTo-Json -Depth 4 -Compress

Write-Host "Writing to file..."
$jsContent = "const quranData = $json;"
$jsContent | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "Done! File saved to $outputPath"
