const { expect } = require('@wdio/globals');
const AppFlow = require('../pageobjects/AppFlow');

describe('Page Object Model - Simple Test', () => {
  let appFlow;

  beforeEach(async () => {
    // Initialize app flow
    appFlow = new AppFlow();
    
    // Wait for app to load
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should test language selection using POM', async () => {
    console.log('=== POM SIMPLE LANGUAGE TEST ===');
    
    // Test language selection only
    const result = await appFlow.testLanguageSelection('English');
    
    console.log('📊 Language selection result:', JSON.stringify(result, null, 2));
    
    // Basic assertion
    expect(result).toBeDefined();
    expect(result.language).toBe('English');
    
    console.log('=== POM SIMPLE LANGUAGE TEST COMPLETED ===');
  });

  it('should get app status', async () => {
    console.log('=== POM APP STATUS TEST ===');
    
    const status = await appFlow.getAppStatus();
    
    console.log('📊 App status:', JSON.stringify(status, null, 2));
    
    // Basic assertion
    expect(status).toBeDefined();
    expect(status.currentPage).toBeDefined();
    
    console.log('=== POM APP STATUS TEST COMPLETED ===');
  });
}); 