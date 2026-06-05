import { test, expect } from "@playwright/test";
import { loginViaApi } from "../helpers/login";

test.describe("Logout desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("desktop", async ({ page }) => {

    await loginViaApi(page, "test@test.test", "Test123&");

    await page.goto("/");

    await page.click('[data-testid="header-profile-button"]');
    await page.click('[data-testid="logout-button"]');

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Logout mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile", async ({ page }) => {
    await loginViaApi(page, "test@test.test", "Test123&");

    await page.goto("/");

    await page.click('[data-testid="header-hamburger-button"]');
    await page.click('[data-testid="drawer-profile-section"]');
    await page.click('[data-testid="logout-button"]');

    await expect(page).toHaveURL(/\/login/);
  });
});