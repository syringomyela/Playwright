// @ts-check
const { test, expect } = require('@playwright/test');

const login = async (page, username, password) => {
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
}
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
});

//check essential elements to be presented on the page
test.describe('Verify page content and try different login options (both correct and not)', () => {
  
  test('Check elements existence on the page', async ({ page }) => {
  await expect(page.locator('[data-test="username"]')).toBeVisible();
  await expect(page.locator('[data-test="password"]')).toBeVisible();
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).not.toBeVisible(); 
});

//Perform correct login, ./inventory page loaded correctly 
test('use login standart_user', async ({ page }) => {

  await login(page, 'standard_user', 'secret_sauce');
  expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
  await logout(page);
  await expect(page.url()).toBe('https://www.saucedemo.com/'); 
});


//Perform correct login, user been locked, error window appeared
test('Use login locked_out_user', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});

//Perform correct login, ./inventory page loaded incorrectly, wrong images
test('Use login problem_user', async ({ page }) => {
  await login(page, 'problem_user', 'secret_sauce');
  expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  await logout(page);
  await expect(page.url()).toBe('https://www.saucedemo.com/'); 
});

//Perform correct login, slow page loading >>>5000ms, ./inventory page loaded correctly 
test('Use login performance_glitch_user', async ({ page }) => {
  await login(page, 'performance_glitch_user', 'secret_sauce');
  expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  await logout(page); 
  await expect(page.url()).toBe('https://www.saucedemo.com/');
});

//???????????
test('Login error_user', async ({ page }) => {
  await login(page, 'error_user', 'secret_sauce');
  expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  await logout(page); 
  await expect(page.url()).toBe('https://www.saucedemo.com/');
});

// Perform correct login, ./inventory page loaded correctly, incorrect elements on ./inventory page  
test('Use login visual_user', async ({ page }) => {
  await login(page, 'visual_user', 'secret_sauce');
  expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  await logout(page); 
  await expect(page.url()).toBe('https://www.saucedemo.com/');
});

// Perform invalid credentials
test('should show error messages on invalid inputs', async ({ page }) => { //надо попробовать с объектами или массивом объектов

  const incorrectLogins = [
    {username : 'invalid', password : 'invalid', error : 'Epic sadface: Username and password do not match any user in this service'},
    {username : '', password: 'secret_sauce', error : 'Epic sadface: Username is required'}, 
    {username : 'standard_user', password : '', error : 'Epic sadface: Password is required'}, 
    {username : '', password : '', error : 'Epic sadface: Username is required'},
  ]
  for (const {username, password, error} of incorrectLogins){
    await login(page, username, password);
    await expect(page.locator('[data-test="error"]')).toHaveText(error);
  }
});
});