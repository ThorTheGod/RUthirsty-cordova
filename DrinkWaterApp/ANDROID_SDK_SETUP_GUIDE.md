# 🤖 Android SDK 完整安装指南

## 📋 概述

本指南将帮助你在本地机器上安装和配置 Android SDK，以便构建 Cordova 应用的 APK 文件。

---

## 🖥️ 系统要求

### Windows
- Windows 10/11 (64-bit)
- 至少 8GB RAM
- 至少 10GB 可用磁盘空间

### macOS
- macOS 10.14 (Mojave) 或更高版本
- 至少 8GB RAM
- 至少 10GB 可用磁盘空间

### Linux
- Ubuntu 18.04+ / Debian 10+ / Fedora 30+
- 至少 8GB RAM
- 至少 10GB 可用磁盘空间

---

## 📦 方法 1: 通过 Android Studio 安装（推荐）

这是最简单和最推荐的方法。

### Step 1: 下载 Android Studio

访问官方网站下载：
```
https://developer.android.com/studio
```

**下载链接（2026年2月）：**
- Windows: https://developer.android.com/studio#downloads
- macOS: https://developer.android.com/studio#downloads
- Linux: https://developer.android.com/studio#downloads

### Step 2: 安装 Android Studio

#### Windows
1. 运行下载的 `.exe` 文件
2. 按照安装向导操作
3. 选择 "Standard" 安装类型
4. 等待下载和安装完成（约 10-15 分钟）

#### macOS
1. 打开下载的 `.dmg` 文件
2. 将 Android Studio 拖到 Applications 文件夹
3. 打开 Android Studio
4. 按照设置向导操作
5. 选择 "Standard" 安装类型

#### Linux
```bash
# 解压下载的文件
tar -xzf android-studio-*.tar.gz

# 移动到 /opt 目录
sudo mv android-studio /opt/

# 运行 Android Studio
/opt/android-studio/bin/studio.sh
```

### Step 3: 首次启动配置

1. **启动 Android Studio**
2. **选择安装类型**: 选择 "Standard"
3. **选择主题**: 根据喜好选择（Light/Dark）
4. **验证设置**: 确认以下组件将被安装
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
5. **点击 "Finish"** 开始下载和安装

### Step 4: 安装必需的 SDK 组件

1. **打开 SDK Manager**
   - 点击 Tools → SDK Manager
   - 或点击工具栏的 SDK Manager 图标

2. **SDK Platforms 标签页**
   - 勾选 **Android 13.0 (Tiramisu) - API Level 33**
   - 勾选 **Android 12.0 (S) - API Level 31**（可选，向后兼容）
   - 点击 "Apply" 下载

3. **SDK Tools 标签页**
   - 勾选 **Android SDK Build-Tools 33.0.0**
   - 勾选 **Android SDK Platform-Tools**
   - 勾选 **Android SDK Tools**
   - 勾选 **Android Emulator**（如果需要模拟器）
   - 勾选 **Intel x86 Emulator Accelerator (HAXM)**（Windows/Mac）
   - 点击 "Apply" 下载

4. **接受许可证**
   - 在弹出的对话框中点击 "Accept"
   - 等待下载和安装完成

### Step 5: 配置环境变量

#### Windows

**方法 1: 通过系统设置（推荐）**

1. 右键点击 "此电脑" → "属性"
2. 点击 "高级系统设置"
3. 点击 "环境变量"
4. 在 "系统变量" 部分，点击 "新建"

**添加 ANDROID_HOME:**
```
变量名: ANDROID_HOME
变量值: C:\Users\你的用户名\AppData\Local\Android\Sdk
```

**编辑 Path 变量:**
1. 找到 "Path" 变量，点击 "编辑"
2. 点击 "新建"，添加以下路径：
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

**方法 2: 通过命令行（临时）**

