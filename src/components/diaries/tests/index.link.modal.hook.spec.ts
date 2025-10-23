import { test, expect } from "@playwright/test";

test.describe("Diaries Link Modal Auth Hook", () => {
  // Set viewport size to ensure modal is visible
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe("Non-logged in user scenario", () => {
    test("should show login request modal when write diary button is clicked", async ({
      page,
    }) => {
      // Set test environment to non-logged in state
      await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = false;
      });

      // Navigate to /diaries and wait for page load
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diaries-page-loaded"]');

      // Click write diary button
      await page.click('[data-testid="write-diary-button"]');

      // Verify login request modal is displayed
      await expect(page.locator('text="로그인하시겠습니까?"')).toBeVisible();

      await expect(
        page.locator('text="이 기능을 사용하려면 로그인이 필요합니다."')
      ).toBeVisible();
    });
  });

  test.describe("Logged in user scenario", () => {
    test("should show diary writing modal when write diary button is clicked", async ({
      page,
    }) => {
      // Set test environment to logged in state
      await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
      });

      // Navigate to /diaries and wait for page load
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diaries-page-loaded"]');

      // Click write diary button
      await page.click('[data-testid="write-diary-button"]');

      // Verify diary writing modal is displayed
      // Check if DiariesNew component is opened as modal
      await expect(
        page.locator('[data-testid="diary-form-modal"]')
      ).toBeVisible();
    });
  });
});
