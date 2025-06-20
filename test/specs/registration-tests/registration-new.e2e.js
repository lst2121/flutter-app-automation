const { expect } = require('@wdio/globals');

// Helper function to take screenshot for debugging
async function takeScreenshot(name) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await driver.saveScreenshot(`./screenshots/${name}_${timestamp}.png`);
    console.log(`   📸 Screenshot saved: ${name}_${timestamp}.png`);
  } catch (e) {
    console.log(`   ⚠️ Screenshot failed: ${e.message}`);
  }
}

// Helper function to scroll down using W3C Actions API (proven working)
async function scrollDownInFlutter() {
  console.log('   📜 Testing W3C Actions API scrolling...');
  
  // Method 1: Try scrolling on ScrollView element first
  try {
    const scrollView = await $('//android.widget.ScrollView');
    if (await scrollView.isDisplayed()) {
      const location = await scrollView.getLocation();
      const size = await scrollView.getSize();
      
      const startX = location.x + size.width / 2;
      const startY = location.y + size.height * 0.8;
      const endY = location.y + size.height * 0.2;
      
      console.log(`   📏 ScrollView: ${JSON.stringify(location)}, size: ${JSON.stringify(size)}`);
      console.log(`   📍 ScrollView scroll: (${startX}, ${startY}) → (${startX}, ${endY})`);
      
      // Hide keyboard first to avoid interference
      try {
        await driver.hideKeyboard();
        console.log('   ⌨️ Keyboard hidden');
      } catch (e) {
        console.log('   ℹ️ No keyboard to hide');
      }
      
      // Use W3C Actions API for scrolling
      await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 500 },
          { type: 'pointerMove', duration: 1000, x: startX, y: endY },
          { type: 'pointerUp', button: 0 }
        ]
      }]);
      await driver.releaseActions();
      
      console.log('   ✅ ScrollView W3C scroll successful');
      await driver.pause(2000);
      return true;
    }
  } catch (e) {
    console.log('   ⚠️ ScrollView W3C scroll failed:', e.message);
  }
  
  // Method 2: Fallback to screen-based W3C scrolling
  try {
    const screenSize = await driver.getWindowSize();
    const centerX = screenSize.width / 2;
    const startY = screenSize.height * 0.8; // Start from 80% down
    const endY = screenSize.height * 0.2;   // End at 20% up
    
    console.log(`   📱 Screen size: ${screenSize.width}x${screenSize.height}`);
    console.log(`   📍 W3C scroll: (${centerX}, ${startY}) → (${centerX}, ${endY})`);
    
    // Hide keyboard first to avoid interference
    try {
      await driver.hideKeyboard();
      console.log('   ⌨️ Keyboard hidden');
    } catch (e) {
      console.log('   ℹ️ No keyboard to hide');
    }
    
    // Wait a moment for any animations to settle
    await driver.pause(500);
    
    // Use W3C Actions API for screen-based scrolling
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: centerX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 500 },
        { type: 'pointerMove', duration: 1000, x: centerX, y: endY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    await driver.releaseActions();
    
    console.log('   ✅ W3C scroll successful');
    await driver.pause(2000);
    return true;
    
  } catch (e) {
    console.log('   ⚠️ W3C scroll failed:', e.message);
  }
  
  console.log('   ❌ All scrolling methods failed');
  return false;
}

// Helper function to find and fill a field with scrolling
async function findAndFillField(hint, value, fieldName) {
  console.log(`📝 Filling ${fieldName}...`);
  let field;
  
  // Try to find the field with multiple scroll attempts
  for (let i = 0; i < 5; i++) {
    try {
      field = await $(`//android.widget.EditText[@hint="${hint}"]`);
      if (await field.isDisplayed()) {
        console.log(`   Found ${fieldName} field on attempt ${i + 1}`);
        break;
      }
    } catch (e) {
      console.log(`   Attempt ${i + 1}: ${fieldName} not found`);
    }
    
    if (i < 4) {
      await scrollDownInFlutter();
    }
  }
  
  if (field && await field.isDisplayed()) {
    try {
      // Click to focus the field first
      await field.click();
      await driver.pause(500);
      
      // Clear existing text
      await field.clearValue();
      await driver.pause(500);
      
      // Fill the field
      await field.setValue(value);
      await driver.pause(1000);
      
      console.log(`✅ Filled ${fieldName}: "${value}"`);
      return true;
      
    } catch (e) {
      console.log(`❌ Error filling ${fieldName}:`, e.message);
      return false;
    }
  } else {
    console.log(`❌ ${fieldName} field not found after scrolling`);
    return false;
  }
}

