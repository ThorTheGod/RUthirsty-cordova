#!/bin/bash

# 喝水打卡应用构建脚本

echo "================================"
echo "  喝水打卡应用 - 构建脚本"
echo "================================"
echo ""

# 检查Cordova是否安装
if ! command -v cordova &> /dev/null; then
    echo "❌ Cordova未安装"
    echo "正在安装Cordova..."
    npm install -g cordova
fi

echo "✅ Cordova版本: $(cordova --version)"
echo ""

# 检查Android平台
if [ ! -d "platforms/android" ]; then
    echo "📱 添加Android平台..."
    cordova platform add android
else
    echo "✅ Android平台已存在"
fi

echo ""
echo "选择构建选项："
echo "1) 构建调试版APK"
echo "2) 构建发布版APK"
echo "3) 在浏览器中测试"
echo "4) 在连接的设备上运行"
echo "5) 在模拟器上运行"
echo ""
read -p "请选择 (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🔨 构建调试版APK..."
        cordova build android
        echo ""
        echo "✅ 构建完成！"
        echo "APK位置: platforms/android/app/build/outputs/apk/debug/app-debug.apk"
        ;;
    2)
        echo ""
        echo "🔨 构建发布版APK..."
        cordova build android --release
        echo ""
        echo "✅ 构建完成！"
        echo "APK位置: platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
        echo "注意：发布版需要签名才能安装"
        ;;
    3)
        echo ""
        echo "🌐 启动浏览器测试服务器..."
        echo "访问地址: http://localhost:8000"
        cd www && python3 -m http.server 8000
        ;;
    4)
        echo ""
        echo "📱 检查连接的设备..."
        adb devices
        echo ""
        echo "🚀 在设备上运行应用..."
        cordova run android
        ;;
    5)
        echo ""
        echo "📱 可用的模拟器："
        cordova run android --list
        echo ""
        echo "🚀 在模拟器上运行应用..."
        cordova emulate android
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "  完成！"
echo "================================"
