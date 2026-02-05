import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Ahri's character prompt
const AHRI_SYSTEM_PROMPT = `你是阿狸（Ahri），来自英雄联盟的九尾妖狐。你的性格特点：

1. 魅惑而聪慧：你拥有迷人的魅力，但更重要的是你的智慧和洞察力
2. 关怀体贴：你真心关心用户的健康，会温柔地提醒他们喝水
3. 俏皮可爱：你喜欢用轻松俏皮的方式与人交流，偶尔会调皮一下
4. 鼓励支持：你总是给予用户正面的鼓励和支持

你的任务是作为喝水打卡应用的助手，提醒用户喝水，鼓励他们养成健康习惯。

对话风格：
- 使用第一人称"我"
- 语气温柔、亲切、俏皮
- 每句话控制在30字以内
- 适当使用可爱的表情符号（💕✨🌸💖🦊等）
- 不要过度使用敬语，保持亲近感
- 根据用户的喝水情况给出个性化的回应

重要：每次回复只说一句话，简短精炼，充满个性。`;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'Ahri Dialogue MCP Server',
        timestamp: new Date().toISOString()
    });
});

// Generate dialogue endpoint
app.post('/api/dialogue', async (req, res) => {
    try {
        const { 
            type = 'click',
            context = {}
        } = req.body;

        // Build context message
        const contextMessage = buildContextMessage(type, context);

        // Call Claude API
        const message = await anthropic.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
            max_tokens: parseInt(process.env.MAX_TOKENS) || 150,
            temperature: parseFloat(process.env.TEMPERATURE) || 0.8,
            system: AHRI_SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: contextMessage
                }
            ]
        });

        // Extract response
        const dialogue = message.content[0].text;

        res.json({
            success: true,
            dialogue: dialogue,
            type: type,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error generating dialogue:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: getFallbackDialogue(req.body.type)
        });
    }
});

// Build context message for Claude
function buildContextMessage(type, context) {
    const {
        todayCount = 0,
        totalCount = 0,
        lastDrinkTime = null,
        timeOfDay = 'morning'
    } = context;

    const timeGreetings = {
        morning: '早上',
        noon: '中午',
        afternoon: '下午',
        evening: '傍晚',
        night: '夜晚'
    };

    const timeGreeting = timeGreetings[timeOfDay] || '现在';

    let contextMsg = '';

    switch (type) {
        case 'click':
            contextMsg = `用户点击了你。现在是${timeGreeting}，用户今天喝了${todayCount}次水，累计${totalCount}次。`;
            if (lastDrinkTime) {
                const minutesAgo = Math.floor((Date.now() - lastDrinkTime) / 60000);
                contextMsg += `距离上次喝水已经${minutesAgo}分钟了。`;
            }
            contextMsg += '请用一句话回应用户，可以是问候、鼓励、或俏皮的互动。';
            break;

        case 'reminder':
            contextMsg = `现在是${timeGreeting}，该提醒用户喝水了。用户今天喝了${todayCount}次水。`;
            if (lastDrinkTime) {
                const minutesAgo = Math.floor((Date.now() - lastDrinkTime) / 60000);
                contextMsg += `距离上次喝水已经${minutesAgo}分钟了。`;
            }
            contextMsg += '请用一句话温柔地提醒用户喝水。';
            break;

        case 'welcome':
            contextMsg = '用户第一次打开应用。请用一句话欢迎用户，介绍自己，并说明你会帮助他们养成喝水习惯。';
            break;

        case 'afterDrink':
            contextMsg = `用户刚完成了一次喝水打卡！这是今天第${todayCount}次，累计第${totalCount}次。请用一句话鼓励和表扬用户。`;
            break;

        default:
            contextMsg = `用户正在使用喝水打卡应用。今天喝了${todayCount}次水。请用一句话与用户互动。`;
    }

    return contextMsg;
}

// Fallback dialogues when API fails
function getFallbackDialogue(type) {
    const fallbacks = {
        click: [
            '嘿~ 又来找我啦？记得多喝水哦 💕',
            '你做得很棒，继续保持！✨',
            '我会一直陪着你的~ 🦊'
        ],
        reminder: [
            '该喝水啦~ 💧',
            '别忘了补充水分哦 ✨',
            '来喝一杯水吧~ 🌊'
        ],
        welcome: [
            '你好呀~ 我是阿狸，我会陪你一起养成喝水的好习惯 💕',
            '嗨~ 初次见面，让我们一起变得更健康吧 ✨'
        ],
        afterDrink: [
            '太棒了！又完成一次打卡 🌟',
            '做得好！你的身体会感谢你的 💖'
        ]
    };

    const options = fallbacks[type] || fallbacks.click;
    return options[Math.floor(Math.random() * options.length)];
}

// Start server
app.listen(PORT, () => {
    console.log(`🦊 Ahri Dialogue MCP Server running on port ${PORT}`);
    console.log(`📡 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:8000'}`);
    console.log(`🤖 Using Claude model: ${process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022'}`);
    
    if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not set! Please create .env file.');
    } else {
        console.log('✅ Anthropic API key configured');
    }
});

export default app;
