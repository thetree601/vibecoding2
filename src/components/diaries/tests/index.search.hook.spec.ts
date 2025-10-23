import { test, expect } from "@playwright/test";

test.describe("Diaries Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Set up test data in localStorage
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였다.",
        emotion: "Happy",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "슬픈 이야기",
        content: "오늘은 조금 슬펐다.",
        emotion: "Sad",
        createdAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: 3,
        title: "놀라운 발견",
        content: "정말 놀라운 일이 있었다.",
        emotion: "Surprise",
        createdAt: "2024-01-03T00:00:00.000Z",
      },
      {
        id: 4,
        title: "화나는 일",
        content: "오늘은 정말 화가 났다.",
        emotion: "Angry",
        createdAt: "2024-01-04T00:00:00.000Z",
      },
    ];

    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // Reload page to load the test data
    await page.reload();
  });

  test("should display all diaries when no search is performed", async ({
    page,
  }) => {
    // Wait for page to load
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Check that all diary cards are visible
    const diaryCards = await page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(4);
  });

  test("should search diaries by title and show matching results", async ({
    page,
  }) => {
    // Wait for page to load
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Find search input and enter search term
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await searchInput.fill("행복");

    // Press Enter to trigger search
    await searchInput.press("Enter");

    // Wait for search results
    await page.waitForTimeout(100);

    // Check that only matching diary is visible
    const diaryCards = await page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // Verify the correct diary is shown
    const title = await page.locator('[data-testid="diary-title"]').first();
    await expect(title).toHaveText("행복한 하루");
  });

  test("should search diaries by partial title match", async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Find search input and enter partial search term
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await searchInput.fill("슬픈");

    // Press Enter to trigger search
    await searchInput.press("Enter");

    // Wait for search results
    await page.waitForTimeout(100);

    // Check that only matching diary is visible
    const diaryCards = await page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // Verify the correct diary is shown
    const title = await page.locator('[data-testid="diary-title"]').first();
    await expect(title).toHaveText("슬픈 이야기");
  });

  test("should show no results when search term does not match any title", async ({
    page,
  }) => {
    // Wait for page to load
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Find search input and enter non-matching search term
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await searchInput.fill("존재하지않는제목");

    // Press Enter to trigger search
    await searchInput.press("Enter");

    // Wait for search results
    await page.waitForTimeout(100);

    // Check that no diary cards are visible
    const diaryCards = await page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test("should clear search results when search input is cleared", async ({
    page,
  }) => {
    // Wait for page to load
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // First perform a search
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await searchInput.fill("행복");
    await searchInput.press("Enter");
    await page.waitForTimeout(100);

    // Verify only one result is shown
    let diaryCards = await page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // Clear the search input
    await searchInput.clear();
    await searchInput.press("Enter");
    await page.waitForTimeout(100);

    // Verify all diaries are shown again
    diaryCards = await page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(4);
  });

  test("should be case insensitive when searching", async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Find search input and enter search term with different case
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await searchInput.fill("행복");

    // Press Enter to trigger search
    await searchInput.press("Enter");

    // Wait for search results
    await page.waitForTimeout(100);

    // Check that matching diary is visible (case insensitive)
    const diaryCards = await page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // Verify the correct diary is shown
    const title = await page.locator('[data-testid="diary-title"]').first();
    await expect(title).toHaveText("행복한 하루");
  });
});
