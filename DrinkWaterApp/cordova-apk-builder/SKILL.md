---
name: cordova-apk-builder
description: Automates building Android APK files from Cordova projects. Use when the user wants to build, package, or generate an APK from a Cordova/PhoneGap application. Triggers include mentions of "build APK", "package Android", "generate APK", "cordova build android", "create APK", or when the user needs to compile their Cordova app for Android distribution or testing. Also use when build errors occur and diagnosis is needed.
---

# Cordova APK Builder

Automates the complete workflow for building Android APK files from Cordova projects, including environment validation, build execution, error diagnosis, and signing guidance.

## Workflow

### 1. Verify Cordova Project

First, confirm you're in a Cordova project directory:

```bash
# Check for config.xml
ls config.xml

# Check project structure
ls -la platforms/ www/
```

### 2. Check Environment

Run the environment check script to verify all required tools:

```bash
bash cordova-apk-builder/scripts/check_environment.sh
```

This checks:
- Cordova CLI
- Node.js
- Java JDK
- ANDROID_HOME environment variable
- Android SDK tools and platform-tools
- Gradle (optional, Cordova uses wrapper if not found)

**If environment check fails:** Follow the error messages to install missing tools.

**Note:** In GitHub Codespaces or environments without Android SDK, you'll need to:
1. Install Android SDK locally (see ANDROID_SDK_SETUP_GUIDE.md)
2. Or use GitHub Actions for automated builds
3. Or continue development in browser mode

### 3. Choose Build Type

**Debug Build** (for testing):
- Automatically signed with debug key
- Larger file size
- Includes debugging symbols
- Ready to install immediately

**Release Build** (for distribution):
- Requires manual signing
- Optimized and smaller
- No debugging symbols
- Needs signing before installation

### 4. Build APK

**For Debug Build:**
```bash
bash cordova-apk-builder/scripts/build_apk.sh --debug
```

**For Release Build:**
```bash
bash cordova-apk-builder/scripts/build_apk.sh --release
```

**For Clean Build:**
```bash
bash cordova-apk-builder/scripts/build_apk.sh --debug --clean
```

The script will:
- Verify project structure
- Add Android platform if missing
- Clean previous builds (if --clean specified)
- Execute cordova build
- Display APK location and size
- Provide installation instructions

### 5. Locate APK

**Debug APK:**
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK (unsigned):**
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 6. Install or Distribute

**Debug APK - Install on Device:**
```bash
# Via ADB
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk

# Or transfer to device and install manually
```

**Release APK - Sign First:**
See [references/signing_guide.md](references/signing_guide.md) for complete signing instructions.

## Error Handling

### When Build Fails

1. **Save error output to file:**
   ```bash
   cordova build android 2>&1 | tee build_error.log
   ```

2. **Run diagnosis script:**
   ```bash
   bash cordova-apk-builder/scripts/diagnose_errors.sh build_error.log
   ```

3. **Follow suggested solutions** from the diagnosis output

4. **For detailed troubleshooting:** See [references/troubleshooting.md](references/troubleshooting.md)

### Common Quick Fixes

**Environment issues:**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**Build cache issues:**
```bash
cordova clean android
cordova build android
```

**Platform corruption:**
```bash
cordova platform rm android
cordova platform add android
cordova build android
```

## Manual Build Commands

If you prefer manual control:

```bash
# Add Android platform
cordova platform add android

# Build debug
cordova build android

# Build release
cordova build android --release

# Build with verbose output
cordova build android --verbose

# Clean build
cordova clean android
```

## APK Signing (Release Only)

Release APKs must be signed before distribution. Three methods available:

### Method 1: Automatic (Recommended)

Create `platforms/android/release-signing.properties`:
```properties
storeFile=/path/to/my-release-key.keystore
keyAlias=my-key-alias
storePassword=your-password
keyPassword=your-password
```

Then build - APK will be automatically signed.

### Method 2: build.json

Create `build.json` in project root with signing configuration.

### Method 3: Manual Signing

Use jarsigner after building unsigned APK.

**Complete signing guide:** [references/signing_guide.md](references/signing_guide.md)

## Scripts Reference

### check_environment.sh
Validates build environment and reports missing dependencies.

**Usage:**
```bash
bash cordova-apk-builder/scripts/check_environment.sh
```

**Output:** Green checkmarks for found tools, red X for missing tools with installation instructions.

### build_apk.sh
Executes the complete build workflow with progress feedback.

**Usage:**
```bash
bash cordova-apk-builder/scripts/build_apk.sh [--debug|--release] [--clean]
```

**Options:**
- `--debug`: Build debug APK (default)
- `--release`: Build release APK
- `--clean`: Clean before building

**Output:** Build progress, APK location, size, and installation instructions.

### diagnose_errors.sh
Analyzes build error logs and suggests solutions.

**Usage:**
```bash
bash cordova-apk-builder/scripts/diagnose_errors.sh <error_log_file>
```

**Detects:**
- ANDROID_HOME issues
- Java version problems
- Gradle failures
- SDK not found
- License not accepted
- Memory errors
- Plugin issues
- Network errors

## Best Practices

### Before Building

1. **Test in browser first** (if possible):
   ```bash
   cordova serve
   ```

2. **Verify config.xml** is correct:
   - App name, version, package ID
   - Required plugins
   - Platform version

3. **Check environment** is properly configured

### During Development

- Use **debug builds** for testing
- Keep **ANDROID_HOME** set in shell profile
- Run **clean builds** when switching branches

### For Release

- Use **release builds** only for distribution
- **Sign APKs** properly with your keystore
- **Test signed APK** before distribution
- **Keep keystore secure** and backed up

### Performance

- Enable Gradle daemon for faster builds
- Use parallel builds
- Increase Gradle memory if needed

See [references/troubleshooting.md](references/troubleshooting.md) for optimization details.

## Resources

### Bundled References

- **[troubleshooting.md](references/troubleshooting.md)** - Complete error reference with solutions for all common build issues
- **[signing_guide.md](references/signing_guide.md)** - Comprehensive APK signing guide for release distribution

### External Documentation

- [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Cordova CLI Reference](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/)
