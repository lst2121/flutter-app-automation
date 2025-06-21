describe('Zip Code Field Validation', () => {
  let zipField;
  before(async () => {
    await driver.pause(2000);
    await driver.performActions([{type:'pointer',id:'finger1',parameters:{pointerType:'touch'},actions:[{type:'pointerMove',duration:0,x:540,y:1800},{type:'pointerDown',button:0},{type:'pause',duration:100},{type:'pointerMove',duration:1000,x:540,y:600},{type:'pointerUp',button:0}]}]);
    await driver.releaseActions();
    await driver.pause(1000);
    zipField = await $('//android.view.View[@content-desc="Zip Code *"]/following-sibling::android.widget.EditText[1]');
  });

  it('should be editable', async () => {
    await zipField.click();
    await zipField.setValue('99999');
    const val = await zipField.getValue();
    expect(val).toBe('99999');
  });

  it('should accept valid zip code', async () => {
    await zipField.clearValue();
    await zipField.setValue('12345-6789');
    const val = await zipField.getValue();
    expect(val).toBe('12345-6789');
  });

  it('should show error for invalid zip', async () => {
    await zipField.clearValue();
    await zipField.setValue('abc');
    await driver.pause(500);
    let errorFound = false;
    try {
      const error = await $('//android.view.View[contains(@content-desc, "zip") or contains(@content-desc, "invalid") or contains(@content-desc, "error")]');
      errorFound = await error.isDisplayed();
    } catch {}
    expect(errorFound).toBe(true);
  });
}); 