Add-Type -AssemblyName System.Drawing

$srcPath = 'd:\Flip Book Invitation\Brown and Beige Vintage Floral Page Border Flyer.png'
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$w = 1200
$h = 1700
$res = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($res)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear([System.Drawing.Color]::FromArgb(254, 252, 247)) # warm ivory

# 1. Top Floral Garland
# In original (2475x3500), the top garland is in y: 0..1050
$topH = 260
$srcTopRect = New-Object System.Drawing.Rectangle(0, 0, [int]$src.Width, 1050)
$destTopRect = New-Object System.Drawing.Rectangle(0, 0, [int]$w, [int]$topH)
$g.DrawImage($src, $destTopRect, $srcTopRect, [System.Drawing.GraphicsUnit]::Pixel)

# 2. Bottom Right Floral Cluster (Bird of Paradise + purple + red flowers)
# In original: x: 1550..2475, y: 2200..3500
$srcBrX = 1550
$srcBrY = 2200
$srcBrW = [int]($src.Width - $srcBrX)
$srcBrH = [int]($src.Height - $srcBrY)

$brCrop = New-Object System.Drawing.Bitmap($srcBrW, $srcBrH)
$gBR = [System.Drawing.Graphics]::FromImage($brCrop)
$gBR.DrawImage($src, 0, 0, (New-Object System.Drawing.Rectangle($srcBrX, $srcBrY, $srcBrW, $srcBrH)), [System.Drawing.GraphicsUnit]::Pixel)
$gBR.Dispose()

# Scale to draw in bottom right
$botTargetH = 310
$botTargetW = [int]($botTargetH * ($srcBrW / $srcBrH))
$destBrX = [int]($w - $botTargetW)
$destBrY = [int]($h - $botTargetH)
$g.DrawImage($brCrop, $destBrX, $destBrY, $botTargetW, $botTargetH)

# Mirror to draw in bottom left
$brCrop.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
$g.DrawImage($brCrop, 0, $destBrY, $botTargetW, $botTargetH)
$brCrop.Dispose()

# 3. Soft gradient fade towards the center text area so text is 100% readable
$fadeH = 80
$topFadeRect = New-Object System.Drawing.Rectangle(0, [int]($topH - 30), [int]$w, [int]$fadeH)
$topFadeBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($topFadeRect, [System.Drawing.Color]::FromArgb(0, 254, 252, 247), [System.Drawing.Color]::FromArgb(255, 254, 252, 247), [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($topFadeBrush, $topFadeRect)
$topFadeBrush.Dispose()

# Fill the center reading area with solid warm ivory
$midTop = [int]($topH + $fadeH - 30)
$midBottom = [int]($destBrY + 20)
$midH = [int]($midBottom - $midTop)
$midBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 252, 247))
$g.FillRectangle($midBrush, 0, $midTop, [int]$w, [int]$midH)
$midBrush.Dispose()

# Soft fade above bottom flowers
$botFadeRect = New-Object System.Drawing.Rectangle(0, [int]($destBrY + 20), [int]$w, [int]60)
$botFadeBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($botFadeRect, [System.Drawing.Color]::FromArgb(255, 254, 252, 247), [System.Drawing.Color]::FromArgb(0, 254, 252, 247), [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($botFadeBrush, $botFadeRect)
$botFadeBrush.Dispose()

# 4. Gold Elegant Border framing the content area
$goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 197, 155, 39), 1.5)
$innerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 197, 155, 39), 0.8)
$innerPen.DashPattern = @(6, 4)

$margin = 38
$g.DrawRectangle($goldPen, $margin, $margin, [int]($w - 2 * $margin), [int]($h - 2 * $margin))
$g.DrawRectangle($innerPen, [int]($margin + 6), [int]($margin + 6), [int]($w - 2 * ($margin + 6)), [int]($h - 2 * ($margin + 6)))

$goldPen.Dispose()
$innerPen.Dispose()

$outPath = 'd:\Flip Book Invitation\theme-inner-page.jpg'
$res.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$res.Dispose()

Write-Host "Created $outPath successfully!"

# Also create a transparent floral divider for text sections (e.g. between Groom & Bride)
# Crop the small hibiscus & leaves or flowers:
$divW = 800
$divH = 120
$divBmp = New-Object System.Drawing.Bitmap($divW, $divH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gDiv = [System.Drawing.Graphics]::FromImage($divBmp)
$gDiv.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gDiv.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gDiv.Clear([System.Drawing.Color]::Transparent)

# Draw central botanical element from top:
# In original: x: 1000..1500, y: 150..400
$divSrcRect = New-Object System.Drawing.Rectangle(1050, 200, 450, 260)
$divDestRect = New-Object System.Drawing.Rectangle([int](($divW - 200)/2), 10, 200, 100)
$gDiv.DrawImage($src, $divDestRect, $divSrcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Draw gold accent lines to left and right
$divPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 197, 155, 39), 1)
$gDiv.DrawLine($divPen, 40, 60, [int](($divW - 220)/2), 60)
$gDiv.DrawLine($divPen, [int](($divW + 220)/2), 60, [int]($divW - 40), 60)
$divPen.Dispose()

$divPath = 'd:\Flip Book Invitation\floral-divider.png'
$divBmp.Save($divPath, [System.Drawing.Imaging.ImageFormat]::Png)
$gDiv.Dispose()
$divBmp.Dispose()

Write-Host "Created $divPath successfully!"
$src.Dispose()
