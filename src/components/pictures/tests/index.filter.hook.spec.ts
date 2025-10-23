import { test, expect } from "@playwright/test";

test.describe("Pictures Filter Functionality", () => {
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

  test.describe("Image Size Changes", () => {
    test("should apply default size (640x640) when default filter is selected", async ({
      page,
    }) => {
      // Ensure default is selected
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');
      await expect(filterSelectbox).toContainText("기본");

      // Debug: Check what's on the page
      console.log("Page content:", await page.content());

      // Wait for loading to complete (skeleton disappears)
      await page.waitForSelector('[data-testid="skeleton"]', {
        state: "hidden",
        timeout: 2000,
      });

      // Debug: Check if grid exists
      const grid = page.locator('[data-testid="pictures-grid"]');
      console.log("Grid exists:", await grid.count());

      // Debug: Check if cards exist
      const cards = page.locator(
        '[data-testid="pictures-grid"] [class*="card"]'
      );
      console.log("Cards count:", await cards.count());

      // Wait for actual images to load (using CSS module class)
      await page.waitForSelector(
        '[data-testid="pictures-grid"] [class*="card"]',
        {
          timeout: 2000,
        }
      );

      // Check that images have default size
      const imageCards = page.locator(
        '[data-testid="pictures-grid"] [class*="card"]'
      );
      const firstCard = imageCards.first();

      await expect(firstCard).toHaveCSS("width", "640px");
      await expect(firstCard).toHaveCSS("height", "640px");
    });

    test("should apply landscape size (640x480) when landscape filter is selected", async ({
      page,
    }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');

      // Wait for loading to complete (skeleton disappears)
      await page.waitForSelector('[data-testid="skeleton"]', {
        state: "hidden",
        timeout: 2000,
      });

      // Wait for actual images to load
      await page.waitForSelector(
        '[data-testid="pictures-grid"] [class*="card"]',
        {
          timeout: 2000,
        }
      );

      // Change to landscape
      await filterSelectbox.click();
      await page.locator('[role="listbox"] >> text="가로형"').click();

      // Wait for the change to take effect
      await page.waitForTimeout(200);

      // Check that images have landscape size
      const imageCards = page.locator(
        '[data-testid="pictures-grid"] [class*="card"]'
      );
      const firstCard = imageCards.first();

      await expect(firstCard).toHaveCSS("width", "640px");
      await expect(firstCard).toHaveCSS("height", "480px");
    });

    test("should apply portrait size (480x640) when portrait filter is selected", async ({
      page,
    }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');

      // Wait for loading to complete (skeleton disappears)
      await page.waitForSelector('[data-testid="skeleton"]', {
        state: "hidden",
        timeout: 2000,
      });

      // Wait for actual images to load
      await page.waitForSelector(
        '[data-testid="pictures-grid"] [class*="card"]',
        {
          timeout: 2000,
        }
      );

      // Change to portrait
      await filterSelectbox.click();
      await page.locator('[role="listbox"] >> text="세로형"').click();

      // Wait for the change to take effect
      await page.waitForTimeout(200);

      // Check that images have portrait size
      const imageCards = page.locator(
        '[data-testid="pictures-grid"] [class*="card"]'
      );
      const firstCard = imageCards.first();

      await expect(firstCard).toHaveCSS("width", "480px");
      await expect(firstCard).toHaveCSS("height", "640px");
    });

    test("should maintain size when switching between filters", async ({
      page,
    }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');

      // Wait for loading to complete (skeleton disappears)
      await page.waitForSelector('[data-testid="skeleton"]', {
        state: "hidden",
        timeout: 2000,
      });

      // Wait for actual images to load
      await page.waitForSelector(
        '[data-testid="pictures-grid"] [class*="card"]',
        {
          timeout: 2000,
        }
      );

      const imageCards = page.locator(
        '[data-testid="pictures-grid"] [class*="card"]'
      );
      const firstCard = imageCards.first();

      // Test default size
      await expect(filterSelectbox).toContainText("기본");
      await expect(firstCard).toHaveCSS("width", "640px");
      await expect(firstCard).toHaveCSS("height", "640px");

      // Test landscape size
      await filterSelectbox.click();
      await page.locator('[role="listbox"] >> text="가로형"').click();
      await page.waitForTimeout(200);

      await expect(firstCard).toHaveCSS("width", "640px");
      await expect(firstCard).toHaveCSS("height", "480px");

      // Test portrait size
      await filterSelectbox.click();
      await page.locator('[role="listbox"] >> text="세로형"').click();
      await page.waitForTimeout(200);

      await expect(firstCard).toHaveCSS("width", "480px");
      await expect(firstCard).toHaveCSS("height", "640px");

      // Test back to default
      await filterSelectbox.click();
      await page.locator('[role="listbox"] >> text="기본"').click();
      await page.waitForTimeout(200);

      await expect(firstCard).toHaveCSS("width", "640px");
      await expect(firstCard).toHaveCSS("height", "640px");
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels", async ({ page }) => {
      const filterSelectbox = page.locator('[aria-label="사진 필터"]');
      await expect(filterSelectbox).toHaveAttribute("aria-label", "사진 필터");
    });
  });
});
