const BasePage = require('./BasePage');

class LanguageSelectionPage extends BasePage {
  constructor() {
    super();
    
    // Page selectors
    this.selectors = {
      pageTitle: '~Select Language',
      englishOption: '~English',
      spanishOption: '~Spanish',
      frenchOption: '~French',
      confirmButton: '//android.widget.Button[@enabled="true"]',
      // Alternative selectors for robustness
      pageTitleAlt: '//android.view.View[contains(@content-desc, "Select Language")]',
      englishOptionAlt: '//android.view.View[contains(@content-desc, "English")]',
      confirmButtonAlt: '//android.widget.Button[contains(@text, "✓") or contains(@text, "✓")]'
    };
  }

  // Wait for language selection page to load
  async waitForPage() {
    console.log('⏳ Waiting for language selection page...');
    return await this.waitForElementMultiple([
      this.selectors.pageTitle,
      this.selectors.pageTitleAlt
    ]);
  }

  // Check if page is displayed
  async isPageDisplayed() {
    try {
      const title = await this.waitForElement(this.selectors.pageTitle, 5000);
      return title !== null;
    } catch (e) {
      return false;
    }
  }

  // Select English language
  async selectEnglish() {
    console.log('🌍 Selecting English language...');
    
    const englishElement = await this.waitForElementMultiple([
      this.selectors.englishOption,
      this.selectors.englishOptionAlt
    ]);
    
    if (englishElement) {
      await englishElement.click();
      console.log('✅ English language selected');
      return true;
    } else {
      console.log('❌ English language option not found');
      return false;
    }
  }

  // Select Spanish language
  async selectSpanish() {
    console.log('🌍 Selecting Spanish language...');
    
    const spanishElement = await this.waitForElement(this.selectors.spanishOption);
    
    if (spanishElement) {
      await spanishElement.click();
      console.log('✅ Spanish language selected');
      return true;
    } else {
      console.log('❌ Spanish language option not found');
      return false;
    }
  }

  // Select French language
  async selectFrench() {
    console.log('🌍 Selecting French language...');
    
    const frenchElement = await this.waitForElement(this.selectors.frenchOption);
    
    if (frenchElement) {
      await frenchElement.click();
      console.log('✅ French language selected');
      return true;
    } else {
      console.log('❌ French language option not found');
      return false;
    }
  }

  // Confirm language selection
  async confirmSelection() {
    console.log('✅ Confirming language selection...');
    
    const confirmButton = await this.waitForElementMultiple([
      this.selectors.confirmButton,
      this.selectors.confirmButtonAlt
    ]);
    
    if (confirmButton && await confirmButton.isEnabled()) {
      await confirmButton.click();
      console.log('✅ Language selection confirmed');
      await driver.pause(3000); // Wait for navigation
      return true;
    } else {
      console.log('❌ Confirm button not available or not enabled');
      return false;
    }
  }

  // Complete language selection flow (English by default)
  async completeLanguageSelection(language = 'English') {
    console.log(`🌍 Completing language selection for: ${language}`);
    
    // Wait for page to load
    const pageLoaded = await this.waitForPage();
    if (!pageLoaded) {
      console.log('❌ Language selection page not loaded');
      return false;
    }

    // Select language based on parameter
    let languageSelected = false;
    switch (language.toLowerCase()) {
      case 'english':
        languageSelected = await this.selectEnglish();
        break;
      case 'spanish':
        languageSelected = await this.selectSpanish();
        break;
      case 'french':
        languageSelected = await this.selectFrench();
        break;
      default:
        console.log(`⚠️ Unknown language: ${language}, defaulting to English`);
        languageSelected = await this.selectEnglish();
    }

    if (!languageSelected) {
      return false;
    }

    // Confirm selection
    const confirmed = await this.confirmSelection();
    if (confirmed) {
      console.log('🎉 Language selection completed successfully');
      return true;
    } else {
      console.log('❌ Language selection confirmation failed');
      return false;
    }
  }

  // Get available languages
  async getAvailableLanguages() {
    const languages = [];
    
    try {
      const english = await this.waitForElement(this.selectors.englishOption, 2000);
      if (english) languages.push('English');
      
      const spanish = await this.waitForElement(this.selectors.spanishOption, 2000);
      if (spanish) languages.push('Spanish');
      
      const french = await this.waitForElement(this.selectors.frenchOption, 2000);
      if (french) languages.push('French');
      
      console.log(`📋 Available languages: ${languages.join(', ')}`);
    } catch (e) {
      console.log('⚠️ Error getting available languages:', e.message);
    }
    
    return languages;
  }
}

module.exports = LanguageSelectionPage; 