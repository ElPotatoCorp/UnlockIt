import { test, expect } from "@playwright/test";
import { isLoggedIn, isLoggedOut, loginViaApi, logoutViaApi, registerViaApi } from "../helpers/auth";

test.describe("Background seed", () => {
  test("background stays the same after refresh for same user", async ({ page }) => {
    if (await isLoggedIn(page)) {
      await logoutViaApi(page);
      expect(await isLoggedIn(page)).toBe(false);
    }

    const unique = Date.now();
    const username = `user_${unique}`;
    const email = `user_${unique}@test.test`;
    const password = "Test123&";

    await registerViaApi(page, username, email, password);
    await loginViaApi(page, email, password);

    expect(await isLoggedIn(page)).toBe(true);

    await page.goto("/");

    const seedBefore = await page.locator("[data-seed]").getAttribute("data-seed");

    await page.reload();

    const seedAfter = await page.locator("[data-seed]").getAttribute("data-seed");

    expect(seedBefore).toBe(seedAfter);
  });


  test("background changes after logout and login", async ({ page }) => {
    if (await isLoggedIn(page)) {
      await logoutViaApi(page);
      expect(await isLoggedIn(page)).toBe(false);
    }

    const unique = Date.now();
    const username = `user_${unique}`;
    const email = `user_${unique}@test.test`;
    const password = "Test123&";

    await registerViaApi(page, username, email, password);
    await loginViaApi(page, email, password);

    await page.goto("/");

    const seedBefore = await page.locator("[data-seed]").getAttribute("data-seed");

    // Logout
    await logoutViaApi(page);
    expect(await isLoggedOut(page)).toBe(true);

    // Login again → nouvelle session.sid
    await loginViaApi(page, email, password);
    expect(await isLoggedIn(page)).toBe(true);

    await page.goto("/");

    const seedAfter = await page.locator("[data-seed]").getAttribute("data-seed");

    expect(seedBefore).not.toBe(seedAfter);
  });


  test("two different users have different background seeds", async ({ browser }) => {
    // User A
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();

    const uniqueA = Date.now();
    const usernameA = `userA_${uniqueA}`;
    const emailA = `userA_${uniqueA}@test.test`;
    const passwordA = "Test123&";

    await registerViaApi(pageA, usernameA, emailA, passwordA);
    await loginViaApi(pageA, emailA, passwordA);

    await pageA.goto("/");
    const seedA = await pageA.locator("[data-seed]").getAttribute("data-seed");

    // User B
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    const uniqueB = Date.now() + 1;
    const usernameB = `userB_${uniqueB}`;
    const emailB = `userB_${uniqueB}@test.test`;
    const passwordB = "Test123&";

    await registerViaApi(pageB, usernameB, emailB, passwordB);
    await loginViaApi(pageB, emailB, passwordB);

    await pageB.goto("/");
    const seedB = await pageB.locator("[data-seed]").getAttribute("data-seed");

    expect(seedA).not.toBe(seedB);
  });



});