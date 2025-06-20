const { expect } = require('@wdio/globals');
const AppFlow = require('../../pageobjects/AppFlow');

describe('Page Object Model - Registration Test', () => {
  let appFlow;

  beforeEach(async () => {
    // Initialize app flow
    appFlow = new AppFlow();
    
    // Wait for app to load
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should complete full registration flow using POM', async () => {
    console.log('=== POM REGISTRATION TEST STARTED ===');
    
    // Generate test data
    const testData = appFlow.generateTestData();
    
    // Complete registration flow
    const result = await appFlow.completeRegistration(testData);
    
    // Assertions
    expect(result.success).toBe(true);
    expect(result.step).toBe('completed');
    expect(result.formResults).toBeDefined();
    expect(result.registerClicked).toBe(true);
    
    console.log('=== POM REGISTRATION TEST COMPLETED ===');
  });

  it('should test language selection only', async () => {
    console.log('=== POM LANGUAGE SELECTION TEST ===');
    
    const result = await appFlow.testLanguageSelection('English');
    
    expect(result.success).toBe(true);
    expect(result.language).toBe('English');
    
    console.log('=== POM LANGUAGE SELECTION TEST COMPLETED ===');
  });

  it('should test registration form filling only', async () => {
    console.log('=== POM FORM FILLING TEST ===');
    
    // Complete onboarding first
    const onboardingResult = await appFlow.completeOnboarding();
    expect(onboardingResult.success).toBe(true);
    
    // Generate test data
    const testData = appFlow.generateTestData();
    
    // Test form filling
    const result = await appFlow.testRegistrationForm(testData);
    
    expect(result.success).toBe(true);
    expect(result.successRate).toBeGreaterThan(70);
    
    console.log('=== POM FORM FILLING TEST COMPLETED ===');
  });

  it('should test scrolling functionality', async () => {
    console.log('=== POM SCROLLING TEST ===');
    
    const result = await appFlow.testScrolling();
    
    expect(result.success).toBe(true);
    expect(result.registerButtonFound).toBe(true);
    
    console.log('=== POM SCROLLING TEST COMPLETED ===');
  });

  it('should test multiple registration flows with different data', async () => {
    console.log('=== POM MULTIPLE REGISTRATION TEST ===');
    
    // Generate multiple test data sets
    const testDataSets = appFlow.generateMultipleTestData(2);
    
    const results = [];
    
    for (let i = 0; i < testDataSets.length; i++) {
      console.log(`\n📝 Testing registration ${i + 1}/${testDataSets.length}`);
      
      const result = await appFlow.completeRegistration(testDataSets[i]);
      results.push(result);
      
      // Wait between tests
      await driver.pause(2000);
    }
    
    // Assertions
    const successCount = results.filter(r => r.success).length;
    expect(successCount).toBeGreaterThan(0);
    
    console.log(`📊 Multiple registration results: ${successCount}/${results.length} successful`);
    console.log('=== POM MULTIPLE REGISTRATION TEST COMPLETED ===');
  });

  it('should get app status and verify current page', async () => {
    console.log('=== POM APP STATUS TEST ===');
    
    const status = await appFlow.getAppStatus();
    
    expect(status).toBeDefined();
    expect(status.currentPage).toBeDefined();
    expect(['language_selection', 'login', 'registration', 'unknown']).toContain(status.currentPage);
    
    console.log(`📍 Current app status: ${JSON.stringify(status, null, 2)}`);
    console.log('=== POM APP STATUS TEST COMPLETED ===');
  });
}); 