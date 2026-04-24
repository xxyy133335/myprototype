$pagesDir = Join-Path (Get-Location) "pages"
$files = Get-ChildItem "$pagesDir\*.html"

$charMap = @{
    'E7BB' = 0x9F  # tong3
    'E6A0' = 0x8F  # lan2
    'E69D' = 0xBF  # ban3
    'E4B8' = 0xAD  # zhong1
    'E8BF' = 0x90  # yun4
    'E591' = 0x98  # yuan2
    'E5BD' = 0x95  # lu4
    'E680' = 0x81  # tai4
    'E7A4' = 0xBA  # shi4
    'E5BA' = 0x93  # ku4
    'E7A7' = 0xB0  # cheng1
    'E698' = 0xAF  # shi4
    'E590' = 0xA6  # fou3
    'E69C' = 0xBA  # ji1
    'E7AE' = 0xB1  # xiang1
    'E593' = 0x81  # pin3
    'E696' = 0x99  # liao4
    'E5A5' = 0x97  # tao4
    'E7B1' = 0xB3  # mi3
    'E5A6' = 0x82  # ru2
    'E4BB' = 0x93  # cang1
    'E997' = 0xA8  # men2
    'E987' = 0x8F  # liang4
    'EFBC' = 0x89  # rparen
    'E58D' = 0x87  # sheng1
    'E6B5' = 0x81  # liu2
    'E5B7' = 0xA5  # gong1
    'E6A8' = 0xA1  # mo2
    'E78A' = 0xB6  # zhuang4
    'E9A1' = 0xB9  # xiang4
    'E59B' = 0xBE  # tu2
    'E59C' = 0xBA  # chang3
    'E6B0' = 0xB8  # yong3
    'E4BA' = 0x86  # le
    'E5B1' = 0x9E  # shu3
    'E6B3' = 0xA8  # zhu4
    'E689' = 0xB9  # pi1
    'E799' = 0xBD  # bai2
    'E684' = 0x9F  # gan3
    'E7A1' = 0xAE  # que4
    'E8AE' = 0xB0  # ji4
    'E5B9' = 0xB6  # bing4
    'E4B9' = 0x89  # yi4
    'E8AF' = 0xB7  # qing3
    'E5BE' = 0x85  # dai4
    'E58E' = 0x9F  # yuan2
    'E6AE' = 0x8B  # can2
    'E586' = 0xB3  # jue2
    'E5AD' = 0x98  # cun2
    'E5B0' = 0x86  # jiang1
    'E58A' = 0x9E  # ban4
    'E7BC' = 0x96  # bian1
    'E980' = 0x89  # xuan3
    'E69F' = 0xA5  # cha2
    'E5B8' = 0x88  # shi1
    'E4BE' = 0x8B  # li4
    'E380' = 0x9C  # brackets
    'E599' = 0xA8  # qi4
    'E790' = 0x86  # li3
    'E8A2' = 0xAB  # bei4
    'E7A0' = 0x81  # ma3
    'E688' = 0x96  # huo4
    'E8BD' = 0xBD  # zai4
    'E69E' = 0x90  # jia4
    'E7B4' = 0xA2  # suo3
    'E983' = 0xA8  # bu4
    'E985' = 0x8D  # pei4
    'E794' = 0xB3  # shen1
    'E8A7' = 0x84  # gui1
    'E587' = 0xBA  # chu1
    'E5AF' = 0xBC  # dao3
    'E5BF' = 0x85  # bi4
    'E8B4' = 0xA8  # zhang4
    'E4BC' = 0x9A  # hui4
    'E7AD' = 0x89  # deng3
    'E580' = 0xBC  # zhi2
    'E887' = 0xAA  # zi4
    'E6A1' = 0xA3  # dang4
    'E994' = 0x99  # cuo4
    'E59E' = 0x8B  # xing2
    'E5A7' = 0x94  # wei3
    'E5A1' = 0xAB  # tian2
    'E7BD' = 0xAE  # zhi4
    'E4BD' = 0x8D  # wei4
    'E695' = 0xB0  # shu4
    'E280' = 0x9C  # ldquo
    'E999' = 0x99  # fu4
    'E79A' = 0x84  # de
    'E8A1' = 0xA8  # biao3
}

