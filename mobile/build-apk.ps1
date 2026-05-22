# ================================================================
#  百邑酒世界 · 一键生成 Android APK 脚本
#  使用前提：已安装 JDK 17 + Android Studio（含 Android SDK）
#  运行方式：在 PowerShell 中 cd 到此文件所在目录后执行
#            .\build-apk.ps1
# ================================================================

param(
    [switch]$SkipBuild,   # 加 -SkipBuild 跳过 Next.js 构建，直接用上次的 www
    [switch]$OpenStudio   # 加 -OpenStudio 构建完后打开 Android Studio
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$FrontendDir = Join-Path (Split-Path -Parent $Root) "frontend"
$MobileDir   = $Root
$WwwDir      = Join-Path $MobileDir "www"
$AndroidDir  = Join-Path $MobileDir "android"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  百邑酒世界 · Android APK 构建工具" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ── 环境检测 ──────────────────────────────────────────────────
function Check-Command($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        Write-Host "❌ 未找到 '$name'，请先安装并配置环境变量" -ForegroundColor Red
        return $false
    }
    return $true
}

Write-Host "🔍 检测环境..." -ForegroundColor Yellow
$ok = $true
if (-not (Check-Command "java"))  { $ok = $false; Write-Host "   → 请下载安装 JDK 17: https://adoptium.net/" }
if (-not (Check-Command "node"))  { $ok = $false; Write-Host "   → 请下载安装 Node.js 18+: https://nodejs.org/" }
if (-not $env:ANDROID_HOME -and -not $env:ANDROID_SDK_ROOT) {
    Write-Host "❌ 未找到 ANDROID_HOME 环境变量" -ForegroundColor Red
    Write-Host "   → 安装 Android Studio 后，设置 ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk"
    $ok = $false
}
if (-not $ok) {
    Write-Host ""
    Write-Host "请安装缺失依赖后重新运行此脚本。" -ForegroundColor Red
    Write-Host "详细安装步骤请查看 INSTALL_GUIDE.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Java:  $(java -version 2>&1 | Select-String 'version')" -ForegroundColor Green
Write-Host "✅ Node:  $(node --version)" -ForegroundColor Green
Write-Host "✅ ANDROID_HOME: $($env:ANDROID_HOME ?? $env:ANDROID_SDK_ROOT)" -ForegroundColor Green
Write-Host ""

# ── Step 1: 构建 Next.js 静态导出 ────────────────────────────
if (-not $SkipBuild) {
    Write-Host "📦 Step 1/4  构建 Next.js 静态文件（mock 模式）..." -ForegroundColor Yellow

    # 安装 cross-env（如未安装）
    Push-Location $FrontendDir
    if (-not (Test-Path "node_modules")) {
        Write-Host "   → 安装前端依赖..."
        npm install --silent
    }

    # 用 mobile 配置构建静态输出
    $env:NEXT_CONFIG_FILE = "next.config.mobile.mjs"

    # 备份原 next.config.mjs，临时替换为 mobile 版本
    Copy-Item "next.config.mjs" "next.config.mjs.bak" -Force
    Copy-Item "next.config.mobile.mjs" "next.config.mjs" -Force

    try {
        Write-Host "   → 开始 Next.js 导出构建（约需 1-3 分钟）..."
        npm run build 2>&1 | ForEach-Object { Write-Host "   $_" }
        if ($LASTEXITCODE -ne 0) { throw "Next.js 构建失败" }
        Write-Host "✅ Next.js 静态导出完成 → frontend/out/" -ForegroundColor Green
    } finally {
        # 恢复原配置
        Copy-Item "next.config.mjs.bak" "next.config.mjs" -Force
        Remove-Item "next.config.mjs.bak" -Force
        $env:NEXT_CONFIG_FILE = ""
    }
    Pop-Location

    # ── Step 2: 复制到 www ────────────────────────────────────
    Write-Host ""
    Write-Host "📂 Step 2/4  复制静态文件到 mobile/www/..." -ForegroundColor Yellow
    $OutDir = Join-Path $FrontendDir "out"
    if (-not (Test-Path $OutDir)) {
        Write-Host "❌ 未找到 frontend/out 目录，构建可能失败" -ForegroundColor Red
        exit 1
    }
    if (Test-Path $WwwDir) { Remove-Item $WwwDir -Recurse -Force }
    Copy-Item $OutDir $WwwDir -Recurse
    Write-Host "✅ 文件已复制到 mobile/www/" -ForegroundColor Green
} else {
    Write-Host "⏭  跳过 Next.js 构建（使用现有 www/ 目录）" -ForegroundColor DarkYellow
    if (-not (Test-Path $WwwDir)) {
        Write-Host "❌ mobile/www 不存在，请先不加 -SkipBuild 运行一次" -ForegroundColor Red
        exit 1
    }
}

# ── Step 3: Capacitor 安装 & 同步 ────────────────────────────
Write-Host ""
Write-Host "📱 Step 3/4  安装 Capacitor 并同步 Android 平台..." -ForegroundColor Yellow
Push-Location $MobileDir

if (-not (Test-Path "node_modules")) {
    Write-Host "   → 安装 Capacitor 依赖..."
    npm install --silent
}

# 初次运行：添加 Android 平台
if (-not (Test-Path $AndroidDir)) {
    Write-Host "   → 添加 Android 平台（首次运行，约 2 分钟）..."
    npx cap add android 2>&1 | ForEach-Object { Write-Host "   $_" }
}

# 同步 web 资产到 Android 工程
Write-Host "   → 同步资产..."
npx cap sync android 2>&1 | ForEach-Object { Write-Host "   $_" }
Write-Host "✅ Capacitor 同步完成" -ForegroundColor Green

# ── Step 4: Gradle 构建 APK ───────────────────────────────────
Write-Host ""
Write-Host "🔨 Step 4/4  Gradle 构建 APK（约 3-5 分钟）..." -ForegroundColor Yellow
Push-Location $AndroidDir
.\gradlew.bat assembleDebug 2>&1 | ForEach-Object { Write-Host "   $_" }
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ APK 构建失败，请查看上方错误信息" -ForegroundColor Red
    Pop-Location; Pop-Location
    exit 1
}
Pop-Location
Pop-Location

# ── 完成 ─────────────────────────────────────────────────────
$ApkPath = Join-Path $AndroidDir "app\build\outputs\apk\debug\app-debug.apk"
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  🎉 APK 构建成功！" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  📍 APK 路径：" -ForegroundColor Cyan
Write-Host "     $ApkPath" -ForegroundColor White
Write-Host ""
Write-Host "  📲 安装到手机：" -ForegroundColor Cyan
Write-Host "     1. 用数据线连接手机，开启 USB 调试" -ForegroundColor White
Write-Host "     2. adb install ""$ApkPath""" -ForegroundColor White
Write-Host "     或：直接把 APK 文件传到手机安装" -ForegroundColor White
Write-Host ""

# 打开文件夹方便用户找到 APK
$ApkFolder = Split-Path -Parent $ApkPath
if (Test-Path $ApkPath) {
    Start-Process explorer.exe $ApkFolder
}

if ($OpenStudio) {
    Write-Host "   → 正在打开 Android Studio..." -ForegroundColor Yellow
    npx cap open android
}
