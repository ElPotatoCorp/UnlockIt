import { request, type Page, APIRequestContext, APIResponse } from "@playwright/test";

const apiURL = "http://localhost:3000/api"

export async function loginViaApi(page: Page, identifier: string, password: string) {
  const requestContext = await request.newContext();

  const response = await retryApiCall(() =>
    requestContext.post(`${apiURL}/auth/login`, {
      data: { identifier, password },
    })
  );

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

  const response = await retryApiCall(() =>
    requestContext.post(`${apiURL}/auth/logout`)
  );

  if (!response.ok()) {
    throw new Error(`Logout failed with status ${response.status()}`);
  }

  const storage = await requestContext.storageState();
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

export async function retryApiCall(
  fn: () => Promise<APIResponse>,
  retries = 3,
  ttl = 30000 // 30 secondes
): Promise<APIResponse> {
  for (let i = 0; i < retries; i++) {
    const res = await fn();

    if (res.status() !== 429) {
      return res;
    }

    // attendre la fin de la fenêtre
    await new Promise(r => setTimeout(r, ttl));
  }

  throw new Error("API rate-limited too many times");
}