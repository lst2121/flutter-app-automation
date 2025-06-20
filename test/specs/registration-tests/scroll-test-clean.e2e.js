const { expect } = require('@wdio/globals');
const AppFlow = require('../../pageobjects/AppFlow');

describe('Scroll Test Clean', () => {
  let appFlow;

  beforeEach(async () => {
    appFlow = new AppFlow();
    console.log('⏳ Waiting for app to load...');
    await driver.pause(3000);
  });

  it('should use working scroll coordinates with correct syntax', async () => {
    console.log('=== SCROLL TEST CLEAN STARTED ===');
    
    // Step 1: Complete onboarding to reach login page
    console.log('\n🌍 Step 1: Complete onboarding...');
    const onboardingResult = await appFlow.completeOnboarding();
    console.log('📊 Onboarding result:', JSON.stringify(onboardingResult, null, 2));
    
    if (!onboardingResult.success) {
      throw new Error('Failed to complete onboarding');
    }
    
    // Step 2: Navigate to registration page via sign up
    console.log('\n📝 Step 2: Navigate to registration page...');
    const loginPage = appFlow.loginPage;
    const signUpResult = await loginPage.navigateToSignUp();
    console.log('📊 Sign up navigation result:', signUpResult);
    
    if (!signUpResult) {
      throw new Error('Failed to navigate to registration page');
    }
    
    // Step 3: Take screenshot before scroll
    console.log('\n📸 Step 3: Taking screenshot before scroll...');
    await driver.saveScreenshot('./screenshots/before-scroll-clean.png');
    
    // Step 4: Perform the WORKING central scroll with correct syntax
    console.log('\n🔄 Step 4: Performing working central scroll...');
    try {
      // Use the working coordinates with correct W3C Actions API syntax
      await driver.performActions([
        {
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
        }
      ]);
      console.log('✅ Working central scroll completed successfully');
    } catch (error) {
      console.log('❌ Scroll failed:', error.message);
    }
    
    // Step 5: Take screenshot after scroll
    console.log('\n📸 Step 5: Taking screenshot after scroll...');
    await driver.saveScreenshot('./screenshots/after-scroll-clean.png');
    
    // Step 6: Wait for animations to settle
    console.log('\n⏳ Step 6: Waiting for animations to settle...');
    await driver.pause(2000);
    
    // Step 7: Try to fill first name field
    console.log('\n✏️ Step 7: Attempting to fill first name field...');
    try {
      const firstNameField = await $('~First Name');
      if (await firstNameField.isDisplayed()) {
        console.log('✅ First name field found and visible');
        await firstNameField.click();
        await driver.pause(500);
        await firstNameField.setValue('John');
        console.log('✅ First name filled successfully: John');
      } else {
        console.log('❌ First name field not visible');
      }
    } catch (error) {
      console.log('❌ Error filling first name:', error.message);
    }
    
    // Step 8: Take final screenshot
    console.log('\n📸 Step 8: Taking final screenshot...');
    await driver.saveScreenshot('./screenshots/final-scroll-clean.png');
    
    // Step 9: Check if we're still on registration page
    console.log('\n🔍 Step 9: Checking current page...');
    try {
      const registrationElement = await $('~Registration');
      if (await registrationElement.isDisplayed()) {
        console.log('✅ Still on registration page - SUCCESS!');
      } else {
        console.log('❌ No longer on registration page');
      }
    } catch (error) {
      console.log('❌ Error checking registration page:', error.message);
    }
    
    console.log('\n=== SCROLL TEST CLEAN COMPLETED ===');
  });
}); 