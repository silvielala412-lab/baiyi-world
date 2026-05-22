# 百邑酒世界 APK · 环境安装指南

> 完成以下步骤后，运行 `build-apk.ps1` 即可生成 APK

---

## 第一步：安装 JDK 17

1. 打开浏览器访问：https://adoptium.net/
2. 点击 **Latest LTS** → 选择 **Windows x64** → 下载 `.msi` 安装包
3. 双击安装，**勾选"Set JAVA_HOME variable"**（很重要！）
4. 安装完成后，打开 PowerShell 验证：
   ```powershell
   java -version
   # 应显示：java version "17.x.x" 或类似
   ```

---

## 第二步：安装 Android Studio

1. 打开浏览器访问：https://developer.android.com/studio
2. 点击 **Download Android Studio** → 下载 `.exe` 安装包（约 1GB）
3. 双击安装，**全部默认选项**，等待安装完成（约 10-15 分钟）
4. 首次启动 Android Studio 时，它会自动下载 Android SDK（约 500MB）
5. 等待 SDK 下载完成后，关闭 Android Studio

---

## 第三步：设置环境变量

打开 PowerShell（**以管理员身份运行**），执行以下命令：

```powershell
# 设置 ANDROID_HOME（如果你的用户名不是 35313，修改路径中的用户名）
[System.Environment]::SetEnvironmentVariable(
    "ANDROID_HOME",
    "C:\Users\35313\AppData\Local\Android\Sdk",
    "Machine"
)

# 把 adb 加到 PATH
$path = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
[System.Environment]::SetEnvironmentVariable(
    "PATH",
    "$path;C:\Users\35313\AppData\Local\Android\Sdk\platform-tools",
    "Machine"
)
```

**关闭并重新打开 PowerShell**，然后验证：
```powershell
echo $env:ANDROID_HOME
# 应输出 SDK 路径

adb version
# 应输出 Android Debug Bridge version ...
```

---

## 第四步：运行构建脚本

```powershell
# 1. 进入 mobile 目录
cd "d:\code\baiyi world\mobile"

# 2. 允许运行脚本（只需执行一次）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. 执行一键构建
.\build-apk.ps1
```

**首次运行约需 10-15 分钟**（需下载 Gradle 和 Android 构建工具），之后每次约 2-3 分钟。

---

## 第五步：安装 APK 到手机

### 方式一：USB 数据线（推荐）
1. 手机开启**开发者选项** → 开启 **USB 调试**
   - 进入手机「设置」→「关于手机」→ 连续点击「版本号」7次
   - 返回「设置」→「开发者选项」→ 开启「USB 调试」
2. 用数据线连接手机和电脑
3. 在 PowerShell 中执行：
   ```powershell
   adb install "d:\code\baiyi world\mobile\android\app\build\outputs\apk\debug\app-debug.apk"
   ```

### 方式二：直接传文件
1. APK 文件位于：
   ```
   d:\code\baiyi world\mobile\android\app\build\outputs\apk\debug\app-debug.apk
   ```
2. 通过微信、QQ 或 U 盘传到手机
3. 在手机上点击 APK 文件安装（需开启「允许安装未知来源应用」）

---

## 常见问题

**Q：构建时提示 "SDK location not found"**
A：确认 `ANDROID_HOME` 环境变量已正确设置，重新打开 PowerShell 再试

**Q：Gradle 下载很慢**
A：属于正常现象，首次约需 5-10 分钟，后续不再重新下载

**Q：手机安装时提示"解析包错误"**
A：手机存储空间不足，或者下载过程中 APK 文件损坏，重新传输再试

**Q：想用 Android Studio 调试界面**
A：执行 `.\build-apk.ps1 -OpenStudio` 会在构建后直接打开 Android Studio
