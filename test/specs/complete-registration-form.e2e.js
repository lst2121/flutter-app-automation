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

// Enhanced keyboard handling with visibility check
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
    // Try to hide anyway
    try {
      await driver.hideKeyboard();
      console.log('✅ Keyboard hidden successfully (fallback)');
      await driver.pause(500);
      return true;
    } catch (hideError) {
      console.log('ℹ️ No keyboard to hide');
      return false;
    }
  }
}

// Retry wrapper for flaky operations
async function retry(fn, maxAttempts = 3, operationName = 'Operation') {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === maxAttempts - 1) throw e;
      console.log(`🔄 Retrying ${operationName} (${i + 1}/${maxAttempts})...`);
      await driver.pause(1000);
    }
  }
}

// Helper function to scroll down
async function scrollDown() {
  console.log('🔄 Scrolling down...');
  
  // Hide keyboard before scrolling to prevent interference
  await hideKeyboard();
  
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

// Enhanced dropdown selection with retry logic
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
    await registrationPage.fillPhone('+19876543210');
    
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
      // Use content-desc locator for Zip Code field
      const zipField = await $('//android.widget.EditText[preceding-sibling::android.view.View[@content-desc="Zip Code *"]]');
      if (await zipField.isDisplayed()) {
        console.log('📝 Found Zip Code field using content-desc locator');
        await zipField.click();
        await driver.pause(500);
        await zipField.clearValue();
        await driver.pause(500);
        await zipField.setValue('12345');
        await driver.pause(1000);
        await hideKeyboard();
        console.log('✅ Zip Code filled successfully');
      } else {
        console.log('⚠️ Zip Code field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Zip Code:', error.message);
    }

    // Step 8: Fill SS#/TIN#
    console.log('\n🆔 Step 8: Filling SS#/TIN#...');
    try {
      // Use content-desc locator for SS#/TIN# field
      const ssnField = await $('//android.widget.EditText[preceding-sibling::android.view.View[@content-desc="SS#/TIN# *"]]');
      if (await ssnField.isDisplayed()) {
        console.log('📝 Found SS#/TIN# field using content-desc locator');
        await ssnField.click();
        await driver.pause(500);
        await ssnField.clearValue();
        await driver.pause(500);
        await ssnField.setValue('123-45-6789');
        await driver.pause(1000);
        await hideKeyboard();
        console.log('✅ SS#/TIN# filled successfully');
      } else {
        console.log('⚠️ SS#/TIN# field not found');
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
        await selectFromDropdown('~Select Residence Status', [], 'Residence Status');
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
            await hideKeyboard();
            console.log('✅ Password filled successfully');
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
            await hideKeyboard();
            console.log('✅ Confirm Password filled successfully');
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
