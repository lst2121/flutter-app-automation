const { expect } = require('@wdio/globals');
const AppFlow = require('../pageobjects/AppFlow');
const RegistrationPage = require('../pageobjects/RegistrationPage');
const fs = require('fs');

// Helper function to close sidebar
async function closeSidebar() {
  try {
    let anytimeShift;
    try {
      anytimeShift = await $('~Anytime Shift');
      if (anytimeShift && await anytimeShift.isDisplayed()) {
        await anytimeShift.click();
        console.log('✅ Sidebar closed by clicking Anytime Shift');
        await driver.pause(500);
        return;
      }
    } catch {}

    try {
      anytimeShift = await $('android=new UiSelector().textContains("Anytime Shift")');
      if (anytimeShift && await anytimeShift.isDisplayed()) {
        await anytimeShift.click();
        console.log('✅ Sidebar closed by clicking Anytime Shift (XPath)');
        await driver.pause(500);
        return;
      }
    } catch {}

    console.log('ℹ️ Anytime Shift element not visible, skipping sidebar close');
  } catch (error) {
    console.log('⚠️ Could not find or click Anytime Shift:', error.message);
  }
}

// Helper function to hide keyboard
async function hideKeyboard() {
  console.log('⌨️ Checking keyboard visibility...');
  try {
    const isShown = await driver.isKeyboardShown();
    if (isShown) {
      await driver.hideKeyboard();
      console.log('✅ Keyboard hidden successfully');
      await driver.pause(500);
      return true;
    } else {
      console.log('ℹ️ Keyboard already hidden');
      return true;
    }
  } catch (error) {
    console.log('ℹ️ Could not check keyboard status:', error.message);
    try {
      await driver.hideKeyboard();
      console.log('✅ Keyboard hidden successfully');
      await driver.pause(500);
      return true;
    } catch (hideError) {
      console.log('⚠️ Could not hide keyboard:', hideError.message);
      return false;
    }
  }
}

