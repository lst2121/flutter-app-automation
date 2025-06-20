const { expect } = require('@wdio/globals');
const AppFlow = require('../pageobjects/AppFlow');
const RegistrationPage = require('../pageobjects/RegistrationPage');
const fs = require('fs');

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

// Timestamped screenshot helper
async function takeScreenshot(name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `./screenshots/${name}-${timestamp}.png`;
  await driver.saveScreenshot(filename);
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
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

describe('Debug Zip Code and SS#/TIN# Test', () => {
  let appFlow;
  let registrationPage;

  beforeEach(async () => {
    appFlow = new AppFlow();
    registrationPage = new RegistrationPage();
    console.log('⏳ Waiting for app to load...');
    await driver.pause(3000);
  });

  it('should fill zip code and SS#/TIN# fields', async () => {
    console.log('=== DEBUG ZIP CODE AND SS#/TIN# TEST STARTED ===');

    // Step 1: Complete onboarding
    const onboardingResult = await appFlow.completeOnboarding();
    if (!onboardingResult.success) throw new Error('❌ Onboarding failed');

    // Step 2: Navigate to registration page
    const signUpResult = await appFlow.loginPage.navigateToSignUp();
    if (!signUpResult) throw new Error('❌ Navigation to sign up failed');

    // Step 3: Fill basic fields
    console.log('\n📝 Step 3: Filling basic fields...');
    await registrationPage.fillFirstName('John');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail('johndoe@example.com');
    await registrationPage.fillPhone('+19876543210');
    await registrationPage.fillAddress('123 Main Street');

    // Step 4: Scroll down
    console.log('\n🔄 Step 4: Scrolling down...');
    await scrollDown();

    // Step 5: Select State
    console.log('\n🏛️ Step 5: Selecting State...');
    const stateDropdown = await $('~Select State');
    if (await stateDropdown.isDisplayed()) {
      await stateDropdown.click();
      await driver.pause(2000);
      
      // Select first available option
      const stateOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
      for (let i = 0; i < stateOptions.length; i++) {
        try {
          const contentDesc = await stateOptions[i].getAttribute('content-desc');
          if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
            await stateOptions[i].click();
            console.log(`✅ Selected State: ${contentDesc}`);
            break;
          }
        } catch (error) {
          // Continue to next option
        }
      }
    }

    // Step 6: Handle City dropdown
    console.log('\n🏙️ Step 6: Handling City dropdown...');
    await driver.pause(2000);
    const cityDropdown = await $('~Select City');
    if (await cityDropdown.isDisplayed()) {
      await cityDropdown.click();
      await driver.pause(2000);
      
      // Select first available option
      const cityOptions = await $$('android=new UiSelector().className("android.view.View").clickable(true)');
      for (let i = 0; i < cityOptions.length; i++) {
        try {
          const contentDesc = await cityOptions[i].getAttribute('content-desc');
          if (contentDesc && contentDesc.length > 0 && contentDesc !== 'Scrim') {
            await cityOptions[i].click();
            console.log(`✅ Selected City: ${contentDesc}`);
            break;
          }
        } catch (error) {
          // Continue to next option
        }
      }
    }

    // Step 7: Fill Zip Code
    console.log('\n📮 Step 7: Filling Zip Code...');
    try {
      const zipField = await $('//android.view.View[@content-desc="Zip Code *"]/following-sibling::android.widget.EditText[1]');
      if (await zipField.isDisplayed()) {
        console.log('📝 Found Zip Code field');
        await zipField.click();
        await driver.pause(500);
        await zipField.clearValue();
        await driver.pause(500);
        await zipField.setValue('12345');
        await driver.pause(1000);
        await closeSidebar();
        await takeScreenshot('debug-after-zip-code');
        console.log('✅ Zip Code filled successfully');
        
        const stillOnForm = await $('~Select Residence Status').isDisplayed().catch(() => false);
        if (!stillOnForm) {
          throw new Error('❌ Exited form after Zip Code field - hideKeyboard() likely caused back navigation');
        }
        
        const pageSourceAfterZip = await driver.getPageSource();
        fs.writeFileSync('./screenshots/debug-page-source-after-zip.html', pageSourceAfterZip);
        console.log('📄 Page source saved to: ./screenshots/debug-page-source-after-zip.html');
      } else {
        console.log('⚠️ Zip Code field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling Zip Code:', error.message);
    }

    // Step 8: Fill SS#/TIN#
    console.log('\n🆔 Step 8: Filling SS#/TIN#...');
    try {
      const ssnField = await $('//android.view.View[@content-desc="SS#/TIN# *"]/following-sibling::android.widget.EditText[1]');
      if (await ssnField.isDisplayed()) {
        console.log('📝 Found SS#/TIN# field');
        await ssnField.click();
        await driver.pause(500);
        await ssnField.clearValue();
        await driver.pause(500);
        await ssnField.setValue('123-45-6789');
        await driver.pause(1000);
        await closeSidebar();
        await takeScreenshot('debug-after-ssn');
        console.log('✅ SS#/TIN# filled successfully');
        
        const stillOnForm = await $('~Select Residence Status').isDisplayed().catch(() => false);
        if (!stillOnForm) {
          throw new Error('❌ Exited form after SS#/TIN# field - hideKeyboard() likely caused back navigation');
        }
        
        const pageSourceAfterSSN = await driver.getPageSource();
        fs.writeFileSync('./screenshots/debug-page-source-after-ssn.html', pageSourceAfterSSN);
        console.log('📄 Page source saved to: ./screenshots/debug-page-source-after-ssn.html');
      } else {
        console.log('⚠️ SS#/TIN# field not found');
      }
    } catch (error) {
      console.log('⚠️ Error filling SS#/TIN#:', error.message);
    }

    console.log('🎉 DEBUG TEST COMPLETED!');
  });
}); 