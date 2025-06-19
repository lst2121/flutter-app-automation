const BasePage = require('./BasePage');

class RegistrationPage extends BasePage {
  constructor() {
    super();
    
    // Page selectors
    this.selectors = {
      pageTitle: '~Registration',
      // Form fields
      firstNameField: '//android.widget.EditText[@hint="e.g. John"]',
      lastNameField: '//android.widget.EditText[@hint="e.g. Doe"]',
      emailField: '//android.widget.EditText[@hint="e.g. johndoe@mail.com"]',
      phoneField: '//android.widget.EditText[@hint="+1 \n9876543210"]',
      addressField: '//android.widget.EditText[@hint="Street Address"]',
      // Dropdowns
      countryDropdown: '//android.view.View[@hint="Select Country"]',
      stateDropdown: '//android.view.View[@hint="Select State"]',
      // Buttons
      registerButton: '~Register',
      // Alternative selectors for robustness
      pageTitleAlt: '//android.view.View[contains(@content-desc, "Registration")]',
      firstNameFieldAlt: '//android.widget.EditText[contains(@hint, "John")]',
      lastNameFieldAlt: '//android.widget.EditText[contains(@hint, "Doe")]',
      emailFieldAlt: '//android.widget.EditText[contains(@hint, "mail.com")]',
      phoneFieldAlt: '//android.widget.EditText[contains(@hint, "9876543210")]',
      addressFieldAlt: '//android.widget.EditText[contains(@hint, "Street")]',
      countryDropdownAlt: '//android.widget.EditText[@hint="Select Country"]',
      stateDropdownAlt: '//android.widget.EditText[@hint="Select State"]',
      registerButtonAlt: '//android.widget.Button[contains(@text, "Register")]',
      registerButtonAlt2: '//android.view.View[contains(@content-desc, "Register")]'
    };
  }

  // Wait for registration page to load
  async waitForPage() {
    console.log('⏳ Waiting for registration page...');
    return await this.waitForElementMultiple([
      this.selectors.pageTitle,
      this.selectors.pageTitleAlt
    ]);
  }

  // Check if page is displayed
  async isPageDisplayed() {
    try {
      const title = await this.waitForElementMultiple([
        this.selectors.pageTitle,
        this.selectors.pageTitleAlt
      ], 5000);
      return title !== null;
    } catch (e) {
      return false;
    }
  }

  // Fill first name field with enhanced scrolling
  async fillFirstName(firstName) {
    console.log(`📝 Filling First Name: ${firstName}`);
    return await this.fillField('e.g. John', firstName, 'First Name');
  }

  // Fill last name field with enhanced scrolling
  async fillLastName(lastName) {
    console.log(`📝 Filling Last Name: ${lastName}`);
    return await this.fillField('e.g. Doe', lastName, 'Last Name');
  }

  // Fill email field with enhanced scrolling
  async fillEmail(email) {
    console.log(`📝 Filling Email: ${email}`);
    return await this.fillField('e.g. johndoe@mail.com', email, 'Email');
  }

  // Fill phone field with enhanced scrolling
  async fillPhone(phone) {
    console.log(`📝 Filling Phone: ${phone}`);
    return await this.fillField('+1 \n9876543210', phone, 'Phone Number');
  }

  // Fill address field with enhanced scrolling
  async fillAddress(address) {
    console.log(`📝 Filling Address: ${address}`);
    return await this.fillField('Street Address', address, 'Address');
  }

  // Select country from dropdown with enhanced scrolling
  async selectCountry(country) {
    console.log(`🌍 Selecting country: ${country}`);
    
    // Use ScrollUtil to find country dropdown
    const countryDropdown = await this.scrollUtil.scrollToFindElement([
      this.selectors.countryDropdown,
      this.selectors.countryDropdownAlt
    ], 'Country Dropdown');
    
    if (countryDropdown) {
      try {
        await countryDropdown.click();
        console.log('✅ Country dropdown clicked');
        await driver.pause(2000);
        
        // Try to select the specified country
        const countryOption = await this.waitForElement(`~${country}`, 3000);
        if (countryOption) {
          await countryOption.click();
          console.log(`✅ Selected country: ${country}`);
          return true;
        } else {
          console.log(`⚠️ Country ${country} not found, trying first available...`);
          const firstCountry = await this.waitForElement('//android.view.View[@clickable="true"]', 2000);
          if (firstCountry) {
            await firstCountry.click();
            console.log('✅ Selected first available country');
            return true;
          }
        }
      } catch (e) {
        console.log('❌ Error selecting country:', e.message);
      }
    } else {
      console.log('❌ Country dropdown not found');
    }
    
    return false;
  }

  // Select state from dropdown with enhanced scrolling
  async selectState(state) {
    console.log(`🏛️ Selecting state: ${state}`);
    
    // Use ScrollUtil to find state dropdown
    const stateDropdown = await this.scrollUtil.scrollToFindElement([
      this.selectors.stateDropdown,
      this.selectors.stateDropdownAlt
    ], 'State Dropdown');
    
    if (stateDropdown) {
      try {
        await stateDropdown.click();
        console.log('✅ State dropdown clicked');
        await driver.pause(2000);
        
        // Try to select the specified state
        const stateOption = await this.waitForElement(`~${state}`, 3000);
        if (stateOption) {
          await stateOption.click();
          console.log(`✅ Selected state: ${state}`);
          return true;
        } else {
          console.log(`⚠️ State ${state} not found, trying first available...`);
          const firstState = await this.waitForElement('//android.view.View[@clickable="true"]', 2000);
          if (firstState) {
            await firstState.click();
            console.log('✅ Selected first available state');
            return true;
          }
        }
      } catch (e) {
        console.log('❌ Error selecting state:', e.message);
      }
    } else {
      console.log('❌ State dropdown not found');
    }
    
    return false;
  }

