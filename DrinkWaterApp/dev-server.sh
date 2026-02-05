#!/bin/bash

# 喝水打卡应用 - 开发服务器管理脚本

PORT=8000
LOG_FILE="/tmp/live-server.log"
WWW_DIR="www"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查服务器是否运行
check_server() {
    if pgrep -f "live-server.*port=$PORT" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# 启动服务器
start_server() {
    if check_server; then
        echo -e "${YELLOW}⚠️  服务器已在运行中${NC}"
        show_status
        return
    fi

    echo -e "${BLUE}🚀 启动 live-server...${NC}"
    cd "$WWW_DIR" && nohup npx live-server --port=$PORT --no-browser > "$LOG_FILE" 2>&1 &
    sleep 2

    if check_server; then
        echo -e "${GREEN}✅ 服务器启动成功！${NC}"
        echo ""
        echo -e "${GREEN}访问地址: http://localhost:$PORT${NC}"
        echo -e "${GREEN}热重载: 已启用${NC}"
        echo ""
        echo -e "💡 修改 www/ 目录下的文件，浏览器会自动刷新"
    else
        echo -e "${RED}❌ 服务器启动失败${NC}"
        echo "查看日志: tail -f $LOG_FILE"
    fi
}

# 停止服务器
stop_server() {
    if ! check_server; then
        echo -e "${YELLOW}⚠️  服务器未运行${NC}"
        return
    fi

    echo -e "${BLUE}🛑 停止 live-server...${NC}"
    pkill -f "live-server.*port=$PORT"
    sleep 1

    if ! check_server; then
        echo -e "${GREEN}✅ 服务器已停止${NC}"
    else
        echo -e "${RED}❌ 停止失败，尝试强制停止...${NC}"
        pkill -9 -f "live-server.*port=$PORT"
    fi
}

# 重启服务器
restart_server() {
    echo -e "${BLUE}🔄 重启 live-server...${NC}"
    stop_server
    sleep 1
    start_server
}

# 显示状态
show_status() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Live-Server 状态"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if check_server; then
        PID=$(pgrep -f "live-server.*port=$PORT")
        echo -e "  状态: ${GREEN}运行中${NC}"
        echo "  进程ID: $PID"
        echo "  端口: $PORT"
        echo "  目录: $(pwd)/$WWW_DIR"
        echo -e "  访问: ${GREEN}http://localhost:$PORT${NC}"
        echo -e "  热重载: ${GREEN}✅ 已启用${NC}"
    else
        echo -e "  状态: ${RED}未运行${NC}"
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# 查看日志
show_logs() {
    if [ ! -f "$LOG_FILE" ]; then
        echo -e "${YELLOW}⚠️  日志文件不存在${NC}"
        return
    fi

    echo -e "${BLUE}📋 最近的日志 (按 Ctrl+C 退出):${NC}"
    echo ""
    tail -f "$LOG_FILE"
}

# 打开浏览器
open_browser() {
    echo -e "${BLUE}🌐 打开浏览器...${NC}"

    if check_server; then
        echo "请在浏览器中访问: http://localhost:$PORT"
        echo ""
        echo "在 GitHub Codespace 中:"
        echo "  1. 点击底部的 '端口' 标签"
        echo "  2. 找到端口 $PORT"
        echo "  3. 点击 '在浏览器中打开' 图标"
    else
        echo -e "${RED}❌ 服务器未运行，请先启动服务器${NC}"
    fi
}

# 测试热重载
test_reload() {
    if ! check_server; then
        echo -e "${RED}❌ 服务器未运行，请先启动服务器${NC}"
        return
    fi

    echo -e "${BLUE}🧪 测试热重载功能...${NC}"
    echo ""
    echo "1. 在浏览器中打开: http://localhost:$PORT"
    echo "2. 观察浏览器窗口"
    echo "3. 我将修改标题颜色..."
    echo ""
    read -p "按回车键继续..."

    # 备份原文件
    cp www/css/index.css www/css/index.css.backup

    # 修改颜色
    sed -i 's/#667eea/#ff6b6b/g' www/css/index.css

    echo -e "${GREEN}✅ 已修改标题颜色为红色${NC}"
    echo "浏览器应该自动刷新了！"
    echo ""
    read -p "按回车键恢复原样..."

    # 恢复原文件
    mv www/css/index.css.backup www/css/index.css

    echo -e "${GREEN}✅ 已恢复原样${NC}"
    echo "浏览器应该再次自动刷新！"
}

# 显示帮助
show_help() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  喝水打卡应用 - 开发服务器管理工具"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "用法: ./dev-server.sh [命令]"
    echo ""
    echo "命令:"
    echo "  start       启动开发服务器"
    echo "  stop        停止开发服务器"
    echo "  restart     重启开发服务器"
    echo "  status      显示服务器状态"
    echo "  logs        查看服务器日志"
    echo "  open        打开浏览器访问"
    echo "  test        测试热重载功能"
    echo "  help        显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./dev-server.sh start    # 启动服务器"
    echo "  ./dev-server.sh status   # 查看状态"
    echo "  ./dev-server.sh logs     # 查看日志"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# 主程序
case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    open)
        open_browser
        ;;
    test)
        test_reload
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${YELLOW}⚠️  未知命令: $1${NC}"
        show_help
        exit 1
        ;;
esac
