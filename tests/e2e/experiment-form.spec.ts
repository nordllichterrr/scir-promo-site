import { test, expect, type Page } from '@playwright/test';

async function mockExperimentApi(page: Page) {
  await page.route('**/api/lab/**', async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/\/+$/, '');

    if (path.endsWith('/auth/me')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authenticated: true,
          user: { id: 1, username: 'e2e_user', email: 'e2e@example.test' },
        }),
      });
      return;
    }

    if (path.endsWith('/datasets')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            slug: 'movielens',
            name: 'MovieLens',
            description: 'E2E test dataset',
            version: '1.0',
            source: 'test',
            folds_count: 1,
          },
        ]),
      });
      return;
    }

    if (/\/datasets\/\d+\/folds$/.test(path)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            split_type: 'standard',
            fold_index: 0,
            split_seed: 42,
            test_users_count: 10,
            test_targets_count: 10,
          },
        ]),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}

test.describe('SCIR Lab experiment form', () => {
  test('form displays experiment fields and dataset options', async ({ page }) => {
    await mockExperimentApi(page);
    await page.goto('/lab/experiments/new');

    await expect(page.getByLabel('Название эксперимента')).toBeVisible();
    await expect(page.getByLabel('Датасет')).toBeVisible();
    await expect(page.getByLabel('Dataset fold')).toBeVisible();
    await expect(page.getByLabel('Количество пользователей')).toHaveValue('500');
    await expect(page.getByLabel('Top-K')).toHaveValue('10');
    await expect(page.getByLabel('Random seed')).toHaveValue('42');
    await expect(page.getByRole('button', { name: 'Сохранить эксперимент' })).toBeEnabled();
    await expect(page.getByLabel('Датасет')).toContainText('MovieLens');
  });

  test('invalid JSON configuration is rejected', async ({ page }) => {
    await mockExperimentApi(page);
    await page.goto('/lab/experiments/new');

    await page.getByLabel('Название эксперимента').fill('E2E invalid JSON');
    await page.locator('textarea').last().fill('{ invalid json');
    await page.getByRole('button', { name: 'Сохранить эксперимент' }).click();

    await expect(
      page.getByText('Проверьте JSON-конфигурацию. Ожидается JSON object.')
    ).toBeVisible();
  });

  test('user count above 500 is rejected', async ({ page }) => {
    await mockExperimentApi(page);
    await page.goto('/lab/experiments/new');

    await page.getByLabel('Название эксперимента').fill('E2E invalid user count');
    await page.getByLabel('Количество пользователей').fill('501');
    await page.getByRole('button', { name: 'Сохранить эксперимент' }).click();

    await expect(
      page.getByText('Количество пользователей должно быть целым числом от 1 до 500.')
    ).toBeVisible();
  });
});
