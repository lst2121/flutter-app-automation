const { join } = require('path');

exports.config = {
  runner: 'local',

  specs: ['./test/specs/**/*.js'],

  maxInstances: 1,

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '15',
    'appium:app': join(__dirname, 'apps', 'employee.apk'),
    'appium:appPackage': 'com.anytimeshift.employee',
    'appium:appActivity': '.MainActivity',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:newCommandTimeout': 30000,
    'appium:adbExecTimeout': 60000,
    // Debug-specific settings
    'appium:enforceAppInstall': true,
    'appium:allowTestPackages': true,
    'appium:skipServerInstallation': false,
    'appium:skipDeviceInitialization': false
  }],

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 1,

  services: [['appium', {
    command: 'appium',
    args: {
      address: '127.0.0.1',
      port: 4723,
      basePath: '/'
    }
  }]],
  

  framework: 'mocha',

  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
  protocol: 'http'
}; 