# Flutter App Automation

A comprehensive automated testing framework for Flutter applications using WebdriverIO and Appium. This project provides end-to-end testing capabilities for the Anytime Shift employee mobile application.

## 🚀 Features

- **Cross-platform testing** for Android Flutter applications
- **Page Object Model (POM)** design pattern for maintainable test code
- **Smart scrolling** utilities for dynamic content
- **Random data generation** for unique test runs
- **Authentication flow detection** with verification screens
- **Comprehensive test coverage** including:
  - Complete registration flow with random data
  - Form validation (email, SSN/TIN, zip code, password)
  - UI element interactions
  - Scroll behavior testing
  - Language selection

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

## 📱 App Setup

### Using the Provided APK

The project includes the Anytime Shift employee app APK in the `apps/` directory:
- `com.anytimeshift.employee.debug.apk` - Main application file

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
  'appium:app': join(__dirname, 'apps', 'com.anytimeshift.employee.debug.apk'),
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
npm test
# or
npm run wdio
```

### Run Specific Test Files

```bash
# Run complete registration flow (main test)
npm run test:complete-registration

# Run field validation tests
npm run test:field-validation-all

# Run individual validation tests
npm run test:email-validation
npm run test:zip-validation
npm run test:ssn-validation

# Run tests excluding registration-tests folder
npm run test:skip-registration
```

### Run Tests with WebdriverIO CLI

```bash
# Run specific test file
npx wdio run ./wdio.conf.js --spec ./test/specs/complete-regitration-flow.e2e.js

# Run multiple test files
npx wdio run ./wdio.conf.js --spec ./test/specs/email-validation-test.e2e.js,./test/specs/zip-code-validation-test.e2e.js

# Run with different device
npx wdio run ./wdio.conf.js --capabilities.deviceName="your-device-id"
```

## 📁 Project Structure

```
flutter-app-automation/
├── apps/                          # Application APK files
│   └── com.anytimeshift.employee.debug.apk
├── test/
│   ├── pageobjects/              # Page Object Model classes
│   │   ├── BasePage.js           # Base page with common utilities
│   │   ├── LoginPage.js          # Login page interactions
│   │   ├── RegistrationPage.js   # Registration page interactions
│   │   ├── LanguageSelectionPage.js
│   │   └── AppFlow.js            # End-to-end app flow
│   ├── specs/                    # Test specifications
│   │   ├── complete-regitration-flow.e2e.js  # Main registration test
│   │   ├── email-validation-test.e2e.js      # Email field validation
│   │   ├── zip-code-validation-test.e2e.js   # ZIP code validation
│   │   ├── ssn-tin-validation-test.e2e.js    # SSN/TIN validation
│   │   ├── password-field-test.e2e.js        # Password field testing
│   │   ├── registration-tests/               # Additional registration tests (gitignored)
│   │   └── ...                   # Other test files
│   └── utils/                    # Utility functions
│       ├── scrollUtil.js         # Smart scrolling utilities
│       └── TestUtils.js          # Test utilities
├── allure-results/               # Allure test results
├── allure-report/                # Allure test reports
├── screenshots/                  # Test screenshots (gitignored)
├── selectors_file/              # Element selectors and locators
├── wdio.conf.js                 # WebdriverIO configuration
├── wdio.debug.conf.js           # Debug configuration
├── wdio.employee.conf.js        # Employee-specific configuration
├── package.json                 # Project dependencies and scripts
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🧪 Test Categories

### 1. Main Registration Flow
- `complete-regitration-flow.e2e.js` - Complete registration with random data and authentication detection

### 2. Field Validation Tests
- `email-validation-test.e2e.js` - Email field validation and error handling
- `zip-code-validation-test.e2e.js` - ZIP code field validation
- `ssn-tin-validation-test.e2e.js` - SSN/TIN field validation
- `password-field-test.e2e.js` - Password and confirm password field testing

### 3. Additional Tests (in registration-tests folder)
- Various registration flow tests (excluded from git tracking)
- Scroll behavior testing
- Dropdown functionality tests
- Page Object Model implementations

## 🔍 Key Features

### Random Data Generation
The main registration test generates unique data for each run:
- Random email addresses
- Random names (first and last)
- Random phone numbers
- Random addresses
- Random ZIP codes
- Random SSN/TIN numbers

### Authentication Flow Detection
The test automatically detects:
- "Authenticating" spinner during registration
- Verification screens with phone number input
- Verification code input fields
- Success/failure states

### Smart Element Detection
Tests use multiple selector strategies:
- Accessibility IDs (`~element`)
- XPath selectors
- Content descriptions
- Hint text matching

## 🔍 Debugging

### Enable Debug Logging

Update `wdio.conf.js`:
```javascript
logLevel: 'debug',  // Change from 'warn' to 'debug'
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
adb logcat | grep "com.anytimeshift.employee"

# Install APK
adb install apps/com.anytimeshift.employee.debug.apk

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
   - Uninstall existing app first: `adb uninstall com.anytimeshift.employee`

4. **Emulator Issues**
   - Restart Android Studio
   - Create new AVD with different API level
   - Check virtualization settings in BIOS

5. **Test Fails with "Already Taken" Error**
   - This is normal for SSN/TIN fields
   - The test uses random data to avoid this issue
   - If it still occurs, the random data generation will handle it

### Getting Help

1. Check the [Appium documentation](http://appium.io/docs/en/about-appium/intro/)
2. Review [WebdriverIO documentation](https://webdriver.io/docs/gettingstarted)
3. Check test logs in console output
4. Use Appium Inspector for element inspection

## 📊 Test Reports

### Console Output
Tests provide detailed console logging with emojis for easy reading:
- ✅ Success messages
- ❌ Error messages
- 🔄 Progress indicators
- 📝 Data logging

### Allure Reports

Generate and view Allure reports:

```bash
# Generate report
npm run generate:allure-report

# Open report in browser
npm run open:allure-report
```

## 🧹 Cleanup

Clean up test artifacts:

```bash
# Clean all test artifacts
npm run clean:all

# Clean specific artifacts
npm run clean:apps
npm run clean:screenshots
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
2. Review test logs and console output
3. Create an issue with detailed information
4. Include device/emulator specifications and error logs 