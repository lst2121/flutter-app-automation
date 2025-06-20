const fs = require('fs');

/**
 * Test Utilities - Reusable helper functions for WebdriverIO tests
 */
class TestUtils {
  /**
   * Take milestone screenshot with timestamp
   * @param {string} milestone - Name of the milestone
   * @param {string} directory - Screenshot directory (default: ./screenshots)
   */
  static async takeMilestoneScreenshot(milestone, directory = './screenshots') {
    try {
      // Ensure directory exists
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${directory}/${milestone}-${timestamp}.png`;
      await driver.saveScreenshot(filename);
      console.log(`📸 Screenshot saved: ${filename}`);
      return filename;
    } catch (error) {
      console.log('⚠️ Failed to take screenshot:', error.message);
      return null;
    }
  }

  /**
   * Capture page source for debugging
   * @param {string} filename - Base filename without extension
   * @param {string} directory - Output directory (default: ./screenshots)
   */
  static async capturePageSource(filename, directory = './screenshots') {
    try {
      // Ensure directory exists
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const pageSource = await driver.getPageSource();
      const filepath = `${directory}/${filename}.html`;
      fs.writeFileSync(filepath, pageSource);
      console.log(`📄 Page source saved: ${filepath}`);
      return filepath;
    } catch (error) {
      console.log('⚠️ Failed to capture page source:', error.message);
      return null;
    }
  }

  /**
   * Validate test step with error handling and screenshots
   * @param {string} stepName - Name of the test step
   * @param {Function} stepFunction - Async function to execute
   * @param {boolean} takeScreenshotOnFailure - Whether to take screenshot on failure (default: true)
   */
  static async validateStep(stepName, stepFunction, takeScreenshotOnFailure = true) {
    console.log(`\n🔄 Executing: ${stepName}`);
    const startTime = Date.now();
    
    try {
      const result = await stepFunction();
      const duration = Date.now() - startTime;
      console.log(`✅ ${stepName} completed successfully (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`❌ ${stepName} failed after ${duration}ms:`, error.message);
      
      if (takeScreenshotOnFailure) {
        await this.takeMilestoneScreenshot(`FAILED-${stepName.replace(/\s+/g, '-')}`);
        await this.capturePageSource(`FAILED-${stepName.replace(/\s+/g, '-')}`);
      }
      
      throw error;
    }
  }

  /**
   * Wait for element with smart retry logic
   * @param {string} locator - Element locator
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   * @param {number} retries - Number of retry attempts (default: 3)
   * @param {number} retryDelay - Delay between retries in milliseconds (default: 1000)
   */
  static async waitForElementSmart(locator, timeout = 10000, retries = 3, retryDelay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const element = await $(locator);
        await element.waitForDisplayed({ timeout });
        console.log(`✅ Element found on attempt ${attempt}: ${locator}`);
        return element;
      } catch (error) {
        if (attempt === retries) {
          console.log(`❌ Element not found after ${retries} attempts: ${locator}`);
          throw error;
        }
        console.log(`⚠️ Attempt ${attempt} failed, retrying in ${retryDelay}ms...`);
        await driver.pause(retryDelay);
      }
    }
  }

  /**
   * Smart scroll to find an element
   * @param {string} targetLocator - Target element locator
   * @param {number} maxAttempts - Maximum scroll attempts (default: 3)
   * @param {number} scrollPercent - Scroll percentage (default: 0.75)
   */
  static async smartScroll(targetLocator, maxAttempts = 3, scrollPercent = 0.75) {
    console.log(`🔄 Smart scrolling to find: ${targetLocator}`);
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const element = await $(targetLocator);
        if (await element.isDisplayed()) {
          console.log(`✅ Element visible after ${attempt} scroll attempt(s)`);
          return true;
        }
      } catch (error) {
        // Element not found, continue scrolling
      }

      if (attempt < maxAttempts) {
        await driver.executeScript('mobile: scrollGesture', {
          left: 100, top: 100, width: 800, height: 600,
          direction: 'down',
          percent: scrollPercent
        });
        await driver.pause(1000);
      }
    }
    
    console.log(`⚠️ Element not visible after ${maxAttempts} scroll attempts`);
    return false;
  }

  /**
   * Hide keyboard safely with fallback
   * @param {boolean} useFallback - Whether to use fallback method (default: true)
   */
  static async hideKeyboardSafely(useFallback = true) {
    try {
      await driver.hideKeyboard();
      console.log('⌨️ Keyboard hidden successfully');
      return true;
    } catch (error) {
      console.log('⚠️ Could not hide keyboard with primary method:', error.message);
      
      if (useFallback) {
        try {
          // Fallback: tap outside the screen
          await driver.executeScript('mobile: tap', {
            x: 200, y: 100
          });
          console.log('⌨️ Keyboard hidden with fallback method');
          return true;
        } catch (fallbackError) {
          console.log('❌ Fallback keyboard hiding also failed:', fallbackError.message);
          return false;
        }
      }
      
      return false;
    }
  }

  /**
   * Generate random test data
   * @param {string} type - Type of data to generate
   */
  static generateTestData(type) {
    const timestamp = Date.now();
    
    switch (type) {
      case 'email':
        return `test.user.${timestamp}@example.com`;
      case 'phone':
        return `555${String(timestamp).slice(-7)}`;
      case 'ssn':
        return `123-45-${String(timestamp).slice(-4)}`;
      case 'zipcode':
        return String(timestamp).slice(-5);
      case 'name':
        return `TestUser${timestamp}`;
      default:
        return `test_${timestamp}`;
    }
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum retry attempts (default: 3)
   * @param {number} baseDelay - Base delay in milliseconds (default: 1000)
   */
  static async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await driver.pause(delay);
      }
    }
  }

  /**
   * Check if element exists without throwing error
   * @param {string} locator - Element locator
   * @param {number} timeout - Timeout in milliseconds (default: 5000)
   */
  static async elementExists(locator, timeout = 5000) {
    try {
      const element = await $(locator);
      await element.waitForDisplayed({ timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get element text safely
   * @param {string} locator - Element locator
   * @param {string} defaultValue - Default value if element not found (default: '')
   */
  static async getElementText(locator, defaultValue = '') {
    try {
      const element = await $(locator);
      return await element.getText();
    } catch (error) {
      console.log(`⚠️ Could not get text for ${locator}:`, error.message);
      return defaultValue;
    }
  }

  /**
   * Wait for page to be stable (no loading indicators)
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   */
  static async waitForPageStable(timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        // Check for common loading indicators
        const loadingIndicators = await $$('android=new UiSelector().className("android.widget.ProgressBar")');
        const isLoading = loadingIndicators.some(indicator => indicator.isDisplayed());
        
        if (!isLoading) {
          console.log('✅ Page appears to be stable');
          return true;
        }
        
        await driver.pause(500);
      } catch (error) {
        // If we can't find loading indicators, assume page is stable
        console.log('✅ Page appears to be stable (no loading indicators found)');
        return true;
      }
    }
    
    console.log('⚠️ Page stability timeout reached');
    return false;
  }

  /**
   * Create test data object with random values
   * @param {Object} template - Template object with field types
   */
  static createTestData(template) {
    const testData = {};
    
    for (const [key, type] of Object.entries(template)) {
      testData[key] = this.generateTestData(type);
    }
    
    return testData;
  }
}

module.exports = TestUtils; 