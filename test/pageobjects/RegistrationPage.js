const BasePage = require('./BasePage');

class RegistrationPage extends BasePage {
  constructor() {
    super();
    
    // Page selectors based on page source analysis
    this.selectors = {
      pageTitle: '~Registration',
      // Form fields
      firstNameField: '//android.widget.EditText[@hint="e.g. John"]',
      lastNameField: '//android.widget.EditText[@hint="e.g. Doe"]',
      emailField: '//android.widget.EditText[@hint="e.g. johndoe@mail.com"]',
      phoneField: '//android.widget.EditText[@hint="+1 \n9876543210"]',
      addressField: '//android.widget.EditText[@hint="Street Address"]',
      zipCodeField: '//android.widget.EditText[@hint="e.g. 000000"]',
      ssnField: '//android.widget.EditText[@hint="e.g. 000-00-0000"]',
      passwordField: '//android.widget.EditText[@hint="********"][1]',
      confirmPasswordField: '//android.widget.EditText[@hint="********"][2]',
      // Dropdowns
      stateDropdown: '~Select State',
      residenceStatusDropdown: '~Select Residence Status',
      // Buttons
      registerButton: '~Register',
      // Alternative selectors for robustness
      pageTitleAlt: '//android.view.View[contains(@content-desc, "Registration")]',
      firstNameFieldAlt: '//android.widget.EditText[contains(@hint, "John")]',
      lastNameFieldAlt: '//android.widget.EditText[contains(@hint, "Doe")]',
      emailFieldAlt: '//android.widget.EditText[contains(@hint, "mail.com")]',
      phoneFieldAlt: '//android.widget.EditText[contains(@hint, "9876543210")]',
      addressFieldAlt: '//android.widget.EditText[contains(@hint, "Street")]',
      zipCodeFieldAlt: '//android.widget.EditText[contains(@hint, "000000")]',
      ssnFieldAlt: '//android.widget.EditText[contains(@hint, "000-00-0000")]',
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
      '//android.view.View[@content-desc="Select State"]'
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

  // Fill registration form with all fields
  async fillRegistrationForm(formData) {
    console.log('📝 Filling complete registration form...');
    
    const results = {
      firstName: false,
      lastName: false,
      email: false,
      phone: false,
      address: false,
      country: false,
      state: false,
      zipCode: false,
      ssn: false,
      residenceStatus: false,
      password: false,
      confirmPassword: false
    };
    
    try {
      // Fill basic fields
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
      
      // Select country
      if (formData.country) {
        results.country = await this.selectCountry(formData.country);
      }
      
      // Select state
      if (formData.state) {
        results.state = await this.selectState(formData.state);
      }
      
      // Fill zip code
      if (formData.zipCode) {
        results.zipCode = await this.fillZipCode(formData.zipCode);
      }
      
      // Fill SSN
      if (formData.ssn) {
        results.ssn = await this.fillSSN(formData.ssn);
      }
      
      // Select residence status
      if (formData.residenceStatus) {
        results.residenceStatus = await this.selectResidenceStatus(formData.residenceStatus);
      }
      
      // Fill password
      if (formData.password) {
        results.password = await this.fillPassword(formData.password);
      }
      
      // Fill confirm password
      if (formData.confirmPassword) {
        results.confirmPassword = await this.fillConfirmPassword(formData.confirmPassword);
      }
      
      console.log('📊 Form filling results:', results);
      return results;
      
    } catch (e) {
      console.log('❌ Error filling registration form:', e.message);
      return results;
    }
  }

  // Complete registration process
  async completeRegistration(formData) {
    console.log('🎯 Starting complete registration process...');
    
    // Fill the form
    const formResults = await this.fillRegistrationForm(formData);
    
    // Submit the form
    const submitResult = await this.clickRegister();
    
    return {
      formFilled: Object.values(formResults).every(result => result === true),
      submitted: submitResult,
      formResults: formResults
    };
  }

  // Get form validation status
  async getFormValidationStatus() {
    console.log('🔍 Checking form validation status...');
    
    const validationStatus = {
      hasErrors: false,
      errorMessages: [],
      isComplete: false
    };
    
    try {
      // Check for error messages
      const errorElements = await $$('//android.view.View[contains(@content-desc, "error") or contains(@text, "error")]');
      
      if (errorElements.length > 0) {
        validationStatus.hasErrors = true;
        for (let element of errorElements) {
          const errorText = await element.getAttribute('content-desc') || await element.getAttribute('text');
          if (errorText) {
            validationStatus.errorMessages.push(errorText);
          }
        }
      }
      
      // Check if all required fields are filled
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'address',
        'country', 'state', 'zipCode', 'ssn', 'residenceStatus',
        'password', 'confirmPassword'
      ];
      
      // This is a simplified check - in a real scenario you'd check each field's value
      validationStatus.isComplete = !validationStatus.hasErrors;
      
    } catch (e) {
      console.log('❌ Error checking validation status:', e.message);
    }
    
    return validationStatus;
  }

  // Get available fields on the page
  async getAvailableFields() {
    console.log('🔍 Getting available fields...');
    
    const fields = [];
    
    try {
      // Get all EditText elements
      const editTexts = await $$('android.widget.EditText');
      
      for (let i = 0; i < editTexts.length; i++) {
        try {
          const hint = await editTexts[i].getAttribute('hint');
          const text = await editTexts[i].getAttribute('text');
          const bounds = await editTexts[i].getAttribute('bounds');
          
          fields.push({
            index: i,
            hint: hint,
            text: text,
            bounds: bounds,
            type: 'input'
          });
        } catch (e) {
          // Skip elements that can't be read
        }
      }
      
      // Get all dropdown elements
      const dropdowns = await $$('//android.view.View[contains(@content-desc, "Select ")]');
      
      for (let i = 0; i < dropdowns.length; i++) {
        try {
          const contentDesc = await dropdowns[i].getAttribute('content-desc');
          const bounds = await dropdowns[i].getAttribute('bounds');
          
          fields.push({
            index: i,
            contentDesc: contentDesc,
            bounds: bounds,
            type: 'dropdown'
          });
        } catch (e) {
          // Skip elements that can't be read
        }
      }
      
    } catch (e) {
      console.log('❌ Error getting available fields:', e.message);
    }
    
    return fields;
  }

  // Open registration page
  async open() {
    await driver.startActivity(
      'com.anytimeshift.employee',
      'com.anytimeshift.employee.activities.RegistrationActivity'
    );
    await this.waitForRegistrationPage();
  }

  // Wait for registration page to load
  async waitForRegistrationPage() {
    const registrationTitle = await $('//*[@content-desc="Registration"]');
    await registrationTitle.waitForExist({ timeout: 10000 });
  }

  // Fill zip code field
  async fillZipCode(zipCode) {
    console.log(`📮 Filling Zip Code: ${zipCode}`);
    try {
      const zipCodeField = await $('//android.widget.EditText[@hint="e.g. 000000"]');
      await zipCodeField.click();
      await driver.pause(500);
      await zipCodeField.clearValue();
      await driver.pause(500);
      await zipCodeField.setValue(zipCode);
      await driver.pause(1000);
      console.log('✅ Zip Code filled successfully');
      return true;
    } catch (error) {
      console.log('❌ Error filling Zip Code:', error.message);
      return false;
    }
  }

  // Fill SSN field
  async fillSSN(ssn) {
    console.log(`🆔 Filling SS#/TIN#: ${ssn}`);
    try {
      const ssnField = await $('//android.widget.EditText[@hint="e.g. 000-00-0000"]');
      await ssnField.click();
      await driver.pause(500);
      await ssnField.clearValue();
      await driver.pause(500);
      await ssnField.setValue(ssn);
      await driver.pause(1000);
      console.log('✅ SS#/TIN# filled successfully');
      return true;
    } catch (error) {
      console.log('❌ Error filling SS#/TIN#:', error.message);
      return false;
    }
  }

  // Select residence status from dropdown
  async selectResidenceStatus(status) {
    console.log(`🏠 Selecting Residence Status: ${status}`);
    try {
      const residenceDropdown = await $('//*[@content-desc="Select Residence Status"]');
      await residenceDropdown.click();
      await driver.pause(2000);
      
      // Select the status (adjust selector as needed)
      const statusOption = await $(`//*[@text="${status}"]`);
      if (statusOption) {
        await statusOption.click();
        console.log(`✅ Selected Residence Status: ${status}`);
        return true;
      } else {
        // Try to select first available option
        const firstOption = await $('//android.view.View[@clickable="true"]');
        if (firstOption) {
          await firstOption.click();
          console.log('✅ Selected first available Residence Status');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log('❌ Error selecting Residence Status:', error.message);
      return false;
    }
  }

  // Fill password field
  async fillPassword(password) {
    console.log(`🔐 Filling Password: ${password}`);
    try {
      const passwordField = await $('//android.widget.EditText[@hint="********"][1]');
      await passwordField.click();
      await driver.pause(500);
      await passwordField.clearValue();
      await driver.pause(500);
      await passwordField.setValue(password);
      await driver.pause(1000);
      console.log('✅ Password filled successfully');
      return true;
    } catch (error) {
      console.log('❌ Error filling Password:', error.message);
      return false;
    }
  }

  // Fill confirm password field
  async fillConfirmPassword(password) {
    console.log(`🔐 Filling Confirm Password: ${password}`);
    try {
      const confirmPasswordField = await $('//android.widget.EditText[@hint="********"][2]');
      await confirmPasswordField.click();
      await driver.pause(500);
      await confirmPasswordField.clearValue();
      await driver.pause(500);
      await confirmPasswordField.setValue(password);
      await driver.pause(1000);
      console.log('✅ Confirm Password filled successfully');
      return true;
    } catch (error) {
      console.log('❌ Error filling Confirm Password:', error.message);
      return false;
    }
  }

  // Click register button
  async clickRegisterButton() {
    console.log('📝 Clicking Register button...');
    try {
      const registerButton = await $('//*[@content-desc="Register"]');
      await registerButton.click();
      console.log('✅ Register button clicked successfully');
      return true;
    } catch (error) {
      console.log('❌ Error clicking Register button:', error.message);
      return false;
    }
  }

  // Get success message (adjust as per your app)
  async getSuccessMessage() {
    return await $('//*[contains(@text, "success") or contains(@content-desc, "success")]');
  }
}

module.exports = new RegistrationPage(); 