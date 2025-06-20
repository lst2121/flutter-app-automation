const fs = require('fs');

describe('Password Field Test', () => {
  it('should find password field by scrolling and capture source', async () => {
    console.log('🔐 Starting Password Field Test');
    
    // Wait for app to load
    await driver.pause(3000);
    
    // Take initial screenshot
    await driver.saveScreenshot('./screenshots/initial-state.png');
    console.log('📸 Initial screenshot taken');
    
    // Capture initial page source
    const initialPageSource = await driver.getPageSource();
    fs.writeFileSync('./screenshots/page-source-initial.xml', initialPageSource);
    console.log('📄 Initial page source captured');
    
    // First, test SSN/TIN field - it's visible after first scroll
    console.log('\n🆔 Testing SSN/TIN field first...');
    
    // Scroll down once to bring SSN/TIN field into view
    console.log('🔄 Scrolling down to bring SSN/TIN field into view...');
    
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: 540, y: 1800 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', duration: 1000, x: 540, y: 600 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    await driver.releaseActions();
    await driver.pause(1500);
    
    // Take screenshot after first scroll
    await driver.saveScreenshot('./screenshots/after-first-scroll.png');
    console.log('📸 Screenshot after first scroll taken');
    
    // Test SSN/TIN field using the correct logic from fill-and-submit-registration-form.e2e.js
    console.log('🆔 Looking for SSN/TIN field...');
    
    try {
      // Find SS#/TIN# field by looking for the EditText after the "SS#/TIN# *" label
      const ssnLabel = await $('//android.view.View[@content-desc="SS#/TIN# *"]');
      if (await ssnLabel.isDisplayed()) {
        console.log('✅ SS#/TIN# label found');
        
        // Find the EditText that follows this label - it's the next EditText after the label
        const ssnField = await $('//android.view.View[@content-desc="SS#/TIN# *"]/following-sibling::android.widget.EditText[1]');
        if (await ssnField.isDisplayed()) {
          console.log('📝 Found SS#/TIN# field using content-desc locator');
          
          // Take screenshot before clicking
          await driver.saveScreenshot('./screenshots/before-ssn-click.png');
          
          // Click on SSN/TIN field
          await ssnField.click();
          await driver.pause(500);
          
          // Clear and enter SSN/TIN
          await ssnField.clearValue();
          await driver.pause(500);
          await ssnField.clearValue();
          await ssnField.setValue('123-45-6789');
          await driver.pause(1000);
          
          // Take screenshot after SSN/TIN entry
          await driver.saveScreenshot('./screenshots/ssn-entered.png');
          console.log('📸 Screenshot after SSN/TIN entry taken');
          
          // Capture page source after SSN/TIN entry
          const ssnPageSource = await driver.getPageSource();
          fs.writeFileSync('./screenshots/page-source-after-ssn.xml', ssnPageSource);
          console.log('📄 Page source captured after SSN/TIN entry');
          
          console.log('✅ SS#/TIN# filled successfully: 123-45-6789');
          
          // Simple validation - just check if we can still find the SS#/TIN# label
          const stillOnForm = await $('//android.view.View[@content-desc="SS#/TIN# *"]').isDisplayed().catch(() => false);
          if (!stillOnForm) {
            console.log('⚠️ Form may have navigated away after SSN/TIN entry');
          } else {
            console.log('✅ Form still visible after SSN/TIN entry');
          }
          
        } else {
          console.log('⚠️ SS#/TIN# field not found after label');
          await driver.saveScreenshot('./screenshots/ssn-field-not-found.png');
        }
      } else {
        console.log('⚠️ SS#/TIN# label not found after first scroll');
        await driver.saveScreenshot('./screenshots/ssn-label-not-found.png');
      }
    } catch (error) {
      console.log('⚠️ Error filling SS#/TIN#:', error.message);
      await driver.saveScreenshot('./screenshots/ssn-error.png');
    }
    
    // Now test Residence Status dropdown
    console.log('\n📋 Testing Residence Status dropdown...');
    
    // Scroll down multiple times to bring Residence Status dropdown into view
    console.log('🔄 Scrolling to bring Residence Status dropdown into view...');
    
    // Second scroll to go further down
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: 540, y: 1800 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', duration: 1000, x: 540, y: 600 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    await driver.releaseActions();
    await driver.pause(1500);

    // Third scroll to ensure we're at the bottom
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: 540, y: 1800 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', duration: 1000, x: 540, y: 600 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    await driver.releaseActions();
    await driver.pause(2000);

    // Take screenshot before looking for dropdown
    await driver.saveScreenshot('./screenshots/before-residence-search.png');
    
    // Try to find Residence Status dropdown using different locators
    let residenceDropdown = null;
    
    // Try content-desc first
    try {
      residenceDropdown = await $('~Select Residence Status');
      await residenceDropdown.waitForDisplayed({ timeout: 3000 });
      console.log('✅ Residence Status dropdown found using content-desc');
    } catch (error) {
      console.log('⚠️ Not found with content-desc, trying hint text...');
      // Try hint text
      try {
        residenceDropdown = await $('android=new UiSelector().text("Select Residence Status")');
        await residenceDropdown.waitForDisplayed({ timeout: 3000 });
        console.log('✅ Residence Status dropdown found using text');
      } catch (error2) {
        console.log('⚠️ Not found with text, trying hint...');
        // Try hint
        try {
          residenceDropdown = await $('android=new UiSelector().textContains("Residence")');
          await residenceDropdown.waitForDisplayed({ timeout: 3000 });
          console.log('✅ Residence Status dropdown found using textContains');
        } catch (error3) {
          console.log('❌ Residence Status dropdown not found with any locator');
          // Capture page source to see what's available
          const pageSource = await driver.getPageSource();
          fs.writeFileSync('./screenshots/page-source-residence-not-found.html', pageSource);
          console.log('📄 Page source saved to: ./screenshots/page-source-residence-not-found.html');
        }
      }
    }
    
    if (residenceDropdown && await residenceDropdown.isDisplayed()) {
      // Take screenshot before clicking
      await driver.saveScreenshot('./screenshots/before-residence-click.png');
      
      // Click the Residence Status dropdown
      await residenceDropdown.click();
      console.log('✅ Residence Status dropdown clicked');
      await driver.pause(2000);
      
      // Capture page source after Residence Status dropdown click
      console.log('📄 Capturing page source after Residence Status dropdown click...');
      const residencePageSource = await driver.getPageSource();
      fs.writeFileSync('./screenshots/page-source-residence-dropdown.html', residencePageSource);
      console.log('📄 Residence Status dropdown page source saved to: ./screenshots/page-source-residence-dropdown.html');
      
      // Take screenshot after clicking
      await driver.saveScreenshot('./screenshots/residence-dropdown-opened.png');
      
      // Look for dropdown options using content-desc (as seen in page source)
      const residenceOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
      console.log(`🔍 Found ${residenceOptions.length} potential residence options`);
      
      // Filter for actual residence options (those with content-desc containing residence status names)
      const availableResidenceStatuses = [];
      for (let i = 0; i < residenceOptions.length; i++) {
        try {
          const contentDesc = await residenceOptions[i].getAttribute('content-desc');
          if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
            availableResidenceStatuses.push({
              element: residenceOptions[i],
              name: contentDesc
            });
          }
        } catch (error) {
          // Skip elements that don't have content-desc
        }
      }
      
      console.log(`📋 Available residence statuses: ${availableResidenceStatuses.map(s => s.name).join(', ')}`);
      
      if (availableResidenceStatuses.length > 0) {
        // Select a random residence status (or the first one)
        const selectedResidenceIndex = Math.floor(Math.random() * availableResidenceStatuses.length);
        const selectedResidence = availableResidenceStatuses[selectedResidenceIndex];
        
        await selectedResidence.element.click();
        console.log(`✅ Selected Residence Status: ${selectedResidence.name}`);

        // Take screenshot after selection
        await driver.saveScreenshot('./screenshots/residence-option-selected.png');
      } else {
        console.log('⚠️ No residence status options found with content-desc');
        
        // Fallback: try to click any clickable option
        const clickableOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
        if (clickableOptions.length > 0) {
          // Skip the first one (usually the scrim/overlay)
          const optionToClick = clickableOptions.length > 1 ? clickableOptions[1] : clickableOptions[0];
          await optionToClick.click();
          console.log('✅ Selected a residence status option (fallback method)');
        } else {
          console.log('❌ No clickable options found');
        }
      }
    } else {
      console.log('❌ Residence Status dropdown not found or not visible');
    }
    
    // Click on "Registration" text at the top to exit editing mode
    console.log('\n📱 Clicking on Registration text to exit editing mode...');
    try {
      const registrationText = await $('~Registration');
      await registrationText.click();
      await driver.pause(1000);
      console.log('✅ Clicked on Registration text to exit editing mode');
    } catch (error) {
      console.log('⚠️ Could not click on Registration text:', error.message);
    }
    
    // Now scroll down to find password field
    console.log('\n📜 Looking for password field...');
    
    // First try to find password field without scrolling
    const passwordSelectors = [
      '~Password',
      '~password',
      '//android.widget.EditText[@hint="Password"]',
      '//android.widget.EditText[@hint="********"]',
      '//android.widget.EditText[@password="true"]'
    ];

    let passwordField = null;
    
    // Try all selectors without scrolling first
    for (const selector of passwordSelectors) {
      try {
        passwordField = await $(selector);
        if (await passwordField.isDisplayed()) {
          console.log(`✅ Password field found with selector: ${selector}`);
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    // If password field not found, do a single scroll to bring all fields into view
    if (!passwordField || !(await passwordField.isDisplayed())) {
      console.log('🔄 Scrolling once to bring all fields into view...');
      
      await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 540, y: 1800 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 1000, x: 540, y: 600 },
          { type: 'pointerUp', button: 0 }
        ]
      }]);
      await driver.pause(1500);

      // Try all selectors again after scroll
      for (const selector of passwordSelectors) {
        try {
          passwordField = await $(selector);
          if (await passwordField.isDisplayed()) {
            console.log(`✅ Password field found with selector: ${selector} after scroll`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
    }
    
    // Take screenshot after scroll attempt
    await driver.saveScreenshot('./screenshots/after-scroll.png');
    console.log('📸 Screenshot after scroll taken');
    
    // Capture page source after scroll
    const pageSourceAfterScroll = await driver.getPageSource();
    fs.writeFileSync('./screenshots/page-source-after-scroll.xml', pageSourceAfterScroll);
    console.log('📄 Page source after scroll captured');
    
    // Try finding password field again after scroll
    if (!passwordField) {
      console.log('🔄 Trying password field selectors again after scroll...');
      for (const selector of passwordSelectors) {
        try {
          passwordField = await $(selector);
          if (await passwordField.isDisplayed()) {
            console.log(`✅ Password field found with selector: ${selector} after retry`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
    }
    
    if (!passwordField) {
      console.log('❌ Password field not found after scrolling');
      await driver.saveScreenshot('./screenshots/password-not-found.png');
      
      // Capture final page source for debugging
      const finalPageSource = await driver.getPageSource();
      fs.writeFileSync('./screenshots/page-source-final.xml', finalPageSource);
      console.log('📄 Final page source captured with all fields');
    } else {
      console.log('✅ Password field found and ready for interaction');
      
      // Test password field interaction
      await passwordField.click();
      await driver.pause(500);
      await passwordField.setValue('TestPassword123');
      await driver.pause(1000);
      
      // Close keyboard after password field
      await driver.hideKeyboard();
      await driver.pause(500);
      console.log('✅ Password field interaction completed and keyboard closed');
      
      // Now look for confirm password field
      console.log('\n🔐 Looking for confirm password field...');
      let confirmPasswordField = null;
      
      const confirmSelectors = [
        '~Confirm Password',
        '~confirm password',
        '~ConfirmPassword',
        '//android.widget.EditText[@hint="Confirm Password"]',
        '//android.widget.EditText[@hint="********"]',
        '//android.widget.EditText[@content-desc="Confirm Password"]'
      ];
      
      // Try to find confirm password field
      for (const selector of confirmSelectors) {
        try {
          confirmPasswordField = await $(selector);
          if (await confirmPasswordField.isDisplayed()) {
            console.log(`✅ Confirm password field found with selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      // If confirm password field not found, scroll more
      if (!confirmPasswordField || !(await confirmPasswordField.isDisplayed())) {
        console.log('🔄 Scrolling more to find confirm password field...');
        
        await driver.performActions([{
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: 540, y: 1800 },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 1000, x: 540, y: 600 },
            { type: 'pointerUp', button: 0 }
          ]
        }]);
        await driver.pause(1500);
        
        // Try confirm password selectors again
        for (const selector of confirmSelectors) {
          try {
            confirmPasswordField = await $(selector);
            if (await confirmPasswordField.isDisplayed()) {
              console.log(`✅ Confirm password field found with selector: ${selector} after scroll`);
              break;
            }
          } catch (error) {
            // Continue to next selector
          }
        }
      }
      
      // Test confirm password field interaction
      if (confirmPasswordField && await confirmPasswordField.isDisplayed()) {
        console.log('✅ Confirm password field found and ready for interaction');
        
        await confirmPasswordField.click();
        await driver.pause(500);
        await confirmPasswordField.setValue('TestPassword123');
        await driver.pause(1000);
        
        // Close keyboard after confirm password field
        await driver.hideKeyboard();
        await driver.pause(500);
        console.log('✅ Confirm password field interaction completed and keyboard closed');
      } else {
        console.log('❌ Confirm password field not found');
      }
      
      // Now verify register button is visible
      console.log('\n🔘 Looking for register button...');
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
      
      // If register button not found, scroll more
      if (!registerButton || !(await registerButton.isDisplayed())) {
        console.log('🔄 Scrolling more to find register button...');
        
        await driver.performActions([{
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: 540, y: 1800 },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: 100 },
            { type: 'pointerMove', duration: 1000, x: 540, y: 600 },
            { type: 'pointerUp', button: 0 }
          ]
        }]);
        await driver.pause(1500);
        
        // Try register button selectors again
        for (const selector of registerButtonSelectors) {
          try {
            registerButton = await $(selector);
            if (await registerButton.isDisplayed()) {
              console.log(`✅ Register button found with selector: ${selector} after scroll`);
              break;
            }
          } catch (error) {
            // Continue to next selector
          }
        }
      }
      
      // Verify register button
      if (registerButton && await registerButton.isDisplayed()) {
        console.log('✅ Register button is visible and ready for interaction');
        const buttonText = await registerButton.getText();
        console.log(`📝 Register button text: ${buttonText}`);
      } else {
        console.log('❌ Register button not found');
      }
      
      // Take final screenshot
      await driver.saveScreenshot('./screenshots/password-field-completed.png');
    }
    
    console.log('🔐 Password Field Test completed');
  });
}); 