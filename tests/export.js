
const { expect } = require('@playwright/test'); //как работает JSon коммент блок

/**
 * Logs in to the SauceDemo site with standard_user credentials.
 * @param {import('@playwright/test').Page} page - The Playwright Page object.
 */
async function login(page) {
  await page.goto('https://saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
}

module.exports = { login };