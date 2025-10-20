import { test, expect } from "@playwright/test";

test.describe("DiariesNew Modal Close Functionality", () => {
  // Set viewport size to ensure modal is visible
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });
  test("should show cancel modal when close button is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Click the close button
    await page.click('[data-testid="close-button"]');

    // Verify that the cancel modal appears
    await expect(page.locator('[data-testid="cancel-modal"]')).toBeVisible({
      timeout: 400,
    });
    await expect(page.locator('[data-testid="cancel-modal-title"]')).toHaveText(
      "등록 취소",
      { timeout: 400 }
    );
    await expect(
      page.locator('[data-testid="cancel-modal-content"]')
    ).toHaveText("작성 중인 일기가 있습니다. 정말 취소하시겠습니까?", {
      timeout: 400,
    });
  });

  test("should close only cancel modal when continue writing button is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Click the close button
    await page.click('[data-testid="close-button"]');

    // Wait for cancel modal to appear
    await page.waitForSelector('[data-testid="cancel-modal"]');

    // Click continue writing button
    await page
      .locator('[data-testid="continue-writing-button"]')
      .scrollIntoViewIfNeeded();
    await page.click('[data-testid="continue-writing-button"]');

    // Verify that cancel modal is closed but diary form modal is still open
    await expect(page.locator('[data-testid="cancel-modal"]')).not.toBeVisible({
      timeout: 400,
    });
    await expect(page.locator('[data-testid="diary-form-modal"]')).toBeVisible({
      timeout: 400,
    });
  });

  test("should close both modals when cancel registration button is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Click the close button
    await page.click('[data-testid="close-button"]');

    // Wait for cancel modal to appear
    await page.waitForSelector('[data-testid="cancel-modal"]');

    // Click cancel registration button
    await page
      .locator('[data-testid="cancel-registration-button"]')
      .scrollIntoViewIfNeeded();
    await page.click('[data-testid="cancel-registration-button"]');

    // Verify that both modals are closed
    await expect(page.locator('[data-testid="cancel-modal"]')).not.toBeVisible({
      timeout: 400,
    });
    await expect(
      page.locator('[data-testid="diary-form-modal"]')
    ).not.toBeVisible({ timeout: 400 });

    // Verify that we're back to the diaries page
    await expect(
      page.locator('[data-testid="diaries-page-loaded"]')
    ).toBeVisible({ timeout: 400 });
  });
});
