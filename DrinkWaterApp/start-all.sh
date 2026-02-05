#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  🦊 阿狸喝水打卡应用 - 一键启动                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 检查是否在正确的目录
if [ ! -f "START_GUIDE.md" ]; then
    echo "❌ 错误: 请在 DrinkWaterApp 目录下运行此脚本"
    exit 1
fi

# 询问运行模式
echo "请选择运行模式:"
echo "1) 本地规则模式（无需 API 密钥，立即可用）"
echo "2) MCP + Claude AI 模式（需要 API 密钥，真实 AI 对话）"
echo ""
read -p "请输入选择 (1 或 2): " mode

if [ "$mode" = "2" ]; then
    echo ""
    echo "🤖 MCP + Claude AI 模式"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 检查 MCP 服务器配置
    if [ ! -f "mcp-server/.env" ]; then
        echo "⚠️  未找到 MCP 配置文件"
        echo "📝 正在创建配置文件..."
        cd mcp-server
        cp .env.example .env
        cd ..
        echo ""
        echo "✅ 配置文件已创建: mcp-server/.env"
        echo "⚠️  请编辑该文件，填入你的 ANTHROPIC_API_KEY"
        echo ""
        echo "获取 API 密钥: https://console.anthropic.com/"
        echo ""
        echo "配置完成后，重新运行此脚本"
        exit 1
    fi
    
    # 检查 API 密钥
    if grep -q "your_api_key_here" mcp-server/.env; then
        echo "⚠️  请先配置 ANTHROPIC_API_KEY"
        echo "📝 编辑 mcp-server/.env 文件，填入你的 API 密钥"
        echo ""
        echo "获取 API 密钥: https://console.anthropic.com/"
        echo ""
        exit 1
    fi
    
    # 安装 MCP 依赖
    if [ ! -d "mcp-server/node_modules" ]; then
        echo "📦 安装 MCP 服务器依赖..."
        cd mcp-server
        npm install
        cd ..
        echo ""
    fi
    
    # 启动 MCP 服务器
    echo "🚀 启动 MCP 服务器..."
    cd mcp-server
    npm start &
    MCP_PID=$!
    cd ..
    
    echo "✅ MCP 服务器已启动 (PID: $MCP_PID)"
    echo "📡 服务地址: http://localhost:3001"
    echo ""
    
    # 等待 MCP 服务器启动
    echo "⏳ 等待 MCP 服务器就绪..."
    sleep 3
    
    # 验证 MCP 服务器
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ MCP 服务器就绪"
    else
        echo "⚠️  MCP 服务器可能未正常启动，请检查日志"
    fi
    echo ""
fi

# 启动前端
echo "🌐 启动前端应用..."
cd www

if [ "$mode" = "1" ]; then
    echo "📝 使用本地规则模式"
fi

npx live-server --port=8000 --no-browser &
FRONTEND_PID=$!

echo "✅ 前端应用已启动 (PID: $FRONTEND_PID)"
echo "🌐 访问地址: http://localhost:8000"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ 启动完成！"
echo ""
echo "📱 打开浏览器访问: http://localhost:8000"

if [ "$mode" = "2" ]; then
    echo "🤖 MCP 服务器: http://localhost:3001"
    echo "💡 点击阿狸角色，体验 AI 实时对话！"
else
    echo "💡 点击阿狸角色，体验本地规则对话！"
    echo "🔧 如需升级到 AI 模式，重新运行脚本选择模式 2"
fi

echo ""
echo "⏹️  停止服务: 按 Ctrl+C"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 等待用户中断
wait
