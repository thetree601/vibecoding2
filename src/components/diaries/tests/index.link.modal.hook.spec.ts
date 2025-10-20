import { test, expect } from "@playwright/test";

test.describe("Diary Modal Functionality", () => {
  test("should open diary modal when write button is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load completely using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Verify modal content (DiariesNew) is displayed
    await expect(page.getByText("일기 쓰기")).toBeVisible();
  });
});
