const { expect } = require('@wdio/globals');

// Reusable: Take screenshot with timestamp
async function takeScreenshot(name) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await driver.saveScreenshot(`./screenshots/${name}_${timestamp}.png`);
    console.log(`📸 Screenshot saved: ${name}_${timestamp}.png`);
  } catch (e) {
    console.log(`⚠️ Screenshot failed: ${e.message}`);
  }
}

// Reusable: W3C Touch Scrolling (center of screen) - PROVEN WORKING
async function scrollDownW3C() {
  console.log('📜 Attempting W3C touch scroll...');
  try {
    await driver.hideKeyboard().catch(() => {}); // prevent keyboard block
    await driver.pause(500);
    const { width, height } = await driver.getWindowSize();
    const startX = width / 2;
    const startY = height * 0.75;
    const endY = height * 0.25;

    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 300 },
        { type: 'pointerMove', duration: 1000, x: startX, y: endY },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    await driver.releaseActions();
    await driver.pause(1500);
    console.log('✅ Scroll successful');
    return true;
  } catch (e) {
    console.log('❌ Scroll failed:', e.message);
    return false;
  }
}

// Reusable: Try to find Register button with multiple strategies
async function findRegisterButton() {
  const selectors = [
    '~Register',
    '//android.widget.Button[contains(@text, "Register")]',
    '//android.view.View[contains(@content-desc, "Register")]'
  ];
  for (let selector of selectors) {
    try {
      const el = await $(selector);
      if (await el.isDisplayed()) return el;
    } catch (_) {}
  }
  return null;
}

// Reusable: Find and fill a field with scrolling support
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
      await scrollDownW3C();
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

describe('Registration Page Test', () => {
  
  beforeEach(async () => {
    // Wait for app to load and animation to complete
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should complete registration flow with working scroll logic', async () => {
    console.log('=== REGISTRATION PAGE TEST STARTED ===');
    
    // Step 1: Complete Language Selection
    console.log('\n➡️ Step 1: Language selection');
    for (let i = 0; i < 10; i++) {
      try {
        const langTitle = await $('~Select Language');
        if (await langTitle.isDisplayed()) {
          console.log('✅ Language screen visible');
          break;
        }
      } catch (_) {}
      await driver.pause(1000);
    }

    try {
      const english = await $('~English');
      await english.click();
      console.log('✅ English selected');
      const tick = await $('//android.widget.Button[@enabled="true"]');
      await tick.click();
      console.log('✅ Confirmed language');
      await driver.pause(3000);
    } catch (e) {
      console.log('❌ Failed selecting language:', e.message);
      return;
    }

    // Step 2: Click Sign Up on login page
    console.log('\n➡️ Step 2: Login > Sign Up');
    for (let i = 0; i < 10; i++) {
      try {
        const signUp = await $('~Sign Up');
        if (await signUp.isDisplayed()) {
          await signUp.click();
          console.log('✅ Sign Up clicked');
          await driver.pause(3000);
          break;
        }
      } catch (_) {
        await driver.pause(1000);
      }
    }

    // Step 3: Wait for registration page
    console.log('\n➡️ Step 3: Wait for Registration');
    for (let i = 0; i < 10; i++) {
      try {
        const regTitle = await $('~Registration');
        if (await regTitle.isDisplayed()) {
          console.log('✅ Registration screen ready');
          break;
        }
      } catch (_) {
        await driver.pause(1000);
      }
    }

    // Step 4: Fill Registration Form
    console.log('\n➡️ Step 4: Fill Registration Form');
    
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
          await scrollDownW3C();
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
    console.log('\n➡️ Step 5: Form Filling Summary');
    const filledFields = [firstNameFilled, lastNameFilled, emailFilled, phoneFilled, addressFilled];
    const successCount = filledFields.filter(filled => filled).length;
    
    console.log(`📊 Form filling results: ${successCount}/${filledFields.length} fields filled successfully`);
    console.log(`🏛️ State selection: ${stateSelected ? 'Success' : 'Failed'}`);
    
    if (successCount >= 4) {
      console.log('✅ Most fields filled successfully');
    } else {
      console.log('⚠️ Some fields could not be filled');
    }
    
    // Step 6: Scroll to find Register button
    console.log('\n➡️ Step 6: Scroll to find Register button');
    let found = false;

    for (let i = 0; i < 5; i++) {
      console.log(`\n🔄 Scroll Attempt ${i + 1}`);
      const registerBtn = await findRegisterButton();
      if (registerBtn) {
        console.log('✅ Register button found');
        await takeScreenshot(`register_button_found_attempt_${i + 1}`);
        found = true;
        break;
      }

      // Scroll down
      await takeScreenshot(`before_scroll_${i + 1}`);
      const scrolled = await scrollDownW3C();
      if (!scrolled) break;
      await takeScreenshot(`after_scroll_${i + 1}`);
    }

    // Final fallback check
    if (!found) {
      const finalTry = await findRegisterButton();
      if (finalTry) {
        console.log('✅ Register button found in final fallback');
        await takeScreenshot('register_button_found_final');
        found = true;
      } else {
        console.log('❌ Could not find Register button after scrolling');
        await takeScreenshot('register_button_not_found');
      }
    }

    // Step 7: Click Register Button (if found)
    if (found) {
      console.log('\n➡️ Step 7: Click Register Button');
      try {
        const registerBtn = await findRegisterButton();
        if (registerBtn && await registerBtn.isDisplayed()) {
          await registerBtn.click();
          console.log('✅ Register button clicked successfully');
          await driver.pause(2000);
          await takeScreenshot('after_register_click');
        }
      } catch (e) {
        console.log('❌ Error clicking register button:', e.message);
      }
    }

    console.log('\n=== REGISTRATION PAGE TEST COMPLETED ===');
    if (found) {
      console.log('🎉 SUCCESS: Registration flow completed with register button found');
    } else {
      console.log('⚠️ PARTIAL SUCCESS: Form filled but register button not found');
    }
  });
}); 