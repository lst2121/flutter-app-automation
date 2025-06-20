const fs = require('fs');

// Page Object for Registration Form - Updated with correct locators
const RegistrationPage = {
  // Personal Information Fields - Updated based on working test
  firstNameField: '//android.widget.EditText[@hint="e.g. John"]',
  lastNameField: '//android.widget.EditText[@hint="e.g. Doe"]',
  phoneField: '//android.widget.EditText[@hint="+1"]',
  
  // Address Fields - Updated based on working test
  addressField: '//android.widget.EditText[@hint="e.g. 123 Main Street"]',
  zipCodeField: '//android.view.View[@content-desc="Zip Code *"]/following-sibling::android.widget.EditText[1]',
  
  // Dropdowns - Updated based on working test
  stateDropdown: '~Select State',
  cityDropdown: '~Select City',
  residenceStatusDropdown: '~Select Residence Status',
  
  // Identity Fields - Updated based on working test
  ssnField: '//android.view.View[@content-desc="SS#/TIN# *"]/following-sibling::android.widget.EditText[1]',
  
  // Password Fields - Updated based on working test
  passwordField: '//android.widget.EditText[@hint="Password"]',
  confirmPasswordField: '//android.widget.EditText[@hint="Confirm Password"]',
  
  // Submit Button - Updated based on working test
  registerButton: 'android=new UiSelector().textContains("Register")',
  
  // Validation Elements - Updated based on working test
  residenceStatusLabel: '~Residence Status *',
  ssnLabel: '//android.view.View[@content-desc="SS#/TIN# *"]'
};

// Reusable Helper Functions
class FormHelpers {
  /**
   * Fill a field with text, with proper error handling
   */
  static async fillField(locator, value, fieldName) {
    console.log(`📝 Filling ${fieldName}...`);
    try {
      const field = await $(locator);
      await field.waitForDisplayed({ timeout: 10000 });
      await field.click();
      await driver.pause(500);
      await field.clearValue();
      await field.setValue(value);
      await driver.pause(500);
      console.log(`✅ ${fieldName} filled successfully`);
      return true;
    } catch (error) {
      console.log(`❌ Failed to fill ${fieldName}:`, error.message);
      return false;
    }
  }

