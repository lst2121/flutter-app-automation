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
    
    // First, handle First Name field on main screen
    console.log('\n👤 Testing First Name field...');
    
    try {
      // Find First Name field by looking for the EditText with "e.g. John" hint
      const firstNameField = await $('//android.widget.EditText[@hint="e.g. John"]');
      if (await firstNameField.isDisplayed()) {
        console.log('✅ First Name field found');
        
        // Test first name field interaction
        await firstNameField.click();
        await driver.pause(500);
        await firstNameField.clearValue();
        await driver.pause(500);
        await firstNameField.setValue('John');
        await driver.pause(1000);
        
        console.log('✅ First Name field interaction completed');
        
        // Take screenshot after first name entry
        await driver.saveScreenshot('./screenshots/firstname-entered.png');
        console.log('📸 Screenshot after first name entry taken');
        
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
        
      } else {
        console.log('⚠️ First Name field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling First Name field:', error.message);
    }
    
    // Handle Last Name field
    console.log('\n👤 Testing Last Name field...');
    
    try {
      // Find Last Name field by looking for the EditText with "e.g. Doe" hint
      const lastNameField = await $('//android.widget.EditText[@hint="e.g. Doe"]');
      if (await lastNameField.isDisplayed()) {
        console.log('✅ Last Name field found');
        
        // Test last name field interaction
        await lastNameField.click();
        await driver.pause(500);
        await lastNameField.clearValue();
        await driver.pause(500);
        await lastNameField.setValue('Doe');
        await driver.pause(1000);
        
        console.log('✅ Last Name field interaction completed');
        
        // Take screenshot after last name entry
        await driver.saveScreenshot('./screenshots/lastname-entered.png');
        console.log('📸 Screenshot after last name entry taken');
        
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
        
      } else {
        console.log('⚠️ Last Name field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Last Name field:', error.message);
    }
    
    // Handle Email Address field
    console.log('\n📧 Testing Email Address field...');
    
    try {
      // Find Email Address field by looking for the EditText with "e.g. johndoe@mail.com" hint
      const emailField = await $('//android.widget.EditText[@hint="e.g. johndoe@mail.com"]');
      if (await emailField.isDisplayed()) {
        console.log('✅ Email Address field found');
        
        // Test email field interaction
        await emailField.click();
        await driver.pause(500);
        await emailField.clearValue();
        await driver.pause(500);
        await emailField.setValue('johndoe@example.com');
        await driver.pause(1000);
        
        console.log('✅ Email Address field interaction completed');
        
        // Take screenshot after email entry
        await driver.saveScreenshot('./screenshots/email-entered.png');
        console.log('📸 Screenshot after email entry taken');
        
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
        
      } else {
        console.log('⚠️ Email Address field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Email Address field:', error.message);
    }
    
    // Handle Phone Number field
    console.log('\n📞 Testing Phone Number field...');
    
    try {
      // Find Phone Number field by looking for the EditText with phone number hint
      const phoneField = await $('//android.widget.EditText[@hint="+1 &#10;9876543210"]');
      if (await phoneField.isDisplayed()) {
        console.log('✅ Phone Number field found');
        
        // Test phone field interaction
        await phoneField.click();
        await driver.pause(500);
        await phoneField.clearValue();
        await driver.pause(500);
        await phoneField.setValue('9876543210');
        await driver.pause(1000);
        
        console.log('✅ Phone Number field interaction completed');
        
        // Take screenshot after phone entry
        await driver.saveScreenshot('./screenshots/phone-entered.png');
        console.log('📸 Screenshot after phone entry taken');
        
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
        
      } else {
        console.log('⚠️ Phone Number field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Phone Number field:', error.message);
    }
    
    // First, handle Address field on main screen
    console.log('\n🏠 Testing Address field...');
    
    try {
      // Find Address field by looking for the EditText with "Street Address" hint
      const addressField = await $('//android.widget.EditText[@hint="Street Address"]');
      if (await addressField.isDisplayed()) {
        console.log('✅ Address field found');
        
        // Test address field interaction
        await addressField.click();
        await driver.pause(500);
        await addressField.clearValue();
        await driver.pause(500);
        await addressField.setValue('123 Main Street, Apt 4B');
        await driver.pause(1000);
        
        console.log('✅ Address field interaction completed');
        
        // Take screenshot after address entry
        await driver.saveScreenshot('./screenshots/address-entered.png');
        console.log('📸 Screenshot after address entry taken');
        
        // Capture page source after address entry
        const addressPageSource = await driver.getPageSource();
        fs.writeFileSync('./screenshots/page-source-after-address.xml', addressPageSource);
        console.log('📄 Page source captured after address entry');
        
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
        
      } else {
        console.log('⚠️ Address field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Address field:', error.message);
    }
    
    // First, verify Country field is set to United States and not editable
    console.log('\n🌍 Verifying Country field...');
    
    try {
      const countryField = await $('//android.view.View[@text="United States"]');
      if (await countryField.isDisplayed()) {
        console.log('✅ Country field found and set to "United States"');
        
        // Verify it's not editable (should be disabled)
        const isEnabled = await countryField.getAttribute('enabled');
        if (isEnabled === 'false') {
          console.log('✅ Country field is correctly disabled (not editable)');
        } else {
          console.log('⚠️ Country field appears to be editable');
        }
        
        // Take screenshot of initial state
        await driver.saveScreenshot('./screenshots/country-verified.png');
        console.log('📸 Screenshot of country field verification taken');
      } else {
        console.log('⚠️ Country field not found or not set to "United States"');
      }
    } catch (error) {
      console.log('⚠️ Error verifying Country field:', error.message);
    }
    
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
    
    // First, handle State dropdown - it should be visible after this scroll
    console.log('\n🏛️ Testing State dropdown...');
    
    try {
      const stateDropdown = await $('~Select State');
      if (await stateDropdown.isDisplayed()) {
        console.log('✅ State dropdown found');
        await stateDropdown.click();
        await driver.pause(2000);
        
        // Select California as the fixed state option
        const stateOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
        let stateSelected = false;
        for (let i = 0; i < stateOptions.length; i++) {
          try {
            const contentDesc = await stateOptions[i].getAttribute('content-desc');
            if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
              // Try to select California first, then fall back to first option
              if (contentDesc.includes('California') || contentDesc.includes('CA')) {
                await stateOptions[i].click();
                console.log(`✅ Selected State: ${contentDesc}`);
                stateSelected = true;
              } else if (!stateSelected) {
                // Fall back to first available option if California not found
                await stateOptions[i].click();
                console.log(`✅ Selected State: ${contentDesc}`);
                stateSelected = true;
              }
              
              if (stateSelected) {
                await driver.pause(1000);
                
                // Take screenshot after state selection
                await driver.saveScreenshot('./screenshots/state-selected.png');
                console.log('📸 Screenshot after state selection taken');
                break;
              }
            }
          } catch (error) {
            // Continue to next option
          }
        }
        
        // Handle City dropdown that may appear after State selection
        console.log('\n🏙️ Checking for City dropdown after State selection...');
        await driver.pause(2000); // Wait for City dropdown to appear
        
        try {
          const cityDropdown = await $('~Select City');
          if (await cityDropdown.isDisplayed()) {
            console.log('✅ City dropdown found, selecting city...');
            await cityDropdown.click();
            await driver.pause(2000);
            
            // Select Los Angeles as the fixed city option
            const cityOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
            let citySelected = false;
            for (let i = 0; i < cityOptions.length; i++) {
              try {
                const contentDesc = await cityOptions[i].getAttribute('content-desc');
                if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
                  // Try to select Los Angeles first, then fall back to first option
                  if (contentDesc.includes('Los Angeles') || contentDesc.includes('LA')) {
                    await cityOptions[i].click();
                    console.log(`✅ Selected City: ${contentDesc}`);
                    citySelected = true;
                  } else if (!citySelected) {
                    // Fall back to first available option if Los Angeles not found
                    await cityOptions[i].click();
                    console.log(`✅ Selected City: ${contentDesc}`);
                    citySelected = true;
                  }
                  
                  if (citySelected) {
                    await driver.pause(1000);
                    
                    // Take screenshot after city selection
                    await driver.saveScreenshot('./screenshots/city-selected.png');
                    console.log('📸 Screenshot after city selection taken');
                    break;
                  }
                }
              } catch (error) {
                // Continue to next option
              }
            }
          } else {
            console.log('ℹ️ City dropdown not found, proceeding to next fields...');
          }
        } catch (error) {
          console.log('ℹ️ City dropdown not present, proceeding to next fields...');
        }
        
      } else {
        console.log('⚠️ State dropdown not found');
      }
    } catch (error) {
      console.log('⚠️ Error with State dropdown:', error.message);
    }
    
    // First, handle Zip field - it should be visible after this scroll
    console.log('\n📮 Testing Zip Code field...');
    
    // Try to find zip field using the same approach as SSN/TIN
    let zipField = null;
    try {
      // Find Zip Code field by looking for the EditText after the "Zip Code *" label
      const zipLabel = await $('//android.view.View[@content-desc="Zip Code *"]');
      if (await zipLabel.isDisplayed()) {
        console.log('✅ Zip Code label found');
        
        // Find the EditText that follows this label
        zipField = await $('//android.view.View[@content-desc="Zip Code *"]/following-sibling::android.widget.EditText[1]');
        if (await zipField.isDisplayed()) {
          console.log('📝 Found Zip Code field using content-desc locator');
          
          // Test zip field interaction
          await zipField.click();
          await driver.pause(500);
          await zipField.clearValue();
          await driver.pause(500);
          await zipField.setValue('12345');
          await driver.pause(1000);
          
          console.log('✅ Zip field interaction completed');
          
          // Take screenshot after zip entry
          await driver.saveScreenshot('./screenshots/zip-entered.png');
          console.log('📸 Screenshot after zip entry taken');
          
          // Capture page source after zip entry
          const zipPageSource = await driver.getPageSource();
          fs.writeFileSync('./screenshots/page-source-after-zip.xml', zipPageSource);
          console.log('📄 Page source captured after zip entry');
        } else {
          console.log('⚠️ Zip Code field not found after label');
        }
      } else {
        console.log('⚠️ Zip Code label not found after first scroll');
      }
    } catch (error) {
      console.log('⚠️ Error filling Zip Code:', error.message);
    }
    
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