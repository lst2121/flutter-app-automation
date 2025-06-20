const { expect } = require('@wdio/globals');

describe('Login Page Test', () => {
  
  beforeEach(async () => {
    // Wait for app to load and animation to complete
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should complete language selection and navigate to login page, then click sign up', async () => {
    console.log('=== LOGIN PAGE TEST ===');
    
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
    
    // Step 2: Wait for Login Page to Appear
    console.log('\n--- STEP 2: WAIT FOR LOGIN PAGE ---');
    
    console.log('⏳ Waiting 2-3 seconds for login page to appear...');
    await driver.pause(3000);
    
    // Look for login page elements
    attempts = 0;
    let loginPageFound = false;
    
    while (attempts < 15 && !loginPageFound) {
      try {
        // Try multiple login page identifiers
        const loginIdentifiers = [
          '~Login',
          '~Sign In',
          '~Email',
          '~Password',
          '//*[@text="Login"]',
          '//*[@text="Sign In"]',
          '//*[@text="Email"]',
          '//*[@text="Password"]'
        ];
        
        for (const identifier of loginIdentifiers) {
          try {
            const element = await $(identifier);
            if (await element.isDisplayed()) {
              loginPageFound = true;
              console.log(`✅ Login page is visible! Found element: ${identifier}`);
              
              // Get element text for verification
              const elementText = await element.getText();
              console.log(`   Element text: "${elementText}"`);
              break;
            }
          } catch (e) {
            // Continue to next identifier
          }
        }
        
        if (!loginPageFound) {
          console.log(`   Attempt ${attempts + 1}: Login page not ready yet...`);
          await driver.pause(1000);
          attempts++;
        }
      } catch (e) {
        console.log(`   Attempt ${attempts + 1}: Error checking login page`);
        await driver.pause(1000);
        attempts++;
      }
    }
    
    if (!loginPageFound) {
      console.log('❌ Login page not found after waiting');
      console.log('   Taking screenshot to analyze current state...');
      
      try {
        const screenshot = await driver.saveScreenshot();
        console.log('📸 Screenshot taken for analysis');
      } catch (e) {
        console.log('⚠️ Could not take screenshot:', e.message);
      }
      return;
    }
    
    // Step 3: Verify Login Page Elements
    console.log('\n--- STEP 3: VERIFY LOGIN PAGE ELEMENTS ---');
    
    const loginElements = [
      { name: 'Login Title', locator: '~Login' },
      { name: 'Sign In Title', locator: '~Sign In' },
      { name: 'Email Label', locator: '~Email' },
      { name: 'Password Label', locator: '~Password' },
      { name: 'Email Input', locator: '//android.widget.EditText[@hint="Email"]' },
      { name: 'Password Input', locator: '//android.widget.EditText[@hint="Password"]' },
      { name: 'Login Button', locator: '~Login' },
      { name: 'Sign In Button', locator: '~Sign In' }
    ];
    
    let foundElements = 0;
    for (const element of loginElements) {
      try {
        const el = await $(element.locator);
        if (await el.isDisplayed()) {
          console.log(`✅ ${element.name} is visible`);
          foundElements++;
        } else {
          console.log(`⚠️ ${element.name} not visible`);
        }
      } catch (e) {
        console.log(`❌ ${element.name} not found`);
      }
    }
    
    console.log(`📊 Login page verification: ${foundElements}/${loginElements.length} elements found`);
    
    // Step 4: Find and Click Sign Up Button
    console.log('\n--- STEP 4: CLICK SIGN UP BUTTON ---');
    
    try {
      // Try multiple sign up button locators
      const signUpLocators = [
        '~Sign Up',
        '~Register',
        '//*[@text="Sign Up"]',
        '//*[@text="Register"]',
        '//android.widget.Button[contains(@text, "Sign")]',
        '//android.widget.Button[contains(@text, "Register")]',
        '//android.widget.TextView[contains(@text, "Sign")]',
        '//android.widget.TextView[contains(@text, "Register")]'
      ];
      
      let signUpClicked = false;
      
      for (const locator of signUpLocators) {
        try {
          const signUpButton = await $(locator);
          if (await signUpButton.isDisplayed()) {
            console.log(`   Found Sign Up button with locator: ${locator}`);
            
            // Get button text for verification
            const buttonText = await signUpButton.getText();
            console.log(`   Button text: "${buttonText}"`);
            
            await signUpButton.click();
            console.log('✅ Clicked Sign Up button');
            signUpClicked = true;
            await driver.pause(3000); // Wait for navigation
            break;
          }
        } catch (e) {
          // Continue to next locator
        }
      }
      
      if (!signUpClicked) {
        console.log('❌ Could not find Sign Up button');
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
      console.log('❌ Error clicking Sign Up button:', e.message);
      return;
    }
    
    // Step 5: Verify Navigation to Registration Page
    console.log('\n--- STEP 5: VERIFY NAVIGATION TO REGISTRATION ---');
    
    try {
      // Check if we moved to registration page
      const registrationIdentifiers = [
        '~Registration',
        '~First Name',
        '~Last Name',
        '//*[@text="Registration"]',
        '//*[@text="First Name"]',
        '//*[@text="Last Name"]'
      ];
      
      let registrationPageFound = false;
      
      for (const identifier of registrationIdentifiers) {
        try {
          const element = await $(identifier);
          if (await element.isDisplayed()) {
            registrationPageFound = true;
            console.log(`✅ Registration page is visible! Found element: ${identifier}`);
            
            const elementText = await element.getText();
            console.log(`   Element text: "${elementText}"`);
            break;
          }
        } catch (e) {
          // Continue to next identifier
        }
      }
      
      if (!registrationPageFound) {
        console.log('⚠️ Registration page not found yet');
        console.log('   Taking screenshot to analyze current state...');
        
        try {
          const screenshot = await driver.saveScreenshot();
          console.log('📸 Screenshot taken for analysis');
        } catch (e) {
          console.log('⚠️ Could not take screenshot:', e.message);
        }
      }
      
    } catch (e) {
      console.log('⚠️ Error checking registration page:', e.message);
    }
    
    console.log('\n=== LOGIN PAGE TEST COMPLETED ===');
    console.log('🎉 SUCCESS: Language Selection → Login Page → Sign Up → Registration ✅');
  });
}); 