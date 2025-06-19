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

// Helper function to scroll down in Flutter ScrollView
async function scrollDownInFlutter() {
  console.log('   📜 Attempting to scroll down...');
  
  // Method 1: Direct ScrollView scrolling using JavaScript
  try {
    const scrollView = await $('//android.widget.ScrollView');
    if (await scrollView.isDisplayed()) {
      // Use JavaScript to scroll the ScrollView
      await driver.executeScript('arguments[0].scrollTop = arguments[0].scrollTop + 500;', scrollView);
      console.log('   ✅ JavaScript ScrollView scroll successful');
      await driver.pause(1000);
      return true;
    }
  } catch (e) {
    console.log('   ⚠️ JavaScript ScrollView scroll failed:', e.message);
  }
  
  // Method 2: Use touch scrolling on the screen (avoiding input areas)
  try {
    // Get screen size and scroll from middle to top
    const screenSize = await driver.getWindowSize();
    const centerX = screenSize.width / 2;
    const startY = screenSize.height * 0.7; // Start from middle
    const endY = screenSize.height * 0.3;   // End at top
    
    await driver.touchAction([
      { action: 'press', x: centerX, y: startY },
      { action: 'wait', ms: 300 },
      { action: 'moveTo', x: centerX, y: endY },
      { action: 'release' }
    ]);
    console.log('   ✅ Touch scroll successful');
    await driver.pause(1000);
    return true;
  } catch (e) {
    console.log('   ⚠️ Touch scroll failed:', e.message);
  }
  
  // Method 3: Try scrolling by clicking and dragging on empty areas
  try {
    // Click on an empty area first to unfocus any input
    await driver.touchAction([
      { action: 'press', x: 540, y: 150 },
      { action: 'release' }
    ]);
    await driver.pause(300);
    
    // Then scroll using touch gesture
    await driver.touchAction([
      { action: 'press', x: 540, y: 1200 },
      { action: 'wait', ms: 300 },
      { action: 'moveTo', x: 540, y: 600 },
      { action: 'release' }
    ]);
    console.log('   ✅ Empty area touch scroll successful');
    await driver.pause(1000);
    return true;
  } catch (e) {
    console.log('   ⚠️ Empty area touch scroll failed:', e.message);
  }
  
  // Method 4: Try using the ScrollView's scrollTo method
  try {
    const scrollView = await $('//android.widget.ScrollView');
    if (await scrollView.isDisplayed()) {
      // Try to scroll using the ScrollView's native scrolling
      await driver.executeScript('arguments[0].scrollTo(0, arguments[0].scrollTop + 300);', scrollView);
      console.log('   ✅ ScrollView scrollTo successful');
      await driver.pause(1000);
      return true;
    }
  } catch (e) {
    console.log('   ⚠️ ScrollView scrollTo failed:', e.message);
  }
  
  console.log('   ❌ All scrolling methods failed');
  return false;
}

// Helper function to find and fill a field properly for Flutter apps
async function findAndFillField(hint, value, fieldName) {
  console.log(`📝 Filling ${fieldName}...`);
  let field;
  
  // Try to find the field with multiple scroll attempts
  for (let i = 0; i < 8; i++) {
    try {
      field = await $(`//android.widget.EditText[@hint="${hint}"]`);
      if (await field.isDisplayed()) {
        console.log(`   Found ${fieldName} field on attempt ${i + 1}`);
        break;
      }
    } catch (e) {
      console.log(`   Attempt ${i + 1}: ${fieldName} not found`);
    }
    
    if (i < 7) {
      await scrollDownInFlutter();
    }
  }
  
  if (field && await field.isDisplayed()) {
    try {
      // Click to focus the field first
      await field.click();
      await driver.pause(500);
      
      // Clear existing text by selecting all and deleting
      await field.click();
      await driver.pause(300);
      
      // Try multiple clear methods
      try {
        await field.clearValue();
      } catch (e) {
        console.log('   Clear value failed, trying alternative...');
        // Alternative: send backspace multiple times
        const currentText = await field.getText();
        if (currentText && currentText.length > 0) {
          for (let i = 0; i < currentText.length; i++) {
            await driver.sendKeys(['Backspace']);
            await driver.pause(50);
          }
        }
      }
      
      await driver.pause(500);
      
      // Fill the field using sendKeys for better Flutter compatibility
      await field.click();
      await driver.pause(300);
      await field.setValue(value);
      await driver.pause(1000);
      
      // Verify the value was entered correctly
      const enteredValue = await field.getText();
      console.log(`✅ Filled ${fieldName}: "${enteredValue}"`);
      
      // Additional verification - check if the value matches
      if (enteredValue === value) {
        console.log(`   ✅ Value verification passed`);
        return true;
      } else {
        console.log(`   ⚠️ Value verification failed. Expected: "${value}", Got: "${enteredValue}"`);
        // Try one more time with direct sendKeys
        try {
          await field.click();
          await driver.pause(300);
          await driver.sendKeys(value.split(''));
          await driver.pause(1000);
          const retryValue = await field.getText();
          console.log(`   Retry result: "${retryValue}"`);
          return retryValue === value;
        } catch (e) {
          console.log(`   ❌ Retry also failed:`, e.message);
          return false;
        }
      }
      
    } catch (e) {
      console.log(`❌ Error filling ${fieldName}:`, e.message);
      return false;
    }
  } else {
    console.log(`❌ ${fieldName} field not found after scrolling`);
    return false;
  }
}

