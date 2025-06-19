const { expect } = require('@wdio/globals');

// Reusable: Take screenshot with timestamp
async function takeScreenshot(name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await driver.saveScreenshot(`./screenshots/${name}_${timestamp}.png`);
  console.log(`📸 Screenshot saved: ${name}_${timestamp}.png`);
}

// Reusable: W3C Touch Scrolling (center of screen)
async function scrollDownW3C() {
  console.log('📜 Attempting W3C touch scroll...');
  try {
    await driver.hideKeyboard().catch(() => {}); // prevent keyboard block
    await driver.pause(500);
    const { width, height } = await driver.getWindowSize();
    const startX = width / 2;
    const startY = height * 0.75;
    const endY = height * 0.25;

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
    await driver.pause(1500);
    console.log('✅ Scroll successful');
    return true;
  } catch (e) {
    console.log('❌ Scroll failed:', e.message);
    return false;
  }
}

// Reusable: Try to find Register button with multiple strategies
async function findRegisterButton() {
  const selectors = [
    '~Register',
    '//android.widget.Button[contains(@text, "Register")]',
    '//android.view.View[contains(@content-desc, "Register")]'
  ];
  for (let selector of selectors) {
    try {
      const el = await $(selector);
      if (await el.isDisplayed()) return el;
    } catch (_) {}
  }
  return null;
}

describe('Registration Page Scroll Test', () => {
  beforeEach(async () => {
    console.log('⏳ Waiting for app to load...');
    await driver.pause(5000);
  });

  it('should scroll to bottom and find Register button', async () => {
    console.log('=== STARTING REGISTRATION SCROLL TEST ===');

    // Step 1: Select Language
    console.log('\n➡️ Step 1: Language selection');
    for (let i = 0; i < 10; i++) {
      try {
        const langTitle = await $('~Select Language');
        if (await langTitle.isDisplayed()) {
          console.log('✅ Language screen visible');
          break;
        }
      } catch (_) {}
      await driver.pause(1000);
    }

    try {
      const english = await $('~English');
      await english.click();
      console.log('✅ English selected');
      const tick = await $('//android.widget.Button[@enabled="true"]');
      await tick.click();
      console.log('✅ Confirmed language');
      await driver.pause(3000);
    } catch (e) {
      console.log('❌ Failed selecting language:', e.message);
      return;
    }

    // Step 2: Click Sign Up on login page
    console.log('\n➡️ Step 2: Login > Sign Up');
    for (let i = 0; i < 10; i++) {
      try {
        const signUp = await $('~Sign Up');
        if (await signUp.isDisplayed()) {
          await signUp.click();
          console.log('✅ Sign Up clicked');
          await driver.pause(3000);
          break;
        }
      } catch (_) {
        await driver.pause(1000);
      }
    }

    // Step 3: Wait for registration page
    console.log('\n➡️ Step 3: Wait for Registration');
    for (let i = 0; i < 10; i++) {
      try {
        const regTitle = await $('~Registration');
        if (await regTitle.isDisplayed()) {
          console.log('✅ Registration screen ready');
          break;
        }
      } catch (_) {
        await driver.pause(1000);
      }
    }

    // Step 4: Scroll and detect register button
    console.log('\n➡️ Step 4: Scroll to find Register button');
    let found = false;

    for (let i = 0; i < 5; i++) {
      console.log(`\n🔄 Scroll Attempt ${i + 1}`);
      const registerBtn = await findRegisterButton();
      if (registerBtn) {
        console.log('✅ Register button found');
        await takeScreenshot(`register_button_found_attempt_${i + 1}`);
        found = true;
        break;
      }

      // Scroll down
      await takeScreenshot(`before_scroll_${i + 1}`);
      const scrolled = await scrollDownW3C();
      if (!scrolled) break;
      await takeScreenshot(`after_scroll_${i + 1}`);
    }

    // Final fallback check
    if (!found) {
      const finalTry = await findRegisterButton();
      if (finalTry) {
        console.log('✅ Register button found in final fallback');
        await takeScreenshot('register_button_found_final');
        found = true;
      } else {
        console.log('❌ Could not find Register button after scrolling');
        await takeScreenshot('register_button_not_found');
      }
    }

    console.log('\n=== REGISTRATION SCROLL TEST COMPLETED ===');
    if (found) {
      console.log('🎉 SUCCESS: Register button visible after scrolling');
    } else {
      console.log('⚠️ FAILED: Register button not found');
    }
  });
}); 