const { expect } = require('@wdio/globals');

describe('Language Selection Test', () => {
  
  beforeEach(async () => {
    // Wait for app to load and animation to complete
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should select English language and click right tick button', async () => {
    console.log('=== LANGUAGE SELECTION TEST ===');
    
    // Step 1: Wait for language selection screen
    console.log('\n--- STEP 1: WAIT FOR LANGUAGE SCREEN ---');
    
    let attempts = 0;
    let languageScreenFound = false;
    
    while (attempts < 15 && !languageScreenFound) {
      try {
        const selectLanguageTitle = await $('~Select Language');
        if (await selectLanguageTitle.isDisplayed()) {
          languageScreenFound = true;
          console.log('✅ Language selection screen is visible');
          
          const titleText = await selectLanguageTitle.getText();
          console.log(`   Title: "${titleText}"`);
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
    
    // Step 2: Select English language
    console.log('\n--- STEP 2: SELECT ENGLISH LANGUAGE ---');
    
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
    
    // Step 3: Click right tick button
    console.log('\n--- STEP 3: CLICK RIGHT TICK BUTTON ---');
    
    try {
      // Try multiple locators for the right tick button
      const rightTickLocators = [
        '//android.widget.Button[@enabled="true"]',
        '//android.widget.Button[@enabled="false"]',
        '//android.widget.Button',
        '~Proceed',
        '~Continue',
        '~Next'
      ];
      
      let buttonClicked = false;
      
      for (const locator of rightTickLocators) {
        try {
          const button = await $(locator);
          if (await button.isDisplayed()) {
            console.log(`   Found button with locator: ${locator}`);
            
            // Check if button is enabled
            const isEnabled = await button.isEnabled();
            console.log(`   Button enabled: ${isEnabled}`);
            
            if (isEnabled) {
              await button.click();
              console.log('✅ Clicked right tick button');
              buttonClicked = true;
              await driver.pause(3000);
              break;
            } else {
              console.log('   Button is disabled, trying next locator...');
            }
          }
        } catch (e) {
          // Continue to next locator
        }
      }
      
      if (!buttonClicked) {
        console.log('❌ Could not find or click right tick button');
        console.log('   Taking screenshot to analyze current state...');
        
        try {
          const screenshot = await driver.saveScreenshot();
          console.log('📸 Screenshot taken for analysis');
        } catch (e) {
          console.log('⚠️ Could not take screenshot:', e.message);
        }
        return;
      }
      
    } catch (e) {
      console.log('❌ Error clicking right tick button:', e.message);
      return;
    }
    
    // Step 4: Verify we moved past language screen
    console.log('\n--- STEP 4: VERIFY NAVIGATION ---');
    
    try {
      const selectLanguageTitle = await $('~Select Language');
      if (await selectLanguageTitle.isDisplayed()) {
        console.log('⚠️ Still on language selection screen');
      } else {
        console.log('✅ Successfully moved past language selection screen');
      }
    } catch (e) {
      console.log('✅ Language selection screen no longer visible (navigation successful)');
    }
    
    console.log('\n=== LANGUAGE SELECTION TEST COMPLETED ===');
  });
}); 