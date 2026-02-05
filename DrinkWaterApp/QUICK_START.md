# 🚀 快速开始指南

## 📱 阿狸喝水打卡应用

一个带有 AI 对话功能的喝水打卡应用，使用英雄联盟阿狸作为助手角色。

---

## ⚡ 5分钟快速启动

### 方式 1: 浏览器模式（推荐新手）

```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/www
npx live-server --port=8000
```

然后访问：http://localhost:8000

**功能完整度**: 95%（除原生插件外所有功能可用）

---

### 方式 2: 带 AI 对话的完整体验

**终端 1 - 启动 MCP 服务器:**
```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/mcp-server
# 首次使用需要配置 API 密钥
cp .env.example .env
# 编辑 .env 填入 ANTHROPIC_API_KEY
npm install
npm start
```

**终端 2 - 启动前端:**
```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/www
npx live-server --port=8000
```

**功能完整度**: 100%（包含真实 AI 对话）

---

### 方式 3: 一键启动脚本

```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp
./start-all.sh
```

按提示选择模式（本地规则或 MCP AI）

---

## 📦 构建 Android APK

### 选项 A: GitHub Actions（推荐）

1. 提交代码到 GitHub
2. 访问仓库的 Actions 标签
3. 等待自动构建完成
4. 下载 APK 文件

详见：`BUILD_APK_GUIDE.md`

### 选项 B: 本地构建

需要先安装 Android SDK（详见 `ANDROID_SDK_SETUP_GUIDE.md`）

```bash
bash cordova-apk-builder/scripts/build_apk.sh --debug
```

---

## 🎯 核心功能

- ✅ **喝水打卡** - 一键记录喝水
- ✅ **统计显示** - 今日/总计次数
- ✅ **记录管理** - 查看/删除历史记录
- ✅ **阿狸助手** - 可爱的九尾妖狐角色
- ✅ **AI 对话** - 真实 AI 生成个性化对话（需 MCP）
- ✅ **定时提醒** - 自动提醒喝水
- ✅ **设置面板** - 自定义提醒间隔
- ✅ **毛玻璃 UI** - 精美的视觉设计
- ✅ **阿狸背景** - 英雄联盟主题

---

## 📚 完整文档

| 文档 | 说明 |
|------|------|
| `START_GUIDE.md` | 详细启动指南 |
| `BUILD_APK_GUIDE.md` | APK 构建完整指南 |
| `MCP_SETUP_GUIDE.md` | MCP 服务器设置 |
| `AHRI_AI_SYSTEM.md` | AI 对话系统说明 |
| `USER_GUIDE.md` | 用户使用手册 |
| `ANDROID_SDK_SETUP_GUIDE.md` | Android SDK 安装 |

---

## 🔧 常见问题

### Q: 看不到历史记录？
A: 访问 http://localhost:8000/debug.html 调试

### Q: 如何构建 APK？
A: 查看 `BUILD_APK_GUIDE.md`，推荐使用 GitHub Actions

### Q: MCP 是什么？
A: Model Context Protocol，用于接入 Claude AI 生成对话

### Q: 不用 MCP 可以吗？
A: 可以！应用会自动使用本地规则生成对话

---

## 💡 推荐工作流

1. **开发阶段**: 使用浏览器模式快速迭代
2. **测试 AI**: 配置 MCP 体验真实 AI 对话
3. **构建 APK**: 使用 GitHub Actions 自动构建
4. **发布应用**: 签名 Release APK 后发布

---

## 🎉 立即开始

```bash
# 最简单的方式
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/www
npx live-server --port=8000
```

打开浏览器访问 http://localhost:8000，开始使用！

---

**项目**: 阿狸喝水打卡应用  
**版本**: 2.0.0  
**更新**: 2026-02-05
