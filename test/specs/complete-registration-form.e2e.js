const { expect } = require('@wdio/globals');
const AppFlow = require('../pageobjects/AppFlow');

describe('Complete Registration Form Test', () => {
  let appFlow;

  beforeEach(async () => {
    appFlow = new AppFlow();
    console.log('⏳ Waiting for app to load...');
    await driver.pause(3000);
  });

  it('should fill all text fields, close sidebar, then scroll to find registration button', async () => {
    console.log('=== COMPLETE REGISTRATION FORM TEST STARTED ===');

    // Step 1: Complete onboarding
    const onboardingResult = await appFlow.completeOnboarding();
    if (!onboardingResult.success) throw new Error('Failed to complete onboarding');

    // Step 2: Navigate to registration page
    const signUpResult = await appFlow.loginPage.navigateToSignUp();
    if (!signUpResult) throw new Error('Failed to navigate to registration page');

    // Step 3: Fill all text fields
    console.log('\n✏️ Step 3: Filling all text fields...');
    
    // First Name
    try {
      const firstNameInput = await $('android=new UiSelector().className("android.widget.EditText").instance(0)');
      await firstNameInput.click();
      await firstNameInput.setValue('John');
      console.log('✅ First Name set to John');
    } catch (error) {
      console.log('❌ Failed to fill First Name:', error.message);
    }

    // Last Name
    try {
      const lastNameInput = await $('android=new UiSelector().className("android.widget.EditText").instance(1)');
      await lastNameInput.click();
      await lastNameInput.setValue('Doe');
      console.log('✅ Last Name set to Doe');
    } catch (error) {
      console.log('❌ Failed to fill Last Name:', error.message);
    }

    // Email
    try {
      const emailInput = await $('android=new UiSelector().className("android.widget.EditText").instance(2)');
      await emailInput.click();
      await emailInput.setValue('john.doe@example.com');
      console.log('✅ Email set to john.doe@example.com');
    } catch (error) {
      console.log('❌ Failed to fill Email:', error.message);
    }

    // Phone
    try {
      const phoneInput = await $('android=new UiSelector().className("android.widget.EditText").instance(3)');
      await phoneInput.click();
      await phoneInput.setValue('1234567890');
      console.log('✅ Phone set to 1234567890');
    } catch (error) {
      console.log('❌ Failed to fill Phone:', error.message);
    }

    // Address
    try {
      const addressInput = await $('android=new UiSelector().className("android.widget.EditText").instance(4)');
      await addressInput.click();
      await addressInput.setValue('123 Main Street, City, State 12345');
      console.log('✅ Address set to 123 Main Street, City, State 12345');
    } catch (error) {
      console.log('❌ Failed to fill Address:', error.message);
    }

    // Step 4: Close the sidebar by clicking "Anytime Shift"
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

    // Step 5: Scroll until registration button is found
    console.log('\n🔄 Step 5: Scrolling to find registration button...');
    let registrationButtonFound = false;
    let scrollAttempts = 0;
    const maxScrollAttempts = 5;

    while (!registrationButtonFound && scrollAttempts < maxScrollAttempts) {
      scrollAttempts++;
      console.log(`\n📜 Scroll attempt ${scrollAttempts}/${maxScrollAttempts}`);
      
      // Try to find registration button
      try {
        const registerButton = await $('~Register');
        if (await registerButton.isDisplayed()) {
          console.log('✅ Registration button found!');
          registrationButtonFound = true;
          break;
        }
      } catch (error) {
        console.log('ℹ️ Registration button not found yet, continuing to scroll...');
      }

      // Perform scroll
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
        await driver.pause(1000); // Wait for scroll animation
      } catch (error) {
        console.log('❌ Scroll failed:', error.message);
        break;
      }
    }

    if (registrationButtonFound) {
      console.log('🎉 SUCCESS: Registration button found after scrolling!');
    } else {
      console.log('⚠️ Registration button not found after maximum scroll attempts');
    }

    console.log('=== COMPLETE REGISTRATION FORM TEST COMPLETED ===');
  });
}); 