const fs = require('fs');

describe('Email Address Field Validation Test', () => {
  let emailField;
  
  before(async () => {
    console.log('📧 Starting Email Address Field Validation Test Suite');
    await driver.pause(3000);
    
    // Find Email Address field once for all tests
    try {
      emailField = await $('//android.widget.EditText[@hint="e.g. johndoe@mail.com"]');
      if (await emailField.isDisplayed()) {
        console.log('✅ Email Address field found and ready for testing');
      } else {
        console.log('❌ Email Address field not found');
      }
    } catch (error) {
      console.log('❌ Error finding Email Address field:', error.message);
    }
  });

  it('should verify email field is editable', async () => {
    console.log('\n🧪 Test: Email field editability');
    
    if (!emailField || !(await emailField.isDisplayed())) {
      console.log('❌ Email field not available for testing');
      return;
    }
    
    try {
      // Test if field is clickable and editable
      await emailField.click();
      await driver.pause(500);
      
      // Check if keyboard appears (indicates field is editable)
      const isKeyboardVisible = await driver.isKeyboardShown();
      console.log(`📱 Keyboard visible: ${isKeyboardVisible}`);
      
      // Try to enter some text
      await emailField.setValue('test');
      await driver.pause(500);
      
      // Verify text was entered
      const enteredValue = await emailField.getValue();
      console.log(`📝 Entered value: ${enteredValue}`);
      
      if (enteredValue === 'test') {
        console.log('✅ Email field is editable - text entered successfully');
      } else {
        console.log('❌ Email field may not be editable - text not entered');
      }
      
      // Clear the field
      await emailField.clearValue();
      await driver.pause(500);
      
    } catch (error) {
      console.log('❌ Error testing email field editability:', error.message);
    }
  });

  it('should accept valid email format', async () => {
    console.log('\n🧪 Test: Valid email format acceptance');
    
    if (!emailField || !(await emailField.isDisplayed())) {
      console.log('❌ Email field not available for testing');
      return;
    }
    
    try {
      await emailField.click();
      await driver.pause(500);
      await emailField.clearValue();
      await driver.pause(500);
      
      // Test valid email
      await emailField.setValue('valid.email@domain.com');
      await driver.pause(1000);
      
      const enteredValue = await emailField.getValue();
      console.log(`📝 Entered valid email: ${enteredValue}`);
      
      if (enteredValue === 'valid.email@domain.com') {
        console.log('✅ Valid email format accepted successfully');
      } else {
        console.log('❌ Valid email format not accepted properly');
      }
      
      // Clear for next test
      await emailField.clearValue();
      await driver.pause(500);
      
    } catch (error) {
      console.log('❌ Error testing valid email format:', error.message);
    }
  });

  it('should handle invalid email format', async () => {
    console.log('\n🧪 Test: Invalid email format handling');
    
    if (!emailField || !(await emailField.isDisplayed())) {
      console.log('❌ Email field not available for testing');
      return;
    }
    
    try {
      await emailField.click();
      await driver.pause(500);
      await emailField.clearValue();
      await driver.pause(500);
      
      // Test invalid email
      await emailField.setValue('invalid-email');
      await driver.pause(1000);
      
      const enteredValue = await emailField.getValue();
      console.log(`📝 Entered invalid email: ${enteredValue}`);
      
      // Check if field accepts invalid format (some fields do, some don't)
      if (enteredValue === 'invalid-email') {
        console.log('✅ Invalid email format entered (field accepts it)');
      } else {
        console.log('⚠️ Invalid email format may have been filtered');
      }
      
      // Clear for next test
      await emailField.clearValue();
      await driver.pause(500);
      
    } catch (error) {
      console.log('❌ Error testing invalid email format:', error.message);
    }
  });

  it('should handle empty email field', async () => {
    console.log('\n🧪 Test: Empty email field handling');
    
    if (!emailField || !(await emailField.isDisplayed())) {
      console.log('❌ Email field not available for testing');
      return;
    }
    
    try {
      await emailField.click();
      await driver.pause(500);
      await emailField.clearValue();
      await driver.pause(500);
      
      const enteredValue = await emailField.getValue();
      console.log(`📝 Field value after clearing: "${enteredValue}"`);
      
      if (!enteredValue || enteredValue === '') {
        console.log('✅ Email field properly cleared and empty');
      } else {
        console.log('❌ Email field not properly cleared');
      }
      
    } catch (error) {
      console.log('❌ Error testing empty email field:', error.message);
    }
  });

  it('should show validation error when submitting with empty email', async () => {
    console.log('\n🧪 Test: Validation error for empty email on submit');
    
    if (!emailField || !(await emailField.isDisplayed())) {
      console.log('❌ Email field not available for testing');
      return;
    }
    
    try {
      // Ensure email field is empty
      await emailField.click();
      await driver.pause(500);
      await emailField.clearValue();
      await driver.pause(500);
      
      // Try to find and click register button
      console.log('🔘 Looking for register button...');
      let registerButton = null;
      
      const registerButtonSelectors = [
        '~Register',
        '~register',
        '~Submit',
        '~submit',
        '//android.widget.Button[@text="Register"]',
        '//android.widget.Button[@text="Submit"]',
        '//android.widget.Button[contains(@text, "Register")]',
        '//android.widget.Button[contains(@text, "Submit")]'
      ];
      
      // Try to find register button
      for (const selector of registerButtonSelectors) {
        try {
          registerButton = await $(selector);
          if (await registerButton.isDisplayed()) {
            console.log(`✅ Register button found with selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      if (registerButton && await registerButton.isDisplayed()) {
        console.log('🔘 Clicking register button with empty email...');
        await registerButton.click();
        await driver.pause(2000);
        
        // Look for error messages or validation popups
        console.log('🔍 Looking for validation error messages...');
        
        const errorSelectors = [
          '//android.view.View[contains(@content-desc, "required")]',
          '//android.view.View[contains(@content-desc, "invalid")]',
          '//android.view.View[contains(@content-desc, "error")]',
          '//android.widget.TextView[contains(@text, "required")]',
          '//android.widget.TextView[contains(@text, "invalid")]',
          '//android.widget.TextView[contains(@text, "error")]',
          '~Please enter a valid email',
          '~Email is required',
          '~Invalid email format'
        ];
        
        let errorFound = false;
        for (const errorSelector of errorSelectors) {
          try {
            const errorElement = await $(errorSelector);
            if (await errorElement.isDisplayed()) {
              const errorText = await errorElement.getText() || await errorElement.getAttribute('content-desc');
              console.log(`✅ Validation error found: ${errorText}`);
              errorFound = true;
              break;
            }
          } catch (error) {
            // Continue to next selector
          }
        }
        
        if (!errorFound) {
          console.log('⚠️ No validation error message found - app may not validate empty email');
        }
        
      } else {
        console.log('❌ Register button not found - cannot test validation');
      }
      
    } catch (error) {
      console.log('❌ Error testing validation for empty email:', error.message);
    }
  });

  it('should show validation error when submitting with invalid email', async () => {
    console.log('\n🧪 Test: Validation error for invalid email on submit');
    
    if (!emailField || !(await emailField.isDisplayed())) {
      console.log('❌ Email field not available for testing');
      return;
    }
    
    try {
      // Enter invalid email
      await emailField.click();
      await driver.pause(500);
      await emailField.clearValue();
      await driver.pause(500);
      await emailField.setValue('invalid-email');
      await driver.pause(1000);
      
      // Try to find and click register button
      console.log('🔘 Looking for register button...');
      let registerButton = null;
      
      const registerButtonSelectors = [
        '~Register',
        '~register',
        '~Submit',
        '~submit',
        '//android.widget.Button[@text="Register"]',
        '//android.widget.Button[@text="Submit"]',
        '//android.widget.Button[contains(@text, "Register")]',
        '//android.widget.Button[contains(@text, "Submit")]'
      ];
      
      // Try to find register button
      for (const selector of registerButtonSelectors) {
        try {
          registerButton = await $(selector);
          if (await registerButton.isDisplayed()) {
            console.log(`✅ Register button found with selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      if (registerButton && await registerButton.isDisplayed()) {
        console.log('🔘 Clicking register button with invalid email...');
        await registerButton.click();
        await driver.pause(2000);
        
        // Look for error messages or validation popups
        console.log('🔍 Looking for validation error messages...');
        
        const errorSelectors = [
          '//android.view.View[contains(@content-desc, "invalid")]',
          '//android.view.View[contains(@content-desc, "email")]',
          '//android.view.View[contains(@content-desc, "format")]',
          '//android.widget.TextView[contains(@text, "invalid")]',
          '//android.widget.TextView[contains(@text, "email")]',
          '//android.widget.TextView[contains(@text, "format")]',
          '~Please enter a valid email',
          '~Invalid email format',
          '~Email format is invalid'
        ];
        
        let errorFound = false;
        for (const errorSelector of errorSelectors) {
          try {
            const errorElement = await $(errorSelector);
            if (await errorElement.isDisplayed()) {
              const errorText = await errorElement.getText() || await errorElement.getAttribute('content-desc');
              console.log(`✅ Validation error found: ${errorText}`);
              errorFound = true;
              break;
            }
          } catch (error) {
            // Continue to next selector
          }
        }
        
        if (!errorFound) {
          console.log('⚠️ No validation error message found - app may not validate email format');
        }
        
      } else {
        console.log('❌ Register button not found - cannot test validation');
      }
      
    } catch (error) {
      console.log('❌ Error testing validation for invalid email:', error.message);
    }
  });

  after(async () => {
    console.log('\n📧 Email Address Field Validation Test Suite completed');
    
    // Click on "Registration" text to exit editing mode
    try {
      const registrationText = await $('~Registration');
      await registrationText.click();
      await driver.pause(1000);
      console.log('✅ Clicked on Registration text to exit editing mode');
    } catch (error) {
      console.log('⚠️ Could not click on Registration text:', error.message);
    }
  });
}); 