const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor() {
    super();
    
    // Page selectors
    this.selectors = {
      pageTitle: '~Login',
      emailField: '//android.widget.EditText[@hint="Email"]',
      passwordField: '//android.widget.EditText[@hint="Password"]',
      loginButton: '~Login',
      signUpButton: '~Sign Up',
      forgotPasswordButton: '~Forgot Password?',
      // Alternative selectors for robustness
      pageTitleAlt: '//android.view.View[contains(@content-desc, "Login")]',
      emailFieldAlt: '//android.widget.EditText[@hint="Enter your email"]',
      passwordFieldAlt: '//android.widget.EditText[@hint="Enter your password"]',
      loginButtonAlt: '//android.widget.Button[contains(@text, "Login")]',
      signUpButtonAlt: '//android.view.View[contains(@content-desc, "Sign Up")]'
    };
  }

  // Wait for login page to load
  async waitForPage() {
    console.log('⏳ Waiting for login page...');
    return await this.waitForElementMultiple([
      this.selectors.pageTitle,
      this.selectors.pageTitleAlt,
      this.selectors.signUpButton,
      this.selectors.signUpButtonAlt
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

  // Fill email field
  async fillEmail(email) {
    console.log(`📧 Filling email: ${email}`);
    
    const emailField = await this.waitForElementMultiple([
      this.selectors.emailField,
      this.selectors.emailFieldAlt
    ]);
    
    if (emailField) {
      try {
        await emailField.click();
        await driver.pause(500);
        await emailField.clearValue();
        await driver.pause(500);
        await emailField.setValue(email);
        await driver.pause(1000);
        console.log('✅ Email filled successfully');
        return true;
      } catch (e) {
        console.log('❌ Error filling email:', e.message);
        return false;
      }
    } else {
      console.log('❌ Email field not found');
      return false;
    }
  }

  // Fill password field
  async fillPassword(password) {
    console.log(`🔒 Filling password...`);
    
    const passwordField = await this.waitForElementMultiple([
      this.selectors.passwordField,
      this.selectors.passwordFieldAlt
    ]);
    
    if (passwordField) {
      try {
        await passwordField.click();
        await driver.pause(500);
        await passwordField.clearValue();
        await driver.pause(500);
        await passwordField.setValue(password);
        await driver.pause(1000);
        console.log('✅ Password filled successfully');
        return true;
      } catch (e) {
        console.log('❌ Error filling password:', e.message);
        return false;
      }
    } else {
      console.log('❌ Password field not found');
      return false;
    }
  }

  // Click login button
  async clickLogin() {
    console.log('🔑 Clicking login button...');
    
    const loginButton = await this.waitForElementMultiple([
      this.selectors.loginButton,
      this.selectors.loginButtonAlt
    ]);
    
    if (loginButton) {
      try {
        await loginButton.click();
        console.log('✅ Login button clicked');
        await driver.pause(3000); // Wait for navigation
        return true;
      } catch (e) {
        console.log('❌ Error clicking login button:', e.message);
        return false;
      }
    } else {
      console.log('❌ Login button not found');
      return false;
    }
  }

  // Click sign up button
  async clickSignUp() {
    console.log('📝 Clicking sign up button...');
    
    const signUpButton = await this.waitForElementMultiple([
      this.selectors.signUpButton,
      this.selectors.signUpButtonAlt
    ]);
    
    if (signUpButton) {
      try {
        await signUpButton.click();
        console.log('✅ Sign up button clicked');
        await driver.pause(3000); // Wait for navigation
        return true;
      } catch (e) {
        console.log('❌ Error clicking sign up button:', e.message);
        return false;
      }
    } else {
      console.log('❌ Sign up button not found');
      return false;
    }
  }

  // Click forgot password
  async clickForgotPassword() {
    console.log('🔑 Clicking forgot password...');
    
    const forgotPasswordButton = await this.waitForElement(this.selectors.forgotPasswordButton);
    
    if (forgotPasswordButton) {
      try {
        await forgotPasswordButton.click();
        console.log('✅ Forgot password clicked');
        await driver.pause(2000);
        return true;
      } catch (e) {
        console.log('❌ Error clicking forgot password:', e.message);
        return false;
      }
    } else {
      console.log('❌ Forgot password button not found');
      return false;
    }
  }

  // Complete login flow
  async login(email, password) {
    console.log('🔐 Completing login flow...');
    
    // Wait for page to load
    const pageLoaded = await this.waitForPage();
    if (!pageLoaded) {
      console.log('❌ Login page not loaded');
      return false;
    }

    // Fill credentials
    const emailFilled = await this.fillEmail(email);
    if (!emailFilled) {
      return false;
    }

    const passwordFilled = await this.fillPassword(password);
    if (!passwordFilled) {
      return false;
    }

    // Click login
    const loginClicked = await this.clickLogin();
    if (loginClicked) {
      console.log('🎉 Login completed successfully');
      return true;
    } else {
      console.log('❌ Login failed');
      return false;
    }
  }

  // Navigate to sign up page
  async navigateToSignUp() {
    console.log('📝 Navigating to sign up page...');
    
    // Wait for page to load
    const pageLoaded = await this.waitForPage();
    if (!pageLoaded) {
      console.log('❌ Login page not loaded');
      return false;
    }

    // Click sign up
    const signUpClicked = await this.clickSignUp();
    if (signUpClicked) {
      console.log('🎉 Successfully navigated to sign up page');
      return true;
    } else {
      console.log('❌ Failed to navigate to sign up page');
      return false;
    }
  }

  // Get page elements for verification
  async getPageElements() {
    const elements = {};
    
    try {
      elements.emailField = await this.waitForElement(this.selectors.emailField, 2000);
      elements.passwordField = await this.waitForElement(this.selectors.passwordField, 2000);
      elements.loginButton = await this.waitForElement(this.selectors.loginButton, 2000);
      elements.signUpButton = await this.waitForElement(this.selectors.signUpButton, 2000);
      
      console.log('📋 Login page elements found:', Object.keys(elements).filter(key => elements[key]).length);
    } catch (e) {
      console.log('⚠️ Error getting page elements:', e.message);
    }
    
    return elements;
  }
}

module.exports = LoginPage; 