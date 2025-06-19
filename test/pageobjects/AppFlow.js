const LanguageSelectionPage = require('./LanguageSelectionPage');
const LoginPage = require('./LoginPage');
const RegistrationPage = require('./RegistrationPage');

class AppFlow {
  constructor() {
    this.languagePage = new LanguageSelectionPage();
    this.loginPage = new LoginPage();
    this.registrationPage = new RegistrationPage();
  }

  // Complete app onboarding flow
  async completeOnboarding(language = 'English') {
    console.log('🚀 Starting app onboarding flow...');
    
    try {
      // Step 1: Language Selection
      console.log('\n🌍 Step 1: Language Selection');
      const languageSelected = await this.languagePage.completeLanguageSelection(language);
      if (!languageSelected) {
        console.log('❌ Language selection failed');
        return { success: false, step: 'language_selection' };
      }

      // Step 2: Wait for login page
      console.log('\n🔐 Step 2: Login Page');
      await driver.pause(3000); // Wait for navigation
      
      const loginPageLoaded = await this.loginPage.waitForPage();
      if (!loginPageLoaded) {
        console.log('❌ Login page not loaded');
        return { success: false, step: 'login_page_load' };
      }

      console.log('✅ Onboarding completed successfully');
      return { success: true, step: 'completed' };
      
    } catch (e) {
      console.log('❌ Onboarding flow failed:', e.message);
      return { success: false, step: 'error', error: e.message };
    }
  }

  // Complete registration flow
  async completeRegistration(formData) {
    console.log('📝 Starting registration flow...');
    
    try {
      // Step 1: Complete onboarding first
      const onboardingResult = await this.completeOnboarding();
      if (!onboardingResult.success) {
        return onboardingResult;
      }

      // Step 2: Navigate to sign up
      console.log('\n📝 Step 2: Navigate to Sign Up');
      const signUpNavigated = await this.loginPage.navigateToSignUp();
      if (!signUpNavigated) {
        console.log('❌ Failed to navigate to sign up');
        return { success: false, step: 'signup_navigation' };
      }

      // Step 3: Complete registration
      console.log('\n📋 Step 3: Complete Registration');
      const registrationResult = await this.registrationPage.completeRegistration(formData);
      
      if (registrationResult.success) {
        console.log('🎉 Registration flow completed successfully');
        return { 
          success: true, 
          step: 'completed',
          formResults: registrationResult.formResults,
          registerClicked: registrationResult.registerClicked
        };
      } else {
        console.log('⚠️ Registration completed with issues');
        return { 
          success: false, 
          step: 'registration_partial',
          formResults: registrationResult.formResults,
          registerClicked: registrationResult.registerClicked
        };
      }
      
    } catch (e) {
      console.log('❌ Registration flow failed:', e.message);
      return { success: false, step: 'error', error: e.message };
    }
  }

  // Complete login flow
  async completeLogin(email, password) {
    console.log('🔐 Starting login flow...');
    
    try {
      // Step 1: Complete onboarding first
      const onboardingResult = await this.completeOnboarding();
      if (!onboardingResult.success) {
        return onboardingResult;
      }

      // Step 2: Complete login
      console.log('\n🔐 Step 2: Complete Login');
      const loginResult = await this.loginPage.login(email, password);
      
      if (loginResult) {
        console.log('🎉 Login flow completed successfully');
        return { success: true, step: 'completed' };
      } else {
        console.log('❌ Login failed');
        return { success: false, step: 'login_failed' };
      }
      
    } catch (e) {
      console.log('❌ Login flow failed:', e.message);
      return { success: false, step: 'error', error: e.message };
    }
  }

  // Test language selection only
  async testLanguageSelection(language = 'English') {
    console.log(`🌍 Testing language selection: ${language}`);
    
    try {
      const result = await this.languagePage.completeLanguageSelection(language);
      
      if (result) {
        console.log('✅ Language selection test passed');
        return { success: true, language };
      } else {
        console.log('❌ Language selection test failed');
        return { success: false, language };
      }
      
    } catch (e) {
      console.log('❌ Language selection test error:', e.message);
      return { success: false, language, error: e.message };
    }
  }

  // Test registration form only
  async testRegistrationForm(formData) {
    console.log('📋 Testing registration form...');
    
    try {
      // Navigate to registration page first
      const onboardingResult = await this.completeOnboarding();
      if (!onboardingResult.success) {
        return onboardingResult;
      }

      const signUpNavigated = await this.loginPage.navigateToSignUp();
      if (!signUpNavigated) {
        return { success: false, step: 'signup_navigation' };
      }

      // Test form filling
      const formResults = await this.registrationPage.fillRegistrationForm(formData);
      
      console.log(`📊 Registration form test results: ${formResults.successRate.toFixed(1)}% success`);
      
      return {
        success: formResults.successRate >= 70,
        formResults,
        successRate: formResults.successRate
      };
      
    } catch (e) {
      console.log('❌ Registration form test error:', e.message);
      return { success: false, error: e.message };
    }
  }

  // Test scrolling functionality
  async testScrolling() {
    console.log('📜 Testing scrolling functionality...');
    
    try {
      // Navigate to registration page
      const onboardingResult = await this.completeOnboarding();
      if (!onboardingResult.success) {
        return onboardingResult;
      }

      const signUpNavigated = await this.loginPage.navigateToSignUp();
      if (!signUpNavigated) {
        return { success: false, step: 'signup_navigation' };
      }

      // Test scrolling to find register button
      const registerButton = await this.registrationPage.findRegisterButton();
      
      if (registerButton) {
        console.log('✅ Scrolling test passed - register button found');
        return { success: true, registerButtonFound: true };
      } else {
        console.log('⚠️ Scrolling test partial - register button not found');
        return { success: false, registerButtonFound: false };
      }
      
    } catch (e) {
      console.log('❌ Scrolling test error:', e.message);
      return { success: false, error: e.message };
    }
  }

  // Get app status and available pages
  async getAppStatus() {
    console.log('📊 Getting app status...');
    
    const status = {
      languagePage: false,
      loginPage: false,
      registrationPage: false,
      currentPage: 'unknown'
    };
    
    try {
      // Check which page is currently displayed
      if (await this.languagePage.isPageDisplayed()) {
        status.languagePage = true;
        status.currentPage = 'language_selection';
      } else if (await this.loginPage.isPageDisplayed()) {
        status.loginPage = true;
        status.currentPage = 'login';
      } else if (await this.registrationPage.isPageDisplayed()) {
        status.registrationPage = true;
        status.currentPage = 'registration';
      }
      
      console.log(`📍 Current page: ${status.currentPage}`);
      
    } catch (e) {
      console.log('⚠️ Error getting app status:', e.message);
    }
    
    return status;
  }

  // Generate test data for registration
  generateTestData() {
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '5551234567',
      address: '123 Main Street, City, State 12345',
      country: 'United States',
      state: 'California'
    };
    
    console.log('📋 Generated test data:', JSON.stringify(testData, null, 2));
    return testData;
  }

  // Generate multiple test data sets
  generateMultipleTestData(count = 3) {
    const testDataSets = [];
    
    for (let i = 1; i <= count; i++) {
      testDataSets.push({
        firstName: `User${i}`,
        lastName: `Test${i}`,
        email: `user${i}.test@example.com`,
        phone: `555${String(i).padStart(3, '0')}1234567`,
        address: `${i}23 Test Street, Test City, Test State ${String(i).padStart(5, '0')}`,
        country: 'United States',
        state: 'California'
      });
    }
    
    console.log(`📋 Generated ${count} test data sets`);
    return testDataSets;
  }
}

module.exports = AppFlow; 