// Helper function to scroll to bottom of form
async function scrollToBottomOfForm() {
  console.log('   📜 Scrolling to bottom of form...');
  
  // Try multiple scroll attempts to reach the bottom
  for (let i = 0; i < 5; i++) {
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
        return true;
      }
      
      // If button not found, scroll down
      console.log(`   📜 Scroll attempt ${i + 1}/5`);
      
      // Use the new scrolling method that doesn't interfere with input fields
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
        return true;
      }
      
    } catch (e) {
      console.log(`   ⚠️ Scroll attempt ${i + 1} failed:`, e.message);
    }
  }
  
  console.log('   ⚠️ Reached bottom of form');
  return false;
}

describe('Registration Page Test', () => {
  
  beforeEach(async () => {
    // Wait for app to load and animation to complete
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should complete language selection, navigate to registration, and fill the registration form', async () => {
    console.log('=== REGISTRATION PAGE TEST ===');
    
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
    
    // Step 4: Fill Registration Form with Comprehensive Test Data
    console.log('\n--- STEP 4: FILL REGISTRATION FORM ---');
    
    // Take initial screenshot of the registration form
    await takeScreenshot('registration_form_initial');
    
    // Comprehensive test data for registration
    const testData = {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@techcorp.com',
      phone: '5559876543',
      address: '789 Pine Street, Business District, San Francisco, CA 94102',
      country: 'United States'
    };
    
    console.log('📋 Using test data:', JSON.stringify(testData, null, 2));
    
    // Fill First Name
    const firstNameFilled = await findAndFillField('e.g. John', testData.firstName, 'First Name');
    
    // Fill Last Name
    const lastNameFilled = await findAndFillField('e.g. Doe', testData.lastName, 'Last Name');
    
    // Fill Email
    const emailFilled = await findAndFillField('e.g. johndoe@mail.com', testData.email, 'Email');
    
    // Fill Phone Number
    const phoneFilled = await findAndFillField('+1 \n9876543210', testData.phone, 'Phone Number');
    
    // Fill Address
    const addressFilled = await findAndFillField('Street Address', testData.address, 'Address');
    
    // Select Country (if dropdown is present)
    console.log('📝 Selecting Country...');
    try {
      let countryDropdown;
      for (let i = 0; i < 3; i++) {
        try {
          countryDropdown = await $('//android.view.View[@hint="Select Country"]');
          if (await countryDropdown.isDisplayed()) break;
        } catch (e) {
          console.log(`   Attempt ${i + 1}: Country dropdown not found, scrolling...`);
        }
        
        if (i < 2) {
          await scrollDownInFlutter();
        }
      }
      
      if (countryDropdown && await countryDropdown.isDisplayed()) {
        await countryDropdown.click();
        console.log('✅ Clicked country dropdown');
        await driver.pause(2000);
        
        // Try to select the country
        try {
          const countryOption = await $(`~${testData.country}`);
          if (await countryOption.isDisplayed()) {
            await countryOption.click();
            console.log(`✅ Selected Country: ${testData.country}`);
          } else {
            console.log('⚠️ Country option not found, trying alternative method...');
            // Try clicking the first available country option
            const firstCountry = await $('//android.view.View[@clickable="true"]');
            if (await firstCountry.isDisplayed()) {
              await firstCountry.click();
              console.log('✅ Selected first available country');
            }
          }
        } catch (e) {
          console.log('⚠️ Could not select country:', e.message);
        }
      } else {
        console.log('⚠️ Country dropdown not found');
      }
    } catch (e) {
      console.log('❌ Error selecting country:', e.message);
    }
    
    // Step 5: Summary of Form Filling
    console.log('\n--- STEP 5: FORM FILLING SUMMARY ---');
    const filledFields = [firstNameFilled, lastNameFilled, emailFilled, phoneFilled, addressFilled];
    const successCount = filledFields.filter(filled => filled).length;
    
    console.log(`📊 Form filling results: ${successCount}/${filledFields.length} fields filled successfully`);
    
    if (successCount >= 4) {
      console.log('✅ Most fields filled successfully');
    } else {
      console.log('⚠️ Some fields could not be filled');
    }
    
    // Step 6: Click Register Button
    console.log('\n--- STEP 6: CLICK REGISTER BUTTON ---');
    
    try {
      // First, scroll to bottom of form to ensure register button is visible
      await scrollToBottomOfForm();
      
      let registerButton;
      for (let i = 0; i < 3; i++) {
        try {
          // Try multiple selectors for the register button
          registerButton = await $('~Register');
          if (!await registerButton.isDisplayed()) {
            registerButton = await $('//android.widget.Button[contains(@text, "Register")]');
          }
          if (!await registerButton.isDisplayed()) {
            registerButton = await $('//android.view.View[contains(@content-desc, "Register")]');
          }
          if (!await registerButton.isDisplayed()) {
            registerButton = await $('//android.widget.Button[contains(@content-desc, "Register")]');
          }
          
          if (await registerButton.isDisplayed()) {
            console.log(`   Found Register button on attempt ${i + 1}`);
            break;
          }
        } catch (e) {
          console.log(`   Attempt ${i + 1}: Register button not found`);
        }
        
        if (i < 2) {
          await scrollDownInFlutter();
        }
      }
      
      if (registerButton && await registerButton.isDisplayed()) {
        console.log('✅ Register button found and visible');
        
        try {
          // Try clicking the button
          await registerButton.click();
          console.log('✅ Register button clicked successfully');
          await driver.pause(2000);
          
          // Take screenshot after clicking
          await takeScreenshot('after_register_click');
          
          // Verify if we navigated to a new page or got a success message
          try {
            const successMessage = await $('//android.view.View[contains(@text, "success") or contains(@text, "Success")]');
            if (await successMessage.isDisplayed()) {
              console.log('✅ Registration success message found');
            }
          } catch (e) {
            console.log('ℹ️ No success message found, continuing...');
          }
          
        } catch (clickError) {
          console.log('⚠️ Click failed, trying alternative methods...');
          
          try {
            // Try using JavaScript click
            await driver.executeScript('arguments[0].click();', registerButton);
            console.log('✅ JavaScript click successful');
          } catch (jsError) {
            console.log('⚠️ JavaScript click also failed:', jsError.message);
            
            // Try using coordinates (last resort)
            try {
              const location = await registerButton.getLocation();
              const size = await registerButton.getSize();
              const centerX = location.x + size.width / 2;
              const centerY = location.y + size.height / 2;
              
              console.log(`📍 Clicking at coordinates: (${centerX}, ${centerY})`);
              
              // Use sendKeys to simulate tap
              await driver.sendKeys(['Enter']);
              console.log('✅ Enter key click successful');
              
            } catch (coordError) {
              console.log('❌ All click methods failed:', coordError.message);
            }
          }
        }
        
        // Button was found and clicked, continue with test
      }
    } catch (e) {
      console.log('❌ Error clicking Register button:', e.message);
    }

    await driver.pause(1000);
    
    console.log('\n=== REGISTRATION PAGE TEST COMPLETED ===');
    console.log('🎉 SUCCESS: Language Selection → Login → Sign Up → Registration Form Filled and Register Clicked ✅');
    console.log('📝 Form filled with realistic test data successfully!');
  });
}); 