param (
    [Parameter(Mandatory=$true)]
    [string]$ImagePath
)

function Set-Wallpaper {
    param (
        [string]$ImagePath
    )
    
    if (-not (Test-Path $ImagePath)) {
        Write-Error "Wallpaper image not found at: $ImagePath"
        return
    }

    Add-Type -TypeDefinition @"
    using System;
    using System.Runtime.InteropServices;
    public class Wallpaper {
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
    }
"@

    # Set desktop wallpaper
    [Wallpaper]::SystemParametersInfo(0x0014, 0, $ImagePath, 0x01 -bor 0x02)
}

Set-Wallpaper -ImagePath $ImagePath

$regPath = "HKCU:\Control Panel\Desktop"
Set-ItemProperty -Path $regPath -Name "WallPaper" -Value $ImagePath
Set-ItemProperty -Path $regPath -Name "WallpaperStyle" -Value 10
Set-ItemProperty -Path $regPath -Name "TileWallpaper" -Value 0