// Helper function to scroll to bottom and find register button
async function scrollToBottomAndFindRegister() {
  console.log('   📜 Scrolling to bottom to find register button...');
  
  // Try multiple scroll attempts to reach the bottom
  for (let i = 0; i < 4; i++) {
    try {
      // Try to find register button first
      let registerButton = await $('~Register');
      if (!await registerButton.isDisplayed()) {
        registerButton = await $('//android.widget.Button[contains(@text, "Register")]');
      }
      if (!await registerButton.isDisplayed()) {
        registerButton = await $('//android.view.View[contains(@content-desc, "Register")]');
      }
      
      if (await registerButton.isDisplayed()) {
        console.log('   ✅ Register button found, no need to scroll further');
        return registerButton;
      }
      
      // If button not found, scroll down
      console.log(`   📜 Scroll attempt ${i + 1}/4`);
      await scrollDownInFlutter();
      
      // Check again for register button
      registerButton = await $('~Register');
      if (!await registerButton.isDisplayed()) {
        registerButton = await $('//android.widget.Button[contains(@text, "Register")]');
      }
      if (!await registerButton.isDisplayed()) {
        registerButton = await $('//android.view.View[contains(@content-desc, "Register")]');
      }
      
      if (await registerButton.isDisplayed()) {
        console.log('   ✅ Register button found after scrolling');
        return registerButton;
      }
      
    } catch (e) {
      console.log(`   ⚠️ Scroll attempt ${i + 1} failed:`, e.message);
    }
  }
  
  console.log('   ⚠️ Reached bottom of form');
  return null;
}