打开 PowerShell 或 CMD：
```powershell
# 设置环境变量（当前会话）
$env:ANDROID_HOME = "C:\Users\你的用户名\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

#### macOS

**编辑 ~/.zshrc 或 ~/.bash_profile:**

```bash
# 打开配置文件
nano ~/.zshrc

# 添加以下内容
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 保存并退出（Ctrl+X, Y, Enter）

# 重新加载配置
source ~/.zshrc
```

#### Linux

**编辑 ~/.bashrc 或 ~/.zshrc:**

```bash
# 打开配置文件
nano ~/.bashrc

# 添加以下内容
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 保存并退出（Ctrl+X, Y, Enter）

# 重新加载配置
source ~/.bashrc
```

### Step 6: 验证安装

打开新的终端窗口，运行以下命令：

```bash
# 检查 ANDROID_HOME
echo $ANDROID_HOME  # macOS/Linux
echo %ANDROID_HOME%  # Windows

# 检查 adb
adb --version

# 检查 SDK 管理器
sdkmanager --list

# 检查已安装的平台
sdkmanager --list | grep "platforms"
```

**预期输出:**
```
ANDROID_HOME: /path/to/Android/Sdk
adb version: 1.0.41
platforms;android-33 | 2 | Android SDK Platform 33
```

### Step 7: 接受 SDK 许可证

这一步很重要，否则构建会失败：

```bash
# 接受所有许可证
sdkmanager --licenses

# 输入 'y' 接受所有许可证
```

---

## 📦 方法 2: 仅安装 SDK（命令行工具）

如果你不想安装完整的 Android Studio，可以只安装命令行工具。

### Step 1: 下载命令行工具

访问：
```
https://developer.android.com/studio#command-tools
```

下载适合你系统的 "Command line tools only"。

### Step 2: 解压和设置

#### Windows
```powershell
# 创建 SDK 目录
mkdir C:\Android\Sdk
cd C:\Android\Sdk

# 解压下载的文件到 cmdline-tools 目录
# 确保结构是: Sdk\cmdline-tools\latest\bin\sdkmanager.bat
```

#### macOS/Linux
```bash
# 创建 SDK 目录
mkdir -p $HOME/Android/Sdk
cd $HOME/Android/Sdk

# 解压下载的文件
unzip ~/Downloads/commandlinetools-*.zip

# 创建正确的目录结构
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
```

### Step 3: 设置环境变量

按照方法 1 的 Step 5 设置 ANDROID_HOME。

### Step 4: 安装必需的包

```bash
# 设置 SDK 管理器路径
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

# 更新 SDK 管理器
sdkmanager --update

# 安装必需的包
sdkmanager "platform-tools"
sdkmanager "platforms;android-33"
sdkmanager "build-tools;33.0.0"

# 接受许可证
sdkmanager --licenses
```

---

## 🔧 安装 Java JDK

Cordova 需要 Java JDK 11 或更高版本。

### 检查是否已安装

```bash
java -version
```

### 如果未安装

#### Windows
1. 下载 OpenJDK: https://adoptium.net/
2. 选择 JDK 17 (LTS)
3. 运行安装程序
4. 确保勾选 "Set JAVA_HOME variable"

#### macOS
```bash
# 使用 Homebrew
brew install openjdk@17

# 设置 JAVA_HOME
echo 'export JAVA_HOME=$(/usr/libexec/java_home)' >> ~/.zshrc
source ~/.zshrc
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# Fedora
sudo dnf install java-17-openjdk-devel

# 设置 JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

---

## ✅ 验证完整环境

运行你的 Cordova 项目中的环境检查脚本：

```bash
cd /path/to/DrinkWaterApp
bash cordova-apk-builder/scripts/check_environment.sh
```

**预期输出（全部绿色 ✓）:**
```
✓ Cordova CLI: 13.0.0
✓ Node.js: v20.x.x
✓ Java JDK: 17.x.x
✓ ANDROID_HOME: /path/to/Android/Sdk
✓ Android SDK Platform-Tools
✓ Android SDK Build-Tools
✓ Gradle: 8.x
```

