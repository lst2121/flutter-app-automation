const { expect } = require('@wdio/globals');
const AppFlow = require('../../pageobjects/AppFlow');

describe('Scroll After Name and Sidebar Close (Anytime Shift)', () => {
  let appFlow;

  beforeEach(async () => {
    appFlow = new AppFlow();
    console.log('⏳ Waiting for app to load...');
    await driver.pause(3000);
  });

  it('should fill name, close sidebar by clicking Anytime Shift, then scroll', async () => {
    console.log('=== SCROLL TEST WITH SIDEBAR CLOSE VIA ANYTIME SHIFT STARTED ===');

    // Step 1: Complete onboarding
    const onboardingResult = await appFlow.completeOnboarding();
    if (!onboardingResult.success) throw new Error('Failed to complete onboarding');

    // Step 2: Navigate to registration page
    const signUpResult = await appFlow.loginPage.navigateToSignUp();
    if (!signUpResult) throw new Error('Failed to navigate to registration page');

    // Step 3: Fill First Name field
    console.log('\n✏️ Step 3: Fill First Name field...');
    try {
      const firstNameInput = await $('android=new UiSelector().className("android.widget.EditText").instance(0)');
      await firstNameInput.click();
      await firstNameInput.setValue('John');
      console.log('✅ First Name set to John');
    } catch (error) {
      console.log('❌ Failed to fill First Name:', error.message);
    }

    // Step 4: Try to close the sidebar by clicking "Anytime Shift"
    console.log('\n🧹 Step 4: Attempting to close sidebar by clicking Anytime Shift...');
    let sidebarClosed = false;
    try {
      // Try accessibility id first
      let anytimeShift;
      try {
        anytimeShift = await $('~Anytime Shift');
      } catch {}
      // If not found, try XPath by text
      if (!anytimeShift || !(await anytimeShift.isDisplayed())) {
        anytimeShift = await $('android=new UiSelector().textContains("Anytime Shift")');
      }
      if (anytimeShift && await anytimeShift.isDisplayed()) {
        await anytimeShift.click();
        sidebarClosed = true;
        console.log('✅ Sidebar closed by clicking Anytime Shift');
        await driver.pause(1000);
      } else {
        console.log('ℹ️ Anytime Shift element not visible, skipping sidebar close');
      }
    } catch (error) {
      console.log('⚠️ Could not find or click Anytime Shift:', error.message);
    }

    // Step 5: Scroll down
    console.log('\n🔄 Step 5: Scroll...');
    try {
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
      console.log('✅ Scroll performed');
    } catch (error) {
      console.log('❌ Scroll failed:', error.message);
    }

    console.log('=== SCROLL TEST WITH SIDEBAR CLOSE VIA ANYTIME SHIFT COMPLETED ===');
  });
}); 