describe('SSN/TIN Field Validation', () => {
  let ssnField;
  before(async () => {
    await driver.pause(2000);
    await driver.performActions([{type:'pointer',id:'finger1',parameters:{pointerType:'touch'},actions:[{type:'pointerMove',duration:0,x:540,y:1800},{type:'pointerDown',button:0},{type:'pause',duration:100},{type:'pointerMove',duration:1000,x:540,y:600},{type:'pointerUp',button:0}]}]);
    await driver.releaseActions();
    await driver.pause(1000);
    ssnField = await $('//android.view.View[@content-desc="SS#/TIN# *"]/following-sibling::android.widget.EditText[1]');
  });

  it('should be editable', async () => {
    await ssnField.click();
    await ssnField.setValue('111-22-3333');
    const val = await ssnField.getValue();
    expect(val).toBe('111-22-3333');
  });

  it('should accept valid TIN', async () => {
    await ssnField.clearValue();
    await ssnField.setValue('12-3456789');
    const val = await ssnField.getValue();
    expect(val).toBe('12-3456789');
  });

  it('should show error for invalid SSN/TIN', async () => {
    await ssnField.clearValue();
    await ssnField.setValue('abc');
    await driver.pause(500);
    let errorFound = false;
    try {
      const error = await $('//android.view.View[contains(@content-desc, "ssn") or contains(@content-desc, "tin") or contains(@content-desc, "invalid") or contains(@content-desc, "error")]');
      errorFound = await error.isDisplayed();
    } catch {}
    expect(errorFound).toBe(true);
  });
}); 