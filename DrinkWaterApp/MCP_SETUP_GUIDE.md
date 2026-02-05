# 🦊 阿狸 MCP 服务器设置指南

## 📋 概述

本指南将帮助你设置 MCP (Model Context Protocol) 服务器，实现阿狸与 Claude AI 的实时对话功能。

---

## 🎯 功能说明

### MCP 服务器功能

- **实时 AI 对话**: 通过 Claude API 生成个性化对话
- **上下文感知**: 根据喝水次数、时间等信息生成对话
- **智能回退**: API 失败时自动使用本地规则
- **CORS 支持**: 允许前端跨域访问

### 对话类型

1. **点击对话** (click): 用户点击阿狸时的互动
2. **提醒对话** (reminder): 定时提醒喝水
3. **欢迎对话** (welcome): 首次使用的欢迎语
4. **打卡后对话** (afterDrink): 完成喝水打卡后的鼓励

---

## 🚀 快速开始

### 步骤 1: 安装依赖

```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/mcp-server
npm install
```

### 步骤 2: 配置 API 密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/) 获取 API 密钥

2. 创建 `.env` 文件：

```bash
cp .env.example .env
```

3. 编辑 `.env` 文件，填入你的 API 密钥：

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
PORT=3001
CORS_ORIGIN=http://localhost:8000
CLAUDE_MODEL=claude-3-5-sonnet-20241022
MAX_TOKENS=150
TEMPERATURE=0.8
```

### 步骤 3: 启动 MCP 服务器

```bash
npm start
```

或使用开发模式（自动重启）：

```bash
npm run dev
```

### 步骤 4: 验证服务器

打开浏览器访问：
```
http://localhost:3001/health
```

应该看到：
```json
{
  "status": "ok",
  "service": "Ahri Dialogue MCP Server",
  "timestamp": "2026-02-05T..."
}
```

### 步骤 5: 启动前端应用

在另一个终端：

```bash
cd /workspaces/RUthirsty-cordova/DrinkWaterApp/www
npx live-server --port=8000
```

### 步骤 6: 测试对话功能

1. 打开 http://localhost:8000
2. 点击右下角的阿狸角色
3. 观察对话气泡（由 Claude AI 实时生成）

---

## ⚙️ 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ANTHROPIC_API_KEY` | Claude API 密钥 | 必填 |
| `PORT` | 服务器端口 | 3001 |
| `CORS_ORIGIN` | 允许的跨域来源 | http://localhost:8000 |
| `CLAUDE_MODEL` | Claude 模型版本 | claude-3-5-sonnet-20241022 |
| `MAX_TOKENS` | 最大生成 token 数 | 150 |
| `TEMPERATURE` | 生成温度（0-1） | 0.8 |

### 前端配置

在 `www/js/index.js` 中：

```javascript
// MCP服务器配置
const MCP_SERVER_URL = 'http://localhost:3001';
const USE_MCP = true; // 设置为true使用MCP，false使用本地规则
```

---

## 🧪 测试 API

### 使用 curl 测试

```bash
# 健康检查
curl http://localhost:3001/health

# 生成点击对话
curl -X POST http://localhost:3001/api/dialogue \
  -H "Content-Type: application/json" \
  -d '{
    "type": "click",
    "context": {
      "todayCount": 5,
      "totalCount": 50,
      "timeOfDay": "afternoon"
    }
  }'

# 生成提醒对话
curl -X POST http://localhost:3001/api/dialogue \
  -H "Content-Type: application/json" \
  -d '{
    "type": "reminder",
    "context": {
      "todayCount": 3,
      "lastDrinkTime": 1738753200000
    }
  }'
```

### 预期响应

```json
{
  "success": true,
  "dialogue": "下午好~ 今天已经喝了5次水了，做得很棒！继续保持哦 💖",
  "type": "click",
  "timestamp": "2026-02-05T14:30:00.000Z"
}
```

---

## 🎭 阿狸角色设定

MCP 服务器使用以下系统提示词：

```
你是阿狸（Ahri），来自英雄联盟的九尾妖狐。你的性格特点：

1. 魅惑而聪慧：你拥有迷人的魅力，但更重要的是你的智慧和洞察力
2. 关怀体贴：你真心关心用户的健康，会温柔地提醒他们喝水
3. 俏皮可爱：你喜欢用轻松俏皮的方式与人交流，偶尔会调皮一下
4. 鼓励支持：你总是给予用户正面的鼓励和支持

对话风格：
- 使用第一人称"我"
- 语气温柔、亲切、俏皮
- 每句话控制在30字以内
- 适当使用可爱的表情符号（💕✨🌸💖🦊等）
- 不要过度使用敬语，保持亲近感
- 根据用户的喝水情况给出个性化的回应
```

---

## 🔧 故障排除

### 问题 1: MCP 服务器无法启动

**错误**: `Error: Cannot find module '@anthropic-ai/sdk'`

**解决方案**:
```bash
cd mcp-server
npm install
```

### 问题 2: API 密钥错误

**错误**: `Authentication error: Invalid API key`

