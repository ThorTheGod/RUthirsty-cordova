# 喝水打卡应用

一个简单实用的Cordova喝水提醒打卡应用。

## 功能特性

- ✅ 一键打卡喝水
- ✅ 显示今日喝水次数
- ✅ 记录每次喝水的时间
- ✅ 本地存储，数据不丢失
- ✅ 美观的渐变UI设计
- ✅ 支持Android设备

## 项目结构

```
DrinkWaterApp/
├── www/
│   ├── index.html      # 主页面
│   ├── css/
│   │   └── index.css   # 样式文件
│   └── js/
│       └── index.js    # 应用逻辑
├── platforms/
│   └── android/        # Android平台文件
└── config.xml          # Cordova配置文件
```

## 快速测试（浏览器）

在浏览器中测试应用功能：

```bash
# 安装cordova-serve（如果还没安装）
npm install -g cordova-serve

# 启动本地服务器
cordova-serve www

# 然后在浏览器中打开 http://localhost:8000
```

或者直接用任何HTTP服务器：

```bash
cd www
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## 在Android设备上运行

### 前置要求

1. 安装Java JDK 11或更高版本
2. 安装Android Studio和Android SDK
3. 配置环境变量：
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

### 构建APK

```bash
# 构建调试版APK
cordova build android

# 构建发布版APK
cordova build android --release

# APK文件位置：
# platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### 在连接的设备上运行

```bash
# 确保设备已连接并开启USB调试
adb devices

# 运行应用
cordova run android
```

### 在模拟器上运行

```bash
# 列出可用的模拟器
cordova run android --list

# 在模拟器上运行
cordova emulate android
```

## 应用使用说明

1. **打卡喝水**：点击中间的"打卡喝水"按钮
2. **查看次数**：顶部显示今日喝水次数
3. **查看记录**：底部列表显示所有喝水记录，包括时间和日期
4. **数据持久化**：所有记录保存在本地存储中，关闭应用后不会丢失

## 技术栈

- **框架**：Apache Cordova
- **前端**：HTML5 + CSS3 + JavaScript
- **存储**：localStorage
- **平台**：Android

## 自定义配置

编辑 `config.xml` 可以修改：
- 应用名称
- 应用ID
- 版本号
- 图标和启动画面
- 权限设置

## 故障排除

### 构建失败

如果遇到 "ANDROID_HOME not found" 错误：
1. 安装Android Studio
2. 打开SDK Manager安装必要的SDK
3. 设置环境变量

### 应用无法运行

1. 检查设备是否开启USB调试
2. 运行 `adb devices` 确认设备已连接
3. 检查Cordova版本：`cordova --version`

## 开发说明

修改应用代码：
- **界面**：编辑 `www/index.html`
- **样式**：编辑 `www/css/index.css`
- **逻辑**：编辑 `www/js/index.js`

修改后重新构建：
```bash
cordova build android
```

## 许可证

Apache License 2.0
