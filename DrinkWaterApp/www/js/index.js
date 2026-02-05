/**
    喝水打卡应用
*/

// 存储键名
const STORAGE_KEY = 'drinkWaterRecords';
const REMINDER_SETTINGS_KEY = 'reminderSettings';

// 喝水记录数组
let drinkRecords = [];

// 提醒设置
let reminderSettings = {
    enabled: true,
    interval: 30, // 默认30分钟提醒一次
    lastReminder: null
};

// 提醒定时器
let reminderTimer = null;

// 等待Cordova设备就绪，如果在浏览器中则直接初始化
document.addEventListener('deviceready', onDeviceReady, false);

// 浏览器环境回退：如果3秒内没有触发deviceready，则直接初始化
setTimeout(() => {
    if (!window.cordova) {
        console.log('在浏览器环境中运行，直接初始化应用');
        onDeviceReady();
    }
}, 1000);

function onDeviceReady() {
    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    } else {
        console.log('在浏览器中运行（测试模式）');
    }

    document.getElementById('deviceready').classList.add('ready');

    // 初始化应用
    initApp();
}

// 初始化应用
function initApp() {
    // 加载存储的记录
    loadRecords();

    // 加载提醒设置
    loadReminderSettings();

    // 更新显示
    updateDisplay();

    // 绑定打卡按钮事件
    const drinkButton = document.getElementById('drinkButton');
    drinkButton.addEventListener('click', handleDrink);

    // 绑定清空按钮事件
    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', handleClearAll);

    // 绑定角色点击事件
    const assistant = document.querySelector('.assistant-character');
    assistant.addEventListener('click', handleAssistantClick);

    // 初始化角色为偷看状态
    const reminderAssistant = document.getElementById('reminderAssistant');
    setTimeout(() => {
        reminderAssistant.classList.add('peeking');
    }, 1000); // 1秒后开始偷看

    // 绑定气泡点击事件（关闭气泡）
    const chatBubble = document.getElementById('chatBubble');
    chatBubble.addEventListener('click', hideChatBubble);

    // 绑定设置按钮事件
    const settingsButton = document.getElementById('settingsButton');
    settingsButton.addEventListener('click', openSettings);

    // 绑定关闭设置按钮事件
    const closeSettings = document.getElementById('closeSettings');
    closeSettings.addEventListener('click', closeSettingsPanel);

    // 绑定设置面板背景点击事件（点击背景关闭）
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.addEventListener('click', (e) => {
        if (e.target === settingsPanel) {
            closeSettingsPanel();
        }
    });

    // 绑定提醒开关事件
    const reminderToggle = document.getElementById('reminderToggle');
    reminderToggle.addEventListener('change', handleReminderToggle);

    // 绑定间隔按钮事件
    const intervalButtons = document.querySelectorAll('.interval-btn');
    intervalButtons.forEach(btn => {
        btn.addEventListener('click', handleIntervalChange);
    });

    // 绑定测试提醒按钮事件
    const testReminderBtn = document.getElementById('testReminder');
    testReminderBtn.addEventListener('click', () => {
        showReminder();
        closeSettingsPanel();
    });

    // 初始化设置面板状态
    updateSettingsUI();

    // 启动提醒系统
    startReminderSystem();

    console.log('喝水打卡应用已初始化');
}

// 处理打卡事件
async function handleDrink() {
    // 创建新记录
    const now = new Date();
    const record = {
        id: Date.now(),
        timestamp: now.getTime(),
        date: formatDate(now),
        time: formatTime(now)
    };

    // 添加到记录数组开头
    drinkRecords.unshift(record);

    // 保存到localStorage
    saveRecords();

    // 更新显示
    updateDisplay();

    // 按钮动画反馈
    const button = document.getElementById('drinkButton');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);

    // 显示阿狸的鼓励对话
    setTimeout(async () => {
        const message = await ahriDialogue.generateDialogue('afterDrink');
        showChatBubble(message);
    }, 500);

    console.log('打卡成功:', record);
}

