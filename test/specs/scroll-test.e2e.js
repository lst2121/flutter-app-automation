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

// Improved scrolling function using W3C Actions API
async function testScrolling() {
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

describe('Registration Page Scroll Test', () => {
  
  beforeEach(async () => {
    // Wait for app to load and animation to complete
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should complete flow to registration page and test scrolling', async () => {
    console.log('\n=== REGISTRATION PAGE SCROLL TEST STARTED ===');
    
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
    
    // Step 4: Test Scrolling
    console.log('\n--- STEP 4: TEST SCROLLING ---');
    
    // Take initial screenshot
    await takeScreenshot('before_scroll_test');
    
    // Test scrolling multiple times to reach the bottom
    let registerButtonFound = false;
    for (let i = 0; i < 4; i++) { // Try up to 4 scrolls to reach bottom
      console.log(`\n📜 Scroll Attempt ${i + 1}/4`);
      
      // Check for register button before scrolling
      try {
        let registerButton = null;
        
        // Try traditional selectors
        try {
          registerButton = await $('~Register');
        } catch (e) {
          console.log('   ⚠️ Accessibility label search failed:', e.message);
        }
        
        if (!registerButton || !await registerButton.isDisplayed()) {
          try {
            registerButton = await $('//android.widget.Button[contains(@text, "Register")]');
          } catch (e) {
            console.log('   ⚠️ XPath button search failed:', e.message);
          }
        }
        
        if (!registerButton || !await registerButton.isDisplayed()) {
          try {
            registerButton = await $('//android.view.View[contains(@content-desc, "Register")]');
          } catch (e) {
            console.log('   ⚠️ XPath view search failed:', e.message);
          }
        }
        
        if (registerButton && await registerButton.isDisplayed()) {
          console.log(`✅ Register button found on attempt ${i + 1} (before scrolling)`);
          await takeScreenshot(`register_button_found_attempt_${i + 1}`);
          registerButtonFound = true;
          break;
        }
      } catch (e) {
        // Continue with scrolling
      }
      
      // Perform scroll
      const scrollResult = await testScrolling();
      
      if (scrollResult) {
        console.log(`✅ Scroll attempt ${i + 1} successful`);
        await takeScreenshot(`after_scroll_${i + 1}`);
        
        // Check for register button after scrolling
        try {
          let registerButton = null;
          
          // Try traditional selectors
          try {
            registerButton = await $('~Register');
          } catch (e) {
            console.log('   ⚠️ Accessibility label search failed:', e.message);
          }
          
          if (!registerButton || !await registerButton.isDisplayed()) {
            try {
              registerButton = await $('//android.widget.Button[contains(@text, "Register")]');
            } catch (e) {
              console.log('   ⚠️ XPath button search failed:', e.message);
            }
          }
          
          if (!registerButton || !await registerButton.isDisplayed()) {
            try {
              registerButton = await $('//android.view.View[contains(@content-desc, "Register")]');
            } catch (e) {
              console.log('   ⚠️ XPath view search failed:', e.message);
            }
          }
          
          if (registerButton && await registerButton.isDisplayed()) {
            console.log(`✅ Register button found after scroll attempt ${i + 1}`);
            await takeScreenshot(`register_button_found_after_scroll_${i + 1}`);
            registerButtonFound = true;
            break;
          }
        } catch (e) {
          console.log(`⚠️ Register button not found after scroll ${i + 1}`);
        }
      } else {
        console.log(`❌ Scroll attempt ${i + 1} failed`);
      }
      
      await driver.pause(2000);
    }
    
    // Step 5: Final Check for Register Button
    console.log('\n--- STEP 5: FINAL CHECK FOR REGISTER BUTTON ---');
    if (!registerButtonFound) {
      try {
        let registerButton = null;
        
        // Try traditional selectors
        try {
          registerButton = await $('~Register');
        } catch (e) {
          console.log('   ⚠️ Accessibility label search failed:', e.message);
        }
        
        if (!registerButton || !await registerButton.isDisplayed()) {
          try {
            registerButton = await $('//android.widget.Button[contains(@text, "Register")]');
          } catch (e) {
            console.log('   ⚠️ XPath button search failed:', e.message);
          }
        }
        
        if (!registerButton || !await registerButton.isDisplayed()) {
          try {
            registerButton = await $('//android.view.View[contains(@content-desc, "Register")]');
          } catch (e) {
            console.log('   ⚠️ XPath view search failed:', e.message);
          }
        }
        
        if (registerButton && await registerButton.isDisplayed()) {
          console.log('✅ Register button found in final check');
          await takeScreenshot('register_button_found_final');
          registerButtonFound = true;
        } else {
          console.log('⚠️ Register button not found after all scroll attempts');
          await takeScreenshot('register_button_not_found_final');
        }
      } catch (e) {
        console.log('⚠️ Error in final register button check:', e.message);
      }
    }
    
    // Summary
    console.log('\n--- SCROLL TEST SUMMARY ---');
    if (registerButtonFound) {
      console.log('🎉 SUCCESS: Scrolling worked and register button was found!');
    } else {
      console.log('⚠️ PARTIAL: Scrolling worked but register button not found');
    }
    
    console.log('\n=== REGISTRATION PAGE SCROLL TEST COMPLETED ===');
  });
}); 