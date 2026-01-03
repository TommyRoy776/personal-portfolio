import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MING WAI TOMMY CHAN/);
})

test('professional experience visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-job-experience')).toBeVisible();
    await expect(page.getByRole('heading',{name:'Professional Experience'})).toBeVisible();
})

test('About me visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-about-me')).toBeVisible();
    await expect(page.getByRole('heading',{name:'About Me'})).toBeVisible();
    await expect(page.getByRole('img',{name:'FlushingTech'})).toBeVisible();
})