// 从localStorage加载记录
function loadRecords() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            drinkRecords = JSON.parse(stored);
            console.log('加载了', drinkRecords.length, '条记录');
        }
    } catch (error) {
        console.error('加载记录失败:', error);
        drinkRecords = [];
    }
}

// 保存记录到localStorage
function saveRecords() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drinkRecords));
        console.log('记录已保存');
    } catch (error) {
        console.error('保存记录失败:', error);
    }
}

// 更新显示
function updateDisplay() {
    updateTodayCount();
    updateTotalCount();
    updateRecordsList();
}

// 更新今日喝水次数
function updateTodayCount() {
    const today = formatDate(new Date());
    const todayRecords = drinkRecords.filter(record => record.date === today);
    const count = todayRecords.length;

    const countElement = document.getElementById('todayCount');
    countElement.textContent = count;

    // 数字变化动画
    countElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        countElement.style.transform = 'scale(1)';
    }, 300);
}

// 更新总计次数
function updateTotalCount() {
    const count = drinkRecords.length;
    const countElement = document.getElementById('totalCount');
    countElement.textContent = count;
}

// 更新记录列表
function updateRecordsList() {
    const listElement = document.getElementById('recordsList');

    if (drinkRecords.length === 0) {
        listElement.innerHTML = '<div class="empty-message">还没有喝水记录，点击上方按钮开始打卡吧！</div>';
        return;
    }

    // 生成记录HTML
    let html = '';
    drinkRecords.forEach(record => {
        html += `
            <div class="record-item">
                <div class="record-icon">💧</div>
                <div class="record-info">
                    <div class="record-time">${record.time}</div>
                    <div class="record-date">${record.date}</div>
                </div>
                <button class="delete-button" onclick="deleteRecord(${record.id})">删除</button>
            </div>
        `;
    });

    listElement.innerHTML = html;
}

// 删除单条记录
function deleteRecord(recordId) {
    if (confirm('确定要删除这条记录吗？')) {
        drinkRecords = drinkRecords.filter(record => record.id !== recordId);
        saveRecords();
        updateDisplay();
        console.log('记录已删除:', recordId);
    }
}

// 清空所有记录
function handleClearAll() {
    if (drinkRecords.length === 0) {
        alert('没有记录可以清空');
        return;
    }

    if (confirm('确定要清空所有记录吗？此操作不可恢复！')) {
        drinkRecords = [];
        saveRecords();
        updateDisplay();
        console.log('所有记录已清空');
    }
}

// 格式化日期 (YYYY-MM-DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 格式化时间 (HH:MM:SS)
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// ========================================
// 提醒系统功能
// ========================================

// 阿狸的角色设定
const ahriPersonality = {
    name: "阿狸",
    title: "九尾妖狐",
    traits: ["魅惑", "聪慧", "关怀", "俏皮"],
    mood: ["开心", "关心", "调皮", "温柔", "鼓励"]
};

// 提醒文案库（阿狸风格）
const reminderMessages = [
    '该喝水啦~ 💧',
    '记得补充水分哦~ ✨',
    '喝水时间到啦！💙',
    '来喝一杯水吧~ 🌊',
    '别忘了喝水哦~ 💦',
    '水分补充很重要呢~ 🎀',
    '该给身体补水啦~ 🌸',
    '喝水让你更健康~ 💖',
    '一起喝水吧~ 🌈',
    '保持水分充足哦~ ⭐',
    '喝水打卡时间~ 🎵',
    '来一杯清凉的水吧~ 🧊',
    '别让身体缺水哦~ 💝',
    '喝水是个好习惯~ 🌺',
    '该补充能量啦~ 💫'
];

// MCP服务器配置
const MCP_SERVER_URL = 'http://localhost:3001';
const USE_MCP = true; // 设置为true使用MCP，false使用本地规则

// AI对话生成系统
class AhriDialogueGenerator {
    constructor() {
        this.lastDialogueTime = null;
        this.dialogueHistory = [];
        this.contextData = {
            todayCount: 0,
            totalCount: 0,
            lastDrinkTime: null,
            timeOfDay: 'morning',
            userMood: 'neutral'
        };
        this.mcpAvailable = false;
        this.checkMCPServer();
    }

