Add-Type -AssemblyName System.Drawing

$srcPath = 'd:\Flip Book Invitation\Brown and Beige Vintage Floral Page Border Flyer.png'
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$dpiX = $src.HorizontalResolution
$dpiY = $src.VerticalResolution

function Make-Transparent([System.Drawing.Bitmap]$bmp, [int]$whiteThresh = 244, [int]$feather = 20) {
  $rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)
  $bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $ptr = $bmpData.Scan0
  $bytes = [int]($bmp.Width * $bmp.Height * 4)
  $rgbValues = New-Object byte[] $bytes
  [System.Runtime.InteropServices.Marshal]::Copy($ptr, $rgbValues, 0, $bytes)

  for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = $rgbValues[$i]
    $g = $rgbValues[$i + 1]
    $r = $rgbValues[$i + 2]
    
    $minChannel = [Math]::Min($r, [Math]::Min($g, $b))
    
    if ($minChannel -ge $whiteThresh) {
      $rgbValues[$i + 3] = 0
    } elseif ($minChannel -ge ($whiteThresh - $feather)) {
      $diff = $whiteThresh - $minChannel
      $alpha = [byte][Math]::Min(255, [Math]::Max(0, [int](255 * ($diff / $feather))))
      $rgbValues[$i + 3] = $alpha
    } else {
      $rgbValues[$i + 3] = 255
    }
  }

  [System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $ptr, $bytes)
  $bmp.UnlockBits($bmpData)
  return $bmp
}

# 1. TOP FLORAL GARLAND (full width across)
$topSrcW = $src.Width
$topSrcH = 1150
$cropTop = New-Object System.Drawing.Bitmap($topSrcW, $topSrcH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cropTop.SetResolution($dpiX, $dpiY)
$g = [System.Drawing.Graphics]::FromImage($cropTop)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $topSrcW, $topSrcH)
$srcRect = New-Object System.Drawing.Rectangle(0, 0, $topSrcW, $topSrcH)
$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$cropTop = Make-Transparent $cropTop 244 18

# Scale down for web (width: 900px)
$webTopH = [int](900 * ($topSrcH / $topSrcW))
$webTop = New-Object System.Drawing.Bitmap(900, $webTopH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gWT = [System.Drawing.Graphics]::FromImage($webTop)
$gWT.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gWT.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gWT.DrawImage($cropTop, (New-Object System.Drawing.Rectangle(0, 0, 900, $webTopH)), (New-Object System.Drawing.Rectangle(0, 0, $topSrcW, $topSrcH)), [System.Drawing.GraphicsUnit]::Pixel)
$gWT.Dispose()
$cropTop.Dispose()

$webTop.Save('d:\Flip Book Invitation\ornament-top.png', [System.Drawing.Imaging.ImageFormat]::Png)
$webTop.Dispose()
Write-Host "Created ornament-top.png (full width)"

# 2. BOTTOM RIGHT CORNER (Bird of Paradise + purple + red flowers)
$brSrcX = 1450
$brSrcY = 2150
$brSrcW = [int]($src.Width - $brSrcX)
$brSrcH = [int]($src.Height - $brSrcY)

$cropBR = New-Object System.Drawing.Bitmap($brSrcW, $brSrcH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cropBR.SetResolution($dpiX, $dpiY)
$g = [System.Drawing.Graphics]::FromImage($cropBR)
$g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $brSrcW, $brSrcH)), (New-Object System.Drawing.Rectangle($brSrcX, $brSrcY, $brSrcW, $brSrcH)), [System.Drawing.GraphicsUnit]::Pixel)

# Clear cloth sliver at bottom left of the flower crop:
$clothBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillRectangle($clothBrush, 0, [int]($brSrcH * 0.72), [int]($brSrcW * 0.36), [int]($brSrcH * 0.32))
$clothBrush.Dispose()
$g.Dispose()

$cropBR = Make-Transparent $cropBR 244 18

$webBRH = 340
$webBRW = [int]($webBRH * ($brSrcW / $brSrcH))
$webBR = New-Object System.Drawing.Bitmap($webBRW, $webBRH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gBR = [System.Drawing.Graphics]::FromImage($webBR)
$gBR.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gBR.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gBR.DrawImage($cropBR, (New-Object System.Drawing.Rectangle(0, 0, $webBRW, $webBRH)), (New-Object System.Drawing.Rectangle(0, 0, $brSrcW, $brSrcH)), [System.Drawing.GraphicsUnit]::Pixel)
$gBR.Dispose()

$webBR.Save('d:\Flip Book Invitation\ornament-corner-right.png', [System.Drawing.Imaging.ImageFormat]::Png)

# Mirror for left corner
$webBR.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
$webBR.Save('d:\Flip Book Invitation\ornament-corner-left.png', [System.Drawing.Imaging.ImageFormat]::Png)
$webBR.Dispose()
$cropBR.Dispose()
Write-Host "Created ornament-corner-right.png & left"

# 3. FLORAL DIVIDER (Single Red Hibiscus + Leaves + Gold Filigree lines)
$hibSrcX = 1750
$hibSrcY = 40
$hibSrcW = 680
$hibSrcH = 680
$cropHib = New-Object System.Drawing.Bitmap($hibSrcW, $hibSrcH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cropHib.SetResolution($dpiX, $dpiY)
$g = [System.Drawing.Graphics]::FromImage($cropHib)
$g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $hibSrcW, $hibSrcH)), (New-Object System.Drawing.Rectangle($hibSrcX, $hibSrcY, $hibSrcW, $hibSrcH)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$cropHib = Make-Transparent $cropHib 244 18

# Make divider with center hibiscus and gold wings
$divW = 600
$divH = 60
$divBmp = New-Object System.Drawing.Bitmap($divW, $divH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gD = [System.Drawing.Graphics]::FromImage($divBmp)
$gD.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gD.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$hibSize = 52
$hibX = [int](($divW - $hibSize) / 2)
$hibY = [int](($divH - $hibSize) / 2)
$gD.DrawImage($cropHib, $hibX, $hibY, $hibSize, $hibSize)

# Gold lines
$goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 197, 155, 39), 1)
$gD.DrawLine($goldPen, 40, [int]($divH / 2), ($hibX - 12), [int]($divH / 2))
$gD.DrawLine($goldPen, ($hibX + $hibSize + 12), [int]($divH / 2), ($divW - 40), [int]($divH / 2))
# Add small diamond/dot at line ends
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 197, 155, 39))
$gD.FillEllipse($goldBrush, 36, [int]($divH / 2 - 2), 4, 4)
$gD.FillEllipse($goldBrush, ($divW - 40), [int]($divH / 2 - 2), 4, 4)

$goldPen.Dispose()
$goldBrush.Dispose()
$gD.Dispose()
$cropHib.Dispose()

$divBmp.Save('d:\Flip Book Invitation\ornament-divider.png', [System.Drawing.Imaging.ImageFormat]::Png)
$divBmp.Dispose()
Write-Host "Created ornament-divider.png"

$src.Dispose()
