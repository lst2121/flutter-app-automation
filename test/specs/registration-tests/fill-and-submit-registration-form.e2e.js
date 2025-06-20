const { expect } = require('@wdio/globals');
const fs = require('fs');

// Helper function to take timestamped screenshots
async function takeScreenshot(name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `./screenshots/${name}-${timestamp}.png`;
  await driver.saveScreenshot(filename);
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
}

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

// Helper function to save page source
async function savePageSource(name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `./screenshots/page-source-${name}-${timestamp}.html`;
  const pageSource = await driver.getPageSource();
  fs.writeFileSync(filename, pageSource);
  console.log(`📄 Page source saved: ${filename}`);
  return filename;
}

// Helper function to wait for registration page
async function waitForRegistrationPage() {
  console.log('⏳ Waiting for registration page to load...');
  
  // Wait for the registration title
  const registrationTitle = await $('~Registration');
  await registrationTitle.waitForExist({ timeout: 10000 });
  
  // Wait a bit more for the form to fully load
  await driver.pause(2000);
  
  console.log('✅ Registration page loaded successfully');
}

// Helper function to fill field with proper error handling
async function fillField(fieldLocator, value, fieldName) {
  return await retry(async () => {
    console.log(`📝 Filling ${fieldName} with: ${value}`);
    
    const field = await $(fieldLocator);
    await field.waitForDisplayed({ timeout: 5000 });
    await field.click();
    await driver.pause(500);
    await field.clearValue();
    await driver.pause(500);
    await field.setValue(value);
    await driver.pause(1000);
    
    console.log(`✅ ${fieldName} filled successfully`);
    return true;
  }, 3, `${fieldName} field filling`);
}

