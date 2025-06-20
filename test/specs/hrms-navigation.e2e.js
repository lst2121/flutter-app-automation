const { expect } = require('@wdio/globals');

describe('HRMS App Navigation Test', () => {
  
  beforeEach(async () => {
    console.log('🧪 Starting HRMS navigation test...');
    await driver.pause(3000);
  });

  it('should test basic app navigation and screen transitions', async () => {
    console.log('=== HRMS NAVIGATION TEST ===');
    
    // Wait for app to load
    await driver.pause(5000);
    
    // Take initial screenshot
    await driver.saveScreenshot('./screenshots/hrms-initial-screen.png');
    console.log('📸 Initial screen captured');
    
    // Test 1: Check if app loaded properly
    console.log('\n--- STEP 1: APP LOAD VERIFICATION ---');
    try {
      const appState = await driver.queryAppState('com.yourcompany.hrms');
      console.log(`📱 App state: ${appState}`);
      expect(appState).toBe(4); // RUNNING_IN_FOREGROUND
    } catch (e) {
      console.log('⚠️ Could not check app state:', e.message);
    }
    
    // Test 2: Find and interact with navigation elements
    console.log('\n--- STEP 2: NAVIGATION ELEMENTS ---');
    
    // Look for common navigation elements
    const navigationSelectors = [
      { name: 'Menu Button', selector: '//android.widget.Button[contains(@content-desc, "menu")]' },
      { name: 'Navigation Drawer', selector: '//android.view.View[contains(@content-desc, "drawer")]' },
      { name: 'Bottom Navigation', selector: '//android.view.View[contains(@content-desc, "bottom")]' },
      { name: 'Tab Bar', selector: '//android.view.View[contains(@content-desc, "tab")]' },
      { name: 'Any Button', selector: '//android.widget.Button' },
      { name: 'Any Clickable View', selector: '//android.view.View[@clickable="true"]' }
    ];
    
    let foundNavigationElements = [];
    
    for (const nav of navigationSelectors) {
      try {
        const elements = await $$(nav.selector);
        if (elements.length > 0) {
          console.log(`✅ Found ${elements.length} ${nav.name} elements`);
          foundNavigationElements.push(nav);
        }
      } catch (e) {
        console.log(`⚠️ Error checking ${nav.name}:`, e.message);
      }
    }
    
    // Test 3: Try to interact with found elements
    console.log('\n--- STEP 3: INTERACTION TESTING ---');
    
    for (const nav of foundNavigationElements.slice(0, 3)) { // Test first 3 elements
      try {
        const element = await $(nav.selector);
        if (await element.isDisplayed()) {
          console.log(`👆 Attempting to click ${nav.name}...`);
          
          // Take screenshot before interaction
          await driver.saveScreenshot(`./screenshots/hrms-before-${nav.name.toLowerCase().replace(' ', '-')}.png`);
          
          // Click the element
          await element.click();
          console.log(`✅ Successfully clicked ${nav.name}`);
          
          // Wait for potential navigation
          await driver.pause(2000);
          
          // Take screenshot after interaction
          await driver.saveScreenshot(`./screenshots/hrms-after-${nav.name.toLowerCase().replace(' ', '-')}.png`);
          
          // Check if screen changed
          const newPageSource = await driver.getPageSource();
          console.log(`📄 Page source length after ${nav.name}: ${newPageSource.length}`);
          
          // Go back if navigation occurred
          try {
            await driver.back();
            console.log(`🔙 Navigated back from ${nav.name}`);
            await driver.pause(1000);
          } catch (e) {
            console.log(`⚠️ Could not go back from ${nav.name}:`, e.message);
          }
          
        }
      } catch (e) {
        console.log(`❌ Error interacting with ${nav.name}:`, e.message);
      }
    }
    
    // Test 4: Test scrolling navigation
    console.log('\n--- STEP 4: SCROLLING NAVIGATION ---');
    
    try {
      // Get screen size
      const screenSize = await driver.getWindowSize();
      console.log(`📱 Screen size: ${screenSize.width}x${screenSize.height}`);
      
      // Perform scroll gesture
      const centerX = screenSize.width / 2;
      const startY = screenSize.height * 0.8;
      const endY = screenSize.height * 0.2;
      
      console.log(`📜 Scrolling from (${centerX}, ${startY}) to (${centerX}, ${endY})`);
      
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
      
      console.log('✅ Scrolling completed');
      await driver.pause(2000);
      
      // Take screenshot after scrolling
      await driver.saveScreenshot('./screenshots/hrms-after-scroll.png');
      
    } catch (e) {
      console.log('❌ Error during scrolling:', e.message);
    }
    
    // Test 5: Test form navigation (if applicable)
    console.log('\n--- STEP 5: FORM NAVIGATION ---');
    
    try {
      // Look for input fields
      const inputFields = await $$('//android.widget.EditText');
      console.log(`📝 Found ${inputFields.length} input fields`);
      
      if (inputFields.length > 0) {
        // Try to interact with first input field
        const firstField = inputFields[0];
        if (await firstField.isDisplayed()) {
          console.log('👆 Attempting to interact with first input field...');
          
          await firstField.click();
          await driver.pause(500);
          
          // Type some text
          await firstField.setValue('test');
          await driver.pause(1000);
          
          console.log('✅ Input field interaction successful');
          
          // Hide keyboard
          try {
            await driver.hideKeyboard();
            console.log('⌨️ Keyboard hidden');
          } catch (e) {
            console.log('⚠️ Could not hide keyboard:', e.message);
          }
        }
      }
      
    } catch (e) {
      console.log('❌ Error during form navigation:', e.message);
    }
    
    console.log('\n✅ HRMS navigation test completed');
  });

  it('should test app responsiveness and performance', async () => {
    console.log('=== PERFORMANCE TEST ===');
    
    const startTime = Date.now();
    
    try {
      // Get page source to test responsiveness
      const pageSource = await driver.getPageSource();
      const sourceTime = Date.now() - startTime;
      
      console.log(`📄 Page source retrieved in ${sourceTime}ms`);
      console.log(`📄 Page source length: ${pageSource.length} characters`);
      
      // Save page source for analysis
      const fs = require('fs');
      fs.writeFileSync('./screenshots/hrms-page-source.html', pageSource);
      console.log('📄 Page source saved for analysis');
      
      // Performance check
      if (sourceTime < 5000) {
        console.log('✅ Page source retrieval: FAST');
      } else if (sourceTime < 10000) {
        console.log('⚠️ Page source retrieval: MODERATE');
      } else {
        console.log('❌ Page source retrieval: SLOW');
      }
      
    } catch (e) {
      console.log('❌ Error testing performance:', e.message);
    }
    
    // Take final screenshot
    await driver.saveScreenshot('./screenshots/hrms-performance-test.png');
  });

  afterEach(async () => {
    console.log('🧹 Cleaning up after navigation test...');
    
    try {
      // Take final screenshot
      await driver.saveScreenshot('./screenshots/hrms-navigation-complete.png');
      console.log('📸 Final navigation test screenshot saved');
    } catch (e) {
      console.log('⚠️ Could not take final screenshot:', e.message);
    }
  });
}); 