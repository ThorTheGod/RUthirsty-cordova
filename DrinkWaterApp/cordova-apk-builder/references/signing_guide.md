# APK Signing Guide

## Overview

Android requires all APKs to be digitally signed before installation. Debug builds are automatically signed with a debug key, but release builds need to be signed with your own key for distribution.

## Quick Start

### For Testing (Debug Build)
Debug builds are automatically signed and ready to install:
```bash
cordova build android
# APK at: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### For Distribution (Release Build)
Release builds require manual signing:
```bash
cordova build android --release
# Creates unsigned APK that needs signing
```

## Creating a Signing Key

### Step 1: Generate Keystore

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Important:**
- Store the keystore file securely
- Remember the passwords (you'll need them for every release)
- Validity is in days (10000 = ~27 years)

### Step 2: Answer Prompts

```
Enter keystore password: [your password]
Re-enter new password: [your password]
What is your first and last name? [Your Name]
What is the name of your organizational unit? [Your Company]
What is the name of your organization? [Your Organization]
What is the name of your City or Locality? [Your City]
What is the name of your State or Province? [Your State]
What is the two-letter country code for this unit? [US]
```

## Signing Methods

### Method 1: Automatic Signing (Recommended)

Create `platforms/android/release-signing.properties`:

```properties
storeFile=/path/to/my-release-key.keystore
storeType=jks
keyAlias=my-key-alias
storePassword=your-keystore-password
keyPassword=your-key-password
```

**Security Note:** Add this file to `.gitignore`!

Then build:
```bash
cordova build android --release
# APK will be automatically signed
```

### Method 2: Manual Signing

Build unsigned APK:
```bash
cordova build android --release
```

Sign manually:
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore my-release-key.keystore \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  my-key-alias
```

Verify signature:
```bash
jarsigner -verify -verbose -certs \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Method 3: Using build.json

Create `build.json` in project root:

```json
{
  "android": {
    "debug": {
      "keystore": "debug.keystore",
      "storePassword": "android",
      "alias": "androiddebugkey",
      "password": "android",
      "keystoreType": ""
    },
    "release": {
      "keystore": "/path/to/my-release-key.keystore",
      "storePassword": "your-password",
      "alias": "my-key-alias",
      "password": "your-password",
      "keystoreType": ""
    }
  }
}
```

**Security Note:** Add `build.json` to `.gitignore`!

Build:
```bash
cordova build android --release
```

## APK Alignment (Optional but Recommended)

Zipalign optimizes the APK for better performance:

```bash
zipalign -v 4 \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  platforms/android/app/build/outputs/apk/release/app-release.apk
```

## Verification

### Verify Signature
```bash
jarsigner -verify -verbose -certs app-release.apk
```

### Check APK Info
```bash
aapt dump badging app-release.apk
```

### Verify Alignment
```bash
zipalign -c -v 4 app-release.apk
```

## Security Best Practices

### 1. Protect Your Keystore
- **Never commit keystore to version control**
- Store in secure location (encrypted drive, password manager)
- Create backups in multiple secure locations
- If lost, you cannot update your app!

### 2. Use Strong Passwords
- Minimum 8 characters
- Mix of letters, numbers, symbols
- Different passwords for keystore and key

### 3. Secure Configuration Files
Add to `.gitignore`:
```
# Signing files
*.keystore
*.jks
build.json
release-signing.properties
```

### 4. Environment Variables (Alternative)
Instead of files, use environment variables:

```bash
export ANDROID_KEYSTORE=/path/to/keystore
export ANDROID_KEYSTORE_PASSWORD=your-password
export ANDROID_KEY_ALIAS=your-alias
export ANDROID_KEY_PASSWORD=your-password
```

Reference in build.json:
```json
{
  "android": {
    "release": {
      "keystore": "${ANDROID_KEYSTORE}",
      "storePassword": "${ANDROID_KEYSTORE_PASSWORD}",
      "alias": "${ANDROID_KEY_ALIAS}",
      "password": "${ANDROID_KEY_PASSWORD}"
    }
  }
}
```

## Google Play Store Requirements

### App Signing by Google Play (Recommended)

Google Play can manage your signing key:
1. Upload your APK to Google Play Console
2. Enroll in App Signing by Google Play
3. Google re-signs with their key
4. You keep your upload key

Benefits:
- Google secures your signing key
- Can reset upload key if lost
- Optimized APK delivery

### Manual Signing

If not using Google Play App Signing:
- Use the same keystore for all updates
- Never lose your keystore
- Cannot recover if lost

## Troubleshooting

### "jarsigner: command not found"
Install Java JDK and ensure it's in PATH

### "keytool: command not found"
Java JDK not installed or not in PATH

### "keystore tampered with, or password incorrect"
Wrong password or corrupted keystore

### "APK Signature Scheme v2 verification failed"
Use newer build tools or add to build.gradle:
```gradle
android {
    signingConfigs {
        release {
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }
}
```

## Quick Reference

```bash
# Generate keystore
keytool -genkey -v -keystore my-key.keystore -alias my-alias -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cordova build android --release

# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-key.keystore app-release-unsigned.apk my-alias

# Verify signature
jarsigner -verify -verbose -certs app-release.apk

# Align APK
zipalign -v 4 app-release-unsigned.apk app-release.apk

# Verify alignment
zipalign -c -v 4 app-release.apk
```

## Resources

- [Android App Signing](https://developer.android.com/studio/publish/app-signing)
- [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/)
- [Google Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)
