import { test, expect } from '@playwright/test';

test.describe('SCIR Lab dashboard access', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/lab/dashboard');

    await expect(page).toHaveURL(/\/lab\/login$/);

    await expect(
      page.getByRole('heading', { name: 'Вход в лабораторию' })
    ).toBeVisible();
  });

  test('session verification error is displayed when API is unavailable', async ({ page }) => {
    await page.route('**/api/lab/**', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' }),
      });
    });

    await page.goto('/lab/dashboard');

    await expect(
      page.getByText('Не удалось проверить сессию. Проверьте соединение с сервером.')
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Повторить проверку' })
    ).toBeVisible();
  });
});
