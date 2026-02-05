#!/bin/bash

# Cordova APK Builder - Environment Check Script
# Checks for required tools and environment variables

set -e

echo "🔍 Checking Cordova build environment..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check Cordova CLI
echo -n "Checking Cordova CLI... "
if command -v cordova &> /dev/null; then
    VERSION=$(cordova --version)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Install: npm install -g cordova"
    ERRORS=$((ERRORS + 1))
fi

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    ERRORS=$((ERRORS + 1))
fi

# Check Java JDK
echo -n "Checking Java JDK... "
if command -v java &> /dev/null; then
    VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Install Java JDK 11 or higher"
    ERRORS=$((ERRORS + 1))
fi

# Check ANDROID_HOME
echo -n "Checking ANDROID_HOME... "
if [ -n "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✓${NC} Set: $ANDROID_HOME"
else
    echo -e "${RED}✗${NC} Not set"
    echo "  Set ANDROID_HOME environment variable"
    ERRORS=$((ERRORS + 1))
fi

# Check Android SDK tools
if [ -n "$ANDROID_HOME" ]; then
    echo -n "Checking Android SDK tools... "
    if [ -d "$ANDROID_HOME/tools" ] || [ -d "$ANDROID_HOME/cmdline-tools" ]; then
        echo -e "${GREEN}✓${NC} Found"
    else
        echo -e "${YELLOW}⚠${NC} Not found in expected location"
        WARNINGS=$((WARNINGS + 1))
    fi

    echo -n "Checking Android platform-tools... "
    if [ -d "$ANDROID_HOME/platform-tools" ]; then
        echo -e "${GREEN}✓${NC} Found"
    else
        echo -e "${RED}✗${NC} Not found"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Check Gradle
echo -n "Checking Gradle... "
if command -v gradle &> /dev/null; then
    VERSION=$(gradle --version 2>&1 | grep "Gradle" | head -n 1)
    echo -e "${GREEN}✓${NC} Found: $VERSION"
else
    echo -e "${YELLOW}⚠${NC} Not found (Cordova will use wrapper)"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Environment check passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) - build may still work${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ Environment check failed with $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above before building."
    exit 1
fi
