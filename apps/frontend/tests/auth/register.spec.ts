import { test, expect } from "@playwright/test";
import { ensureLoggedOut, isLoggedIn, loginViaApi, logoutViaApi, registerViaApi } from "../helpers/auth";

test.describe("Register", () => {

    test.beforeEach(async ({ page }) => {
        await ensureLoggedOut(page);
    });

    test("register successfully email", async ({ page }) => {
        await page.goto("/register");

        const form = page.locator("#register-form");

        const uniqueVar = `${Date.now()}`;
        const uniqueUsername = `user_${uniqueVar}`;
        const uniqueEmail = `user_${uniqueVar}@test.test`;

        await form.locator("#username").fill(uniqueUsername);
        await form.locator("#password").fill("Test123&");
        await form.locator("#email").fill(uniqueEmail);

        await form.locator('button[type="submit"]').click();

        await expect(page).toHaveURL("/login");
    });

    test("register phoneNumber disabled", async ({ page }) => {
        await page.goto("/register");

        const phoneBtn = page.locator("button:has-text('Téléphone')");

        await expect(phoneBtn).toBeVisible();
        await expect(phoneBtn).toBeDisabled();
    });

    test("username already used", async ({ page }) => {
        const uniqueVar = Math.random().toString(36).substring(2, 10);
        const username = `user_${uniqueVar}`;
        const email = `user_${uniqueVar}@test.test`;

        await registerViaApi(page, username, email, "Test123&");

        await page.goto("/register");

        const form = page.locator("#register-form");

        await form.locator("#username").fill(username);
        await form.locator("#password").fill("Test123&");
        await form.locator("#email").fill(`another_${uniqueVar}@test.test`);

        await form.locator('button[type="submit"]').click();

        await expect(form.getByText("Email ou nom d'utilisateur déjà utilisé.")).toBeVisible();
    });

    test("email already used", async ({ page }) => {
        const uniqueVar = Math.random().toString(36).substring(2, 10);
        const username = `user_${uniqueVar}`;
        const email = `user_${uniqueVar}@test.test`;

        await registerViaApi(page, username, email, "Test123&");

        await page.goto("/register");

        const form = page.locator("#register-form");

        await form.locator("#username").fill(`another_${uniqueVar}`);
        await form.locator("#password").fill("Test123&");
        await form.locator("#email").fill(email);

        await form.locator('button[type="submit"]').click();

        await expect(form.getByText("Email ou nom d'utilisateur déjà utilisé.")).toBeVisible();
    });

    test("already logged in", async ({ page }) => {
        await loginViaApi(page, "test@test.test", "Test123&");
        expect(await isLoggedIn(page)).toBe(true);

        await page.goto("/register");

        await expect(page.getByRole("heading", { level: 1 })).toHaveText("Déjà connecté");

        await expect(page.getByText(/Vous êtes connecté en tant que/i)).toBeVisible();

        await expect(page.getByRole("link", { name: "Retour à l'accueil" })).toBeVisible();

        const logoutButton = page.locator("#logout-button");
        await expect(logoutButton).toBeVisible();

        await expect(page.locator("#register-form")).toHaveCount(0);
    });
});