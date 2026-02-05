# 🔥 热重载开发指南

## 当前状态

✅ **Live-Server 已启动并运行**
- 端口: 8000
- 热重载: 已启用
- 访问: http://localhost:8000

---

## 🛠️ 开发服务器管理工具

我已经为你创建了一个便捷的管理脚本 `dev-server.sh`

### 快速命令

```bash
# 查看服务器状态
./dev-server.sh status

# 启动服务器
./dev-server.sh start

# 停止服务器
./dev-server.sh stop

# 重启服务器
./dev-server.sh restart

# 查看实时日志
./dev-server.sh logs

# 打开浏览器
./dev-server.sh open

# 测试热重载
./dev-server.sh test

# 显示帮助
./dev-server.sh help
```

---

## 🔥 热重载工作原理

当你修改以下文件时，浏览器会**自动刷新**：

- ✅ `www/index.html` - HTML结构
- ✅ `www/css/index.css` - 样式文件
- ✅ `www/js/index.js` - JavaScript逻辑
- ✅ `www/img/*` - 图片资源

**无需手动刷新浏览器！**

---

## 💡 开发工作流

### 1. 启动开发环境

```bash
# 方法1: 使用管理脚本（推荐）
./dev-server.sh start

# 方法2: 手动启动
cd www && npx live-server --port=8000
```

### 2. 打开浏览器

在 GitHub Codespace 中：
1. 点击底部的 **"端口"** 标签
2. 找到端口 **8000**
3. 点击 **"在浏览器中打开"** 🌐

### 3. 开始开发

编辑文件 → 保存 → 浏览器自动刷新 ✨

---

## 🎨 实战示例

### 示例1: 修改背景颜色

**编辑 `www/css/index.css`**

找到第13行：
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

改为：
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

**保存文件** → 浏览器自动刷新，立即看到粉红色渐变！

### 示例2: 修改按钮文字

**编辑 `www/index.html`**

找到第26行：
```html
<span class="button-text">打卡喝水</span>
```

改为：
```html
<span class="button-text">喝水啦！</span>
```

**保存文件** → 按钮文字立即更新！

### 示例3: 添加控制台日志

**编辑 `www/js/index.js`**

在 `handleDrink()` 函数中添加：
```javascript
console.log('🎉 打卡成功！当前时间:', new Date().toLocaleString());
```

**保存文件** → 打开浏览器控制台，点击打卡按钮，查看日志！

---

## 🔧 高级技巧

### 1. 同时编辑多个文件

Live-Server 会监控所有文件变化，你可以：
- 同时修改 HTML、CSS、JS
- 保存任意文件都会触发刷新
- 批量修改后一次性看到效果

### 2. 使用浏览器开发者工具

```
F12 或 右键 → 检查
```

- **Console** - 查看 JavaScript 日志
- **Elements** - 实时修改 HTML/CSS
- **Network** - 查看资源加载
- **Application** - 查看 localStorage 数据

### 3. 调试 localStorage

在浏览器控制台中：
```javascript
// 查看所有喝水记录
JSON.parse(localStorage.getItem('drinkWaterRecords'))

// 清空所有记录
localStorage.clear()

// 添加测试数据
localStorage.setItem('drinkWaterRecords', JSON.stringify([
  {id: 1, timestamp: Date.now(), date: '2026-02-05', time: '14:30:25'}
]))
```

### 4. 快速测试不同设备

在浏览器中按 `F12`，然后：
1. 点击 **设备工具栏** 图标（手机图标）
2. 选择不同的设备（iPhone、iPad、Android）
3. 查看响应式效果

---

## 📝 常用开发命令

### 查看服务器状态
```bash
./dev-server.sh status
```

### 查看实时日志
```bash
./dev-server.sh logs
# 或
tail -f /tmp/live-server.log
```

### 重启服务器（修改配置后）
```bash
./dev-server.sh restart
```

### 停止服务器
```bash
./dev-server.sh stop
```

---

## 🐛 故障排除

### 问题1: 浏览器没有自动刷新

**解决方案：**
1. 检查服务器是否运行：`./dev-server.sh status`
2. 确保文件保存成功
3. 查看浏览器控制台是否有错误
4. 重启服务器：`./dev-server.sh restart`

### 问题2: 端口被占用

**解决方案：**
```bash
# 停止当前服务器
./dev-server.sh stop

# 或者使用其他端口
cd www && npx live-server --port=8080
```

### 问题3: 修改不生效

**解决方案：**
1. 硬刷新浏览器：`Ctrl + Shift + R` (Windows/Linux) 或 `Cmd + Shift + R` (Mac)
2. 清除浏览器缓存
3. 检查文件是否保存在正确的位置

---

## 🎯 开发建议

### 1. 使用版本控制

```bash
# 提交前先测试
./dev-server.sh start
# 在浏览器中测试所有功能

# 确认无误后提交
git add .
git commit -m "更新功能"
```

### 2. 保持代码整洁

- 定期格式化代码
- 添加必要的注释
- 删除无用的代码

### 3. 测试不同场景

- 测试空数据状态
- 测试大量数据
- 测试边界情况

---

## 📚 相关文件

- `dev-server.sh` - 开发服务器管理脚本
- `build.sh` - 构建脚本
- `README_CN.md` - 项目文档
- `QUICKSTART.md` - 快速开始指南
- `PROJECT_SUMMARY.md` - 项目总结

---

## 🎉 开始开发吧！

现在你已经有了完整的热重载开发环境：

1. ✅ Live-Server 正在运行
2. ✅ 热重载已启用
3. ✅ 管理工具已就绪

**立即访问：** http://localhost:8000

**开始编辑：** 修改 `www/` 目录下的任何文件，保存后立即看到效果！

---

*提示：使用 `./dev-server.sh help` 查看所有可用命令*
