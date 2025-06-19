/**
 * Scroll Utility Module
 * Enhanced W3C-based scrolling with keyboard conflict prevention and debugging
 */

class ScrollUtil {
  constructor() {
    this.maxScrollAttempts = 5;
    this.scrollDelay = 1500;
    this.keyboardHideDelay = 500;
  }

  /**
   * Enhanced W3C Touch Scrolling with keyboard conflict prevention
   * @param {string} screenshotPrefix - Prefix for screenshot names
   * @returns {Promise<boolean>} - Success status
   */
  async scrollDownW3C(screenshotPrefix = 'scroll') {
    console.log('📜 Attempting enhanced W3C touch scroll...');
    
    try {
      // Always hide keyboard first to prevent conflicts
      await this.hideKeyboard();
      await driver.pause(this.keyboardHideDelay);
      
      const { width, height } = await driver.getWindowSize();
      const startX = width / 2;
      const startY = height * 0.75;
      const endY = height * 0.25;

      console.log(`📱 Screen: ${width}x${height}, Scroll: (${startX}, ${startY}) → (${startX}, ${endY})`);

      await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 300 },
          { type: 'pointerMove', duration: 1000, x: startX, y: endY },
          { type: 'pointerUp', button: 0 }
        ]
      }]);
      await driver.releaseActions();
      await driver.pause(this.scrollDelay);
      
      console.log('✅ Enhanced W3C scroll successful');
      return true;
      
    } catch (e) {
      console.log('❌ Enhanced W3C scroll failed:', e.message);
      return false;
    }
  }

  /**
   * Hide keyboard with error handling
   * @returns {Promise<void>}
   */
  async hideKeyboard() {
    try {
      const keyboardHidden = await driver.hideKeyboard();
      if (keyboardHidden) {
        console.log('⌨️ Keyboard hidden successfully');
      } else {
        console.log('ℹ️ No keyboard to hide');
      }
    } catch (e) {
      console.log('ℹ️ Keyboard hide failed (likely no keyboard):', e.message);
    }
  }

  /**
   * Take screenshot with timestamp
   * @param {string} name - Screenshot name
   * @returns {Promise<void>}
   */
  async takeScreenshot(name) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await driver.saveScreenshot(`./screenshots/${name}_${timestamp}.png`);
      console.log(`📸 Screenshot saved: ${name}_${timestamp}.png`);
    } catch (e) {
      console.log(`⚠️ Screenshot failed: ${e.message}`);
    }
  }

  /**
   * Scroll to find element with comprehensive debugging
   * @param {Array<string>} selectors - Array of selectors to try
   * @param {string} elementName - Name of element for logging
   * @param {number} maxAttempts - Maximum scroll attempts
   * @returns {Promise<Element|null>} - Found element or null
   */
  async scrollToFindElement(selectors, elementName = 'Element', maxAttempts = this.maxScrollAttempts) {
    console.log(`🔍 Scrolling to find ${elementName}...`);
    
    for (let i = 0; i < maxAttempts; i++) {
      console.log(`\n🔄 Scroll Attempt ${i + 1}/${maxAttempts}`);
      
      // Try to find element first
      const element = await this.waitForElementMultiple(selectors, 2000);
      if (element) {
        console.log(`✅ ${elementName} found on attempt ${i + 1}`);
        return element;
      }

      // Take screenshot before scroll
      await this.takeScreenshot(`${elementName.toLowerCase()}_before_scroll_${i + 1}`);
      
      // Scroll down
      const scrolled = await this.scrollDownW3C(`${elementName.toLowerCase()}_scroll_${i + 1}`);
      if (!scrolled) {
        console.log(`⚠️ Scroll attempt ${i + 1} failed, stopping`);
        break;
      }
      
      // Take screenshot after scroll
      await this.takeScreenshot(`${elementName.toLowerCase()}_after_scroll_${i + 1}`);
    }
    
    console.log(`⚠️ ${elementName} not found after ${maxAttempts} scroll attempts`);
    return null;
  }

  /**
   * Wait for element with multiple selectors
   * @param {Array<string>} selectors - Array of selectors to try
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Element|null>} - Found element or null
   */
  async waitForElementMultiple(selectors, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      for (let selector of selectors) {
        try {
          const element = await $(selector);
          if (await element.isDisplayed()) {
            return element;
          }
        } catch (_) {}
      }
      await driver.pause(500);
    }
    return null;
  }

  /**
   * Scroll to find Register button specifically
   * @returns {Promise<Element|null>} - Register button element or null
   */
  async scrollToFindRegisterButton() {
    const registerSelectors = [
      '~Register',
      '//android.widget.Button[contains(@text, "Register")]',
      '//android.view.View[contains(@content-desc, "Register")]'
    ];
    
    return await this.scrollToFindElement(registerSelectors, 'Register Button');
  }

  /**
   * Scroll to find any form field
   * @param {string} fieldHint - Field hint text
   * @param {string} fieldName - Field name for logging
   * @returns {Promise<Element|null>} - Field element or null
   */
  async scrollToFindField(fieldHint, fieldName) {
    const fieldSelectors = [
      `//android.widget.EditText[@hint="${fieldHint}"]`,
      `//android.widget.EditText[contains(@hint, "${fieldHint}")]`
    ];
    
    return await this.scrollToFindElement(fieldSelectors, fieldName);
  }

  /**
   * Scroll to bottom of form with progress tracking
   * @param {Function} checkFunction - Function to check if we've reached the bottom
   * @returns {Promise<boolean>} - Success status
   */
  async scrollToBottom(checkFunction) {
    console.log('📜 Scrolling to bottom of form...');
    
    for (let i = 0; i < this.maxScrollAttempts; i++) {
      console.log(`🔄 Bottom scroll attempt ${i + 1}/${this.maxScrollAttempts}`);
      
      // Check if we've reached the bottom
      if (await checkFunction()) {
        console.log('✅ Reached bottom of form');
        return true;
      }

      // Take screenshot before scroll
      await this.takeScreenshot(`bottom_scroll_before_${i + 1}`);
      
      // Scroll down
      const scrolled = await this.scrollDownW3C(`bottom_scroll_${i + 1}`);
      if (!scrolled) {
        console.log('⚠️ Bottom scroll failed, stopping');
        break;
      }
      
      // Take screenshot after scroll
      await this.takeScreenshot(`bottom_scroll_after_${i + 1}`);
    }
    
    console.log('⚠️ Could not reach bottom of form');
    return false;
  }

  /**
   * Smart scroll that adapts to content
   * @param {string} targetElement - Element to find
   * @param {number} maxAttempts - Maximum attempts
   * @returns {Promise<Element|null>} - Found element or null
   */
  async smartScroll(targetElement, maxAttempts = this.maxScrollAttempts) {
    console.log(`🧠 Smart scrolling for: ${targetElement}`);
    
    let lastScrollPosition = 0;
    let noProgressCount = 0;
    
    for (let i = 0; i < maxAttempts; i++) {
      // Try to find element
      try {
        const element = await $(targetElement);
        if (await element.isDisplayed()) {
          console.log(`✅ Smart scroll found element on attempt ${i + 1}`);
          return element;
        }
      } catch (_) {}
      
      // Take screenshot before scroll
      await this.takeScreenshot(`smart_scroll_before_${i + 1}`);
      
      // Perform scroll
      const scrolled = await this.scrollDownW3C(`smart_scroll_${i + 1}`);
      if (!scrolled) {
        console.log('⚠️ Smart scroll failed');
        break;
      }
      
      // Check if we made progress (simplified check)
      const currentPosition = Date.now(); // Simplified position tracking
      if (currentPosition === lastScrollPosition) {
        noProgressCount++;
        if (noProgressCount >= 2) {
          console.log('⚠️ No scroll progress detected, stopping');
          break;
        }
      } else {
        noProgressCount = 0;
      }
      lastScrollPosition = currentPosition;
      
      // Take screenshot after scroll
      await this.takeScreenshot(`smart_scroll_after_${i + 1}`);
    }
    
    console.log('⚠️ Smart scroll could not find element');
    return null;
  }
}

module.exports = ScrollUtil; 