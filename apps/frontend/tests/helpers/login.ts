import { request, type Page } from "@playwright/test";

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