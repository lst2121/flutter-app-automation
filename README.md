# Flutter App Automation

A comprehensive automated testing framework for Flutter applications using WebdriverIO and Appium. This project provides end-to-end testing capabilities for the Anytime Shift employee mobile application.

## 🚀 Features

- **Cross-platform testing** for Android Flutter applications
- **Page Object Model (POM)** design pattern for maintainable test code
- **Visual testing** capabilities with screenshot comparison
- **Smart scrolling** utilities for dynamic content
- **Comprehensive test coverage** including:
  - Language selection
  - Login/Registration flows
  - Form validation
  - UI element interactions
  - Scroll behavior testing

## 📋 Prerequisites

Before setting up this project, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Java Development Kit (JDK)** (v8 or higher)
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
   - Verify installation: `java -version`

3. **Android Studio** with Android SDK
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK Platform 30 or higher
   - Install Android SDK Build-Tools

4. **Appium** (v2.x)
   - Install globally: `npm install -g appium`
   - Verify installation: `appium --version`

5. **Android Emulator or Physical Device**
   - Set up Android Virtual Device (AVD) through Android Studio
   - Or connect a physical Android device with USB debugging enabled

### Environment Variables

Set up the following environment variables:

```bash
# Android SDK
export ANDROID_HOME=/path/to/your/android/sdk
export ANDROID_SDK_ROOT=/path/to/your/android/sdk

# Add to PATH
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flutter-app-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify Appium installation**
   ```bash
   appium driver install uiautomator2
   appium driver list
   ```

## 🔗 Connecting to Local Codebase

**For development with your own Flutter app, see [LOCAL_DEVELOPMENT_SETUP.md](./LOCAL_DEVELOPMENT_SETUP.md)**

Quick setup for local development:

```bash
# Run the setup script
node setup-local-dev.js

# Follow the prompts to configure your app
# Then build and test your local app
npm run dev:test
```

## 📱 App Setup

### Using the Provided APK

The project includes the Anytime Shift employee app APK in the `apps/` directory:
- `com.anytimeshift.employee.apk` - Main application file
- `Anytime Shift_1.0.45_APKPure.xapk` - Alternative package format

### Using Your Own APK

To test a different Flutter app:

1. Place your APK file in the `apps/` directory
2. Update the `wdio.conf.js` file:
   ```javascript
   'appium:app': join(__dirname, 'apps', 'your-app.apk'),
   'appium:appPackage': 'your.app.package',
   'appium:appActivity': '.YourMainActivity',
   ```

## 🔧 Configuration

### WebdriverIO Configuration

The main configuration is in `wdio.conf.js`:

```javascript
capabilities: [{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'emulator-5554',  // Update with your device
  'appium:platformVersion': '15',        // Update with your Android version
  'appium:app': join(__dirname, 'apps', 'com.anytimeshift.employee.apk'),
  'appium:appPackage': 'com.anytimeshift.employee',
  'appium:appActivity': '.MainActivity',
  'appium:autoGrantPermissions': true,
  'appium:noReset': false,
  'appium:newCommandTimeout': 30000,
  'appium:adbExecTimeout': 60000
}]
```

### Device Configuration

Update the device configuration in `wdio.conf.js`:

1. **For Emulator:**
   ```javascript
   'appium:deviceName': 'emulator-5554',
   'appium:platformVersion': '15',
   ```

2. **For Physical Device:**
   ```javascript
   'appium:deviceName': 'your-device-id',  // Get from 'adb devices'
   'appium:platformVersion': 'your-android-version',
   ```

## 🚀 Running Tests

### Start Appium Server

1. **Start Appium server manually:**
   ```bash
   appium
   ```

2. **Or let WebdriverIO start it automatically** (configured in wdio.conf.js)

### Run All Tests

```bash
npm run wdio
```

### Run Specific Test Files

```bash
# Run login tests
npx wdio run ./wdio.conf.js --spec ./test/specs/login-page.e2e.js

# Run registration tests
npx wdio run ./wdio.conf.js --spec ./test/specs/registration-page.e2e.js

# Run language selection tests
npx wdio run ./wdio.conf.js --spec ./test/specs/language-selection.e2e.js

# Run local development tests
npm run test:local
```

### Run Tests with Specific Capabilities

```bash
# Run with different device
npx wdio run ./wdio.conf.js --capabilities.deviceName="your-device-id"
```

### Development Workflow

```bash
# Build and test your local app
npm run dev:test

# Run in debug mode
npm run test:debug

