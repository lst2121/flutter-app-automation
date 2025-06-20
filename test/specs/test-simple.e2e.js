const { expect } = require('@wdio/globals');

describe('Simple Registration Form Test', () => {
  it('should fill and submit the registration form', async () => {
    // Wait for registration screen
    const registrationScreen = await $('~Registration');
    await expect(registrationScreen).toBeDisplayed();
    console.log('✅ Registration page loaded');

    // Fill First Name
    const firstNameField = await $('//android.widget.EditText[@hint="e.g. John"]');
    await firstNameField.clearValue();
    await firstNameField.setValue('John');

    // Fill Last Name
    const lastNameField = await $('//android.widget.EditText[@hint="e.g. Doe"]');
    await lastNameField.clearValue();
    await lastNameField.setValue('Doe');

    // Fill Email
    const emailField = await $('//android.widget.EditText[@hint="e.g. johndoe@mail.com"]');
    await emailField.clearValue();
    await emailField.setValue('john.doe@example.com');

    // Fill Phone
    const phoneField = await $('//android.widget.EditText[@hint="+1 \n9876543210"]');
    await phoneField.clearValue();
    await phoneField.setValue('9876543210');

    // Fill Street Address
    const addressField = await $('//android.widget.EditText[@hint="Street Address"]');
    await addressField.clearValue();
    await addressField.setValue('123 Elm Street');

    // ✅ Scroll down using W3C-compliant touch gesture
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: 500, y: 1600 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', duration: 1000, x: 500, y: 400 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    console.log(await driver.getPageSource());
    await driver.pause(2000); // wait after scroll
    const residenceStatus = await $('android=new UiSelector().text("Residence Status")');
    await residenceStatus.click();

    const residenceOption = await $('android=new UiSelector().text("Own")');
    await residenceOption.click();
    console.log(await driver.getPageSource());

    // Continue filling other fields as needed...

    // Scroll again if needed and click Register
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: 500, y: 1600 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 200 },
        { type: 'pointerMove', duration: 1000, x: 500, y: 400 },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    await driver.pause(1000);

    const registerButton = await $('~Register');
    await registerButton.click();

    // Add assertions if confirmation screen or toast appears
    console.log('✅ Form submitted');
  });
});