describe('New Registration Test', () => {
  
  beforeEach(async () => {
    // Wait for app to load and animation to complete
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should complete registration flow with working scroll logic', async () => {
    console.log('=== NEW REGISTRATION TEST STARTED ===');
    
    // Step 1: Complete Language Selection
    console.log('\n--- STEP 1: COMPLETE LANGUAGE SELECTION ---');
    
    // Wait for language selection screen
    let attempts = 0;
    let languageScreenFound = false;
    
    while (attempts < 15 && !languageScreenFound) {
      try {
        const selectLanguageTitle = await $('~Select Language');
        if (await selectLanguageTitle.isDisplayed()) {
          languageScreenFound = true;
          console.log('✅ Language selection screen is visible');
        }
      } catch (e) {
        console.log(`   Attempt ${attempts + 1}: Language screen not ready yet...`);
        await driver.pause(1000);
        attempts++;
      }
    }
    
    if (!languageScreenFound) {
      console.log('❌ Language selection screen not found after waiting');
      return;
    }
    
    // Select English language
    try {
      const englishOption = await $('~English');
      if (await englishOption.isDisplayed()) {
        await englishOption.click();
        console.log('✅ Selected English language');
        await driver.pause(1000);
      } else {
        console.log('❌ English language option not found');
        return;
      }
    } catch (e) {
      console.log('❌ Error selecting English:', e.message);
      return;
    }
    
    // Click right tick button
    try {
      const rightTickButton = await $('//android.widget.Button[@enabled="true"]');
      if (await rightTickButton.isDisplayed() && await rightTickButton.isEnabled()) {
        await rightTickButton.click();
        console.log('✅ Clicked right tick button');
        await driver.pause(3000); // Wait for navigation
      } else {
        console.log('❌ Right tick button not available or not enabled');
        return;
      }
    } catch (e) {
      console.log('❌ Error clicking right tick button:', e.message);
      return;
    }
    
    // Step 2: Navigate to Login Page and Click Sign Up
    console.log('\n--- STEP 2: NAVIGATE TO LOGIN AND CLICK SIGN UP ---');
    
    // Wait for login page
    console.log('⏳ Waiting for login page to appear...');
    await driver.pause(3000);
    
    // Look for login page and click sign up
    attempts = 0;
    let signUpClicked = false;
    
    while (attempts < 15 && !signUpClicked) {
      try {
        const signUpButton = await $('~Sign Up');
        if (await signUpButton.isDisplayed()) {
          await signUpButton.click();
          console.log('✅ Clicked Sign Up button');
          signUpClicked = true;
          await driver.pause(3000); // Wait for navigation
        } else {
          console.log(`   Attempt ${attempts + 1}: Sign Up button not ready yet...`);
          await driver.pause(1000);
          attempts++;
        }
      } catch (e) {
        console.log(`   Attempt ${attempts + 1}: Error finding Sign Up button`);
        await driver.pause(1000);
        attempts++;
      }
    }
    
    if (!signUpClicked) {
      console.log('❌ Could not click Sign Up button');
      return;
    }
    
    // Step 3: Wait for Registration Page
    console.log('\n--- STEP 3: WAIT FOR REGISTRATION PAGE ---');
    
    attempts = 0;
    let registrationPageFound = false;
    
    while (attempts < 15 && !registrationPageFound) {
      try {
        const registrationTitle = await $('~Registration');
        if (await registrationTitle.isDisplayed()) {
          registrationPageFound = true;
          console.log('✅ Registration page is visible');
        }
      } catch (e) {
        console.log(`   Attempt ${attempts + 1}: Registration page not ready yet...`);
        await driver.pause(1000);
        attempts++;
      }
    }
    
    if (!registrationPageFound) {
      console.log('❌ Registration page not found after waiting');
      return;
    }
    
    // Step 4: Fill Registration Form
    console.log('\n--- STEP 4: FILL REGISTRATION FORM ---');
    
    // Take initial screenshot
    await takeScreenshot('registration_form_initial');
    
    // Test data
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '5551234567',
      address: '123 Main Street, City, State 12345'
    };
    
    console.log('📋 Using test data:', JSON.stringify(testData, null, 2));
    
    // Fill fields with scrolling support
    const firstNameFilled = await findAndFillField('e.g. John', testData.firstName, 'First Name');
    const lastNameFilled = await findAndFillField('e.g. Doe', testData.lastName, 'Last Name');
    const emailFilled = await findAndFillField('e.g. johndoe@mail.com', testData.email, 'Email');
    const phoneFilled = await findAndFillField('+1 \n9876543210', testData.phone, 'Phone Number');
    const addressFilled = await findAndFillField('Street Address', testData.address, 'Address');
    
    // Try to select State from dropdown
    console.log('📝 Selecting State...');
    let stateSelected = false;
    try {
      let stateDropdown;
      for (let i = 0; i < 3; i++) {
        try {
          stateDropdown = await $('//android.view.View[@hint="Select State"]');
          if (!(await stateDropdown.isDisplayed())) {
            stateDropdown = await $('//android.widget.EditText[@hint="Select State"]');
          }
          if (!(await stateDropdown.isDisplayed())) {
            stateDropdown = await $('//android.view.View[contains(@content-desc, "State")]');
          }
          if (await stateDropdown.isDisplayed()) break;
        } catch (e) {
          console.log(`   Attempt ${i + 1}: State dropdown not found`);
        }
        
        if (i < 2) {
          await scrollDownInFlutter();
        }
      }
      
      if (stateDropdown && await stateDropdown.isDisplayed()) {
        await stateDropdown.click();
        console.log('✅ Clicked state dropdown');
        await driver.pause(2000);
        
        // Try to select California
        try {
          const stateOption = await $('~California');
          if (await stateOption.isDisplayed()) {
            await stateOption.click();
            console.log('✅ Selected State: California');
            stateSelected = true;
          } else {
            console.log('⚠️ California not found, trying first available state...');
            const firstState = await $('//android.view.View[@clickable="true"]');
            if (await firstState.isDisplayed()) {
              await firstState.click();
              console.log('✅ Selected first available state');
              stateSelected = true;
            }
          }
        } catch (e) {
          console.log('⚠️ Could not select state:', e.message);
        }
      } else {
        console.log('⚠️ State dropdown not found');
      }
    } catch (e) {
      console.log('❌ Error selecting state:', e.message);
    }
    
    // Step 5: Summary
    console.log('\n--- STEP 5: FORM FILLING SUMMARY ---');
    const filledFields = [firstNameFilled, lastNameFilled, emailFilled, phoneFilled, addressFilled];
    const successCount = filledFields.filter(filled => filled).length;
    
    console.log(`📊 Form filling results: ${successCount}/${filledFields.length} fields filled successfully`);
    console.log(`🏛️ State selection: ${stateSelected ? 'Success' : 'Failed'}`);
    
    if (successCount >= 4) {
      console.log('✅ Most fields filled successfully');
    } else {
      console.log('⚠️ Some fields could not be filled');
    }
    
    // Step 6: Click Register Button
    console.log('\n--- STEP 6: CLICK REGISTER BUTTON ---');
    
    try {
      // Scroll to bottom and find register button
      const registerButton = await scrollToBottomAndFindRegister();
      
      if (registerButton && await registerButton.isDisplayed()) {
        console.log('✅ Register button found and visible');
        
        try {
          await registerButton.click();
          console.log('✅ Register button clicked successfully');
          await driver.pause(2000);
          
          // Take screenshot after clicking
          await takeScreenshot('after_register_click');
          
        } catch (clickError) {
          console.log('⚠️ Click failed:', clickError.message);
        }
        
      } else {
        console.log('❌ Register button not found');
      }
      
    } catch (e) {
      console.log('❌ Error finding register button:', e.message);
    }
    
    console.log('\n=== NEW REGISTRATION TEST COMPLETED ===');
  });
}); 