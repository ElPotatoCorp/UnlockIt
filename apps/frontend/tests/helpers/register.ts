import { request, type Page } from "@playwright/test";

const apiURL = "http://localhost:3000/api"

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