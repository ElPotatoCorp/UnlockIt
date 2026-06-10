import { test, expect } from "@playwright/test";
import { ensureLoggedOut, isLoggedIn, loginViaApi, logoutViaApi } from "../helpers/auth";

test.describe("Login", () => {

    test.beforeEach(async ({ page }) => {
        await ensureLoggedOut(page);
    });

    test("login successfully", async ({ page }) => {
        await page.goto("/login");

        const form = page.locator("#login-form");

        await form.locator("#identifier").fill("test@test.test");

        await form.locator("#password").fill("Test123&");

        await form.locator('button[type="submit"]').click();

        await expect(page).toHaveURL("/");

        expect(await isLoggedIn(page)).toBe(true);
    });

    test("invalid credentials", async ({ page }) => {
        await page.goto("/login");

        const form = page.locator("#login-form");

        await form.locator("#identifier").fill("test@test.test");

        await form.locator("#password").fill("Wrong123!");

        await form.locator('button[type="submit"]').click();

        await expect(form.getByText("Identifiants invalides.")).toBeVisible();
    });

    test("already logged in", async ({ page }) => {
        await loginViaApi(page, "test@test.test", "Test123&");

        await page.goto("/login");

        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Déjà connecté");

        await expect(page.getByText(/Vous êtes connecté en tant que/i)).toBeVisible();

        await expect(page.getByRole("link", { name: "Retour à l'accueil" })).toBeVisible();

        const logoutButton = page.locator("#logout-button");
        await expect(logoutButton).toBeVisible();

        await expect(page.locator("#login-form")).toHaveCount(0);
    });
});