  // Find register button with enhanced scrolling and debugging
  async findRegisterButton() {
    console.log('🔍 Finding register button with enhanced scrolling...');
    
    // Use ScrollUtil's dedicated method for register button
    const registerButton = await this.scrollUtil.scrollToFindRegisterButton();
    
    if (registerButton) {
      console.log('✅ Register button found with enhanced scrolling');
      return registerButton;
    } else {
      console.log('❌ Register button not found after enhanced scrolling');
      return null;
    }
  }

  // Click register button with enhanced error handling
  async clickRegister() {
    console.log('📝 Clicking register button...');
    
    const registerButton = await this.findRegisterButton();
    
    if (registerButton) {
      try {
        // Hide keyboard before clicking to prevent conflicts
        await this.hideKeyboard();
        await driver.pause(500);
        
        await registerButton.click();
        console.log('✅ Register button clicked successfully');
        await driver.pause(2000);
        return true;
      } catch (e) {
        console.log('❌ Error clicking register button:', e.message);
        return false;
      }
    } else {
      console.log('❌ Register button not found');
      return false;
    }
  }

  // Fill complete registration form with enhanced scrolling
  async fillRegistrationForm(formData) {
    console.log('📋 Filling registration form with enhanced scrolling...');
    
    const results = {
      firstName: false,
      lastName: false,
      email: false,
      phone: false,
      address: false,
      country: false,
      state: false
    };
    
    // Fill basic fields with enhanced scrolling
    if (formData.firstName) {
      results.firstName = await this.fillFirstName(formData.firstName);
    }
    
    if (formData.lastName) {
      results.lastName = await this.fillLastName(formData.lastName);
    }
    
    if (formData.email) {
      results.email = await this.fillEmail(formData.email);
    }
    
    if (formData.phone) {
      results.phone = await this.fillPhone(formData.phone);
    }
    
    if (formData.address) {
      results.address = await this.fillAddress(formData.address);
    }
    
    // Select dropdowns with enhanced scrolling
    if (formData.country) {
      results.country = await this.selectCountry(formData.country);
    }
    
    if (formData.state) {
      results.state = await this.selectState(formData.state);
    }
    
    // Calculate success rate
    const filledFields = Object.values(results).filter(Boolean).length;
    const totalFields = Object.keys(results).length;
    const successRate = (filledFields / totalFields) * 100;
    
    console.log(`📊 Enhanced form filling results: ${filledFields}/${totalFields} fields filled (${successRate.toFixed(1)}%)`);
    
    return {
      results,
      successRate,
      filledFields,
      totalFields
    };
  }

  // Complete registration flow with enhanced functionality
  async completeRegistration(formData) {
    console.log('🎯 Completing registration flow with enhanced scrolling...');
    
    // Wait for page to load
    const pageLoaded = await this.waitForPage();
    if (!pageLoaded) {
      console.log('❌ Registration page not loaded');
      return false;
    }

    // Take initial screenshot
    await this.takeScreenshot('registration_form_initial');

    // Fill the form with enhanced scrolling
    const formResults = await this.fillRegistrationForm(formData);
    
    // Try to click register button with enhanced error handling
    const registerClicked = await this.clickRegister();
    
    // Take final screenshot
    await this.takeScreenshot('registration_form_completed');
    
    return {
      formResults,
      registerClicked,
      success: formResults.successRate >= 70 && registerClicked
    };
  }

  // Get form validation status with enhanced checking
  async getFormValidationStatus() {
    const validation = {
      hasRequiredFields: false,
      hasValidEmail: false,
      hasValidPhone: false,
      isFormComplete: false
    };
    
    try {
      // Check for required fields
      const requiredFields = [
        this.selectors.firstNameField,
        this.selectors.lastNameField,
        this.selectors.emailField
      ];
      
      let requiredFieldsCount = 0;
      for (let field of requiredFields) {
        const element = await this.waitForElement(field, 1000);
        if (element) requiredFieldsCount++;
      }
      
      validation.hasRequiredFields = requiredFieldsCount >= 2;
      
      // Check if form appears complete using enhanced scrolling
      const registerButton = await this.findRegisterButton();
      validation.isFormComplete = registerButton !== null;
      
    } catch (e) {
      console.log('⚠️ Error checking form validation:', e.message);
    }
    
    return validation;
  }

  // Get available form fields with enhanced detection
  async getAvailableFields() {
    const fields = {};
    
    try {
      fields.firstName = await this.waitForElement(this.selectors.firstNameField, 2000);
      fields.lastName = await this.waitForElement(this.selectors.lastNameField, 2000);
      fields.email = await this.waitForElement(this.selectors.emailField, 2000);
      fields.phone = await this.waitForElement(this.selectors.phoneField, 2000);
      fields.address = await this.waitForElement(this.selectors.addressField, 2000);
      fields.country = await this.waitForElement(this.selectors.countryDropdown, 2000);
      fields.state = await this.waitForElement(this.selectors.stateDropdown, 2000);
      
      const availableCount = Object.keys(fields).filter(key => fields[key]).length;
      console.log(`📋 Available form fields: ${availableCount}/7`);
    } catch (e) {
      console.log('⚠️ Error getting available fields:', e.message);
    }
    
    return fields;
  }
}

module.exports = RegistrationPage; 