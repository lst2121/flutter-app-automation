const fs = require('fs');
const registrationPage = require('../../pageobjects/RegistrationPage');

// Test Data for different scenarios
const testData = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    address: '123 Main Street',
    zipCode: '12345',
    ssn: '123-45-6789',
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!'
  },
  invalid: {
    firstName: '', // empty
    lastName: 'A', // too short
    email: 'invalid-email',
    phone: '123', // too short
    address: '', // empty
    zipCode: 'abc', // non-numeric
    ssn: '123-45-678', // incomplete
    password: 'weak', // too weak
    confirmPassword: 'different' // mismatch
  },
  boundary: {
    firstName: 'A'.repeat(100), // very long
    lastName: 'B'.repeat(100), // very long
    email: 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com', // very long
    phone: '1'.repeat(20), // very long
    address: 'C'.repeat(200), // very long
    zipCode: '1'.repeat(10), // very long
    ssn: '123-45-6789-123', // too long
    password: 'A'.repeat(50), // very long
    confirmPassword: 'A'.repeat(50) // very long
  }
};

// Helper class for validation tests
class ValidationTestHelpers {
  static async takeScreenshot(testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `./screenshots/validation-${testName}-${timestamp}.png`;
    await driver.saveScreenshot(filename);
    console.log(`📸 Screenshot saved: ${filename}`);
  }

  static async capturePageSource(testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pageSource = await driver.getPageSource();
    fs.writeFileSync(`./screenshots/validation-${testName}-${timestamp}.xml`, pageSource);
    console.log(`📄 Page source saved: validation-${testName}-${timestamp}.xml`);
  }

