import { test, expect } from '@playwright/test';

test.describe('SCIR Lab authentication', () => {
  test('registration page displays required fields', async ({ page }) => {
    await page.goto('/lab/register');

    await expect(
      page.getByRole('heading', { name: 'Создание аккаунта' })
    ).toBeVisible();

    await expect(page.getByLabel('Имя пользователя')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Пароль')).toBeVisible();
    await expect(page.getByLabel('Повторите пароль')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Создать аккаунт' })
    ).toBeVisible();
  });

  test('registration rejects mismatched passwords', async ({ page }) => {
    await page.goto('/lab/register');

    await page.getByLabel('Имя пользователя').fill('e2e_test_user');
    await page.getByLabel('Email').fill('e2e@example.test');
    await page.getByLabel('Пароль').fill('StrongPassword123!');
    await page.getByLabel('Повторите пароль').fill('DifferentPassword123!');

    await page.getByRole('button', { name: 'Создать аккаунт' }).click();

    await expect(page.getByText('Пароли не совпадают.')).toBeVisible();
    await expect(page).toHaveURL(/\/lab\/register$/);
  });

  test('login page displays username and password fields', async ({ page }) => {
    await page.goto('/lab/login');

    await expect(
      page.getByRole('heading', { name: 'Вход в лабораторию' })
    ).toBeVisible();

    await expect(page.getByLabel('Имя пользователя')).toBeVisible();
    await expect(page.getByLabel('Пароль')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Войти' })
    ).toBeVisible();
  });
});
