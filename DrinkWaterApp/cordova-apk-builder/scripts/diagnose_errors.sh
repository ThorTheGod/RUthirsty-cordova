#!/bin/bash

# Cordova APK Builder - Error Diagnosis Script
# Analyzes build errors and suggests solutions

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERROR_LOG="$1"

if [ -z "$ERROR_LOG" ]; then
    echo "Usage: $0 <error_log_file>"
    exit 1
fi

if [ ! -f "$ERROR_LOG" ]; then
    echo "Error log file not found: $ERROR_LOG"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🔍 Cordova Build Error Diagnosis${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for common errors
FOUND_ISSUE=false

# ANDROID_HOME not set
if grep -q "ANDROID_HOME" "$ERROR_LOG" || grep -q "ANDROID_SDK_ROOT" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: ANDROID_HOME not set${NC}"
    echo ""
    echo "Solution:"
    echo "  export ANDROID_HOME=\$HOME/Android/Sdk"
    echo "  export PATH=\$PATH:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools"
    echo ""
    FOUND_ISSUE=true
fi

# Java version issues
if grep -q "java.lang.UnsupportedClassVersionError" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: Java version mismatch${NC}"
    echo ""
    echo "Solution:"
    echo "  Install Java JDK 11 or higher"
    echo "  Check version: java -version"
    echo ""
    FOUND_ISSUE=true
fi

# Gradle issues
if grep -q "Could not find gradle" "$ERROR_LOG" || grep -q "Gradle build failed" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: Gradle build failed${NC}"
    echo ""
    echo "Solutions:"
    echo "  1. Clean and rebuild:"
    echo "     cordova clean android"
    echo "     cordova build android"
    echo ""
    echo "  2. Check Gradle wrapper:"
    echo "     cd platforms/android"
    echo "     ./gradlew clean"
    echo ""
    FOUND_ISSUE=true
fi

# SDK not found
if grep -q "SDK location not found" "$ERROR_LOG" || grep -q "failed to find target" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: Android SDK not found or incomplete${NC}"
    echo ""
    echo "Solutions:"
    echo "  1. Install Android Studio and SDK"
    echo "  2. Set ANDROID_HOME correctly"
    echo "  3. Install required SDK platforms:"
    echo "     sdkmanager \"platforms;android-33\""
    echo "     sdkmanager \"build-tools;33.0.0\""
    echo ""
    FOUND_ISSUE=true
fi

# License not accepted
if grep -q "license" "$ERROR_LOG" && grep -q "not been accepted" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: Android SDK licenses not accepted${NC}"
    echo ""
    echo "Solution:"
    echo "  \$ANDROID_HOME/tools/bin/sdkmanager --licenses"
    echo "  (Accept all licenses by typing 'y')"
    echo ""
    FOUND_ISSUE=true
fi

# Out of memory
if grep -q "OutOfMemoryError" "$ERROR_LOG" || grep -q "Java heap space" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: Out of memory during build${NC}"
    echo ""
    echo "Solution:"
    echo "  Increase Gradle memory in platforms/android/gradle.properties:"
    echo "  org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m"
    echo ""
    FOUND_ISSUE=true
fi

# Plugin issues
if grep -q "plugin" "$ERROR_LOG" && grep -q "not found" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: Cordova plugin error${NC}"
    echo ""
    echo "Solutions:"
    echo "  1. Remove and re-add plugins:"
    echo "     cordova plugin rm <plugin-name>"
    echo "     cordova plugin add <plugin-name>"
    echo ""
    echo "  2. Remove and re-add Android platform:"
    echo "     cordova platform rm android"
    echo "     cordova platform add android"
    echo ""
    FOUND_ISSUE=true
fi

# Network/download issues
if grep -q "Could not download" "$ERROR_LOG" || grep -q "Connection refused" "$ERROR_LOG"; then
    echo -e "${RED}✗ Issue: Network/download error${NC}"
    echo ""
    echo "Solutions:"
    echo "  1. Check internet connection"
    echo "  2. Try again (temporary network issue)"
    echo "  3. Check proxy settings if behind firewall"
    echo ""
    FOUND_ISSUE=true
fi

if [ "$FOUND_ISSUE" = false ]; then
    echo -e "${YELLOW}⚠ No common issues detected${NC}"
    echo ""
    echo "Please review the full error log for details:"
    echo "  $ERROR_LOG"
    echo ""
    echo "Common troubleshooting steps:"
    echo "  1. Clean build: cordova clean android"
    echo "  2. Remove and re-add platform:"
    echo "     cordova platform rm android"
    echo "     cordova platform add android"
    echo "  3. Check environment: run check_environment.sh"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "For more help, see references/troubleshooting.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
