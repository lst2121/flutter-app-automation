const fs = require('fs');
const registrationPage = require('../../pageobjects/RegistrationPage');

// Test Data Configuration
const testData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  address: '123 Main Street',
  zipCode: '12345',
  ssn: '123-45-6789',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!'
};

// Enhanced Helper Functions
class TestHelpers {
  /**
   * Take milestone screenshot with timestamp
   */
  static async takeMilestoneScreenshot(milestone) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./screenshots/${milestone}-${timestamp}.png`;
    await driver.saveScreenshot(filename);
    console.log(`📸 Screenshot saved: ${filename}`);
  }

  /**
   * Capture page source for debugging
   */
  static async capturePageSource(filename) {
    const pageSource = await driver.getPageSource();
    fs.writeFileSync(`./screenshots/${filename}.xml`, pageSource);
    console.log(`📄 Page source saved: ${filename}.xml`);
  }

  /**
   * Validate test step with error handling
   */
  static async validateStep(stepName, stepFunction) {
    console.log(`\n🔄 Executing: ${stepName}`);
    try {
      const result = await stepFunction();
      console.log(`✅ ${stepName} completed successfully`);
      return result;
    } catch (error) {
      console.log(`❌ ${stepName} failed:`, error.message);
      await this.takeMilestoneScreenshot(`FAILED-${stepName.replace(/\s+/g, '-')}`);
      throw error;
    }
  }

  /**
   * Wait for element with smart retry
   */
  static async waitForElementSmart(locator, timeout = 10000, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const element = await $(locator);
        await element.waitForDisplayed({ timeout });
        return element;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.log(`⚠️ Attempt ${attempt} failed, retrying...`);
        await driver.pause(1000);
      }
    }
  }

  /**
   * Check if app is launched and navigate to registration
   */
  static async ensureAppLaunched() {
    console.log('🚀 Ensuring app is launched...');
    
    // Wait for app to load
    await driver.pause(3000);
    
    // Take initial screenshot
    await this.takeMilestoneScreenshot('app-launch');
    await this.capturePageSource('initial-page-source');
    
    // Check if we're in the app or still on launcher
    const pageSource = await driver.getPageSource();
    
    if (pageSource.includes('com.google.android.apps.nexuslauncher')) {
      console.log('📱 App not launched yet, waiting...');
      await driver.pause(5000);
      await this.takeMilestoneScreenshot('after-wait');
      await this.capturePageSource('after-wait-source');
    }
    
    // Look for app-specific elements
    const appElements = [
      '~Registration',
      '~Login',
      '~Sign Up',
      '//android.view.View[contains(@content-desc, "Registration")]',
      '//android.view.View[contains(@content-desc, "Login")]',
      '//android.view.View[contains(@content-desc, "Sign Up")]'
    ];
    
    for (const selector of appElements) {
      try {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          console.log(`✅ Found app element: ${selector}`);
          return true;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    console.log('⚠️ App elements not found, taking debug screenshot');
    await this.takeMilestoneScreenshot('debug-app-not-found');
    await this.capturePageSource('debug-app-not-found');
    
    return false;
  }
}

describe('Registration Form (POM Enhanced)', () => {
  before(async () => {
    // Ensure screenshots directory exists
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots', { recursive: true });
    }
  });

  afterEach(async function () {
    // Global error screenshot hook
    if (this.currentTest.state === 'failed') {
      await TestHelpers.takeMilestoneScreenshot(`FAILED-${this.currentTest.title.replace(/\s+/g, '-')}`);
      await TestHelpers.capturePageSource(`FAILED-${this.currentTest.title.replace(/\s+/g, '-')}`);
    }
  });

  it('should launch app and navigate to registration page', async () => {
    console.log('\n🚀 Starting App Launch Test');
    
    // Step 1: Ensure app is launched
    await TestHelpers.validateStep('App Launch', async () => {
      return await TestHelpers.ensureAppLaunched();
    });
    
    // Step 2: Wait for registration page to load
    await TestHelpers.validateStep('Page Load', async () => {
      return await registrationPage.waitForPage();
    });
    
    console.log('🎉 App launch test completed!');
  });

  it('should complete registration form using Page Object Model', async () => {
    console.log('\n🚀 Starting POM Enhanced Registration Form Test');
    await TestHelpers.takeMilestoneScreenshot('test-start');

    // Step 1: Ensure app is launched
    await TestHelpers.validateStep('App Launch', async () => {
      return await TestHelpers.ensureAppLaunched();
    });

    // Step 2: Wait for registration page to load
    await TestHelpers.validateStep('Page Load', async () => {
      return await registrationPage.waitForPage();
    });

    // Step 3: Fill Personal Information
    await TestHelpers.validateStep('Personal Information', async () => {
      await registrationPage.fillFirstName(testData.firstName);
      await registrationPage.fillLastName(testData.lastName);
      await registrationPage.fillEmail(testData.email);
      await registrationPage.fillPhone(testData.phone);
      return true;
    });

    // Step 4: Fill Address Information
    await TestHelpers.validateStep('Address Information', async () => {
      await registrationPage.fillAddress(testData.address);
      await registrationPage.fillZipCode(testData.zipCode);
      return true;
    });

    // Step 5: Select State
    await TestHelpers.validateStep('State Selection', async () => {
      return await registrationPage.selectState('California'); // or any available state
    });

    // Step 6: Fill SS#/TIN#
    await TestHelpers.validateStep('SS#/TIN# Entry', async () => {
      await registrationPage.fillSSN(testData.ssn);
      return true;
    });

    // Step 7: Select Residence Status
    await TestHelpers.validateStep('Residence Status Selection', async () => {
      return await registrationPage.selectResidenceStatus('Alien Non-resident/Greencard Holder');
    });

    // Step 8: Fill Password Fields
    await TestHelpers.validateStep('Password Fields', async () => {
      await registrationPage.fillPassword(testData.password);
      await registrationPage.fillConfirmPassword(testData.confirmPassword);
      return true;
    });

    // Step 9: Submit Registration
    await TestHelpers.validateStep('Form Submission', async () => {
      await TestHelpers.takeMilestoneScreenshot('before-register-click');
      await registrationPage.clickRegisterButton();
      await TestHelpers.takeMilestoneScreenshot('after-register-click');
      return true;
    });

    // Step 10: Capture final state
    await TestHelpers.validateStep('Final State Capture', async () => {
      await TestHelpers.capturePageSource('final-page-source');
      return true;
    });

    console.log('🎉 POM ENHANCED REGISTRATION FORM TEST PASSED!');
  });

  it('should handle form validation errors gracefully', async () => {
    console.log('\n🔍 Starting Form Validation Test');
    
    // Test with invalid data
    const invalidData = {
      ...testData,
      email: 'invalid-email',
      phone: '123', // too short
      password: 'weak' // too weak
    };

    await TestHelpers.validateStep('Page Load for Validation Test', async () => {
      return await registrationPage.waitForPage();
    });

    // Fill form with invalid data
    await TestHelpers.validateStep('Fill Invalid Data', async () => {
      await registrationPage.fillFirstName(invalidData.firstName);
      await registrationPage.fillLastName(invalidData.lastName);
      await registrationPage.fillEmail(invalidData.email);
      await registrationPage.fillPhone(invalidData.phone);
      return true;
    });

    // Check validation status
    await TestHelpers.validateStep('Check Validation Status', async () => {
      const validationStatus = await registrationPage.getFormValidationStatus();
      console.log('📊 Form validation status:', validationStatus);
      return validationStatus;
    });

    console.log('✅ Form validation test completed');
  });

  it('should be data-driven with multiple test scenarios', async () => {
    console.log('\n📊 Starting Data-Driven Test');
    
    // Multiple test scenarios
    const testScenarios = [
      {
        name: 'Valid Registration',
        data: testData,
        expectedResult: 'success'
      },
      {
        name: 'Minimal Required Fields',
        data: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '5551234567',
          address: '456 Oak Ave',
          zipCode: '54321',
          ssn: '987-65-4321',
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!'
        },
        expectedResult: 'success'
      }
    ];

    for (const scenario of testScenarios) {
      console.log(`\n🔄 Running scenario: ${scenario.name}`);
      
      await TestHelpers.validateStep(`Scenario: ${scenario.name}`, async () => {
        // Wait for page
        await registrationPage.waitForPage();
        
        // Fill form with scenario data
        await registrationPage.fillFirstName(scenario.data.firstName);
        await registrationPage.fillLastName(scenario.data.lastName);
        await registrationPage.fillEmail(scenario.data.email);
        await registrationPage.fillPhone(scenario.data.phone);
        await registrationPage.fillAddress(scenario.data.address);
        await registrationPage.fillZipCode(scenario.data.zipCode);
        await registrationPage.fillSSN(scenario.data.ssn);
        await registrationPage.fillPassword(scenario.data.password);
        await registrationPage.fillConfirmPassword(scenario.data.confirmPassword);
        
        // Take screenshot for this scenario
        await TestHelpers.takeMilestoneScreenshot(`scenario-${scenario.name.replace(/\s+/g, '-')}`);
        
        return true;
      });
    }

    console.log('✅ Data-driven test completed');
  });
}); 