---

## 🚀 构建你的第一个 APK

环境配置完成后，构建 APK：

```bash
# 进入项目目录
cd /path/to/DrinkWaterApp

# 方法 1: 使用 skill 脚本（推荐）
bash cordova-apk-builder/scripts/build_apk.sh --debug

# 方法 2: 直接使用 Cordova 命令
cordova build android

# 方法 3: 构建 release 版本
bash cordova-apk-builder/scripts/build_apk.sh --release
```

**APK 位置:**
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🐛 常见问题排查

### 问题 1: "ANDROID_HOME not found"

**解决方案:**
```bash
# 检查环境变量
echo $ANDROID_HOME

# 如果为空，重新设置
export ANDROID_HOME=$HOME/Android/Sdk  # macOS/Linux
set ANDROID_HOME=C:\Android\Sdk        # Windows

# 重新加载配置文件
source ~/.bashrc  # 或 ~/.zshrc
```

### 问题 2: "sdkmanager: command not found"

**解决方案:**
```bash
# 添加到 PATH
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

### 问题 3: "License not accepted"

**解决方案:**
```bash
# 接受所有许可证
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

# 输入 'y' 接受所有
```

### 问题 4: "Gradle build failed"

**解决方案:**
```bash
# 清理并重新构建
cordova clean android
cordova build android

# 或使用 skill 脚本
bash cordova-apk-builder/scripts/build_apk.sh --debug --clean
```

### 问题 5: "Java version mismatch"

**解决方案:**
```bash
# 检查 Java 版本
java -version

# 应该是 11 或更高版本
# 如果不是，安装正确的版本并设置 JAVA_HOME
```

### 问题 6: 构建很慢

**解决方案:**
```bash
# 增加 Gradle 内存
echo "org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m" >> platforms/android/gradle.properties

# 启用 Gradle daemon
echo "org.gradle.daemon=true" >> platforms/android/gradle.properties
```

---

## 📱 安装 APK 到设备

### 通过 USB

```bash
# 1. 在手机上启用开发者选项和 USB 调试
# 2. 连接手机到电脑
# 3. 检查设备连接
adb devices

# 4. 安装 APK
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk

# 或使用 Cordova 命令
cordova run android
```

### 手动安装

1. 将 APK 文件传输到手机
2. 在手机上打开文件管理器
3. 点击 APK 文件
4. 允许安装未知来源应用
5. 点击安装

---

## 🎯 快速参考

### 环境变量设置

**Windows (PowerShell):**
```powershell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

**macOS/Linux (Bash/Zsh):**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

### 常用命令

```bash
# 检查环境
bash cordova-apk-builder/scripts/check_environment.sh

# 构建 Debug APK
cordova build android

# 构建 Release APK
cordova build android --release

# 清理构建
cordova clean android

# 运行在设备上
cordova run android

# 查看日志
adb logcat
```

---

## 📚 相关资源

- [Android Studio 官方文档](https://developer.android.com/studio)
- [Cordova Android 平台指南](https://cordova.apache.org/docs/en/latest/guide/platforms/android/)
- [Android SDK 命令行工具](https://developer.android.com/studio/command-line)
- [Gradle 构建工具](https://gradle.org/)

---

## 💡 下一步

安装完成后：

1. ✅ 运行环境检查脚本验证安装
2. ✅ 构建你的第一个 Debug APK
3. ✅ 在真机或模拟器上测试
4. ✅ 查看 `cordova-apk-builder/references/signing_guide.md` 了解如何签名 Release APK

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看 `cordova-apk-builder/references/troubleshooting.md`
2. 运行诊断脚本：`bash cordova-apk-builder/scripts/diagnose_errors.sh build.log`
3. 检查 Cordova 官方文档
4. 向我提问！

---

**祝你构建成功！** 🎉
