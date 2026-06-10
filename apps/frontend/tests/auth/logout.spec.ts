import { test, expect } from "@playwright/test";
import { ensureLoggedIn, isLoggedIn, loginViaApi } from "../helpers/auth";

test.describe("Logout desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("desktop", async ({ page }) => {
    if (!(await isLoggedIn(page))) {
      await loginViaApi(page, "test@test.test", "Test123&");
      expect(await isLoggedIn(page)).toBe(true);
    }

    await page.goto("/");

    const header = page.locator("header");

    const profileButton = header.locator("#profile-menu-button");
    const profileMenu = header.locator("#profile-menu");

    if (!(await profileMenu.isVisible())) {
      await profileButton.click();
    }

    const logoutButton = profileMenu.locator("#logout-button");
    await logoutButton.click();

    await expect(page).toHaveURL(/\/login/);

    expect(await isLoggedIn(page)).toBe(false);
  });

  test("logout from /login when already logged in", async ({ page }) => {
    if (!(await isLoggedIn(page))) {
      await loginViaApi(page, "test@test.test", "Test123&");
      expect(await isLoggedIn(page)).toBe(true);
    }

    await page.goto("/login");

    const logoutButton = page.locator("#logout-button");
    await logoutButton.click();

    await expect(page).toHaveURL(/\/login/);

    expect(await isLoggedIn(page)).toBe(false);
  });


  test("logout from /register when already logged in", async ({ page }) => {
    if (!(await isLoggedIn(page))) {
      await loginViaApi(page, "test@test.test", "Test123&");
      expect(await isLoggedIn(page)).toBe(true);
    }

    await page.goto("/register");

    const logoutButton = page.locator("#logout-button");
    await logoutButton.click();

    await expect(page).toHaveURL(/\/register/);

    expect(await isLoggedIn(page)).toBe(false);
  });

});

test.describe("Logout mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile", async ({ page }) => {
    if (!(await isLoggedIn(page))) {
      await loginViaApi(page, "test@test.test", "Test123&");
      expect(await isLoggedIn(page)).toBe(true);
    }

    await page.goto("/");

    const header = page.locator("header");

    const hamburgerButton = header.locator("#hamburger-button");
    const hamburgerExpanded = await hamburgerButton.getAttribute("aria-expanded");

    if (hamburgerExpanded === "false") {
      await hamburgerButton.click();
    }

    const drawer = header.locator("#drawer");

    const profileSectionButton = drawer.locator("#profile-section-button");
    const profileExpanded = await profileSectionButton.getAttribute("aria-expanded");

    if (profileExpanded === "false") {
      await profileSectionButton.click();
    }

    const logoutButton = drawer.locator("#logout-button");
    await logoutButton.click();

    await expect(page).toHaveURL(/\/login/);

    expect(await isLoggedIn(page)).toBe(false);
  });
});