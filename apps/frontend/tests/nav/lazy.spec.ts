import { test, expect } from "@playwright/test";

test.describe("Lazy navigation", () => {
    const lazyRoutes = [
        "/privacy",
        "/legal",
        "/cookies",
        "/refunds"
    ];

    test.beforeEach(async ({ page }) => {
        // Ralentir les chunks JS pour forcer Suspense à s'activer
        await page.route("**/*.js", async (route) => {
            await new Promise(r => setTimeout(r, 800));
            await route.continue();
        });
    });

    test("Loader appears to each", async ({ page }) => {

        await page.goto("/");

        for (const route of lazyRoutes) {

            await page.click(`a[href="${route}"]`);

            await expect(page.locator("#page-loading")).toBeVisible();

            await expect(page).toHaveURL(route);

            await expect(page.locator("#page-loading")).toHaveCount(0);
        }
    });
});