    // 检查MCP服务器是否可用
    async checkMCPServer() {
        if (!USE_MCP) {
            console.log('MCP已禁用，使用本地规则生成对话');
            return;
        }

        try {
            const response = await fetch(`${MCP_SERVER_URL}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                this.mcpAvailable = true;
                console.log('✅ MCP服务器连接成功');
            } else {
                console.warn('⚠️ MCP服务器响应异常，使用本地规则');
            }
        } catch (error) {
            console.warn('⚠️ MCP服务器未启动，使用本地规则:', error.message);
            this.mcpAvailable = false;
        }
    }

    // 通过MCP生成对话
    async generateDialogueViaMCP(type) {
        try {
            const response = await fetch(`${MCP_SERVER_URL}/api/dialogue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: type,
                    context: this.contextData
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('🤖 Claude生成对话:', data.dialogue);
                return data.dialogue;
            } else {
                console.warn('MCP返回失败，使用fallback:', data.fallback);
                return data.fallback || this.generateDialogueLocally(type);
            }
        } catch (error) {
            console.error('MCP调用失败:', error);
            return this.generateDialogueLocally(type);
        }
    }

    // 本地规则生成对话（原有逻辑）
    generateDialogueLocally(type) {
        switch (type) {
            case 'click':
                return this.generateClickDialogue();
            case 'reminder':
                return this.generateReminderDialogue();
            case 'welcome':
                return this.generateWelcomeDialogue();
            case 'afterDrink':
                return this.generateAfterDrinkDialogue();
            default:
                return this.generateRandomDialogue();
        }
    }

    // 更新上下文数据
    updateContext(data) {
        this.contextData = { ...this.contextData, ...data };
        this.contextData.timeOfDay = this.getTimeOfDay();
    }

