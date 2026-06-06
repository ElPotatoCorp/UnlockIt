import { request, type Page, APIRequestContext } from "@playwright/test";

const apiURL = "http://localhost:3000/api"

export async function loginViaApi(
    page: Page,
    identifier: string,
    password: string
) {
    const requestContext = await request.newContext();

    const response = await requestContext.post(`${apiURL}/auth/login`, {
        data: { identifier, password },
    });

    if (!response.ok()) {
        throw new Error(`Login failed with status ${response.status()}`);
    }

    const storage = await requestContext.storageState();

    await page.context().addCookies(storage.cookies);
}

export async function registerViaApi(
    page: Page,
    username: string,
    email: string,
    password: string
) {
    const requestContext = await request.newContext();

    const response = await requestContext.post(`${apiURL}/auth/register`, {
        data: { username, email, password },
    });

    if (!response.ok()) {
        throw new Error(`Register failed with status ${response.status()}`);
    }

    const storage = await requestContext.storageState();
    await page.context().addCookies(storage.cookies);
}

export async function logoutViaApi(page: Page) {
  const requestContext = await request.newContext({
    storageState: await page.context().storageState(),
  });

  const response = await requestContext.post(`${apiURL}/auth/logout`);

  if (!response.ok()) {
    throw new Error(`Logout failed with status ${response.status()}`);
  }

  // On récupère l'état de storage après logout
  const storage = await requestContext.storageState();

  // On remplace les cookies du browser par ceux du logout
  await page.context().clearCookies();
  await page.context().addCookies(storage.cookies);
}

export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    const res = await page.request.get(`${apiURL}/auth/me`);
    return res.ok();
  } catch {
    return false;
  }
}

export async function isLoggedOut(page: Page): Promise<boolean> {
  const res = await page.request.get(`${apiURL}/auth/me`);
  return res.status() === 401;
}

// TODO LoggedIn but expired