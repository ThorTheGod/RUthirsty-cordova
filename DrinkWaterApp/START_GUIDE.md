# 🚀 快速启动指南

## 📋 两种运行模式

### 模式 1: 本地规则模式（推荐新手）

**优点**: 无需配置，立即可用，零成本
**缺点**: 对话多样性较低

**启动步骤**:

```bash
# 1. 进入项目目录
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/www

# 2. 启动前端（如果还没启动）
npx live-server --port=8000 --no-browser

# 3. 打开浏览器
# 访问 http://localhost:8000
```

**配置**: 无需配置，默认使用本地规则

---

### 模式 2: MCP + Claude AI 模式（推荐进阶）

**优点**: 真实 AI 对话，高度个性化，每次都不同
**缺点**: 需要 API 密钥，有少量成本（~$0.001/次）

**启动步骤**:

```bash
# 1. 安装 MCP 服务器依赖
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/mcp-server
npm install

# 2. 配置 API 密钥
cp .env.example .env
# 编辑 .env 文件，填入你的 ANTHROPIC_API_KEY

# 3. 启动 MCP 服务器
npm start

# 4. 新开终端，启动前端
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/www
npx live-server --port=8000 --no-browser

# 5. 打开浏览器
# 访问 http://localhost:8000
```

**配置**: 在 `www/js/index.js` 中设置 `const USE_MCP = true;`

---

## 🔑 获取 API 密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账号
3. 创建 API 密钥
4. 复制密钥（格式: `sk-ant-api03-xxxxx`）
5. 粘贴到 `mcp-server/.env` 文件中

---

## ✅ 验证安装

### 检查前端

访问: http://localhost:8000
- 应该看到喝水打卡应用
- 背景是阿狸主题
- 右下角有阿狸角色

### 检查 MCP 服务器（如果使用）

访问: http://localhost:3001/health
- 应该看到: `{"status":"ok","service":"Ahri Dialogue MCP Server",...}`

### 测试对话功能

1. 点击右下角的阿狸角色
2. 观察对话气泡
   - MCP 模式: 显示"思考中..."然后显示 AI 生成的对话
   - 本地模式: 立即显示本地规则生成的对话

---

## 🎯 功能测试清单

- [ ] 喝水打卡功能
- [ ] 今日次数统计
- [ ] 总计次数统计
- [ ] 记录列表显示
- [ ] 删除单条记录
- [ ] 清空所有记录
- [ ] 点击阿狸显示对话
- [ ] 完成打卡后显示鼓励
- [ ] 定时提醒功能
- [ ] 设置面板调整间隔

---

## 🔧 常见问题

### Q: 点击阿狸没有反应？
A: 检查浏览器控制台是否有错误，刷新页面重试

### Q: MCP 服务器无法启动？
A: 
1. 确认已运行 `npm install`
2. 检查 Node.js 版本（需要 v18+）
3. 查看错误日志

### Q: 对话一直显示"思考中..."？
A:
1. 检查 MCP 服务器是否运行
2. 访问 http://localhost:3001/health 验证
3. 查看浏览器控制台错误
4. 如果 MCP 不可用，设置 `USE_MCP = false`

### Q: API 密钥错误？
A:
1. 确认密钥格式正确（以 `sk-ant-api03-` 开头）
2. 检查 `.env` 文件中的配置
3. 重启 MCP 服务器

---

## 📚 更多文档

- [MCP 完整设置指南](./MCP_SETUP_GUIDE.md)
- [AI 系统说明](./AHRI_AI_SYSTEM.md)
- [功能说明文档](./REMINDER_FEATURE.md)
- [用户使用指南](./USER_GUIDE.md)

---

## 🎉 开始使用

选择你的模式，按照上面的步骤启动，然后打开浏览器体验吧！

**推荐**: 先使用本地规则模式熟悉功能，再升级到 MCP 模式体验 AI 对话。
