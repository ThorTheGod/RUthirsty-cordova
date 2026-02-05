# 🎯 阿狸偷看功能 - 快速测试指南

## 🚀 立即体验

### 方式 1：浏览器测试（推荐）

```bash
# 服务器已在运行
访问：http://localhost:8000
```

**测试步骤：**
1. ⏱️ 等待 1 秒，观察阿狸从右侧边缘偷看
2. 👀 注意她的轻微摆动动画
3. 🖱️ 点击阿狸的头部或身体
4. 😮 观察惊讶动画和对话气泡
5. ⏳ 等待 3-4 秒，看她恢复偷看状态

### 方式 2：演示页面

```bash
访问：http://localhost:8000/peek-demo.html
```

这个页面展示了完整的交互流程和技术细节。

---

## 📱 移动端测试

### GitHub Actions 自动构建

最新的 APK 正在构建中：

```
🔄 构建状态：进行中
📦 构建链接：https://github.com/ThorTheGod/RUthirsty-cordova/actions
```

**下载步骤：**
1. 访问 GitHub Actions 页面
2. 等待构建完成（约 5-10 分钟）
3. 下载 `app-debug` artifact
4. 解压得到 APK 文件
5. 安装到手机测试

---

## 🎬 交互效果预览

### 状态 1：初始隐藏
```
屏幕边缘
    |
    |
    |  (阿狸躲在这里)
    |
```

### 状态 2：偷看模式
```
屏幕边缘
    |
    |  👀🦊 <- 轻微摆动
    |
    |
```

### 状态 3：完全出现
```
屏幕边缘
    |
    |
    |      😊🦊💬 "你好呀~"
    |
```

---

## ✨ 关键特性测试

### 1. 偷看动画
- [ ] 页面加载后 1 秒开始偷看
- [ ] 角色在边缘轻微左右摆动
- [ ] 只露出部分身体（头发、耳朵）
- [ ] 动画流畅，无卡顿

### 2. 点击交互
- [ ] 点击角色后完全出现
- [ ] 有惊讶动画（旋转+缩放）
- [ ] 眼睛快速眨眼
- [ ] 对话气泡弹出

### 3. 对话系统
- [ ] 显示个性化对话内容
- [ ] 对话气泡有弹出动画
- [ ] 3-4 秒后自动隐藏
- [ ] 对话结束后恢复偷看

### 4. 定时提醒
- [ ] 到达提醒时间自动出现
- [ ] 显示提醒对话
- [ ] 5 秒后自动恢复偷看

### 5. 打卡反馈
- [ ] 点击打卡按钮后阿狸出现
- [ ] 显示鼓励对话
- [ ] 对话结束后恢复偷看

### 6. 响应式设计
- [ ] 桌面端位置正确
- [ ] 移动端触摸响应
- [ ] 横竖屏切换正常
- [ ] 不同屏幕尺寸适配

---

## 🐛 常见问题排查

### 问题 1：角色不出现
**检查：**
```javascript
// 打开浏览器控制台
console.log(document.getElementById('reminderAssistant'));
// 应该显示元素，不是 null
```

**解决：**
- 刷新页面
- 检查 JavaScript 是否加载
- 查看控制台错误信息

### 问题 2：动画不流畅
**检查：**
- 浏览器是否支持 CSS Transform
- 是否有其他动画冲突
- CPU/GPU 使用率

**解决：**
- 使用现代浏览器（Chrome, Firefox, Safari）
- 关闭其他占用资源的标签页
- 检查硬件加速是否开启

### 问题 3：点击无反应
**检查：**
```javascript
// 控制台测试
document.querySelector('.assistant-character').click();
// 应该触发点击事件
```

**解决：**
- 确保点击的是角色区域
- 检查 z-index 是否被遮挡
- 查看事件监听是否绑定

### 问题 4：移动端位置不对
**检查：**
- 屏幕宽度是否小于 480px
- 媒体查询是否生效
- viewport 设置是否正确

**解决：**
- 检查 CSS 媒体查询
- 调整响应式断点
- 测试不同设备尺寸