  /**
   * Select an option from a dropdown with fallback strategies
   */
  static async selectOptionFromDropdown(dropdownLocator, fieldName, preferredOption = null) {
    console.log(`📋 Opening ${fieldName} dropdown...`);
    try {
      const dropdown = await $(dropdownLocator);
      await dropdown.waitForDisplayed({ timeout: 10000 });
      await dropdown.click();
      await driver.pause(1500);

      // Try CheckedTextView first (most reliable)
      const options = await $$('android=new UiSelector().className("android.widget.CheckedTextView")');
      if (options.length > 0) {
        const optionToSelect = preferredOption && options.length > 1 ? options[1] : options[0];
        await optionToSelect.click();
        const optionText = await optionToSelect.getText();
        console.log(`✅ Selected ${fieldName}: ${optionText}`);
        await driver.pause(1000);
        return true;
      }

      // Fallback to android.view.View
      console.log(`🔄 Trying fallback for ${fieldName}...`);
      const fallbackOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
      
      for (const option of fallbackOptions) {
        try {
          const contentDesc = await option.getAttribute('content-desc');
          if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
            await option.click();
            console.log(`✅ Selected ${fieldName} (fallback): ${contentDesc}`);
            await driver.pause(1000);
            return true;
          }
        } catch (error) {
          // Continue to next option
        }
      }

      console.log(`⚠️ No suitable ${fieldName} option found`);
      return false;
    } catch (error) {
      console.log(`❌ Error with ${fieldName} dropdown:`, error.message);
      return false;
    }
  }

  /**
   * Smart scroll that checks if element is visible before scrolling
   */
  static async smartScroll(targetLocator, maxAttempts = 3) {
    console.log('🔄 Smart scrolling...');
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const element = await $(targetLocator);
        if (await element.isDisplayed()) {
          console.log(`✅ Element visible after ${attempt} scroll attempt(s)`);
          return true;
        }
      } catch (error) {
        // Element not found, continue scrolling
      }

      if (attempt < maxAttempts) {
        await driver.executeScript('mobile: scrollGesture', {
          left: 100, top: 100, width: 800, height: 600,
          direction: 'down',
          percent: 0.75
        });
        await driver.pause(1000);
      }
    }
    console.log(`⚠️ Element not visible after ${maxAttempts} scroll attempts`);
    return false;
  }

  /**
   * Take screenshot only at key milestones
   */
  static async takeMilestoneScreenshot(milestone) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./screenshots/${milestone}-${timestamp}.png`;
    await driver.saveScreenshot(filename);
    console.log(`📸 Screenshot saved: ${filename}`);
  }

  /**
   * Hide keyboard safely
   */
  static async hideKeyboardSafely() {
    try {
      await driver.hideKeyboard();
      console.log('⌨️ Keyboard hidden successfully');
      return true;
    } catch (error) {
      console.log('⚠️ Could not hide keyboard:', error.message);
      return false;
    }
  }

  /**
   * Validate form is still accessible
   */
  static async validateFormAccessibility() {
    try {
      const ssnLabel = await $(RegistrationPage.ssnLabel);
      return await ssnLabel.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Launch app and navigate to registration
   */
  static async launchAppAndNavigateToRegistration() {
    console.log('🚀 Launching app and navigating to registration...');
    
    // Wait for app to load
    await driver.pause(5000);
    
    // Look for registration button or navigate to registration
    try {
      // Try to find registration button
      const registrationButton = await $('~Registration');
      if (await registrationButton.isDisplayed()) {
        await registrationButton.click();
        console.log('✅ Clicked Registration button');
        await driver.pause(3000);
        return true;
      }
    } catch (error) {
      console.log('⚠️ Registration button not found, trying alternative navigation...');
    }

    // Alternative: Try to find any button that might lead to registration
    try {
      const buttons = await $$('android.widget.Button');
      for (const button of buttons) {
        const text = await button.getText();
        if (text && text.toLowerCase().includes('register')) {
          await button.click();
          console.log('✅ Found and clicked registration-related button');
          await driver.pause(3000);
          return true;
        }
      }
    } catch (error) {
      console.log('⚠️ No registration buttons found');
    }

    console.log('⚠️ Could not navigate to registration automatically');
    return false;
  }
}

// Test Data
const testData = {
  firstName: 'John',
  lastName: 'Doe',
  phone: '9876543210',
  address: '123 Main Street',
  zipCode: '12345',
  ssn: '123-45-6789',
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!'
};

describe('Registration Form (Refactored)', () => {
  before(async () => {
    // Ensure screenshots directory exists
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots', { recursive: true });
    }
  });

  afterEach(async function () {
    // Global error screenshot hook
    if (this.currentTest.state === 'failed') {
      await FormHelpers.takeMilestoneScreenshot(`FAILED-${this.currentTest.title.replace(/\s+/g, '-')}`);
    }
  });

  it('should complete registration form with improved reliability', async () => {
    console.log('\n🚀 Starting Refactored Registration Form Test');
    await FormHelpers.takeMilestoneScreenshot('test-start');

    // Step 0: Launch app and navigate to registration
    console.log('\n📱 Step 0: Launching app and navigating to registration...');
    const navigationSuccess = await FormHelpers.launchAppAndNavigateToRegistration();
    if (!navigationSuccess) {
      console.log('⚠️ Could not navigate to registration, continuing with current screen...');
    }

    // Step 1: Fill Personal Information
    console.log('\n👤 Step 1: Filling Personal Information...');
    await FormHelpers.fillField(RegistrationPage.firstNameField, testData.firstName, 'First Name');
    await FormHelpers.fillField(RegistrationPage.lastNameField, testData.lastName, 'Last Name');
    await FormHelpers.fillField(RegistrationPage.phoneField, testData.phone, 'Phone Number');

    // Step 2: Fill Address Information
    console.log('\n🏠 Step 2: Filling Address Information...');
    await FormHelpers.fillField(RegistrationPage.addressField, testData.address, 'Address');

    // Step 3: Select State
    console.log('\n🗺️ Step 3: Selecting State...');
    const stateSelected = await FormHelpers.selectOptionFromDropdown(RegistrationPage.stateDropdown, 'State');
    if (!stateSelected) {
      throw new Error('Failed to select State');
    }

    // Step 4: Select City (after state selection)
    console.log('\n🏙️ Step 4: Selecting City...');
    await driver.pause(2000); // Wait for city dropdown to populate
    const citySelected = await FormHelpers.selectOptionFromDropdown(RegistrationPage.cityDropdown, 'City');
    if (!citySelected) {
      throw new Error('Failed to select City');
    }

    // Step 5: Fill Zip Code
    console.log('\n📮 Step 5: Filling Zip Code...');
    await FormHelpers.fillField(RegistrationPage.zipCodeField, testData.zipCode, 'Zip Code');

    // Validate form is still accessible
    if (!await FormHelpers.validateFormAccessibility()) {
      throw new Error('Form became inaccessible after address section');
    }

    // Step 6: Fill SS#/TIN#
    console.log('\n🆔 Step 6: Filling SS#/TIN#...');
    await FormHelpers.fillField(RegistrationPage.ssnField, testData.ssn, 'SS#/TIN#');

    // Step 7: Select Residence Status
    console.log('\n🏠 Step 7: Selecting Residence Status...');
    const residenceSelected = await FormHelpers.selectOptionFromDropdown(RegistrationPage.residenceStatusDropdown, 'Residence Status');
    if (!residenceSelected) {
      throw new Error('Failed to select Residence Status');
    }

    // Validate form is still accessible
    if (!await FormHelpers.validateFormAccessibility()) {
      throw new Error('Form became inaccessible after Residence Status selection');
    }

    // Step 8: Fill Password
    console.log('\n🔐 Step 8: Filling Password...');
    await FormHelpers.fillField(RegistrationPage.passwordField, testData.password, 'Password');
    await FormHelpers.hideKeyboardSafely();

    // Step 9: Fill Confirm Password
    console.log('\n🔐 Step 9: Filling Confirm Password...');
    await FormHelpers.fillField(RegistrationPage.confirmPasswordField, testData.confirmPassword, 'Confirm Password');
    await FormHelpers.hideKeyboardSafely();

    // Step 10: Smart scroll to find Register button
    console.log('\n🔄 Step 10: Finding Register button...');
    const buttonVisible = await FormHelpers.smartScroll(RegistrationPage.registerButton);
    if (!buttonVisible) {
      throw new Error('Register button not found after scrolling');
    }

    // Step 11: Click Register button
    console.log('\n📝 Step 11: Clicking Register button...');
    try {
      const registerButton = await $(RegistrationPage.registerButton);
      await registerButton.waitForDisplayed({ timeout: 10000 });
      await FormHelpers.takeMilestoneScreenshot('before-register-click');
      await registerButton.click();
      console.log('✅ Register button clicked successfully!');
      await FormHelpers.takeMilestoneScreenshot('after-register-click');
    } catch (error) {
      console.log('❌ Error clicking Register button:', error.message);
      throw error;
    }

    // Capture final page source
    console.log('📄 Capturing final page source...');
    const finalPageSource = await driver.getPageSource();
    fs.writeFileSync('./screenshots/page-source-after-registration.html', finalPageSource);
    console.log('📄 Final page source saved');

    console.log('🎉 REFACTORED REGISTRATION FORM TEST PASSED!');
  });
}); 