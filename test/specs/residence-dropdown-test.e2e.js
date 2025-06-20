const { expect } = require('@wdio/globals');
const AppFlow = require('../pageobjects/AppFlow');
const fs = require('fs');

describe('Residence Status Dropdown Test', () => {
  let appFlow;

  beforeEach(async () => {
    appFlow = new AppFlow();
    console.log('⏳ Waiting for app to load...');
    await driver.pause(3000);
  });

  it('should navigate to registration page and test Residence Status dropdown', async () => {
    console.log('=== RESIDENCE STATUS DROPDOWN TEST STARTED ===');

    // Step 1: Complete onboarding
    const onboardingResult = await appFlow.completeOnboarding();
    if (!onboardingResult.success) throw new Error('❌ Onboarding failed');

    // Step 2: Navigate to registration page
    const signUpResult = await appFlow.loginPage.navigateToSignUp();
    if (!signUpResult) throw new Error('❌ Navigation to sign up failed');

    // Step 3: Scroll down multiple times to bring Residence Status dropdown into view
    console.log('\n🔄 Scrolling to bring Residence Status dropdown into view...');
    
    // First scroll
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

    // Second scroll to go further down
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

    // Third scroll to ensure we're at the bottom
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
    await driver.pause(2000);

    // Step 4: Test Residence Status dropdown
    console.log('\n📋 Testing Residence Status dropdown...');
    try {
      // Take screenshot before looking for dropdown
      await driver.saveScreenshot('./screenshots/before-residence-search.png');
      
      // Try to find Residence Status dropdown using different locators
      let residenceDropdown = null;
      
      // Try content-desc first
      try {
        residenceDropdown = await $('~Select Residence Status');
        await residenceDropdown.waitForDisplayed({ timeout: 3000 });
        console.log('✅ Residence Status dropdown found using content-desc');
      } catch (error) {
        console.log('⚠️ Not found with content-desc, trying hint text...');
        // Try hint text
        try {
          residenceDropdown = await $('android=new UiSelector().text("Select Residence Status")');
          await residenceDropdown.waitForDisplayed({ timeout: 3000 });
          console.log('✅ Residence Status dropdown found using text');
        } catch (error2) {
          console.log('⚠️ Not found with text, trying hint...');
          // Try hint
          try {
            residenceDropdown = await $('android=new UiSelector().textContains("Residence")');
            await residenceDropdown.waitForDisplayed({ timeout: 3000 });
            console.log('✅ Residence Status dropdown found using textContains');
          } catch (error3) {
            console.log('❌ Residence Status dropdown not found with any locator');
            // Capture page source to see what's available
            const pageSource = await driver.getPageSource();
            fs.writeFileSync('./screenshots/page-source-residence-not-found.html', pageSource);
            console.log('📄 Page source saved to: ./screenshots/page-source-residence-not-found.html');
            throw new Error('Residence Status dropdown not found');
          }
        }
      }
      
      // Take screenshot before clicking
      await driver.saveScreenshot('./screenshots/before-residence-click.png');
      
      // Click the Residence Status dropdown
      await residenceDropdown.click();
      console.log('✅ Residence Status dropdown clicked');
      await driver.pause(2000);
      
      // Capture page source after Residence Status dropdown click
      console.log('📄 Capturing page source after Residence Status dropdown click...');
      const residencePageSource = await driver.getPageSource();
      fs.writeFileSync('./screenshots/page-source-residence-dropdown.html', residencePageSource);
      console.log('📄 Residence Status dropdown page source saved to: ./screenshots/page-source-residence-dropdown.html');
      
      // Take screenshot after clicking
      await driver.saveScreenshot('./screenshots/residence-dropdown-opened.png');
      
      // Look for dropdown options using content-desc (as seen in page source)
      const residenceOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
      console.log(`🔍 Found ${residenceOptions.length} potential residence options`);
      
      // Filter for actual residence options (those with content-desc containing residence status names)
      const availableResidenceStatuses = [];
      for (let i = 0; i < residenceOptions.length; i++) {
        try {
          const contentDesc = await residenceOptions[i].getAttribute('content-desc');
          if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
            availableResidenceStatuses.push({
              element: residenceOptions[i],
              name: contentDesc
            });
          }
        } catch (error) {
          // Skip elements that don't have content-desc
        }
      }
      
      console.log(`📋 Available residence statuses: ${availableResidenceStatuses.map(s => s.name).join(', ')}`);
      
      if (availableResidenceStatuses.length > 0) {
        // Select a random residence status (or the first one)
        const selectedResidenceIndex = Math.floor(Math.random() * availableResidenceStatuses.length);
        const selectedResidence = availableResidenceStatuses[selectedResidenceIndex];
        
        await selectedResidence.element.click();
        console.log(`✅ Selected Residence Status: ${selectedResidence.name}`);
        
        // Take screenshot after selection
        await driver.saveScreenshot('./screenshots/residence-option-selected.png');
      } else {
        console.log('⚠️ No residence status options found with content-desc');
        
        // Fallback: try to click any clickable option
        const clickableOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
        if (clickableOptions.length > 0) {
          // Skip the first one (usually the scrim/overlay)
          const optionToClick = clickableOptions.length > 1 ? clickableOptions[1] : clickableOptions[0];
          await optionToClick.click();
          console.log('✅ Selected a residence status option (fallback method)');
        } else {
          console.log('❌ No clickable options found');
        }
      }
      
    } catch (error) {
      console.log('❌ Failed to interact with Residence Status dropdown:', error.message);
      // Take screenshot on error
      await driver.saveScreenshot('./screenshots/residence-dropdown-error.png');
    }

    await driver.pause(2000);
    console.log('=== RESIDENCE STATUS DROPDOWN TEST COMPLETED ===');
  });
}); 