---

## 🎨 自定义调整

### 调整偷看深度
```css
/* 在 index.css 中修改 */
.reminder-assistant {
    right: -60px; /* 增大数值 = 躲得更深 */
}

.reminder-assistant.peeking {
    right: -40px; /* 调整偷看位置 */
}
```

### 调整动画速度
```css
/* 偷看动画速度 */
@keyframes peek {
    animation-duration: 2s; /* 改为 3s 更慢，1s 更快 */
}

/* 滑动速度 */
.reminder-assistant {
    transition: right 0.5s; /* 改为 0.3s 更快，0.8s 更慢 */
}
```

### 调整恢复时间
```javascript
// 在 index.js 的 handleAssistantClick 函数中
setTimeout(() => {
    assistant.classList.remove('visible');
    assistant.classList.add('peeking');
}, 4000); // 改为 3000 更快恢复，5000 更慢恢复
```

---

## 📊 性能监控

### 浏览器开发者工具

1. **打开 Performance 面板**
   - F12 → Performance
   - 录制交互过程
   - 查看 FPS 和渲染时间

2. **检查动画性能**
   ```javascript
   // 控制台运行
   performance.mark('animation-start');
   // 触发动画
   performance.mark('animation-end');
   performance.measure('animation', 'animation-start', 'animation-end');
   console.log(performance.getEntriesByName('animation'));
   ```

3. **监控内存使用**
   - F12 → Memory
   - 拍摄堆快照
   - 检查是否有内存泄漏

### 目标性能指标

- ✅ FPS: 60fps（流畅）
- ✅ 动画延迟: < 16ms
- ✅ 内存增长: < 5MB
- ✅ CPU 使用: < 10%

---

## 🎯 用户反馈收集

### 测试问卷

1. **第一印象**
   - 注意到偷看动画了吗？
   - 是否激发了点击欲望？
   - 动画是否自然流畅？

2. **交互体验**
   - 点击反馈是否及时？
   - 惊讶动画是否有趣？
   - 对话内容是否合适？

3. **整体感受**
   - 是否增加了趣味性？
   - 是否感觉被打扰？
   - 是否愿意继续互动？

### 改进建议

根据测试反馈，可以调整：
- 偷看频率和幅度
- 惊讶动画的夸张程度
- 对话显示时长
- 恢复偷看的时机

---

## 📈 A/B 测试建议

### 版本 A：当前实现
- 默认偷看
- 点击完全出现
- 3-4 秒恢复

### 版本 B：更主动
- 偷看 + 定期探出
- 点击后停留更久
- 需要再次点击才恢复

### 版本 C：更含蓄
- 只在提醒时出现
- 点击后快速恢复
- 更少的动画效果

---

## 🔗 相关资源

### 文档
- 📚 [完整功能文档](PEEK_INTERACTION_GUIDE.md)
- 🎨 [可视化演示](http://localhost:8000/peek-demo.html)
- 🌐 [在线应用](http://localhost:8000)

### 代码
- 💻 [CSS 样式](www/css/index.css)
- 🔧 [JavaScript 逻辑](www/js/index.js)
- 📦 [GitHub 仓库](https://github.com/ThorTheGod/RUthirsty-cordova)

### 构建
- 🏗️ [GitHub Actions](https://github.com/ThorTheGod/RUthirsty-cordova/actions)
- 📱 [APK 下载](https://github.com/ThorTheGod/RUthirsty-cordova/actions/runs/21711509152)

---

## 🎉 测试完成清单

完成以下测试后，功能即可上线：

- [ ] 浏览器桌面端测试通过
- [ ] 浏览器移动端测试通过
- [ ] 真机 APK 测试通过
- [ ] 性能指标达标
- [ ] 用户反馈收集
- [ ] 已知问题记录
- [ ] 文档完善

---

**祝测试顺利！有任何问题随时反馈。** 🦊✨

---

**版本**: 1.0.0
**更新日期**: 2026-02-05
**测试环境**: Chrome 120+, Safari 17+, Android 10+
**作者**: Claude Sonnet 4.5
