//import { login } from './export.js';
const { test, expect } = require('@playwright/test');

let URLVerificators = {
  0 : 'https://www.saucedemo.com/inventory.html',
  1 : 'https://saucelabs.com/',
  2 : 'https://www.saucedemo.com/',
};



test.describe('Inventory interactions tests', () => {

    test.beforeEach(async ({ page }) => {
      
        //login with standard_user credentials
        await page.goto('https://saucedemo.com/');
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(URLVerificators[0]);
      })

    test('Open Sidebar Menu and test buttons', async ({ page }) => {
      
      // Click the menu button
      const sidebarMenu = page.locator('#react-burger-menu-btn'); // # - это для ID
      const menuItems = page.locator('[data-test$="sidebar-link"]'); //CSS ^= - для выбора элемента, начинающегося с заданного текста; $= - для элемента, который заканчивается на него же

      await sidebarMenu.click();  
      
      // Verify menu items
      await expect(page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible(); 
      await expect(page.locator('[data-test="about-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
      await expect(page.locator('[data-test="reset-sidebar-link"]')).toBeVisible();

      // click all menu buttons in order and compare their URLs 
      
      for ( let i = 0; i < 4; i++) {
        //if menu closed reopen it
        if (!await sidebarMenu.isVisible()) {

          await sidebarMenu.click();

        }
        
        //click i button
        await menuItems.nth(i).click();

        if (i === 1 && 2) {

          // Check if URL is correct 
          await expect(page).toHaveURL(URLVerificators[i]);
          // relogin
          await page.locator('[data-test="username"]').fill('standard_user');
          await page.locator('[data-test="password"]').fill('secret_sauce');
          await page.locator('[data-test="login-button"]').click();
          await page.waitForNavigation(); 

        } else { //reset page case
            const badgeLocator = page.locator('.shopping_cart_badge');
            await page.locator('.btn_inventory').nth(2).click();
            await expect(badgeLocator).toHaveText('1');
            await sidebarMenu.click();
            await menuItems.nth(i).click();
            await expect(badgeLocator).toHaveText('0');
          } 
        }

    });

  
    test('Add to Cart Buttons', async ({ page }) => {
      // Ensure there are 6 products
      await expect(page.locator('.inventory_item')).toHaveCount(6);
  
      // Add each product to the cart
      const addToCartButtons = page.locator('.btn_inventory');

        await addToCartButtons.nth(0).click();
        await addToCartButtons.nth(1).click();
        await addToCartButtons.nth(2).click();
        await addToCartButtons.nth(3).click();
        await addToCartButtons.nth(4).click();
        await addToCartButtons.nth(5).click();
  
      // Verify that the cart contains 6 items
      const badgeLocator = page.locator('.shopping_cart_badge');
      await expect(badgeLocator).toHaveText('6');
    });
    
  test.describe('Sorting menu interaction tests', () => {

    test('A to Z', async ({ page }) => {

      await page.locator('[data-test="product-sort-container"]').selectOption({ value: 'az' });
  
      const names = await page.locator('.inventory_item_name').allTextContents();
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);

    });
  
    test('Z to A', async ({ page }) => {

      await page.locator('[data-test="product-sort-container"]').selectOption({ value: 'za' });
  
      const names = await page.locator('.inventory_item_name').allTextContents();
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);

    });

    test('Sort by Price (Low to High)', async ({ page }) => {

      await page.locator('[data-test="product-sort-container"]').selectOption({ value: 'lohi' });
  
      const prices = await page.locator('.inventory_item_price').allTextContents();
      const sortedPrices = [...prices].sort((a, b) => parseFloat(a.substring(1)) - parseFloat(b.substring(1))); //копирую - сортирую(убрать знак доллара сабстрингом - перевожу в число - сортирую)
      expect(prices).toEqual(sortedPrices);

    });
  
    test('Sort by Price (High to Low)', async ({ page }) => {
      await page.locator('[data-test="product-sort-container"]').selectOption({ value: 'hilo' });
  
      const prices = await page.locator('.inventory_item_price').allTextContents();
      const sortedPrices = [...prices].sort((a, b) => parseFloat(b.substring(1)) - parseFloat(a.substring(1)));
      expect(prices).toEqual(sortedPrices);
    });
  })
  });