#!/bin/bash

echo "🦊 启动阿狸 MCP 服务器..."
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件"
    echo "📝 正在创建 .env 文件..."
    cp .env.example .env
    echo ""
    echo "✅ .env 文件已创建"
    echo "⚠️  请编辑 .env 文件，填入你的 ANTHROPIC_API_KEY"
    echo ""
    echo "获取 API 密钥: https://console.anthropic.com/"
    echo ""
    exit 1
fi

# 检查 API 密钥
if grep -q "your_api_key_here" .env; then
    echo "⚠️  请先配置 ANTHROPIC_API_KEY"
    echo "📝 编辑 .env 文件，填入你的 API 密钥"
    echo ""
    echo "获取 API 密钥: https://console.anthropic.com/"
    echo ""
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
    echo ""
fi

# 启动服务器
echo "🚀 启动 MCP 服务器..."
echo ""
npm start
