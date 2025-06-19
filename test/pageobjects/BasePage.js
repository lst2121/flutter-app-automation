const ScrollUtil = require('../utils/scrollUtil');

class BasePage {
  constructor() {
    this.timeout = 10000;
    this.scrollUtil = new ScrollUtil();
  }

  // Reusable: Take screenshot with timestamp
  async takeScreenshot(name) {
    return await this.scrollUtil.takeScreenshot(name);
  }

  // Reusable: W3C Touch Scrolling (center of screen) - PROVEN WORKING
  async scrollDownW3C() {
    return await this.scrollUtil.scrollDownW3C();
  }

  // Reusable: Wait for element to be displayed
  async waitForElement(selector, timeout = this.timeout) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          return element;
        }
      } catch (_) {}
      await driver.pause(500);
    }
    return null;
  }

  // Reusable: Wait for element with multiple selectors
  async waitForElementMultiple(selectors, timeout = this.timeout) {
    return await this.scrollUtil.waitForElementMultiple(selectors, timeout);
  }

  // Reusable: Click element with retry
  async clickElement(selector, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          await element.click();
          console.log(`✅ Clicked element: ${selector}`);
          return true;
        }
      } catch (e) {
        console.log(`⚠️ Click attempt ${i + 1} failed: ${e.message}`);
      }
      await driver.pause(1000);
    }
    console.log(`❌ Failed to click element: ${selector}`);
    return false;
  }

  // Reusable: Fill field with scrolling support
  async fillField(hint, value, fieldName, maxScrollAttempts = 5) {
    console.log(`📝 Filling ${fieldName}...`);
    
    // Use ScrollUtil to find the field
    const field = await this.scrollUtil.scrollToFindField(hint, fieldName);
    
    if (field && await field.isDisplayed()) {
      try {
        // Click to focus the field first
        await field.click();
        await driver.pause(500);
        
        // Clear existing text
        await field.clearValue();
        await driver.pause(500);
        
        // Fill the field
        await field.setValue(value);
        await driver.pause(1000);
        
        console.log(`✅ Filled ${fieldName}: "${value}"`);
        return true;
        
      } catch (e) {
        console.log(`❌ Error filling ${fieldName}:`, e.message);
        return false;
      }
    } else {
      console.log(`❌ ${fieldName} field not found after scrolling`);
      return false;
    }
  }

  // Reusable: Scroll to find element
  async scrollToFindElement(selectors, maxScrollAttempts = 5) {
    return await this.scrollUtil.scrollToFindElement(selectors, 'Element', maxScrollAttempts);
  }

  // Reusable: Scroll to find Register button specifically
  async scrollToFindRegisterButton() {
    return await this.scrollUtil.scrollToFindRegisterButton();
  }

  // Reusable: Wait for page to load
  async waitForPageLoad(timeout = 10000) {
    console.log('⏳ Waiting for page to load...');
    await driver.pause(2000);
    
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        // Check if any interactive elements are present
        const elements = await $$('//android.widget.Button | //android.widget.EditText | //android.view.View[@clickable="true"]');
        if (elements.length > 0) {
          console.log('✅ Page appears to be loaded');
          return true;
        }
      } catch (_) {}
      await driver.pause(500);
    }
    
    console.log('⚠️ Page load timeout');
    return false;
  }

  // Enhanced method to hide keyboard
  async hideKeyboard() {
    return await this.scrollUtil.hideKeyboard();
  }

  // Smart scroll method
  async smartScroll(targetElement, maxAttempts = 5) {
    return await this.scrollUtil.smartScroll(targetElement, maxAttempts);
  }

  // Scroll to bottom with custom check function
  async scrollToBottom(checkFunction) {
    return await this.scrollUtil.scrollToBottom(checkFunction);
  }
}

module.exports = BasePage; 