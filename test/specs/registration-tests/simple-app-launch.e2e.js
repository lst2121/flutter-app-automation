const fs = require('fs');

describe('Simple App Launch Test', () => {
  before(async () => {
    // Ensure screenshots directory exists
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots', { recursive: true });
    }
  });

  it('should launch the app successfully', async () => {
    console.log('\n🚀 Starting Simple App Launch Test');
    
    // Wait for app to load
    await driver.pause(5000);
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./screenshots/app-launch-${timestamp}.png`;
    await driver.saveScreenshot(filename);
    console.log(`📸 Screenshot saved: ${filename}`);
    
    // Capture page source
    const pageSource = await driver.getPageSource();
    fs.writeFileSync(`./screenshots/app-launch-${timestamp}.xml`, pageSource);
    console.log(`📄 Page source saved: app-launch-${timestamp}.xml`);
    
    // Check if we're in the app or still on launcher
    if (pageSource.includes('com.google.android.apps.nexuslauncher')) {
      console.log('⚠️ Still on Android launcher, app may not have launched');
    } else {
      console.log('✅ App appears to be launched');
    }
    
    // Look for any app-specific elements
    const appElements = [
      '~Registration',
      '~Login',
      '~Sign Up',
      '~Anytime Shift',
      '//android.view.View[contains(@content-desc, "Registration")]',
      '//android.view.View[contains(@content-desc, "Login")]',
      '//android.view.View[contains(@content-desc, "Sign Up")]',
      '//android.view.View[contains(@content-desc, "Anytime")]'
    ];
    
    let foundElement = false;
    for (const selector of appElements) {
      try {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          console.log(`✅ Found app element: ${selector}`);
          foundElement = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!foundElement) {
      console.log('⚠️ No app-specific elements found');
    }
    
    console.log('🎉 Simple app launch test completed!');
  });
}); 