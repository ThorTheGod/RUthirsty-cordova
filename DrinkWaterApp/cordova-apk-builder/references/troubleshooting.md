# Cordova Build Troubleshooting Guide

## Common Build Errors and Solutions

### 1. ANDROID_HOME Not Set

**Error:**
```
Failed to find 'ANDROID_HOME' environment variable
ANDROID_SDK_ROOT=undefined
```

**Solution:**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Add to ~/.bashrc or ~/.zshrc for persistence
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools' >> ~/.bashrc
```

### 2. Java Version Issues

**Error:**
```
java.lang.UnsupportedClassVersionError
Unsupported class file major version
```

**Solution:**
- Install Java JDK 11 or higher
- Check version: `java -version`
- Set JAVA_HOME if needed:
  ```bash
  export JAVA_HOME=/path/to/jdk
  ```

### 3. Gradle Build Failed

**Error:**
```
Gradle build failed with exit code 1
Could not resolve all dependencies
```

**Solutions:**

**Option 1: Clean and rebuild**
```bash
cordova clean android
cordova build android
```

**Option 2: Remove and re-add platform**
```bash
cordova platform rm android
cordova platform add android
cordova build android
```

**Option 3: Clear Gradle cache**
```bash
cd platforms/android
./gradlew clean
cd ../..
cordova build android
```

### 4. SDK Not Found

**Error:**
```
SDK location not found
Failed to find target with hash string 'android-33'
```

**Solution:**
```bash
# Install required SDK components
sdkmanager "platforms;android-33"
sdkmanager "build-tools;33.0.0"
sdkmanager "platform-tools"

# Or use Android Studio SDK Manager
```

### 5. License Not Accepted

**Error:**
```
You have not accepted the license agreements
```

**Solution:**
```bash
$ANDROID_HOME/tools/bin/sdkmanager --licenses
# Type 'y' to accept all licenses
```

### 6. Out of Memory

**Error:**
```
OutOfMemoryError: Java heap space
```

**Solution:**

Create or edit `platforms/android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m
org.gradle.daemon=true
org.gradle.parallel=true
```

### 7. Plugin Errors

**Error:**
```
Plugin 'cordova-plugin-xxx' not found
Failed to restore plugin
```

**Solutions:**

**Option 1: Reinstall plugin**
```bash
cordova plugin rm cordova-plugin-xxx
cordova plugin add cordova-plugin-xxx
```

**Option 2: Rebuild platform**
```bash
cordova platform rm android
cordova platform add android
```

### 8. Network/Download Errors

**Error:**
```
Could not download gradle-x.x.x.zip
Connection refused
```

**Solutions:**
- Check internet connection
- Retry the build (temporary network issue)
- If behind proxy, configure Gradle proxy in `~/.gradle/gradle.properties`:
  ```properties
  systemProp.http.proxyHost=proxy.company.com
  systemProp.http.proxyPort=8080
  systemProp.https.proxyHost=proxy.company.com
  systemProp.https.proxyPort=8080
  ```

### 9. Build Tools Version Mismatch

**Error:**
```
Failed to find Build Tools revision xx.x.x
```

**Solution:**
```bash
# List installed build tools
sdkmanager --list | grep build-tools

# Install required version
sdkmanager "build-tools;33.0.0"
```

### 10. Duplicate Resources

**Error:**
```
Duplicate resources
Resource 'xxx' already defined
```

**Solution:**
- Check for duplicate plugins
- Remove conflicting plugins:
  ```bash
  cordova plugin list
  cordova plugin rm <duplicate-plugin>
  ```

## General Troubleshooting Steps

### Step 1: Verify Environment
```bash
# Run environment check
bash scripts/check_environment.sh
```

### Step 2: Clean Build
```bash
cordova clean android
rm -rf platforms/android/app/build
cordova build android
```

### Step 3: Fresh Platform
```bash
cordova platform rm android
cordova platform add android
cordova build android
```

### Step 4: Check Logs
```bash
# Build with verbose output
cordova build android --verbose

# Check Gradle logs
cat platforms/android/app/build/outputs/logs/manifest-merger-debug-report.txt
```

### Step 5: Verify config.xml
- Check for syntax errors
- Verify plugin versions
- Check platform version

## Platform-Specific Issues

### Windows
- Use forward slashes in paths
- Run Command Prompt as Administrator
- Check Windows Defender/Antivirus

### macOS
- Install Xcode Command Line Tools
- Check file permissions
- Use `sudo` if permission denied

### Linux
- Install required libraries:
  ```bash
  sudo apt-get install lib32z1 lib32ncurses5 lib32stdc++6
  ```
- Check file permissions

## Performance Optimization

### Speed Up Builds
```bash
# Enable Gradle daemon
echo "org.gradle.daemon=true" >> platforms/android/gradle.properties

# Enable parallel builds
echo "org.gradle.parallel=true" >> platforms/android/gradle.properties

# Increase memory
echo "org.gradle.jvmargs=-Xmx2048m" >> platforms/android/gradle.properties
```

## Getting Help

If issues persist:
1. Check Cordova documentation: https://cordova.apache.org/docs/
2. Search Stack Overflow with error message
3. Check Cordova GitHub issues
4. Run diagnosis script: `bash scripts/diagnose_errors.sh error.log`
