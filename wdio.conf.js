const { join } = require('path');
const HtmlReporter = require('@rpii/wdio-html-reporter').HtmlReporter;

exports.config = {
  runner: 'local',

  specs: ['./test/specs/**/*.js'],

  maxInstances: 1,

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '15',
    'appium:app': join(__dirname, 'apps', 'com.anytimeshift.employee.debug.apk'),
    'appium:appPackage': 'com.anytimeshift.employee',
    'appium:appActivity': '.MainActivity',
    'appium:appWaitActivity': '*',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:newCommandTimeout': 30000,
    'appium:adbExecTimeout': 60000
  }],

  // logLevel: 'warn',
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

  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }]
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 150000
  },

  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
  protocol: 'http',
};