# Watch mode for development
npm run dev:watch
```

## 📁 Project Structure

```
flutter-app-automation/
├── apps/                          # Application APK files
│   ├── com.anytimeshift.employee.apk
│   └── Anytime Shift_1.0.45_APKPure.xapk
├── test/
│   ├── pageobjects/              # Page Object Model classes
│   │   ├── BasePage.js           # Base page with common utilities
│   │   ├── LoginPage.js          # Login page interactions
│   │   ├── RegistrationPage.js   # Registration page interactions
│   │   ├── LanguageSelectionPage.js
│   │   └── AppFlow.js            # End-to-end app flow
│   ├── specs/                    # Test specifications
│   │   ├── login-page.e2e.js
│   │   ├── registration-page.e2e.js
│   │   ├── language-selection.e2e.js
│   │   ├── local-dev.e2e.js      # Local development tests
│   │   └── ...                   # Other test files
│   └── utils/                    # Utility functions
│       └── scrollUtil.js         # Smart scrolling utilities
├── screenshots/                  # Test screenshots and visual comparisons
├── selectors_file/              # Element selectors and locators
├── wdio.conf.js                 # WebdriverIO configuration
├── package.json                 # Project dependencies
├── setup-local-dev.js           # Local development setup script
├── LOCAL_DEVELOPMENT_SETUP.md   # Local development guide
└── README.md                    # This file
```

## 🧪 Test Categories

### 1. Language Selection Tests
- `language-selection.e2e.js` - Tests language selection flow

### 2. Authentication Tests
- `login-page.e2e.js` - Login page functionality
- `registration-page.e2e.js` - Registration form testing
- `registration-new.e2e.js` - Enhanced registration tests

### 3. Form Validation Tests
- `complete-registration-form.e2e.js` - Complete form validation
- `debug-zip-ssn.e2e.js` - ZIP and SSN field validation

### 4. UI Interaction Tests
- `scroll-test.e2e.js` - Scroll behavior testing
- `scroll-test-clean.e2e.js` - Clean scroll tests
- `state-dropdown-test.e2e.js` - Dropdown functionality
- `residence-dropdown-test.e2e.js` - Residence dropdown tests

### 5. Page Object Model Tests
- `pom-simple-test.e2e.js` - Basic POM implementation
- `pom-enhanced-test.e2e.js` - Enhanced POM tests
- `pom-registration-test.e2e.js` - POM registration flow

### 6. Local Development Tests
- `local-dev.e2e.js` - Local development and debugging tests

## 🔍 Debugging

### Enable Debug Logging

Update `wdio.conf.js`:
```javascript
logLevel: 'debug',  // Change from 'info' to 'debug'
```

### Take Screenshots

Tests automatically capture screenshots on failures. Manual screenshots:
```javascript
await driver.saveScreenshot('./screenshots/debug.png');
```

### View Appium Logs

```bash
appium --log appium.log
```

### ADB Commands for Debugging

```bash
# List connected devices
adb devices

# View app logs
adb logcat | grep "your-app-package"

# Install APK
adb install apps/com.anytimeshift.employee.apk

# Uninstall app
adb uninstall com.anytimeshift.employee
```

## 🐛 Troubleshooting

### Common Issues

1. **Appium Connection Failed**
   - Ensure Appium server is running on port 4723
   - Check firewall settings
   - Verify device/emulator is connected

2. **Element Not Found**
   - Check element selectors in test files
   - Verify app is in correct state
   - Use Appium Inspector to verify element locators

3. **APK Installation Failed**
   - Check APK file integrity
   - Verify device has enough storage
   - Uninstall existing app first

4. **Emulator Issues**
   - Restart Android Studio
   - Create new AVD with different API level
   - Check virtualization settings in BIOS

### Getting Help

1. Check the [Appium documentation](http://appium.io/docs/en/about-appium/intro/)
2. Review [WebdriverIO documentation](https://webdriver.io/docs/gettingstarted)
3. Check test logs in `screenshots/` directory
4. Use Appium Inspector for element inspection

## 📊 Test Reports

Test results are displayed in the console with detailed logging. For enhanced reporting, consider adding:

```bash
npm install @wdio/allure-reporter --save-dev
```

Update `wdio.conf.js`:
```javascript
reporters: ['spec', ['allure', {
  outputDir: 'allure-results',
  disableWebdriverStepsReporting: true,
  disableWebdriverScreenshotsReporting: false,
}]],
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review test logs and screenshots
3. Create an issue with detailed information
4. Include device/emulator specifications and error logs 