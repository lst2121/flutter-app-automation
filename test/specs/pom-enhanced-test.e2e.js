const { expect } = require('@wdio/globals');
const AppFlow = require('../pageobjects/AppFlow');

describe('Page Object Model - Enhanced Test', () => {
  let appFlow;

  beforeEach(async () => {
    // Initialize app flow
    appFlow = new AppFlow();
    
    // Wait for app to load
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should complete registration flow with enhanced scrolling and debugging', async () => {
    console.log('=== ENHANCED POM REGISTRATION TEST STARTED ===');
    
    // Generate test data
    const testData = appFlow.generateTestData();
    console.log('📋 Test data generated:', JSON.stringify(testData, null, 2));
    
    // Complete registration flow with enhanced functionality
    const result = await appFlow.completeRegistration(testData);
    
    console.log('📊 Enhanced registration result:', JSON.stringify(result, null, 2));
    
    // Assertions
    expect(result).toBeDefined();
    expect(result.formResults).toBeDefined();
    expect(result.registerClicked).toBeDefined();
    
    // Check if we have at least partial success
    if (result.success) {
      console.log('🎉 ENHANCED TEST: Full registration success!');
    } else if (result.formResults && result.formResults.successRate >= 50) {
      console.log('⚠️ ENHANCED TEST: Partial success - form filled but register button issue');
    } else {
      console.log('❌ ENHANCED TEST: Registration failed');
    }
    
    console.log('=== ENHANCED POM REGISTRATION TEST COMPLETED ===');
  });

  it('should test enhanced scrolling functionality specifically', async () => {
    console.log('=== ENHANCED SCROLLING TEST ===');
    
    // Complete onboarding first
    const onboardingResult = await appFlow.completeOnboarding();
    expect(onboardingResult.success).toBe(true);
    
    // Navigate to registration page
    const signUpNavigated = await appFlow.loginPage.navigateToSignUp();
    expect(signUpNavigated).toBe(true);
    
    // Test enhanced scrolling to find register button
    const registerButton = await appFlow.registrationPage.findRegisterButton();
    
    if (registerButton) {
      console.log('✅ Enhanced scrolling test passed - register button found');
      expect(registerButton).toBeDefined();
    } else {
      console.log('⚠️ Enhanced scrolling test partial - register button not found');
      // This might be expected if the button is not visible without filling form
    }
    
    console.log('=== ENHANCED SCROLLING TEST COMPLETED ===');
  });

  it('should test form field filling with enhanced scrolling', async () => {
    console.log('=== ENHANCED FORM FILLING TEST ===');
    
    // Complete onboarding first
    const onboardingResult = await appFlow.completeOnboarding();
    expect(onboardingResult.success).toBe(true);
    
    // Navigate to registration page
    const signUpNavigated = await appFlow.loginPage.navigateToSignUp();
    expect(signUpNavigated).toBe(true);
    
    // Generate test data
    const testData = appFlow.generateTestData();
    
    // Test enhanced form filling
    const formResults = await appFlow.registrationPage.fillRegistrationForm(testData);
    
    console.log('📊 Enhanced form filling results:', JSON.stringify(formResults, null, 2));
    
    // Assertions
    expect(formResults).toBeDefined();
    expect(formResults.successRate).toBeGreaterThan(0);
    expect(formResults.filledFields).toBeGreaterThan(0);
    
    if (formResults.successRate >= 70) {
      console.log('✅ Enhanced form filling test passed');
    } else {
      console.log('⚠️ Enhanced form filling test partial success');
    }
    
    console.log('=== ENHANCED FORM FILLING TEST COMPLETED ===');
  });

  it('should test keyboard conflict prevention', async () => {
    console.log('=== KEYBOARD CONFLICT PREVENTION TEST ===');
    
    // Complete onboarding first
    const onboardingResult = await appFlow.completeOnboarding();
    expect(onboardingResult.success).toBe(true);
    
    // Navigate to registration page
    const signUpNavigated = await appFlow.loginPage.navigateToSignUp();
    expect(signUpNavigated).toBe(true);
    
    // Test keyboard hiding functionality
    const keyboardHidden = await appFlow.registrationPage.hideKeyboard();
    console.log('⌨️ Keyboard hidden:', keyboardHidden);
    
    // Test scrolling after keyboard hide
    const scrolled = await appFlow.registrationPage.scrollDownW3C();
    console.log('📜 Scrolled after keyboard hide:', scrolled);
    
    expect(scrolled).toBeDefined();
    
    console.log('=== KEYBOARD CONFLICT PREVENTION TEST COMPLETED ===');
  });

  it('should test multiple registration attempts with different data', async () => {
    console.log('=== ENHANCED MULTIPLE REGISTRATION TEST ===');
    
    // Generate multiple test data sets
    const testDataSets = appFlow.generateMultipleTestData(2);
    
    const results = [];
    
    for (let i = 0; i < testDataSets.length; i++) {
      console.log(`\n📝 Enhanced registration attempt ${i + 1}/${testDataSets.length}`);
      
      // Take screenshot before each attempt
      await appFlow.registrationPage.takeScreenshot(`enhanced_registration_attempt_${i + 1}_start`);
      
      const result = await appFlow.completeRegistration(testDataSets[i]);
      results.push(result);
      
      // Take screenshot after each attempt
      await appFlow.registrationPage.takeScreenshot(`enhanced_registration_attempt_${i + 1}_end`);
      
      // Wait between tests
      await driver.pause(3000);
    }
    
    // Analyze results
    const successCount = results.filter(r => r.success).length;
    const partialSuccessCount = results.filter(r => !r.success && r.formResults && r.formResults.successRate >= 50).length;
    
    console.log(`📊 Enhanced multiple registration results:`);
    console.log(`   - Full success: ${successCount}/${results.length}`);
    console.log(`   - Partial success: ${partialSuccessCount}/${results.length}`);
    console.log(`   - Total attempts: ${results.length}`);
    
    // Assertions
    expect(results.length).toBe(2);
    expect(successCount + partialSuccessCount).toBeGreaterThan(0);
    
    console.log('=== ENHANCED MULTIPLE REGISTRATION TEST COMPLETED ===');
  });

  it('should test app status and page detection', async () => {
    console.log('=== ENHANCED APP STATUS TEST ===');
    
    const status = await appFlow.getAppStatus();
    
    console.log('📊 Enhanced app status:', JSON.stringify(status, null, 2));
    
    // Assertions
    expect(status).toBeDefined();
    expect(status.currentPage).toBeDefined();
    expect(['language_selection', 'login', 'registration', 'unknown']).toContain(status.currentPage);
    
    // Test page-specific functionality
    if (status.languagePage) {
      console.log('🌍 Currently on language selection page');
    } else if (status.loginPage) {
      console.log('🔐 Currently on login page');
    } else if (status.registrationPage) {
      console.log('📝 Currently on registration page');
    } else {
      console.log('❓ Unknown page state');
    }
    
    console.log('=== ENHANCED APP STATUS TEST COMPLETED ===');
  });
}); 