function Get-CorrectByte3 {
    param([byte]$b1, [byte]$b2, [byte[]]$allBytes, [int]$pos)
    $key = '{0:X2}{1:X2}' -f $b1, $b2
    
    # Ambiguous: E585 = ru4(A5) or mian3(8D)
    if ($key -eq 'E585') {
        $prevStart = [Math]::Max(0, $pos - 30)
        $prevBytes = $allBytes[$prevStart..($pos-1)]
        $prevText = [System.Text.Encoding]::UTF8.GetString($prevBytes)
        if ($prevText -match 'exempt' -or $prevText -match 'value=') { return 0x8D }
        # Check next byte: if 'C' follows after 3F -> mian3C
        $nextByte = $allBytes[$pos + 3]
        if ($nextByte -eq 0x43) { return 0x8D }
        return 0xA5
    }
    
    # Ambiguous: E58C = qu1(BA) or hua4(96)
    if ($key -eq 'E58C') {
        $prevStart = [Math]::Max(0, $pos - 30)
        $prevBytes = $allBytes[$prevStart..($pos-1)]
        $prevText = [System.Text.Encoding]::UTF8.GetString($prevBytes)
        if ($prevText -match 'init') { return 0x96 }
        return 0xBA
    }
    
    # Ambiguous: E58F = hao4(B7) or die2(A0) or fa1(91)
    if ($key -eq 'E58F') {
        $prevStart = [Math]::Max(0, $pos - 30)
        $prevBytes = $allBytes[$prevStart..($pos-1)]
        $prevText = [System.Text.Encoding]::UTF8.GetString($prevBytes)
        if ($prevText -match 'sidebar') { return 0xA0 }
        $afterPos = $pos + 3
        if ($afterPos -lt $allBytes.Length -and $allBytes[$afterPos] -eq 0x0A) { return 0xA0 }
        return 0xB7
    }
    
    # Ambiguous: E5BC = shi4(8F) or kai1(80)
    if ($key -eq 'E5BC') {
        $prevStart = [Math]::Max(0, $pos - 30)
        $prevBytes = $allBytes[$prevStart..($pos-1)]
        $prevText = [System.Text.Encoding]::UTF8.GetString($prevBytes)
        if ($prevText -match 'Modal') { return 0x80 }
        return 0x8F
    }
    
    # Ambiguous: E380 = various CJK punct
    if ($key -eq 'E380') {
        $nextByte = $allBytes[$pos + 3]
        if ($nextByte -eq 0x0A -or $nextByte -eq 0x20) { return 0x82 }  # period
        return 0x9C  # tilde
    }
    
    # Ambiguous: E280 = ldquo(9C) or rdquo(9D)
    if ($key -eq 'E280') {
        return 0x9C
    }
    
    if ($charMap.ContainsKey($key)) {
        return $charMap[$key]
    }
    return $null
}

function Get-ConsumedByte {
    param([byte[]]$allBytes, [int]$corruptPos)
    $nextBytePos = $corruptPos + 3
    if ($nextBytePos -ge $allBytes.Length) { return $null }
    $nextByte = $allBytes[$nextBytePos]
    
    # The 0x3F replaced original_byte3, and the byte AFTER was deleted
    # So current nextByte is what WAS 2 positions after the corruption
    # We need to figure out what the deleted byte was
    
    switch ($nextByte) {
        0x2F { return 0x3C }   # closing tag: char + lt + /
        0x3E { return 0x22 }   # attr end: char + quote + gt
        0x2D { return 0x20 }   # comment: char + space + dash
        0x2C { return 0x27 }   # JS: char + quote + comma
        0x43 { return 0x33 }   # 3C pattern
        0x29 { return 0x27 }   # JS: char + quote + rparen
        0x3B { return 0x27 }   # JS: char + quote + semicolon
        default {
            if ($nextByte -eq 0x0A -or $nextByte -eq 0x0D) { return 0x20 }
            if ($nextByte -eq 0x20) { return 0x20 }
            if ($nextByte -eq 0x2E) { return 0x2E }  # period
            if ($nextByte -eq 0x24) { return 0x20 }  # dollar sign after space
            return 0x22
        }
    }
}

$totalFixed = 0

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    [byte[]]$bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $positions = [System.Collections.Generic.List[int]]::new()
    for ($i = 0; $i -lt $bytes.Length - 2; $i++) {
        if ($bytes[$i] -ge 0xE0 -and $bytes[$i] -le 0xEF -and 
            $bytes[$i+1] -ge 0x80 -and $bytes[$i+1] -le 0xBF -and 
            $bytes[$i+2] -eq 0x3F) {
            $positions.Add($i)
        }
    }
    if ($positions.Count -eq 0) {
        Write-Host "  No corruptions found"
        continue
    }
    Write-Host "  Found $($positions.Count) corrupted positions"
    $posSet = [System.Collections.Generic.HashSet[int]]::new()
    foreach ($p in $positions) { [void]$posSet.Add($p) }
    $newBytes = [System.Collections.Generic.List[byte]]::new($bytes.Length + 500)
    $i = 0
    $fixCount = 0
    $unknowns = 0
    while ($i -lt $bytes.Length) {
        if ($posSet.Contains($i)) {
            $b1 = $bytes[$i]
            $b2 = $bytes[$i+1]
            $correctB3 = Get-CorrectByte3 -b1 $b1 -b2 $b2 -allBytes $bytes -pos $i
            if ($null -ne $correctB3) {
                $consumedByte = Get-ConsumedByte -allBytes $bytes -corruptPos $i
                $newBytes.Add($b1)
                $newBytes.Add($b2)
                $newBytes.Add([byte]$correctB3)
                if ($null -ne $consumedByte) {
                    $newBytes.Add([byte]$consumedByte)
                }
                $fixCount++
                $i += 3
            } else {
                $key = '{0:X2}{1:X2}' -f $bytes[$i], $bytes[$i+1]
                Write-Host "  UNKNOWN: $key at pos $i"
                $unknowns++
                $newBytes.Add($bytes[$i])
                $i++
            }
        } else {
            $newBytes.Add($bytes[$i])
            $i++
        }
    }
    Write-Host "  Fixed: $fixCount, Unknown: $unknowns"
    $totalFixed += $fixCount
    [System.IO.File]::WriteAllBytes($file.FullName, $newBytes.ToArray())
    Write-Host "  Saved: $($file.Name)"
}

Write-Host "`nTotal: Fixed $totalFixed corruptions across $($files.Length) files"
