const { expect } = require('@wdio/globals');
const AppFlow = require('../../pageobjects/AppFlow');
const fs = require('fs');

describe('State Dropdown Test', () => {
  let appFlow;

  beforeEach(async () => {
    appFlow = new AppFlow();
    console.log('⏳ Waiting for app to load...');
    await driver.pause(3000);
  });

  it('should navigate to registration page and test State dropdown', async () => {
    console.log('=== STATE DROPDOWN TEST STARTED ===');

    // Step 1: Complete onboarding
    const onboardingResult = await appFlow.completeOnboarding();
    if (!onboardingResult.success) throw new Error('❌ Onboarding failed');

    // Step 2: Navigate to registration page
    const signUpResult = await appFlow.loginPage.navigateToSignUp();
    if (!signUpResult) throw new Error('❌ Navigation to sign up failed');

    // Step 3: Scroll down to bring State dropdown into view
    console.log('\n🔄 Scrolling to bring State dropdown into view...');
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

    // Step 4: Test State dropdown using exact locator from page source
    console.log('\n📋 Testing State dropdown...');
    try {
      // Use the exact content-desc from page source
      const stateDropdown = await $('~Select State');
      await stateDropdown.waitForDisplayed({ timeout: 5000 });
      console.log('✅ State dropdown found and displayed');
      
      // Take screenshot before clicking
      await driver.saveScreenshot('./screenshots/before-state-click.png');
      
      // Click the State dropdown
      await stateDropdown.click();
      console.log('✅ State dropdown clicked');
      await driver.pause(2000);
      
      // Capture page source after State dropdown click
      console.log('📄 Capturing page source after State dropdown click...');
      const statePageSource = await driver.getPageSource();
      fs.writeFileSync('./screenshots/page-source-state-dropdown.html', statePageSource);
      console.log('📄 State dropdown page source saved to: ./screenshots/page-source-state-dropdown.html');
      
      // Take screenshot after clicking
      await driver.saveScreenshot('./screenshots/state-dropdown-opened.png');
      
      // Look for dropdown options using content-desc (as seen in page source)
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
        
        // Take screenshot after selection
        await driver.saveScreenshot('./screenshots/state-option-selected.png');
      } else {
        console.log('⚠️ No state options found with content-desc');
        
        // Fallback: try to click any clickable option
        const clickableOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
        if (clickableOptions.length > 0) {
          // Skip the first one (usually the scrim/overlay)
          const optionToClick = clickableOptions.length > 1 ? clickableOptions[1] : clickableOptions[0];
          await optionToClick.click();
          console.log('✅ Selected a state option (fallback method)');
        } else {
          console.log('❌ No clickable options found');
        }
      }
      
    } catch (error) {
      console.log('❌ Failed to interact with State dropdown:', error.message);
      // Take screenshot on error
      await driver.saveScreenshot('./screenshots/state-dropdown-error.png');
    }

    // Step 5: Test Residence Status dropdown
    console.log('\n📋 Testing Residence Status dropdown...');
    try {
      // Scroll down more to bring Residence Status dropdown into view
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

      // Use the exact content-desc from page source
      const residenceDropdown = await $('~Select Residence Status');
      await residenceDropdown.waitForDisplayed({ timeout: 5000 });
      console.log('✅ Residence Status dropdown found and displayed');
      
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
      
      // Look for dropdown options
      const residenceOptions = await $$('android=new UiSelector().className("android.widget.CheckedTextView")');
      console.log(`🔍 Found ${residenceOptions.length} residence dropdown options`);
      
      if (residenceOptions.length > 0) {
        // Select the 2nd option (index 1)
        if (residenceOptions.length > 1) {
          await residenceOptions[1].click();
          const optionText = await residenceOptions[1].getText();
          console.log(`✅ Selected Residence Status option: ${optionText}`);
        } else {
          await residenceOptions[0].click();
          const optionText = await residenceOptions[0].getText();
          console.log(`✅ Selected Residence Status option: ${optionText}`);
        }
        
        // Take screenshot after selection
        await driver.saveScreenshot('./screenshots/residence-option-selected.png');
      } else {
        console.log('⚠️ No residence dropdown options found');
      }
      
    } catch (error) {
      console.log('❌ Failed to interact with Residence Status dropdown:', error.message);
      // Take screenshot on error
      await driver.saveScreenshot('./screenshots/residence-dropdown-error.png');
    }

    await driver.pause(2000);
    console.log('=== STATE DROPDOWN TEST COMPLETED ===');
  });
}); 