    // 获取时间段
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 14) return 'noon';
        if (hour >= 14 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    // 获取时间段问候语
    getTimeGreeting() {
        const greetings = {
            morning: ['早上好', '早安', '新的一天开始啦'],
            noon: ['中午好', '午安', '该休息一下了'],
            afternoon: ['下午好', '下午茶时间', '继续加油'],
            evening: ['傍晚好', '晚上好', '辛苦一天了'],
            night: ['夜深了', '该休息了', '晚安']
        };
        const options = greetings[this.contextData.timeOfDay];
        return options[Math.floor(Math.random() * options.length)];
    }

    // 生成基于喝水次数的评价
    getDrinkCountComment() {
        const count = this.contextData.todayCount;
        if (count === 0) {
            return ['今天还没有喝水记录呢', '要开始喝水啦', '第一杯水很重要哦'][Math.floor(Math.random() * 3)];
        } else if (count < 3) {
            return ['喝水次数还不够呢', '继续保持', '再多喝几次吧'][Math.floor(Math.random() * 3)];
        } else if (count < 6) {
            return ['做得不错', '保持这个节奏', '很棒的习惯'][Math.floor(Math.random() * 3)];
        } else if (count < 10) {
            return ['太棒了', '你真是喝水小能手', '完美的一天'][Math.floor(Math.random() * 3)];
        } else {
            return ['哇，喝了好多水', '你是喝水冠军', '简直不可思议'][Math.floor(Math.random() * 3)];
        }
    }

    // 生成基于时间间隔的提醒
    getTimeBasedReminder() {
        if (!this.contextData.lastDrinkTime) {
            return '好久没喝水了吧？';
        }
        const timeDiff = Date.now() - this.contextData.lastDrinkTime;
        const minutes = Math.floor(timeDiff / 60000);

        if (minutes < 30) {
            return '刚喝过水，真棒~';
        } else if (minutes < 60) {
            return '距离上次喝水已经有一会儿了';
        } else if (minutes < 120) {
            return '已经超过一小时没喝水了呢';
        } else {
            return '好久没喝水了，快来补充水分吧';
        }
    }

    // 生成个性化对话（核心AI生成逻辑）
    async generateDialogue(type = 'click') {
        this.updateContext({
            todayCount: getTodayCount(),
            totalCount: drinkRecords.length,
            lastDrinkTime: drinkRecords.length > 0 ? drinkRecords[0].timestamp : null
        });

        let dialogue = '';

        // 如果MCP可用且启用，使用MCP生成
        if (USE_MCP && this.mcpAvailable) {
            dialogue = await this.generateDialogueViaMCP(type);
        } else {
            // 否则使用本地规则生成
            dialogue = this.generateDialogueLocally(type);
            const emoji = this.getRandomEmoji();
            dialogue = dialogue + ' ' + emoji;
        }

        // 添加到历史记录
        this.dialogueHistory.push({
            type,
            dialogue,
            timestamp: Date.now()
        });

        // 只保留最近20条记录
        if (this.dialogueHistory.length > 20) {
            this.dialogueHistory.shift();
        }

        return dialogue;
    }

    // 生成点击对话
    generateClickDialogue() {
        const templates = [
            // 基于时间的对话
            () => `${this.getTimeGreeting()}~ ${this.getDrinkCountComment()}！`,

            // 基于喝水次数的对话
            () => {
                const count = this.contextData.todayCount;
                if (count === 0) {
                    return '今天还没开始喝水呢，要不要来一杯？';
                } else {
                    return `今天已经喝了${count}次水了，${this.getDrinkCountComment()}~`;
                }
            },

            // 基于时间间隔的对话
            () => this.getTimeBasedReminder(),

            // 鼓励性对话
            () => {
                const encouragements = [
                    '你做得很棒，继续保持哦',
                    '喝水是个好习惯，我会一直陪着你',
                    '每一次喝水都是对自己的关爱',
                    '保持水分充足，让身体更有活力',
                    '你的健康，我来守护'
                ];
                return encouragements[Math.floor(Math.random() * encouragements.length)];
            },

            // 俏皮对话
            () => {
                const playful = [
                    '嘿嘿，又来找我啦？',
                    '想我了吗？记得多喝水哦~',
                    '点我这么多次，是不是喜欢我呀？',
                    '我可是会魅惑的九尾狐，但现在只想让你多喝水',
                    '别光看着我，水杯在那边呢~'
                ];
                return playful[Math.floor(Math.random() * playful.length)];
            },

            // 关怀对话
            () => {
                const caring = [
                    '最近有好好照顾自己吗？',
                    '工作累了就休息一下，喝杯水吧',
                    '身体是革命的本钱，要多喝水哦',
                    '看你这么努力，我很欣慰呢',
                    '记得劳逸结合，喝水休息都很重要'
                ];
                return caring[Math.floor(Math.random() * caring.length)];
            },

            // 基于总次数的成就对话
            () => {
                const total = this.contextData.totalCount;
                if (total < 10) {
                    return '刚开始使用呢，加油哦！';
                } else if (total < 50) {
                    return `已经累计${total}次了，不错的开始！`;
                } else if (total < 100) {
                    return `哇，${total}次了！你真的很棒！`;
                } else if (total < 500) {
                    return `${total}次！你已经是喝水达人了！`;
                } else {
                    return `${total}次！简直是传奇级别的坚持！`;
                }
            }
        ];

        // 随机选择一个模板
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template();
    }

    // 生成提醒对话
    generateReminderDialogue() {
        const templates = [
            () => `${this.getTimeGreeting()}，该喝水啦`,
            () => `亲爱的，${this.getTimeBasedReminder()}`,
            () => {
                const tips = [
                    '喝水能提高注意力哦',
                    '水分充足，皮肤会更好',
                    '喝水有助于新陈代谢',
                    '补充水分，让大脑更清醒',
                    '喝水能缓解疲劳'
                ];
                return tips[Math.floor(Math.random() * tips.length)] + '，来喝一杯吧';
            },
            () => {
                const reminders = [
                    '时间到了，该补充水分了',
                    '别忘了我们的约定，定时喝水哦',
                    '又到了喝水的时间啦',
                    '我来提醒你喝水了~',
                    '该给身体补充能量了'
                ];
                return reminders[Math.floor(Math.random() * reminders.length)];
            }
        ];

        const template = templates[Math.floor(Math.random() * templates.length)];
        return template();
    }

    // 生成欢迎对话
    generateWelcomeDialogue() {
        const welcomes = [
            `你好呀，我是${ahriPersonality.name}，${ahriPersonality.title}~ 我会陪你一起养成喝水的好习惯`,
            '嗨~ 初次见面，我会定时提醒你喝水哦',
            '欢迎使用喝水打卡！点击我可以查看今日喝水次数',
            '你好！我是你的专属喝水助手，让我们一起变得更健康吧',
            '很高兴认识你~ 从现在开始，我会守护你的健康'
        ];
        return welcomes[Math.floor(Math.random() * welcomes.length)];
    }

    // 生成喝水后的对话
    generateAfterDrinkDialogue() {
        const afterDrink = [
            '太棒了！又完成一次打卡',
            '很好！继续保持这个习惯',
            '做得好！你的身体会感谢你的',
            '完美！又向健康迈进了一步',
            '真棒！我为你感到骄傲',
            '好样的！坚持就是胜利',
            '不错哦！你真的很自律',
            '厉害！这就是健康的生活方式'
        ];
        return afterDrink[Math.floor(Math.random() * afterDrink.length)];
    }

    // 生成随机对话
    generateRandomDialogue() {
        return this.generateClickDialogue();
    }

    // 获取随机表情
    getRandomEmoji() {
        const emojis = ['💕', '✨', '🌸', '💖', '🌟', '💫', '🎀', '🌺', '💝', '⭐', '🌈', '💙', '🦊', '✨'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
}

// 创建全局对话生成器实例
const ahriDialogue = new AhriDialogueGenerator();

// 加载提醒设置
function loadReminderSettings() {
    try {
        const stored = localStorage.getItem(REMINDER_SETTINGS_KEY);
        if (stored) {
            reminderSettings = { ...reminderSettings, ...JSON.parse(stored) };
            console.log('提醒设置已加载:', reminderSettings);
        }
    } catch (error) {
        console.error('加载提醒设置失败:', error);
    }
}

// 保存提醒设置
function saveReminderSettings() {
    try {
        localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(reminderSettings));
        console.log('提醒设置已保存');
    } catch (error) {
        console.error('保存提醒设置失败:', error);
    }
}

// 启动提醒系统
async function startReminderSystem() {
    if (!reminderSettings.enabled) {
        console.log('提醒系统已禁用');
        return;
    }

    // 清除现有定时器
    if (reminderTimer) {
        clearInterval(reminderTimer);
    }

    // 设置定时器（每分钟检查一次）
    reminderTimer = setInterval(checkReminder, 60000);

    // 如果是首次使用（从未提醒过），显示欢迎提醒
    if (!reminderSettings.lastReminder) {
        setTimeout(async () => {
            const message = await ahriDialogue.generateDialogue('welcome');
            showChatBubble(message);
        }, 2000); // 2秒后显示欢迎提醒
    } else {
        // 立即检查一次（如果上次提醒时间超过间隔）
        checkReminder();
    }

    console.log(`提醒系统已启动，间隔: ${reminderSettings.interval}分钟`);
}

// 检查是否需要提醒
function checkReminder() {
    if (!reminderSettings.enabled) {
        return;
    }

    const now = Date.now();
    const intervalMs = reminderSettings.interval * 60 * 1000;

    // 如果从未提醒过，或距离上次提醒已超过设定间隔
    if (!reminderSettings.lastReminder || (now - reminderSettings.lastReminder) >= intervalMs) {
        showReminder();
        reminderSettings.lastReminder = now;
        saveReminderSettings();
    }
}

// 显示提醒
async function showReminder() {
    const assistant = document.getElementById('reminderAssistant');
    const bubble = document.getElementById('chatBubble');
    const text = document.getElementById('bubbleText');

    // 让角色完全出现
    assistant.classList.remove('peeking');
    assistant.classList.add('visible');

    // 使用AI生成提醒对话
    const message = await ahriDialogue.generateDialogue('reminder');
    text.textContent = message;

    // 显示气泡
    bubble.classList.add('show', 'pulse');

    // 5秒后自动隐藏并恢复偷看状态
    setTimeout(() => {
        hideChatBubble();
        setTimeout(() => {
            assistant.classList.remove('visible');
            assistant.classList.add('peeking');
        }, 1000);
    }, 5000);

    console.log('显示提醒:', message);
}

// 隐藏聊天气泡
function hideChatBubble() {
    const bubble = document.getElementById('chatBubble');
    bubble.classList.remove('show', 'pulse');
}

// 显示聊天气泡（手动触发）
function showChatBubble(message) {
    const bubble = document.getElementById('chatBubble');
    const text = document.getElementById('bubbleText');

    text.textContent = message;
    bubble.classList.add('show');

    // 3秒后自动隐藏
    setTimeout(() => {
        hideChatBubble();
    }, 3000);
}

// 处理角色点击事件
async function handleAssistantClick() {
    const assistant = document.getElementById('reminderAssistant');
    const character = document.querySelector('.assistant-character');
    const bubble = document.getElementById('chatBubble');

    // 让角色完全出现
    assistant.classList.remove('peeking');
    assistant.classList.add('visible');

    // 添加惊讶动画
    character.classList.add('surprised', 'clicked');
    setTimeout(() => {
        character.classList.remove('clicked');
    }, 300);

    // 如果气泡已显示，则隐藏
    if (bubble.classList.contains('show')) {
        hideChatBubble();
        // 3秒后恢复偷看状态
        setTimeout(() => {
            assistant.classList.remove('visible');
            assistant.classList.add('peeking');
        }, 3000);
    } else {
        // 显示加载状态
        showChatBubble('思考中... 🤔');

        // 使用AI生成个性化对话
        const message = await ahriDialogue.generateDialogue('click');
        showChatBubble(message);

        // 对话结束后恢复偷看状态
        setTimeout(() => {
            assistant.classList.remove('visible');
            assistant.classList.add('peeking');
        }, 4000);
    }

    console.log('角色被点击');
}

// 获取今日喝水次数
function getTodayCount() {
    const today = formatDate(new Date());
    const todayRecords = drinkRecords.filter(record => record.date === today);
    return todayRecords.length;
}

// 更新提醒间隔（可选功能，供将来扩展）
function updateReminderInterval(minutes) {
    reminderSettings.interval = minutes;
    saveReminderSettings();
    startReminderSystem(); // 重启提醒系统
    console.log(`提醒间隔已更新为 ${minutes} 分钟`);
}

// 切换提醒开关（可选功能，供将来扩展）
function toggleReminder(enabled) {
    reminderSettings.enabled = enabled;
    saveReminderSettings();

    if (enabled) {
        startReminderSystem();
        showChatBubble('提醒功能已开启~ 📢');
    } else {
        if (reminderTimer) {
            clearInterval(reminderTimer);
            reminderTimer = null;
        }
        showChatBubble('提醒功能已关闭~ 🔕');
    }

    console.log('提醒功能:', enabled ? '已开启' : '已关闭');
}

// ========================================
// 设置面板功能
// ========================================

// 打开设置面板
function openSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.add('show');
    updateSettingsUI();
    console.log('打开设置面板');
}

// 关闭设置面板
function closeSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.remove('show');
    console.log('关闭设置面板');
}

// 更新设置面板UI
function updateSettingsUI() {
    // 更新提醒开关状态
    const toggle = document.getElementById('reminderToggle');
    toggle.checked = reminderSettings.enabled;

    // 更新间隔按钮状态
    const intervalButtons = document.querySelectorAll('.interval-btn');
    intervalButtons.forEach(btn => {
        const interval = parseInt(btn.dataset.interval);
        if (interval === reminderSettings.interval) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 处理提醒开关切换
function handleReminderToggle(event) {
    const enabled = event.target.checked;
    toggleReminder(enabled);
}

// 处理间隔变更
function handleIntervalChange(event) {
    const interval = parseInt(event.target.dataset.interval);
    updateReminderInterval(interval);
    updateSettingsUI();
    showChatBubble(`提醒间隔已设置为 ${interval} 分钟~ ⏰`);
}
