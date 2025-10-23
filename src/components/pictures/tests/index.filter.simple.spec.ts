import { test, expect } from "@playwright/test";

test.describe("Pictures Filter Functionality - Simplified", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pictures");
    // Wait for page to load completely using data-testid
    await page.waitForSelector('[data-testid="pictures-grid"]', {
      timeout: 2000,
    });
  });

  test.describe("Filter Selection", () => {
    test("should display filter options correctly", async ({ page }) => {
      // Check if filter selectbox is present
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');
      await expect(filterSelectbox).toBeVisible();

      // Click to open dropdown
      await filterSelectbox.click();

      // Check if all filter options are present in the dropdown
      await expect(
        page.locator('[role="listbox"] >> text="기본"')
      ).toBeVisible();
      await expect(
        page.locator('[role="listbox"] >> text="가로형"')
      ).toBeVisible();
      await expect(
        page.locator('[role="listbox"] >> text="세로형"')
      ).toBeVisible();
    });

    test("should have default filter selected initially", async ({ page }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');

      // Check that "기본" is selected by default
      await expect(filterSelectbox).toContainText("기본");
    });

    test("should change filter selection to landscape", async ({ page }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');

      // Click to open dropdown
      await filterSelectbox.click();

      // Select landscape option
      await page.locator('[role="listbox"] >> text="가로형"').click();

      // Verify selection changed
      await expect(filterSelectbox).toContainText("가로형");
    });

    test("should change filter selection to portrait", async ({ page }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');

      // Click to open dropdown
      await filterSelectbox.click();

      // Select portrait option
      await page.locator('[role="listbox"] >> text="세로형"').click();

      // Verify selection changed
      await expect(filterSelectbox).toContainText("세로형");
    });

    test("should change filter selection back to default", async ({ page }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');

      // First change to landscape
      await filterSelectbox.click();
      await page.locator('[role="listbox"] >> text="가로형"').click();
      await expect(filterSelectbox).toContainText("가로형");

      // Then change back to default
      await filterSelectbox.click();
      await page.locator('[role="listbox"] >> text="기본"').click();
      await expect(filterSelectbox).toContainText("기본");
    });
  });

  test.describe("Filter Hook Integration", () => {
    test("should have filter hook integrated", async ({ page }) => {
      // Check that the filter selectbox is using the new filter options
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');
      await expect(filterSelectbox).toBeVisible();

      // Open dropdown to see options
      await filterSelectbox.click();

      // Verify the new filter options are present
      await expect(
        page.locator('[role="listbox"] >> text="기본"')
      ).toBeVisible();
      await expect(
        page.locator('[role="listbox"] >> text="가로형"')
      ).toBeVisible();
      await expect(
        page.locator('[role="listbox"] >> text="세로형"')
      ).toBeVisible();

      // Verify old options are not present
      await expect(
        page.locator('[role="listbox"] >> text="전체"')
      ).not.toBeVisible();
      await expect(
        page.locator('[role="listbox"] >> text="강아지"')
      ).not.toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels", async ({ page }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');
      await expect(filterSelectbox).toHaveAttribute("aria-label", "사진 필터");
    });
  });
});
