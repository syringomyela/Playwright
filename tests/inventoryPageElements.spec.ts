const { test, expect } = require('@playwright/test');
//const { login } = require('./export.js')
const expectedProductNames = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)'
];

const expectedProductDescriptions = [
  'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
  `A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.`,
  'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.',
  `It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.`,
  `Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.`,
  'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.'
];

const expectedProductImageUrls = [
  'https://www.saucedemo.com/static/media/sauce-backpack-1200x1500.0a0b85a3.jpg',
  'https://www.saucedemo.com/static/media/bike-light-1200x1500.37c843b0.jpg',
  'https://www.saucedemo.com/static/media/bolt-shirt-1200x1500.c2599ac5.jpg',
  'https://www.saucedemo.com/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg',
  'https://www.saucedemo.com/static/media/red-onesie-1200x1500.2ec615b2.jpg',
  'https://www.saucedemo.com/static/media/red-tatt-1200x1500.30dadef4.jpg'
];



test.describe('Testing item`s content: name, text and image', () => {

    test.beforeEach(async ({ page }) => {
      
      //login with standard_user credentials
      await page.goto('https://saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');

    })

    test('Examine products name', async ({ page }) => {

        //checking number of items 
      await expect(page.locator('.inventory_item')).toHaveCount(6);
      await expect(page.locator('.title')).toHaveText('Products');

        // Extract all product names
      const productNames = await page.locator('.inventory_item_name').allTextContents();

        //Compare if given names correct
      expect(productNames).toHaveLength(expectedProductNames.length);
      expect(productNames).toEqual(expectedProductNames);
    })


    test('Examine products description', async ({ page }) => {

      const productDescriptions = await page.locator('.inventory_item_desc').allTextContents();
      

      // Verify the length and content of product descriptions
      expect(productDescriptions).toHaveLength(expectedProductDescriptions.length);
      expect(productDescriptions).toEqual(expectedProductDescriptions);
    })

    
    test('Examine products images', async ({ page }) => {

        await page.goto('https://saucedemo.com/');
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');

        await page.waitForSelector('.inventory_item_img img');

        // Extract product image URLs
        const productImages = await page.locator('.inventory_item_img img').evaluateAll(images => images.map(img => img.src));
        // Verify the length and content of image URLs
        expect(productImages).toHaveLength(expectedProductImageUrls.length);
        expect(productImages).toEqual(expectedProductImageUrls);
    });

})