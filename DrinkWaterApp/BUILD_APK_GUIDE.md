# 📦 安卓 APK 打包完整指南

## 🎯 概述

本指南提供三种方式来构建安卓 APK：
1. **本地构建** - 需要安装 Android SDK
2. **GitHub Actions** - 自动化云端构建
3. **浏览器模式** - 继续在浏览器中开发测试

---

## 方式 1: 本地构建（推荐用于发布）

### 前提条件

需要安装以下工具：
- ✅ Node.js (已安装)
- ✅ Cordova CLI (已安装)
- ❌ Java JDK 11+ (需要安装)
- ❌ Android SDK (需要安装)
- ❌ Gradle (可选，Cordova 会自动使用)

### 步骤 1: 安装 Android SDK

详细安装指南请查看：
```bash
cat ANDROID_SDK_SETUP_GUIDE.md
```

或访问：https://developer.android.com/studio

### 步骤 2: 配置环境变量

**Linux/macOS:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**Windows:**
```powershell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

### 步骤 3: 检查环境

```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp
bash cordova-apk-builder/scripts/check_environment.sh
```

### 步骤 4: 构建 APK

**Debug 版本（用于测试）:**
```bash
bash cordova-apk-builder/scripts/build_apk.sh --debug
```

**Release 版本（用于发布）:**
```bash
bash cordova-apk-builder/scripts/build_apk.sh --release
```

**清理后构建:**
```bash
bash cordova-apk-builder/scripts/build_apk.sh --debug --clean
```

### 步骤 5: 查找 APK

**Debug APK:**
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK:**
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 步骤 6: 安装到设备

```bash
# 通过 ADB 安装
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk

# 或手动传输到设备安装
```

---

## 方式 2: GitHub Actions 自动构建（推荐用于 CI/CD）

### 优点
- ✅ 无需本地安装 Android SDK
- ✅ 自动化构建
- ✅ 每次提交自动生成 APK
- ✅ 可下载构建产物

### 步骤 1: 创建 GitHub Actions 工作流

创建文件 `.github/workflows/build-apk.yml`:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    
    - name: Install dependencies
      run: |
        cd DrinkWaterApp
        npm install
        npm install -g cordova
    
    - name: Add Android platform
      run: |
        cd DrinkWaterApp
        cordova platform add android
    
    - name: Build Debug APK
      run: |
        cd DrinkWaterApp
        cordova build android --debug
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: DrinkWaterApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 步骤 2: 提交到 GitHub

```bash
git add .github/workflows/build-apk.yml
git commit -m "Add GitHub Actions workflow for APK build"
git push
```

### 步骤 3: 下载 APK

1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择最新的工作流运行
4. 在 "Artifacts" 部分下载 APK

---

## 方式 3: 浏览器模式（开发测试）

### 优点
- ✅ 无需 Android SDK
- ✅ 快速迭代开发
- ✅ 实时预览
- ✅ 调试方便

### 使用方法

```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/www
npx live-server --port=8000
```

访问：http://localhost:8000

### 功能测试

在浏览器中可以测试：
- ✅ UI 界面
- ✅ 喝水打卡功能
- ✅ 记录管理
- ✅ 阿狸对话系统
- ✅ 定时提醒
- ✅ 设置面板
- ❌ Cordova 插件功能（需要真机）

---

## 🔧 故障排除

### 问题 1: ANDROID_HOME 未设置

**错误信息:**
```
Failed to find 'ANDROID_HOME' environment variable
```

**解决方案:**
1. 安装 Android SDK
2. 设置环境变量
3. 重启终端
4. 重新运行构建命令

详细指南：`cat ANDROID_SDK_SETUP_GUIDE.md`

### 问题 2: Java 版本不兼容

**错误信息:**
```
Unsupported Java version
```

**解决方案:**
```bash
# 安装 Java 17
sudo apt install openjdk-17-jdk

# 设置 JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### 问题 3: Gradle 构建失败

**错误信息:**
```
Gradle build failed
```

**解决方案:**
```bash
# 清理并重新构建
cordova clean android
cordova build android

# 或使用 skill 脚本
bash cordova-apk-builder/scripts/build_apk.sh --debug --clean
```

### 问题 4: 许可证未接受

**错误信息:**
```
You have not accepted the license agreements
```

**解决方案:**
```bash
# 接受所有许可证
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
```

### 问题 5: 在 Codespaces 中构建失败

**原因:** Codespaces 默认不包含 Android SDK

**解决方案:**
- 使用 GitHub Actions（推荐）
- 或在本地机器上构建
- 或继续使用浏览器模式开发

---

## 📊 构建类型对比

| 特性 | Debug | Release |
|------|-------|---------|
| 签名 | 自动（debug key） | 需要手动签名 |
| 文件大小 | 较大 | 较小（优化） |
| 调试符号 | 包含 | 不包含 |
| 安装 | 可直接安装 | 需签名后安装 |
| 用途 | 开发测试 | 正式发布 |
| 性能 | 较慢 | 优化后更快 |

---

## 🎯 推荐工作流

### 开发阶段
1. 使用浏览器模式快速开发
2. 定期在真机测试（Debug APK）
3. 使用 GitHub Actions 自动构建

### 发布阶段
1. 本地构建 Release APK
2. 签名 APK
3. 测试签名后的 APK
4. 上传到应用商店

---

## 📚 相关文档

- **Android SDK 安装**: `ANDROID_SDK_SETUP_GUIDE.md`
- **APK 签名指南**: `cordova-apk-builder/references/signing_guide.md`
- **故障排除**: `cordova-apk-builder/references/troubleshooting.md`
- **Skill 文档**: `cordova-apk-builder/SKILL.md`

---

## 🚀 快速命令参考

```bash
# 检查环境
bash cordova-apk-builder/scripts/check_environment.sh

# 构建 Debug APK
bash cordova-apk-builder/scripts/build_apk.sh --debug

# 构建 Release APK
bash cordova-apk-builder/scripts/build_apk.sh --release

# 清理构建
bash cordova-apk-builder/scripts/build_apk.sh --debug --clean

# 诊断错误
bash cordova-apk-builder/scripts/diagnose_errors.sh build_error.log

# 安装到设备
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk

# 浏览器模式
cd www && npx live-server --port=8000
```

---

## 💡 提示

1. **首次构建**: 推荐使用 GitHub Actions，无需本地配置
2. **频繁构建**: 安装本地 Android SDK，构建更快
3. **快速开发**: 使用浏览器模式，实时预览
4. **发布应用**: 必须使用 Release APK 并签名

---

**版本**: 1.0.0  
**更新日期**: 2026-02-05  
**项目**: 阿狸喝水打卡应用