  static async validateField(fieldName, value, expectedResult) {
    console.log(`\n🔍 Testing ${fieldName} with value: "${value}"`);
    
    try {
      // Clear the field first
      await this.clearField(fieldName);
      
      // Fill the field
      await this.fillField(fieldName, value);
      
      // Wait for validation
      await driver.pause(1000);
      
      // Check validation result
      const isValid = await this.checkFieldValidation(fieldName);
      
      if (isValid === expectedResult) {
        console.log(`✅ ${fieldName} validation passed: expected ${expectedResult}, got ${isValid}`);
        return true;
      } else {
        console.log(`❌ ${fieldName} validation failed: expected ${expectedResult}, got ${isValid}`);
        await this.takeScreenshot(`${fieldName}-validation-failed`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Error testing ${fieldName}:`, error.message);
      await this.takeScreenshot(`${fieldName}-error`);
      return false;
    }
  }

  static async clearField(fieldName) {
    const fieldMap = {
      'firstName': 'e.g. John',
      'lastName': 'e.g. Doe',
      'email': 'e.g. johndoe@mail.com',
      'phone': '+1 \n9876543210',
      'address': 'Street Address',
      'zipCode': 'e.g. 000000',
      'ssn': 'e.g. 000-00-0000',
      'password': '********',
      'confirmPassword': '********'
    };

    const hint = fieldMap[fieldName];
    if (hint) {
      try {
        const field = await $(`//android.widget.EditText[@hint="${hint}"]`);
        await field.clearValue();
        console.log(`🧹 Cleared ${fieldName} field`);
      } catch (e) {
        console.log(`⚠️ Could not clear ${fieldName} field:`, e.message);
      }
    }
  }

  static async fillField(fieldName, value) {
    const fieldMap = {
      'firstName': 'e.g. John',
      'lastName': 'e.g. Doe',
      'email': 'e.g. johndoe@mail.com',
      'phone': '+1 \n9876543210',
      'address': 'Street Address',
      'zipCode': 'e.g. 000000',
      'ssn': 'e.g. 000-00-0000',
      'password': '********',
      'confirmPassword': '********'
    };

    const hint = fieldMap[fieldName];
    if (hint) {
      try {
        const field = await $(`//android.widget.EditText[@hint="${hint}"]`);
        await field.setValue(value);
        console.log(`✏️ Filled ${fieldName} with: "${value}"`);
      } catch (e) {
        console.log(`⚠️ Could not fill ${fieldName} field:`, e.message);
      }
    }
  }

  static async checkFieldValidation(fieldName) {
    // Look for validation indicators (error messages, red borders, etc.)
    const validationSelectors = [
      `//android.view.View[contains(@content-desc, "error")]`,
      `//android.view.View[contains(@content-desc, "invalid")]`,
      `//android.view.View[contains(@content-desc, "required")]`,
      `//android.widget.TextView[contains(@text, "error")]`,
      `//android.widget.TextView[contains(@text, "invalid")]`,
      `//android.widget.TextView[contains(@text, "required")]`
    ];

    for (const selector of validationSelectors) {
      try {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          const text = await element.getText();
          console.log(`⚠️ Validation error found: ${text}`);
          return false; // Field has validation error
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    return true; // No validation errors found
  }
}

describe('Registration Form Field Validation Tests', () => {
  before(async () => {
    // Ensure screenshots directory exists
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots', { recursive: true });
    }
  });

  beforeEach(async () => {
    // Navigate to registration page before each test
    console.log('\n🔄 Navigating to registration page...');
    await registrationPage.waitForPage();
  });

  describe('First Name Field Validation', () => {
    it('should accept valid first name', async () => {
      const result = await ValidationTestHelpers.validateField('firstName', testData.valid.firstName, true);
      expect(result).to.be.true;
    });

    it('should reject empty first name', async () => {
      const result = await ValidationTestHelpers.validateField('firstName', testData.invalid.firstName, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long first name', async () => {
      const result = await ValidationTestHelpers.validateField('firstName', testData.boundary.firstName, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept first name with special characters', async () => {
      const result = await ValidationTestHelpers.validateField('firstName', "O'Connor", true);
      expect(result).to.be.true;
    });

    it('should accept first name with numbers', async () => {
      const result = await ValidationTestHelpers.validateField('firstName', "John123", true);
      expect(result).to.be.true;
    });
  });

  describe('Last Name Field Validation', () => {
    it('should accept valid last name', async () => {
      const result = await ValidationTestHelpers.validateField('lastName', testData.valid.lastName, true);
      expect(result).to.be.true;
    });

    it('should reject very short last name', async () => {
      const result = await ValidationTestHelpers.validateField('lastName', testData.invalid.lastName, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long last name', async () => {
      const result = await ValidationTestHelpers.validateField('lastName', testData.boundary.lastName, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept last name with hyphens', async () => {
      const result = await ValidationTestHelpers.validateField('lastName', "Smith-Jones", true);
      expect(result).to.be.true;
    });

    it('should accept last name with spaces', async () => {
      const result = await ValidationTestHelpers.validateField('lastName', "Van der Berg", true);
      expect(result).to.be.true;
    });
  });

  describe('Email Field Validation', () => {
    it('should accept valid email address', async () => {
      const result = await ValidationTestHelpers.validateField('email', testData.valid.email, true);
      expect(result).to.be.true;
    });

    it('should reject invalid email format', async () => {
      const result = await ValidationTestHelpers.validateField('email', testData.invalid.email, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long email', async () => {
      const result = await ValidationTestHelpers.validateField('email', testData.boundary.email, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept email with subdomain', async () => {
      const result = await ValidationTestHelpers.validateField('email', "user@company.co.uk", true);
      expect(result).to.be.true;
    });

    it('should reject email without @ symbol', async () => {
      const result = await ValidationTestHelpers.validateField('email', "usercompany.com", false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject email without domain', async () => {
      const result = await ValidationTestHelpers.validateField('email', "user@", false);
      expect(result).to.be.true; // Should fail validation
    });
  });

  describe('Phone Number Field Validation', () => {
    it('should accept valid phone number', async () => {
      const result = await ValidationTestHelpers.validateField('phone', testData.valid.phone, true);
      expect(result).to.be.true;
    });

    it('should reject very short phone number', async () => {
      const result = await ValidationTestHelpers.validateField('phone', testData.invalid.phone, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long phone number', async () => {
      const result = await ValidationTestHelpers.validateField('phone', testData.boundary.phone, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept phone number with dashes', async () => {
      const result = await ValidationTestHelpers.validateField('phone', "987-654-3210", true);
      expect(result).to.be.true;
    });

    it('should accept phone number with parentheses', async () => {
      const result = await ValidationTestHelpers.validateField('phone', "(987) 654-3210", true);
      expect(result).to.be.true;
    });

    it('should reject phone number with letters', async () => {
      const result = await ValidationTestHelpers.validateField('phone', "987-ABC-3210", false);
      expect(result).to.be.true; // Should fail validation
    });
  });

  describe('Address Field Validation', () => {
    it('should accept valid address', async () => {
      const result = await ValidationTestHelpers.validateField('address', testData.valid.address, true);
      expect(result).to.be.true;
    });

    it('should reject empty address', async () => {
      const result = await ValidationTestHelpers.validateField('address', testData.invalid.address, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long address', async () => {
      const result = await ValidationTestHelpers.validateField('address', testData.boundary.address, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept address with apartment number', async () => {
      const result = await ValidationTestHelpers.validateField('address', "123 Main Street, Apt 4B", true);
      expect(result).to.be.true;
    });

    it('should accept address with special characters', async () => {
      const result = await ValidationTestHelpers.validateField('address', "123 Main St. #5", true);
      expect(result).to.be.true;
    });
  });

  describe('Zip Code Field Validation', () => {
    it('should accept valid zip code', async () => {
      const result = await ValidationTestHelpers.validateField('zipCode', testData.valid.zipCode, true);
      expect(result).to.be.true;
    });

    it('should reject non-numeric zip code', async () => {
      const result = await ValidationTestHelpers.validateField('zipCode', testData.invalid.zipCode, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long zip code', async () => {
      const result = await ValidationTestHelpers.validateField('zipCode', testData.boundary.zipCode, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept 5-digit zip code', async () => {
      const result = await ValidationTestHelpers.validateField('zipCode', "90210", true);
      expect(result).to.be.true;
    });

    it('should accept 9-digit zip code', async () => {
      const result = await ValidationTestHelpers.validateField('zipCode', "90210-1234", true);
      expect(result).to.be.true;
    });

    it('should reject zip code with letters', async () => {
      const result = await ValidationTestHelpers.validateField('zipCode', "ABC12", false);
      expect(result).to.be.true; // Should fail validation
    });
  });

  describe('SSN Field Validation', () => {
    it('should accept valid SSN format', async () => {
      const result = await ValidationTestHelpers.validateField('ssn', testData.valid.ssn, true);
      expect(result).to.be.true;
    });

    it('should reject incomplete SSN', async () => {
      const result = await ValidationTestHelpers.validateField('ssn', testData.invalid.ssn, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long SSN', async () => {
      const result = await ValidationTestHelpers.validateField('ssn', testData.boundary.ssn, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept SSN without dashes', async () => {
      const result = await ValidationTestHelpers.validateField('ssn', "123456789", true);
      expect(result).to.be.true;
    });

    it('should reject SSN with letters', async () => {
      const result = await ValidationTestHelpers.validateField('ssn', "123-45-678A", false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject SSN starting with 000', async () => {
      const result = await ValidationTestHelpers.validateField('ssn', "000-45-6789", false);
      expect(result).to.be.true; // Should fail validation
    });
  });

  describe('Password Field Validation', () => {
    it('should accept strong password', async () => {
      const result = await ValidationTestHelpers.validateField('password', testData.valid.password, true);
      expect(result).to.be.true;
    });

    it('should reject weak password', async () => {
      const result = await ValidationTestHelpers.validateField('password', testData.invalid.password, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject very long password', async () => {
      const result = await ValidationTestHelpers.validateField('password', testData.boundary.password, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should accept password with special characters', async () => {
      const result = await ValidationTestHelpers.validateField('password', "MyP@ssw0rd!", true);
      expect(result).to.be.true;
    });

    it('should reject password without numbers', async () => {
      const result = await ValidationTestHelpers.validateField('password', "MyPassword", false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject password without uppercase', async () => {
      const result = await ValidationTestHelpers.validateField('password', "mypassword123", false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject password without lowercase', async () => {
      const result = await ValidationTestHelpers.validateField('password', "MYPASSWORD123", false);
      expect(result).to.be.true; // Should fail validation
    });
  });

  describe('Confirm Password Field Validation', () => {
    it('should accept matching password', async () => {
      // First fill password
      await ValidationTestHelpers.fillField('password', testData.valid.password);
      // Then test confirm password
      const result = await ValidationTestHelpers.validateField('confirmPassword', testData.valid.confirmPassword, true);
      expect(result).to.be.true;
    });

    it('should reject non-matching password', async () => {
      // First fill password
      await ValidationTestHelpers.fillField('password', testData.valid.password);
      // Then test confirm password
      const result = await ValidationTestHelpers.validateField('confirmPassword', testData.invalid.confirmPassword, false);
      expect(result).to.be.true; // Should fail validation
    });

    it('should reject empty confirm password', async () => {
      // First fill password
      await ValidationTestHelpers.fillField('password', testData.valid.password);
      // Then test confirm password
      const result = await ValidationTestHelpers.validateField('confirmPassword', '', false);
      expect(result).to.be.true; // Should fail validation
    });
  });

  describe('Form Submission Validation', () => {
    it('should allow submission with all valid fields', async () => {
      // Fill all fields with valid data
      await ValidationTestHelpers.fillField('firstName', testData.valid.firstName);
      await ValidationTestHelpers.fillField('lastName', testData.valid.lastName);
      await ValidationTestHelpers.fillField('email', testData.valid.email);
      await ValidationTestHelpers.fillField('phone', testData.valid.phone);
      await ValidationTestHelpers.fillField('address', testData.valid.address);
      await ValidationTestHelpers.fillField('zipCode', testData.valid.zipCode);
      await ValidationTestHelpers.fillField('ssn', testData.valid.ssn);
      await ValidationTestHelpers.fillField('password', testData.valid.password);
      await ValidationTestHelpers.fillField('confirmPassword', testData.valid.confirmPassword);

      // Try to submit
      try {
        await registrationPage.clickRegisterButton();
        console.log('✅ Form submission allowed with valid data');
        expect(true).to.be.true;
      } catch (error) {
        console.log('❌ Form submission failed:', error.message);
        expect(false).to.be.true;
      }
    });

    it('should prevent submission with invalid fields', async () => {
      // Fill fields with invalid data
      await ValidationTestHelpers.fillField('firstName', testData.invalid.firstName);
      await ValidationTestHelpers.fillField('email', testData.invalid.email);
      await ValidationTestHelpers.fillField('phone', testData.invalid.phone);

      // Try to submit
      try {
        await registrationPage.clickRegisterButton();
        console.log('❌ Form submission allowed with invalid data');
        expect(false).to.be.true;
      } catch (error) {
        console.log('✅ Form submission correctly prevented with invalid data');
        expect(true).to.be.true;
      }
    });
  });
}); 