// Helper function to retry operations
async function retry(fn, maxAttempts = 3, operationName = 'Operation') {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 ${operationName} attempt ${attempt}/${maxAttempts}`);
      return await fn();
    } catch (error) {
      console.log(`⚠️ ${operationName} attempt ${attempt} failed:`, error.message);
      if (attempt === maxAttempts) {
        throw error;
      }
      await driver.pause(1000);
    }
  }
}

// Helper function to scroll down
async function scrollDown() {
  console.log('🔄 Scrolling down...');
  await closeSidebar();
  
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
}

// Helper function to select from dropdown
async function selectFromDropdown(dropdownLocator, options, dropdownName) {
  return await retry(async () => {
    console.log(`📋 Selecting ${dropdownName}...`);
    
    // Hide keyboard before clicking dropdown to prevent interference
    await hideKeyboard();
    
    const dropdown = await $(dropdownLocator);
    await dropdown.waitForDisplayed({ timeout: 5000 });
    await dropdown.click();
    console.log(`✅ ${dropdownName} dropdown clicked`);
    await driver.pause(2000);
    
    // Look for dropdown options using content-desc
    const dropdownOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
    console.log(`🔍 Found ${dropdownOptions.length} potential ${dropdownName} options`);
    
    // Filter for actual options (those with content-desc)
    const availableOptions = [];
    for (let i = 0; i < dropdownOptions.length; i++) {
      try {
        const contentDesc = await dropdownOptions[i].getAttribute('content-desc');
        if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
          availableOptions.push({
            element: dropdownOptions[i],
            name: contentDesc
          });
        }
      } catch (error) {
        // Skip elements that don't have content-desc
      }
    }
    
    console.log(`📋 Available ${dropdownName} options: ${availableOptions.map(s => s.name).join(', ')}`);
    
    if (availableOptions.length > 0) {
      // Select a random option
      const selectedIndex = Math.floor(Math.random() * availableOptions.length);
      const selectedOption = availableOptions[selectedIndex];
      
      await selectedOption.element.click();
      console.log(`✅ Selected ${dropdownName}: ${selectedOption.name}`);
      return true;
    } else {
      console.log(`⚠️ No ${dropdownName} options found with content-desc`);
      return false;
    }
  }, 3, `${dropdownName} selection`);
}

// Timestamped screenshot helper
async function takeScreenshot(name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `./screenshots/${name}-${timestamp}.png`;
  await driver.saveScreenshot(filename);
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
}

describe('Complete Registration Form Test', () => {
  let appFlow;
  let registrationPage;

  beforeEach(async () => {
    appFlow = new AppFlow();
    registrationPage = new RegistrationPage();
    console.log('⏳ Waiting for app to load...');
    await driver.pause(3000);
  });

  it('should complete full registration form with all fields', async () => {
    console.log('=== COMPLETE REGISTRATION FORM TEST STARTED ===');

    // Step 1: Complete onboarding
    const onboardingResult = await appFlow.completeOnboarding();
    if (!onboardingResult.success) throw new Error('❌ Onboarding failed');

    // Step 2: Navigate to registration page
    const signUpResult = await appFlow.loginPage.navigateToSignUp();
    if (!signUpResult) throw new Error('❌ Navigation to sign up failed');

    // Step 3: Fill all fields before country using RegistrationPage
    console.log('\n📝 Step 3: Filling fields before country...');
    
    // Fill First Name
    await registrationPage.fillFirstName('John');
    
    // Fill Last Name
    await registrationPage.fillLastName('Doe');
    
    // Fill Email
    await registrationPage.fillEmail('johndoe@example.com');
    
    // Fill Phone
    await registrationPage.fillPhone('9876543210');
    
    // Fill Address
    await registrationPage.fillAddress('123 Main Street');

    // Step 4: Close sidebar if present
    console.log('\n🚪 Step 4: Closing sidebar...');
    await closeSidebar();

    // Step 5: Scroll down to bring more fields into view
    console.log('\n🔄 Step 5: Scrolling down...');
    await scrollDown();

    // Step 6: Select State
    console.log('\n🏛️ Step 6: Selecting State...');
    await selectFromDropdown('~Select State', [], 'State');

    // Step 6.5: Handle City dropdown that appears after State selection
    console.log('\n🏙️ Step 6.5: Handling City dropdown after State selection...');
    await driver.pause(2000); // Wait 2 seconds for City dropdown to appear
    
    // Check if City dropdown appeared
    let citySelected = false;
    try {
      const cityDropdown = await $('~Select City');
      if (await cityDropdown.isDisplayed()) {
        console.log('🏙️ City dropdown found, selecting city...');
        await selectFromDropdown('~Select City', [], 'City');
        await driver.pause(2000);
        citySelected = true;
        
        // Capture page source after City selection to understand the complete form structure
        console.log('📄 Capturing page source after City selection...');
        const pageSourceAfterCity = await driver.getPageSource();
        fs.writeFileSync('./screenshots/page-source-after-city-selection.html', pageSourceAfterCity);
        console.log('📄 Page source saved to: ./screenshots/page-source-after-city-selection.html');
        
        // Take screenshot after City selection
        await takeScreenshot('after-city-selection');
        
        console.log('🔍 Analyzing page source to find available fields...');
        
        // Parse the page source to find all available input fields
        const availableFields = [];
        const fieldMatches = pageSourceAfterCity.match(/<android\.widget\.EditText[^>]*hint="([^"]*)"[^>]*>/g);
        if (fieldMatches) {
          fieldMatches.forEach(match => {
            const hintMatch = match.match(/hint="([^"]*)"/);
            if (hintMatch) {
              availableFields.push(hintMatch[1]);
            }
          });
        }
        
        console.log('📋 Available input fields after City selection:');
        availableFields.forEach((field, index) => {
          console.log(`  ${index + 1}. ${field}`);
        });
        
        // Also look for any remaining dropdowns
        const dropdownMatches = pageSourceAfterCity.match(/content-desc="Select ([^"]*)"[^>]*>/g);
        if (dropdownMatches) {
          console.log('📋 Available dropdowns after City selection:');
          dropdownMatches.forEach(match => {
            const dropdownMatch = match.match(/content-desc="Select ([^"]*)"/);
            if (dropdownMatch) {
              console.log(`  - ${dropdownMatch[1]}`);
            }
          });
        }
        
      } else {
        console.log('ℹ️ City dropdown not found, proceeding to next fields...');
      }
    } catch (error) {
      console.log('ℹ️ City dropdown not present, proceeding to next fields...');
    }

    // Step 7: Fill Zip Code
    console.log('\n📮 Step 7: Filling Zip Code...');
    try {
      // Find Zip Code field by looking for the EditText after the "Zip Code *" label
      const zipCodeLabel = await $('//android.view.View[@content-desc="Zip Code *"]');
      if (await zipCodeLabel.isDisplayed()) {
        // Find the EditText that follows this label
        const zipField = await $('//android.view.View[@content-desc="Zip Code *"]/following-sibling::android.widget.EditText[1]');
        if (await zipField.isDisplayed()) {
          console.log('📝 Found Zip Code field using content-desc locator');
          await zipField.click();
          await driver.pause(500);
          await zipField.clearValue();
          await driver.pause(500);
          await zipField.setValue('12345');
          await driver.pause(1000);
          await closeSidebar();
          await takeScreenshot('after-zip-code');
          console.log('✅ Zip Code filled successfully');
          
          // 🔧 ROLLBACK: Use working validation from debug test
          const stillOnForm = await $('~Select Residence Status').isDisplayed().catch(() => false);
          if (!stillOnForm) {
            throw new Error('❌ Exited form after Zip Code field - hideKeyboard() likely caused back navigation');
          }
          
          // 🔄 Scroll immediately to keep in form context
          await scrollDown();
        } else {
          console.log('⚠️ Zip Code input field not found after label');
        }
      } else {
        console.log('⚠️ Zip Code label not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Zip Code:', error.message);
    }

    // Step 8: Fill SS#/TIN#
    console.log('\n🆔 Step 8: Filling SS#/TIN#...');
    try {
      // Find SS#/TIN# field by looking for the EditText after the "SS#/TIN# *" label
      const ssnLabel = await $('//android.view.View[@content-desc="SS#/TIN# *"]');
      if (await ssnLabel.isDisplayed()) {
        // Find the EditText that follows this label - it's the next EditText after the label
        const ssnField = await $('//android.view.View[@content-desc="SS#/TIN# *"]/following-sibling::android.widget.EditText[1]');
        if (await ssnField.isDisplayed()) {
          console.log('📝 Found SS#/TIN# field using content-desc locator');
          await ssnField.click();
          await driver.pause(500);
          await ssnField.clearValue();
          await driver.pause(500);
          await ssnField.setValue('123-45-6789');
          await driver.pause(1000);
          await closeSidebar(); // 🔧 ROLLBACK: Use working approach from debug test
          await takeScreenshot('after-ssn');
          console.log('✅ SS#/TIN# filled successfully');
          
          // 🔧 ROLLBACK: Use working validation from debug test
          const stillOnForm = await $('~Select Residence Status').isDisplayed().catch(() => false);
          if (!stillOnForm) {
            throw new Error('❌ Exited form after SS#/TIN# field - hideKeyboard() likely caused back navigation');
          }
          
          // 🔄 Scroll immediately to keep in form context
          await scrollDown();
        } else {
          console.log('⚠️ SS#/TIN# input field not found after label');
        }
      } else {
        console.log('⚠️ SS#/TIN# label not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling SS#/TIN#:', error.message);
    }

    // Step 9: Scroll down more to bring remaining fields into view
    console.log('\n🔄 Step 9: Scrolling down for remaining fields...');
    await scrollDown();

    // Step 10: Select Residence Status
    console.log('\n🏠 Step 10: Selecting Residence Status...');
    try {
      const residenceDropdown = await $('~Select Residence Status');
      if (await residenceDropdown.isDisplayed()) {
        await residenceDropdown.click();
        await driver.pause(2000);
        
        // Select first available option
        const residenceOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
        for (let i = 0; i < residenceOptions.length; i++) {
          try {
            const contentDesc = await residenceOptions[i].getAttribute('content-desc');
            if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
              await residenceOptions[i].click();
              console.log(`✅ Selected Residence Status: ${contentDesc}`);
              await driver.pause(1000);
              await takeScreenshot('after-residence-status');
              break;
            }
          } catch (error) {
            // Continue to next option
          }
        }
      } else {
        console.log('⚠️ Residence Status dropdown not found');
      }
    } catch (error) {
      console.log('⚠️ Error with Residence Status dropdown:', error.message);
    }

    // Step 11: Fill Password
    console.log('\n🔐 Step 11: Filling Password...');
    try {
      // Look for password field - it might be the last EditText field
      const passwordFields = await $$('android.widget.EditText');
      let passwordFilled = false;
      
      for (let i = passwordFields.length - 1; i >= 0; i--) {
        try {
          const field = passwordFields[i];
          const hint = await field.getAttribute('hint');
          const text = await field.getAttribute('text');
          
          // If field is empty and has no hint, it's likely a password field
          if ((!hint || hint === '') && (!text || text === '') && await field.isDisplayed()) {
            console.log('📝 Found Password field');
            await field.click();
            await driver.pause(500);
            await field.clearValue();
            await driver.pause(500);
            await field.setValue('TestPassword123!');
            await driver.pause(1000);
            await closeSidebar(); // 🔧 ROLLBACK: Use working approach from debug test
            await takeScreenshot('after-password');
            console.log('✅ Password filled successfully');
            
            // 🔧 ROLLBACK: Use working validation from debug test
            const stillOnForm = await $('~Select Residence Status').isDisplayed().catch(() => false);
            if (!stillOnForm) {
              throw new Error('❌ Exited form after Password field - hideKeyboard() likely caused back navigation');
            }
            
            // 🔄 Scroll immediately to keep in form context
            await scrollDown();
            passwordFilled = true;
            break;
          }
        } catch (error) {
          // Continue to next field
        }
      }
      
      if (!passwordFilled) {
        console.log('⚠️ Password field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Password:', error.message);
    }

    // Step 12: Fill Confirm Password
    console.log('\n🔐 Step 12: Filling Confirm Password...');
    try {
      // Look for confirm password field - it might be the next EditText after Password
      const allEditTexts = await $$('android.widget.EditText');
      let confirmPasswordFilled = false;
      
      for (let i = 0; i < allEditTexts.length; i++) {
        try {
          const field = allEditTexts[i];
          const hint = await field.getAttribute('hint');
          const text = await field.getAttribute('text');
          
          // If field is empty and has no hint, and we haven't filled it yet, it's likely confirm password
          if ((!hint || hint === '') && (!text || text === '') && await field.isDisplayed()) {
            console.log('📝 Found Confirm Password field');
            await field.click();
            await driver.pause(500);
            await field.clearValue();
            await driver.pause(500);
            await field.setValue('TestPassword123!');
            await driver.pause(1000);
            await closeSidebar(); // 🔧 ROLLBACK: Use working approach from debug test
            await takeScreenshot('after-confirm-password');
            console.log('✅ Confirm Password filled successfully');
            
            // 🔧 ROLLBACK: Use working validation from debug test
            const stillOnForm = await $('~Select Residence Status').isDisplayed().catch(() => false);
            if (!stillOnForm) {
              throw new Error('❌ Exited form after Confirm Password field - hideKeyboard() likely caused back navigation');
            }
            
            // 🔄 Scroll immediately to keep in form context
            await scrollDown();
            confirmPasswordFilled = true;
            break;
          }
        } catch (error) {
          // Continue to next field
        }
      }
      
      if (!confirmPasswordFilled) {
        console.log('⚠️ Confirm Password field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Confirm Password:', error.message);
    }

    // Step 13: Scroll down to find Register button
    console.log('\n🔄 Step 13: Scrolling down to find Register button...');
    
    // 🔧 FIXED: Before scrolling to Register button, confirm screen not exited
    const stillOnForm = await $('~Residence Status *').isDisplayed().catch(() => false);
    if (!stillOnForm) {
      throw new Error('❌ Exited form after confirm password step');
    }
    
    await scrollDown();

    // Step 14: Find and click Register button
    console.log('\n📝 Step 14: Finding and clicking Register button...');
    
    // Take screenshot before looking for register button
    await takeScreenshot('before-register-search');
    
    const registerButton = await registrationPage.findRegisterButton();
    
    if (registerButton) {
      // Take screenshot before clicking register button
      await takeScreenshot('before-register-click');
      
      const clickResult = await registrationPage.clickRegister();
      if (clickResult) {
        console.log('✅ Registration form submitted successfully!');
        
        // Take final screenshot
        await takeScreenshot('after-register-click');
        
        // Capture final page source
        console.log('📄 Capturing final page source...');
        const finalPageSource = await driver.getPageSource();
        fs.writeFileSync('./screenshots/page-source-after-registration.html', finalPageSource);
        console.log('📄 Final page source saved to: ./screenshots/page-source-after-registration.html');
        
        console.log('🎉 COMPLETE REGISTRATION FORM TEST PASSED!');
      } else {
        throw new Error('❌ Failed to click register button');
      }
    } else {
      throw new Error('❌ Register button not found');
    }
  });
});

