$pagesDir = Join-Path (Get-Location) "pages"
$files = Get-ChildItem "$pagesDir\*.html"

# Define replacement pairs as hex byte sequences
# Format: old_hex_bytes -> new_hex_bytes
$byteReplacements = @(
    # E4BA86 (le) -> E4BABA (ren) in "shen qing ren"
    @('E794B3E8AFB7E4BA86', 'E794B3E8AFB7E4BABA')
    # E58D87 (sheng) -> E58D95 (dan) in "qing dan"
    @('E6B885E58D87', 'E6B885E58D95')
    # E58D87 (sheng) -> E58D95 (dan) in "yi ku dan"
    @('E7A7BBE5BA93E58D87', 'E7A7BBE5BA93E58D95')
    # E4BB93 (cang) -> E4BBB6 (jian) in "you jian"
    @('E990AEE4BB93', 'E990AEE4BBB6')
    # E59BBE (tu) -> E59BA0 (yin) in "yuan yin"
    @('E58E9FE59BBE', 'E58E9FE59BA0')
    # E794B3 (shen) -> E794A8 (yong) in "shi yong"
    @('E4BDBFE794B3', 'E4BDBFE794A8')
    # Fix "ling qian yu ku" -> "ling qian ku cun"
    @('E9A286E5898DE4BD99E5BA93', 'E9A286E5898DE5BA93E5AD98')
    # Fix "bao qian yu ku" -> "bao qian ku cun"
    @('E68AA5E5898DE4BD99E5BA93', 'E68AA5E5898DE5BA93E5AD98')
    # Fix "dang qian yu ku" -> "dang qian ku cun"
    @('E5BD93E5898DE4BD99E5BA93', 'E5BD93E5898DE5BA93E5AD98')
)

function HexToBytes([string]$hex) {
    $bytes = New-Object byte[] ($hex.Length / 2)
    for ($i = 0; $i -lt $hex.Length; $i += 2) {
        $bytes[$i/2] = [Convert]::ToByte($hex.Substring($i, 2), 16)
    }
    return ,$bytes
}

function FindBytes($haystack, $needle, $start) {
    for ($i = $start; $i -le $haystack.Length - $needle.Length; $i++) {
        $found = $true
        for ($j = 0; $j -lt $needle.Length; $j++) {
            if ($haystack[$i + $j] -ne $needle[$j]) {
                $found = $false
                break
            }
        }
        if ($found) { return $i }
    }
    return -1
}

$totalFixes = 0

foreach ($file in $files) {
    [byte[]]$bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $modified = $false
    $fixCount = 0
    
    foreach ($r in $byteReplacements) {
        $oldBytes = HexToBytes $r[0]
        $newBytes = HexToBytes $r[1]
        
        $newByteList = New-Object System.Collections.Generic.List[byte]
        $pos = 0
        $replaced = $false
        
        while ($pos -lt $bytes.Length) {
            $found = FindBytes $bytes $oldBytes $pos
            if ($found -ge 0) {
                for ($k = $pos; $k -lt $found; $k++) { $newByteList.Add($bytes[$k]) }
                foreach ($b in $newBytes) { $newByteList.Add($b) }
                $pos = $found + $oldBytes.Length
                $replaced = $true
                $fixCount++
            } else {
                for ($k = $pos; $k -lt $bytes.Length; $k++) { $newByteList.Add($bytes[$k]) }
                break
            }
        }
        
        if ($replaced) {
            $bytes = $newByteList.ToArray()
            $modified = $true
        }
    }
    
    # Fix placeholder missing quotes: find pattern placeholder="...XX 20 20 72 65 71 75 69 72 65 64
    # Should be: ...XX 22 20 72 65 71 (insert quote before space+required)
    $reqBytes = @(0x20, 0x20, 0x72, 0x65, 0x71, 0x75, 0x69, 0x72, 0x65, 0x64)  # "  required"
    $placeholderMark = @(0x70, 0x6C, 0x61, 0x63, 0x65, 0x68, 0x6F, 0x6C, 0x64, 0x65, 0x72, 0x3D, 0x22)  # placeholder="
    
    $newByteList2 = New-Object System.Collections.Generic.List[byte]
    $i = 0
    while ($i -lt $bytes.Length) {
        if ($i -le $bytes.Length - $reqBytes.Length) {
            $match = $true
            for ($j = 0; $j -lt $reqBytes.Length; $j++) {
                if ($bytes[$i + $j] -ne $reqBytes[$j]) { $match = $false; break }
            }
            if ($match) {
                # Check if we're inside a placeholder attribute
                $lookback = [Math]::Min($i, 200)
                $prevChunk = [System.Text.Encoding]::UTF8.GetString($bytes[($i - $lookback)..($i - 1)])
                if ($prevChunk -match 'placeholder="[^"]*$') {
                    # Replace double-space with quote+space
                    $newByteList2.Add(0x22)  # "
                    $newByteList2.Add(0x20)  # space
                    # Skip the two spaces, keep "required"
                    $i += 2  # skip the two spaces
                    $modified = $true
                    $fixCount++
                    continue
                }
            }
        }
        $newByteList2.Add($bytes[$i])
        $i++
    }
    $bytes = $newByteList2.ToArray()
    
    # Fix placeholder="...XX 20 20 6D 69 6E 3D (double-space before min=)
    $minBytes = @(0x20, 0x20, 0x6D, 0x69, 0x6E, 0x3D)
    $newByteList3 = New-Object System.Collections.Generic.List[byte]
    $i = 0
    while ($i -lt $bytes.Length) {
        if ($i -le $bytes.Length - $minBytes.Length) {
            $match = $true
            for ($j = 0; $j -lt $minBytes.Length; $j++) {
                if ($bytes[$i + $j] -ne $minBytes[$j]) { $match = $false; break }
            }
            if ($match) {
                $lookback = [Math]::Min($i, 200)
                $prevChunk = [System.Text.Encoding]::UTF8.GetString($bytes[($i - $lookback)..($i - 1)])
                if ($prevChunk -match 'placeholder="[^"]*$') {
                    $newByteList3.Add(0x22)
                    $newByteList3.Add(0x20)
                    $i += 2
                    $modified = $true
                    $fixCount++
                    continue
                }
            }
        }
        $newByteList3.Add($bytes[$i])
        $i++
    }
    $bytes = $newByteList3.ToArray()
    
    if ($modified) {
        [System.IO.File]::WriteAllBytes($file.FullName, $bytes)
        Write-Host "$($file.Name): $fixCount fixes"
        $totalFixes += $fixCount
    } else {
        Write-Host "$($file.Name): no changes"
    }
}

Write-Host "`nTotal: $totalFixes fixes"