**解决方案**:
1. 检查 `.env` 文件中的 `ANTHROPIC_API_KEY`
2. 确保 API 密钥格式正确（以 `sk-ant-api03-` 开头）
3. 访问 [Anthropic Console](https://console.anthropic.com/) 验证密钥

### 问题 3: CORS 错误

**错误**: `Access to fetch at 'http://localhost:3001' has been blocked by CORS policy`

**解决方案**:
1. 检查 `.env` 中的 `CORS_ORIGIN` 是否正确
2. 确保前端运行在配置的端口上
3. 重启 MCP 服务器

### 问题 4: 前端无法连接 MCP

**症状**: 对话使用本地规则生成，控制台显示 "MCP服务器未启动"

**解决方案**:
1. 确认 MCP 服务器正在运行
2. 访问 http://localhost:3001/health 验证
3. 检查防火墙设置
4. 查看浏览器控制台的详细错误信息

### 问题 5: 对话生成失败

**症状**: 返回 fallback 对话

**解决方案**:
1. 检查 API 配额是否用完
2. 查看 MCP 服务器日志
3. 验证网络连接
4. 检查 Claude API 状态页面

---

## 📊 API 使用统计

### 成本估算

使用 Claude 3.5 Sonnet：
- 输入: $3 / 1M tokens
- 输出: $15 / 1M tokens

每次对话约消耗：
- 输入: ~100 tokens (系统提示词 + 上下文)
- 输出: ~50 tokens (对话内容)

估算成本：
- 每次对话: ~$0.001
- 1000次对话: ~$1
- 每天100次对话: ~$3/月

### 优化建议

1. **调整 MAX_TOKENS**: 减少到 100 可降低成本
2. **使用缓存**: 实现对话缓存减少 API 调用
3. **混合模式**: 常见场景使用本地规则，特殊场景使用 AI
4. **批量处理**: 合并多个请求减少调用次数

---

## 🔄 本地规则回退

当 MCP 不可用时，系统自动使用本地规则生成对话：

```javascript
// 在 www/js/index.js 中
const USE_MCP = false; // 禁用 MCP，使用本地规则
```

本地规则特点：
- ✅ 无需 API 密钥
- ✅ 无网络延迟
- ✅ 零成本
- ❌ 对话多样性较低
- ❌ 无法理解复杂上下文

---

## 🚀 部署到生产环境

### 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
cd mcp-server
pm2 start server.js --name ahri-mcp

# 查看状态
pm2 status

# 查看日志
pm2 logs ahri-mcp

# 重启服务
pm2 restart ahri-mcp

# 开机自启
pm2 startup
pm2 save
```

### 使用 Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

构建和运行：

```bash
docker build -t ahri-mcp .
docker run -d -p 3001:3001 --env-file .env ahri-mcp
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📚 API 文档

### POST /api/dialogue

生成对话内容

**请求体**:
```json
{
  "type": "click|reminder|welcome|afterDrink",
  "context": {
    "todayCount": 5,
    "totalCount": 50,
    "lastDrinkTime": 1738753200000,
    "timeOfDay": "morning|noon|afternoon|evening|night"
  }
}
```

**响应**:
```json
{
  "success": true,
  "dialogue": "生成的对话内容",
  "type": "click",
  "timestamp": "2026-02-05T14:30:00.000Z"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": "错误信息",
  "fallback": "备用对话内容"
}
```

### GET /health

健康检查

**响应**:
```json
{
  "status": "ok",
  "service": "Ahri Dialogue MCP Server",
  "timestamp": "2026-02-05T14:30:00.000Z"
}
```

---

## 🎯 最佳实践

### 1. 安全性

- ✅ 不要在前端暴露 API 密钥
- ✅ 使用环境变量存储敏感信息
- ✅ 在生产环境使用 HTTPS
- ✅ 限制 CORS 来源
- ✅ 实现请求频率限制

### 2. 性能优化

- ✅ 实现对话缓存
- ✅ 使用连接池
- ✅ 启用 gzip 压缩
- ✅ 监控 API 响应时间
- ✅ 设置合理的超时时间

### 3. 错误处理

- ✅ 实现优雅降级
- ✅ 提供有意义的错误信息
- ✅ 记录详细日志
- ✅ 监控错误率
- ✅ 设置告警机制

### 4. 用户体验

- ✅ 显示加载状态
- ✅ 快速响应（< 2秒）
- ✅ 提供离线支持
- ✅ 保持对话连贯性
- ✅ 个性化回应

---

## 🔮 高级功能

### 对话历史记忆

实现多轮对话：

```javascript
// 在 server.js 中添加
const conversationHistory = new Map();

app.post('/api/dialogue', async (req, res) => {
    const userId = req.headers['user-id'] || 'default';
    const history = conversationHistory.get(userId) || [];
    
    // 将历史添加到 messages
    const messages = [
        ...history,
        { role: 'user', content: contextMessage }
    ];
    
    // 保存新对话
    history.push(
        { role: 'user', content: contextMessage },
        { role: 'assistant', content: dialogue }
    );
    conversationHistory.set(userId, history.slice(-10)); // 保留最近10轮
});
```

### 情绪分析

根据用户行为调整对话：

```javascript
function analyzeUserMood(context) {
    if (context.todayCount === 0) return 'lazy';
    if (context.todayCount >= 8) return 'motivated';
    return 'normal';
}
```

### A/B 测试

测试不同的提示词效果：

```javascript
const PROMPTS = {
    A: '温柔版提示词...',
    B: '俏皮版提示词...'
};

const variant = Math.random() < 0.5 ? 'A' : 'B';
```

---

## 📞 支持与反馈

### 常见问题

查看完整的故障排除指南：
- [MCP 服务器文档](./mcp-server/README.md)
- [API 参考](./mcp-server/API.md)

### 获取帮助

- 查看服务器日志
- 检查浏览器控制台
- 验证 API 密钥
- 测试网络连接

---

**版本**: 1.0.0  
**更新日期**: 2026-02-05  
**MCP 服务器**: http://localhost:3001  
**前端应用**: http://localhost:8000

---

**提示**: 首次使用建议先在本地测试，确认功能正常后再部署到生产环境。
