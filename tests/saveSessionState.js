
const { chromium } = require('playwright'); // Import Playwright

(async () => {
    // Launch a new browser instance - зачем? 
    const browser = await chromium.launch();
    const context = await browser.newContext(); //что такое контекст подробнее
    const page = await context.newPage();

    await page.goto('https://saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');

    const storageState = await context.storageState(); 
    require('fs').writeFileSync('storageState.json', JSON.stringify(storageState)); // Write to file - понять что тут происходит

    console.log('Session state saved to storageState.json');

})();