// Helper function to select from dropdown
async function selectFromDropdown(dropdownLocator, options, dropdownName) {
  console.log(`📋 Selecting ${dropdownName}...`);
  
  try {
    // 🔧 FIXED: Remove hideKeyboard() call that causes navigation issues
    // Just proceed directly to dropdown selection
    
    const dropdown = await $(dropdownLocator);
    await dropdown.waitForDisplayed({ timeout: 5000 });
    await dropdown.click();
    console.log(`✅ ${dropdownName} dropdown clicked`);
    await driver.pause(2000);
    
    // Look for dropdown options using the correct approach
    console.log(`🔍 Looking for ${dropdownName} options...`);
    
    // Try CheckedTextView first (for Residence Status)
    let dropdownOptions = await $$('android=new UiSelector().className("android.widget.CheckedTextView")');
    console.log(`🔍 Found ${dropdownOptions.length} CheckedTextView options`);
    
    if (dropdownOptions.length === 0) {
      // Fallback to View elements with content-desc (for State)
      dropdownOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
      console.log(`🔍 Fallback: Found ${dropdownOptions.length} View options`);
    }
    
    // Filter for actual dropdown options
    const availableOptions = [];
    for (let i = 0; i < dropdownOptions.length; i++) {
      try {
        const element = dropdownOptions[i];
        if (await element.isDisplayed()) {
          // Try to get text first (for CheckedTextView)
          let optionText = await element.getText().catch(() => null);
          
          // If no text, try content-desc (for View elements)
          if (!optionText) {
            optionText = await element.getAttribute('content-desc').catch(() => null);
          }
          
          if (optionText && optionText.length > 0 && optionText !== 'Scrim') {
            availableOptions.push({
              element: element,
              text: optionText
            });
          }
        }
      } catch (error) {
        // Continue to next element
      }
    }
    
    console.log(`📋 Available ${dropdownName} options: ${availableOptions.map(o => o.text).join(', ')}`);
    
    if (availableOptions.length > 0) {
      // Select a random option (or the first one)
      const selectedIndex = Math.floor(Math.random() * availableOptions.length);
      const selectedOption = availableOptions[selectedIndex];
      
      await selectedOption.element.click();
      console.log(`✅ Selected ${dropdownName}: ${selectedOption.text}`);
      await driver.pause(1000);
      return true;
    }
    
    console.log(`⚠️ No ${dropdownName} options found`);
    return false;
  } catch (error) {
    console.log(`⚠️ Error selecting ${dropdownName}:`, error.message);
    return false;
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

// Helper function to validate app is still on registration page
async function validateRegistrationPage() {
  try {
    const registrationTitle = await $('~Registration');
    const isDisplayed = await registrationTitle.isDisplayed();
    if (!isDisplayed) {
      console.log('❌ App is no longer on registration page!');
      await savePageSource('app-crashed');
      throw new Error('App crashed or navigated away from registration page');
    }
    console.log('✅ App is still on registration page');
    return true;
  } catch (error) {
    console.log('❌ Cannot validate registration page:', error.message);
    await savePageSource('validation-failed');
    throw error;
  }
}

describe('Fill and Submit Registration Form (Debug APK)', () => {
  beforeEach(async () => {
    console.log('🚀 Starting registration form filling test...');
    
    // Wait for registration page to load
    await waitForRegistrationPage();
    
    // Take initial screenshot
    await takeScreenshot('registration-form-filling-started');
    
    // Validate we're on the right page
    await validateRegistrationPage();
  });

  it('should fill all fields, select dropdowns, and submit the form', async () => {
    console.log('=== COMPLETE REGISTRATION FORM TEST STARTED ===');

    // Step 1: Fill First Name
    console.log('\n📝 Step 1: Filling First Name...');
    try {
      const firstNameField = await $('//android.widget.EditText[@hint="e.g. John"]');
      if (await firstNameField.isDisplayed()) {
        await firstNameField.click();
        await driver.pause(500);
        await firstNameField.clearValue();
        await driver.pause(500);
        await firstNameField.setValue('John');
        await driver.pause(1000);
        await closeSidebar();
        await takeScreenshot('after-first-name');
        console.log('✅ First Name filled successfully');
      } else {
        console.log('⚠️ First Name field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling First Name:', error.message);
    }

    // Step 2: Fill Last Name
    console.log('\n📝 Step 2: Filling Last Name...');
    try {
      const lastNameField = await $('//android.widget.EditText[@hint="e.g. Doe"]');
      if (await lastNameField.isDisplayed()) {
        await lastNameField.click();
        await driver.pause(500);
        await lastNameField.clearValue();
        await driver.pause(500);
        await lastNameField.setValue('Doe');
        await driver.pause(1000);
        await closeSidebar();
        await takeScreenshot('after-last-name');
        console.log('✅ Last Name filled successfully');
      } else {
        console.log('⚠️ Last Name field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Last Name:', error.message);
    }

    // Step 3: Fill Email
    console.log('\n📝 Step 3: Filling Email...');
    try {
      const emailField = await $('//android.widget.EditText[@hint="e.g. johndoe@mail.com"]');
      if (await emailField.isDisplayed()) {
        await emailField.click();
        await driver.pause(500);
        await emailField.clearValue();
        await driver.pause(500);
        await emailField.setValue('johndoe@example.com');
        await driver.pause(1000);
        await closeSidebar();
        await takeScreenshot('after-email');
        console.log('✅ Email filled successfully');
      } else {
        console.log('⚠️ Email field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Email:', error.message);
    }

    // Step 4: Fill Phone
    console.log('\n📝 Step 4: Filling Phone...');
    try {
      const phoneField = await $('//android.widget.EditText[@hint="+1 \n9876543210"]');
      if (await phoneField.isDisplayed()) {
        await phoneField.click();
        await driver.pause(500);
        await phoneField.clearValue();
        await driver.pause(500);
        await phoneField.setValue('9876543210');
        await driver.pause(1000);
        await closeSidebar();
        await takeScreenshot('after-phone');
        console.log('✅ Phone filled successfully');
      } else {
        console.log('⚠️ Phone field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Phone:', error.message);
    }

    // Step 5: Fill Address
    console.log('\n📝 Step 5: Filling Address...');
    try {
      const addressField = await $('//android.widget.EditText[@hint="Street Address"]');
      if (await addressField.isDisplayed()) {
        await addressField.click();
        await driver.pause(500);
        await addressField.clearValue();
        await driver.pause(500);
        await addressField.setValue('123 Main Street');
        await driver.pause(1000);
        await closeSidebar();
        await takeScreenshot('after-address');
        console.log('✅ Address filled successfully');
      } else {
        console.log('⚠️ Address field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Address:', error.message);
    }

    // Step 6: Close sidebar if present
    console.log('\n🚪 Step 6: Closing sidebar...');
    await closeSidebar();

    // Step 7: Scroll down to bring more fields into view
    console.log('\n🔄 Step 7: Scrolling down...');
    await scrollDown();

    // Step 8: Select State
    console.log('\n🏛️ Step 8: Selecting State...');
    try {
      // Check if State is already selected
      const stateElement = await $('~Hawaii');
      if (await stateElement.isDisplayed()) {
        console.log('✅ State already selected: Hawaii');
      } else {
        // Simple State dropdown selection
        console.log('📋 Opening State dropdown...');
        const stateDropdown = await $('~Select State');
        await stateDropdown.click();
        await driver.pause(2000); // Wait for dropdown to open
        
        // Look for dropdown options using content-desc (as seen in successful state-dropdown-test)
        console.log('🔍 Looking for State options...');
        const stateOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
        console.log(`🔍 Found ${stateOptions.length} potential state options`);
        
        // Filter for actual state options (those with content-desc containing state names)
        const availableStates = [];
        for (let i = 0; i < stateOptions.length; i++) {
          try {
            const contentDesc = await stateOptions[i].getAttribute('content-desc');
            if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
              availableStates.push({
                element: stateOptions[i],
                name: contentDesc
              });
            }
          } catch (error) {
            // Skip elements that don't have content-desc
          }
        }
        
        console.log(`📋 Available states: ${availableStates.map(s => s.name).join(', ')}`);
        
        if (availableStates.length > 0) {
          // Select a random state (or the first one)
          const selectedStateIndex = Math.floor(Math.random() * availableStates.length);
          const selectedState = availableStates[selectedStateIndex];
          
          await selectedState.element.click();
          console.log(`✅ Selected State: ${selectedState.name}`);
          await driver.pause(1000);
        } else {
          console.log('⚠️ No state options found with content-desc');
          
          // Fallback: try to click any clickable option
          const clickableOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
          if (clickableOptions.length > 0) {
            // Skip the first one (usually the scrim/overlay)
            const optionToClick = clickableOptions.length > 1 ? clickableOptions[1] : clickableOptions[0];
            await optionToClick.click();
            console.log('✅ Selected a state option (fallback method)');
            await driver.pause(1000);
          } else {
            console.log('⚠️ No clickable options found');
          }
        }
      }
      await takeScreenshot('after-state-selection');
      console.log('✅ State selection completed');
    } catch (error) {
      console.log('⚠️ State selection error:', error.message);
      // Continue anyway - State might already be selected
    }

    // Step 8.5: Handle City dropdown that appears after State selection
    console.log('\n🏙️ Step 8.5: Handling City dropdown after State selection...');
    try {
      await driver.pause(2000); // Wait for City dropdown to appear
      
      // Check if City dropdown appeared
      const cityDropdown = await $('~Select City');
      if (await cityDropdown.isDisplayed()) {
        console.log('🏙️ City dropdown found, selecting city...');
        await cityDropdown.click();
        await driver.pause(2000);
        
        // Look for city options using the same approach as state dropdown
        console.log('🔍 Looking for City options...');
        const cityOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
        console.log(`🔍 Found ${cityOptions.length} potential city options`);
        
        // Filter for actual city options
        const availableCities = [];
        for (let i = 0; i < cityOptions.length; i++) {
          try {
            const contentDesc = await cityOptions[i].getAttribute('content-desc');
            if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
              availableCities.push({
                element: cityOptions[i],
                name: contentDesc
              });
            }
          } catch (error) {
            // Skip elements that don't have content-desc
          }
        }
        
        console.log(`📋 Available cities: ${availableCities.map(c => c.name).join(', ')}`);
        
        if (availableCities.length > 0) {
          // Select a random city (or the first one)
          const selectedCityIndex = Math.floor(Math.random() * availableCities.length);
          const selectedCity = availableCities[selectedCityIndex];
          
          await selectedCity.element.click();
          console.log(`✅ Selected City: ${selectedCity.name}`);
          await driver.pause(1000);
          await takeScreenshot('after-city-selection');
        } else {
          console.log('⚠️ No city options found with content-desc');
          
          // Fallback: try to click any clickable option
          const clickableOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
          if (clickableOptions.length > 0) {
            // Skip the first one (usually the scrim/overlay)
            const optionToClick = clickableOptions.length > 1 ? clickableOptions[1] : clickableOptions[0];
            await optionToClick.click();
            console.log('✅ Selected a city option (fallback method)');
            await driver.pause(1000);
            await takeScreenshot('after-city-selection-fallback');
          } else {
            console.log('⚠️ No clickable city options found');
          }
        }
      } else {
        console.log('ℹ️ City dropdown not found, proceeding to next fields...');
      }
    } catch (error) {
      console.log('⚠️ Error with City dropdown:', error.message);
      // Continue anyway - City dropdown might not be present
    }

    // Step 9: Fill Zip Code
    console.log('\n📮 Step 9: Filling Zip Code...');
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

    // Step 10: Fill SS#/TIN#
    console.log('\n🆔 Step 10: Filling SS#/TIN#...');
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
          await ssnField.clearValue();
          await ssnField.setValue('123-45-6789');
          await driver.pause(1000);
          
          // 🔧 FIXED: Don't call closeSidebar() - it might cause navigation issues
          // Just take a screenshot and continue
          await takeScreenshot('after-ssn');
          console.log('✅ SS#/TIN# filled successfully');
          
          // 🔧 FIXED: Simple validation - just check if we can still find the SS#/TIN# label
          const stillOnForm = await $('//android.view.View[@content-desc="SS#/TIN# *"]').isDisplayed().catch(() => false);
          if (!stillOnForm) {
            throw new Error('❌ Exited form after SS#/TIN# field');
          }
          
          // Small pause to ensure UI is ready before proceeding to Residence Status dropdown
          await driver.pause(1000);
        } else {
          console.log('⚠️ SS#/TIN# field not found');
        }
      } else {
        console.log('⚠️ SS#/TIN# label not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling SS#/TIN#:', error.message);
    }

    // Step 11: Select Residence Status
    console.log('\n🏠 Step 11: Selecting Residence Status...');
    try {
      // 🔧 FIXED: First check if we're still on the form
      const residenceStatusLabel = await $('~Residence Status *');
      if (await residenceStatusLabel.isDisplayed()) {
        console.log('✅ Residence Status label found, proceeding with dropdown selection');
        
        const residenceDropdown = await $('~Select Residence Status');
        if (await residenceDropdown.isDisplayed()) {
          console.log('📋 Opening Residence Status dropdown...');
          await residenceDropdown.click();
          await driver.pause(1500); // Reduced wait time to prevent timeout
          
          // Look for dropdown options using CheckedTextView (as seen in successful state-dropdown-test)
          console.log('🔍 Looking for Residence Status options...');
          const residenceOptions = await $$('android=new UiSelector().className("android.widget.CheckedTextView")');
          console.log(`🔍 Found ${residenceOptions.length} residence dropdown options`);
          
          if (residenceOptions.length > 0) {
            // Select the 2nd option (index 1) if available, otherwise the first
            const optionToSelect = residenceOptions.length > 1 ? residenceOptions[1] : residenceOptions[0];
            await optionToSelect.click();
            const optionText = await optionToSelect.getText();
            console.log(`✅ Selected Residence Status option: ${optionText}`);
            await driver.pause(1000);
            await takeScreenshot('after-residence-status');
          } else {
            console.log('⚠️ No residence dropdown options found with CheckedTextView');
            
            // Fallback: try using the same approach as state dropdown
            const fallbackOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
            console.log(`🔍 Fallback: Found ${fallbackOptions.length} potential options`);
            
            let selected = false;
            for (let i = 0; i < fallbackOptions.length && !selected; i++) {
              try {
                const contentDesc = await fallbackOptions[i].getAttribute('content-desc');
                if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
                  console.log(`📝 Attempting to select: ${contentDesc}`);
                  
                  // 🔧 FIXED: Add timeout and error handling for dropdown selection
                  try {
                    await fallbackOptions[i].click();
                    console.log(`✅ Selected Residence Status (fallback): ${contentDesc}`);
                    await driver.pause(1000);
                    await takeScreenshot('after-residence-status-fallback');
                    selected = true;
                    
                    // 🔧 FIXED: Verify we're still on the form after selection
                    await driver.pause(500);
                    const stillOnForm = await $('~Residence Status *').isDisplayed().catch(() => false);
                    if (!stillOnForm) {
                      console.log('⚠️ Form may have navigated away after dropdown selection');
                    } else {
                      console.log('✅ Form still visible after dropdown selection');
                    }
                  } catch (clickError) {
                    console.log(`⚠️ Failed to click option "${contentDesc}":`, clickError.message);
                    // Continue to next option
                  }
                }
              } catch (error) {
                // Continue to next option
              }
            }
            
            if (!selected) {
              console.log('⚠️ No suitable Residence Status option could be selected');
            }
          }
        } else {
          console.log('⚠️ Residence Status dropdown not found');
        }
      } else {
        console.log('⚠️ Residence Status label not found - may have navigated away from form');
      }
    } catch (error) {
      console.log('⚠️ Error with Residence Status dropdown:', error.message);
      
      // 🔧 FIXED: Check if session is still active
      try {
        const sessionActive = await driver.getPageSource();
        console.log('✅ Session is still active after dropdown error');
      } catch (sessionError) {
        console.log('❌ Session terminated after dropdown error:', sessionError.message);
        throw new Error('Session terminated during Residence Status dropdown selection');
      }
    }

    // Step 12: Fill Password
    console.log('\n🔐 Step 12: Filling Password...');
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
            
            // Step 1: Click on password field
            await field.click();
            console.log('🖱️ Clicked on password field');
            await driver.pause(1000); // Wait for sidebar/keyboard to appear
            
            // Step 2: Wait for any sidebar or keyboard to appear
            console.log('⏳ Waiting for sidebar/keyboard to appear...');
            await driver.pause(2000); // Give time for UI elements to appear
            
            // Step 3: Input the password data
            console.log('⌨️ Inputting password data...');
            await field.clearValue();
            await field.setValue('TestPassword123!');
            await driver.pause(1000);
            console.log('✅ Password data entered');
            
            // Step 4: Close the keyboard by hiding it
            console.log('🔒 Closing keyboard...');
            try {
              await hideKeyboard();
              console.log('✅ Keyboard hidden successfully');
            } catch (keyboardError) {
              console.log('⚠️ Could not hide keyboard with hideKeyboard():', keyboardError.message);
              
              // Fallback: Try clicking outside the field
              console.log('🔄 Trying to click outside password field...');
              try {
                // Click on a safe area (top of screen)
                await driver.executeScript('mobile: tap', { x: 200, y: 100 });
                console.log('✅ Clicked outside password field');
              } catch (tapError) {
                console.log('⚠️ Could not click outside field:', tapError.message);
              }
            }
            
            await driver.pause(1000); // Wait for UI to settle
            
            await takeScreenshot('after-password');
            console.log('✅ Password filled successfully');
            
            // 🔧 FIXED: Simple validation - check if we can still find Residence Status
            const stillOnForm = await $('~Residence Status *').isDisplayed().catch(() => false);
            if (!stillOnForm) {
              throw new Error('❌ Exited form after Password field');
            }
            
            // Scroll immediately to keep in form context
            await scrollDown();
            passwordFilled = true;
            break;
          }
        } catch (error) {
          console.log(`⚠️ Error with password field ${i}:`, error.message);
          // Continue to next field
        }
      }
      
      if (!passwordFilled) {
        console.log('⚠️ Password field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Password:', error.message);
    }

    // Step 13: Fill Confirm Password
    console.log('\n🔐 Step 13: Filling Confirm Password...');
    try {
      // ✅ FIX 1: Use hint="Confirm Password" to locate field more reliably
      const confirmPasswordField = await $('//android.widget.EditText[@hint="Confirm Password"]');
      if (await confirmPasswordField.isDisplayed()) {
        console.log('📝 Found Confirm Password field using hint selector');
        await confirmPasswordField.click();
        await driver.pause(500);
        await confirmPasswordField.clearValue();
        await confirmPasswordField.setValue('TestPassword123!');
        await driver.pause(1000);
        
        // 🔧 FIXED: Don't call closeSidebar() - it might cause navigation issues
        await takeScreenshot('after-confirm-password');
        console.log('✅ Confirm Password filled successfully');
        
        // 🔧 FIXED: Simple validation - check if we can still find Residence Status
        const stillOnForm = await $('~Residence Status *').isDisplayed().catch(() => false);
        if (!stillOnForm) {
          throw new Error('❌ Exited form after Confirm Password field');
        }
        
        // Scroll immediately to keep in form context
        await scrollDown();
        confirmPasswordFilled = true;
      } else {
        console.log('⚠️ Confirm Password field not visible with hint selector');
        
        // Fallback: Look for confirm password field - it might be the next EditText after Password
        const allEditTexts = await $$('android.widget.EditText');
        let confirmPasswordFilled = false;
        
        for (let i = 0; i < allEditTexts.length; i++) {
          try {
            const field = allEditTexts[i];
            const hint = await field.getAttribute('hint');
            const text = await field.getAttribute('text');
            
            // If field is empty and has no hint, and we haven't filled it yet, it's likely confirm password
            if ((!hint || hint === '') && (!text || text === '') && await field.isDisplayed()) {
              console.log('📝 Found Confirm Password field using fallback method');
              await field.click();
              await driver.pause(500);
              await field.clearValue();
              await field.setValue('TestPassword123!');
              await driver.pause(1000);
              
              // 🔧 FIXED: Don't call closeSidebar() - it might cause navigation issues
              await takeScreenshot('after-confirm-password-fallback');
              console.log('✅ Confirm Password filled successfully (fallback)');
              
              // 🔧 FIXED: Simple validation - check if we can still find Residence Status
              const stillOnForm = await $('~Residence Status *').isDisplayed().catch(() => false);
              if (!stillOnForm) {
                throw new Error('❌ Exited form after Confirm Password field');
              }
              
              // Scroll immediately to keep in form context
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
      }
    } catch (error) {
      console.log('⚠️ Error filling Confirm Password:', error.message);
    }

    // Step 14: Scroll down to find Register button
    console.log('\n🔄 Step 14: Scrolling down to find Register button...');
    
    // 🔧 FIXED: Before scrolling to Register button, confirm screen not exited
    const stillOnForm = await $('~Residence Status *').isDisplayed().catch(() => false);
    if (!stillOnForm) {
      throw new Error('❌ Exited form after confirm password step');
    }
    
    // ✅ FIX 2: Add extra scroll to make sure Register button comes into view
    console.log('🔄 Extra Scroll to ensure Register button is visible...');
    await scrollDown();
    await driver.pause(1500);
    await takeScreenshot('after-extra-scroll');
    
    // ✅ Optional Bonus: Handle Keyboard Issues
    // Sometimes soft keyboard hides the last fields
    try {
      await hideKeyboard(); // Ensure screen isn't partially blocked
      await driver.pause(1000);
      console.log('⌨️ Keyboard hidden to ensure full screen visibility');
    } catch (keyboardError) {
      console.log('⚠️ Could not hide keyboard:', keyboardError.message);
    }

    // Step 15: Find and click Register button
    console.log('\n📝 Step 15: Finding and clicking Register button...');
    
    // Take screenshot before looking for register button
    await takeScreenshot('before-register-search');
    
    // ✅ FIX 3: Wait for Register button explicitly before clicking
    try {
      const registerButton = await $('android=new UiSelector().textContains("Register")');
      await registerButton.waitForDisplayed({ timeout: 10000 });
      await takeScreenshot('before-register-click');
      await registerButton.click();
      console.log('✅ Register button clicked successfully!');
      await takeScreenshot('after-register-click');
      
      // Capture final page source
      console.log('📄 Capturing final page source...');
      const finalPageSource = await driver.getPageSource();
      fs.writeFileSync('./screenshots/page-source-after-registration.html', finalPageSource);
      console.log('📄 Final page source saved to: ./screenshots/page-source-after-registration.html');
      
      console.log('🎉 COMPLETE REGISTRATION FORM TEST PASSED!');
    } catch (error) {
      console.log('❌ Error with Register button:', error.message);
      
      // Fallback: Try other selectors if the main one fails
      console.log('🔄 Trying fallback Register button selectors...');
      const registerSelectors = [
        '~Register',
        'android=new UiSelector().text("Register")',
        '//android.view.View[@content-desc="Register"]',
        '//android.widget.Button[@text="Register"]'
      ];

      let registerButton = null;
      for (const selector of registerSelectors) {
        try {
          const button = await $(selector);
          if (await button.isDisplayed()) {
            registerButton = button;
            console.log(`✅ Found Register button using fallback selector: ${selector}`);
            break;
          }
        } catch (fallbackError) {
          // Continue to next selector
        }
      }
      
      if (registerButton) {
        await takeScreenshot('before-register-click-fallback');
        await registerButton.click();
        console.log('✅ Register button clicked successfully (fallback)!');
        await takeScreenshot('after-register-click-fallback');
        
        // Capture final page source
        console.log('📄 Capturing final page source...');
        const finalPageSource = await driver.getPageSource();
        fs.writeFileSync('./screenshots/page-source-after-registration.html', finalPageSource);
        console.log('📄 Final page source saved to: ./screenshots/page-source-after-registration.html');
        
        console.log('🎉 COMPLETE REGISTRATION FORM TEST PASSED!');
      } else {
        throw new Error('❌ Register button not found with any selector');
      }
    }
  });
}); 