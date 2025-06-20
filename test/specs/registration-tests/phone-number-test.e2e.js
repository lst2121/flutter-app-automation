const fs = require('fs');

describe('Phone Number Field Test', () => {
  it('should test phone number field navigation and writing', async () => {
    console.log('📞 Starting Phone Number Field Test');
    
    // Wait for app to load
    await driver.pause(3000);
    
    // Take initial screenshot
    await driver.saveScreenshot('./screenshots/phone-test-initial.png');
    console.log('📸 Initial screenshot taken');
    
    // Test Phone Number field
    console.log('\n📞 Testing Phone Number field...');
    
    try {
      // Find Phone Number field
      const phoneField = await $('//android.widget.EditText[@hint="+1 \n9876543210"]');
      if (await phoneField.isDisplayed()) {
        console.log('✅ Phone Number field found');
        
        // Click on the field
        await phoneField.click();
        await driver.pause(500);
        console.log('✅ Phone field clicked');
        
        // Clear and enter phone number
        await phoneField.clearValue();
        await phoneField.setValue('5551234567');
        await driver.pause(1000);
        console.log('✅ Phone number entered: 5551234567');
        
        // Take screenshot after entry
        await driver.saveScreenshot('./screenshots/phone-number-entered.png');
        console.log('📸 Screenshot after phone entry taken');
        
        // Click on Registration header to exit
        const registrationText = await $('~Registration');
        await registrationText.click();
        await driver.pause(1000);
        console.log('✅ Clicked on Registration text to exit');
        
        console.log('✅ Phone Number Field Test completed successfully');
        
      } else {
        console.log('❌ Phone Number field not found');
      }
    } catch (error) {
      console.log('❌ Error testing Phone Number field:', error.message);
    }
    
    console.log('📞 Phone Number Field Test completed');
  });
}); 