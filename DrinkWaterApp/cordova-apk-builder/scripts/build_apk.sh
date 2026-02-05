#!/bin/bash

# Cordova APK Builder - Build Script
# Builds Android APK with specified configuration

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
BUILD_TYPE="debug"
CLEAN_BUILD=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --release)
            BUILD_TYPE="release"
            shift
            ;;
        --debug)
            BUILD_TYPE="debug"
            shift
            ;;
        --clean)
            CLEAN_BUILD=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🔨 Cordova APK Builder${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Build type: $BUILD_TYPE"
echo "Clean build: $CLEAN_BUILD"
echo ""

# Check if in Cordova project
if [ ! -f "config.xml" ]; then
    echo -e "${RED}✗ Error: Not in a Cordova project directory${NC}"
    echo "  config.xml not found"
    exit 1
fi

# Check if Android platform exists
if [ ! -d "platforms/android" ]; then
    echo -e "${YELLOW}⚠ Android platform not found${NC}"
    echo "Adding Android platform..."
    cordova platform add android
fi

# Clean build if requested
if [ "$CLEAN_BUILD" = true ]; then
    echo "🧹 Cleaning previous build..."
    cordova clean android
fi

# Build APK
echo ""
echo "🔨 Building $BUILD_TYPE APK..."
echo ""

if [ "$BUILD_TYPE" = "release" ]; then
    cordova build android --release
else
    cordova build android
fi

# Find and display APK location
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Build completed successfully!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$BUILD_TYPE" = "release" ]; then
    APK_PATH="platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk"
    if [ -f "$APK_PATH" ]; then
        echo "📦 APK Location:"
        echo "   $APK_PATH"
        echo ""
        echo -e "${YELLOW}⚠ Note: Release APK is unsigned${NC}"
        echo "   You need to sign it before distribution"
        echo "   See signing_guide.md for instructions"
    fi
else
    APK_PATH="platforms/android/app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "$APK_PATH" ]; then
        echo "📦 APK Location:"
        echo "   $APK_PATH"
        echo ""
        echo "📱 Install on device:"
        echo "   adb install $APK_PATH"
        echo ""
        echo "📤 Or transfer to device and install manually"
    fi
fi

# Show APK size
if [ -f "$APK_PATH" ]; then
    SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo ""
    echo "📊 APK Size: $SIZE"
fi

echo ""
