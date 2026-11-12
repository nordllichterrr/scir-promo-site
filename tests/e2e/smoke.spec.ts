import { test, expect } from '@playwright/test';

test('SCIR Lab homepage responds successfully', async ({ page }) => {
  const response = await page.goto('/');

  expect(response).not.toBeNull();
  expect(response!.ok()).toBeTruthy();
});
