import { test, expect } from "@playwright/test";

// Test data setup - using real data from localStorage
const testDiaries = [
  {
    id: 1,
    title: "행복한 하루",
    content: "오늘은 정말 행복한 하루였어요",
    emotion: "Happy",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "슬픈 하루",
    content: "오늘은 정말 슬픈 하루였어요",
    emotion: "Sad",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    title: "화난 하루",
    content: "오늘은 정말 화난 하루였어요",
    emotion: "Angry",
    createdAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: 4,
    title: "놀란 하루",
    content: "오늘은 정말 놀란 하루였어요",
    emotion: "Surprise",
    createdAt: "2024-01-04T00:00:00.000Z",
  },
  {
    id: 5,
    title: "기타 하루",
    content: "오늘은 정말 기타 하루였어요",
    emotion: "Etc",
    createdAt: "2024-01-05T00:00:00.000Z",
  },
  {
    id: 6,
    title: "행복한 하루2",
    content: "오늘은 정말 행복한 하루였어요2",
    emotion: "Happy",
    createdAt: "2024-01-06T00:00:00.000Z",
  },
  {
    id: 7,
    title: "슬픈 하루2",
    content: "오늘은 정말 슬픈 하루였어요2",
    emotion: "Sad",
    createdAt: "2024-01-07T00:00:00.000Z",
  },
  {
    id: 8,
    title: "화난 하루2",
    content: "오늘은 정말 화난 하루였어요2",
    emotion: "Angry",
    createdAt: "2024-01-08T00:00:00.000Z",
  },
  {
    id: 9,
    title: "놀란 하루2",
    content: "오늘은 정말 놀란 하루였어요2",
    emotion: "Surprise",
    createdAt: "2024-01-09T00:00:00.000Z",
  },
  {
    id: 10,
    title: "기타 하루2",
    content: "오늘은 정말 기타 하루였어요2",
    emotion: "Etc",
    createdAt: "2024-01-10T00:00:00.000Z",
  },
  {
    id: 11,
    title: "행복한 하루3",
    content: "오늘은 정말 행복한 하루였어요3",
    emotion: "Happy",
    createdAt: "2024-01-11T00:00:00.000Z",
  },
  {
    id: 12,
    title: "슬픈 하루3",
    content: "오늘은 정말 슬픈 하루였어요3",
    emotion: "Sad",
    createdAt: "2024-01-12T00:00:00.000Z",
  },
  {
    id: 13,
    title: "화난 하루3",
    content: "오늘은 정말 화난 하루였어요3",
    emotion: "Angry",
    createdAt: "2024-01-13T00:00:00.000Z",
  },
  {
    id: 14,
    title: "놀란 하루3",
    content: "오늘은 정말 놀란 하루였어요3",
    emotion: "Surprise",
    createdAt: "2024-01-14T00:00:00.000Z",
  },
  {
    id: 15,
    title: "기타 하루3",
    content: "오늘은 정말 기타 하루였어요3",
    emotion: "Etc",
    createdAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: 16,
    title: "행복한 하루4",
    content: "오늘은 정말 행복한 하루였어요4",
    emotion: "Happy",
    createdAt: "2024-01-16T00:00:00.000Z",
  },
  {
    id: 17,
    title: "슬픈 하루4",
    content: "오늘은 정말 슬픈 하루였어요4",
    emotion: "Sad",
    createdAt: "2024-01-17T00:00:00.000Z",
  },
  {
    id: 18,
    title: "화난 하루4",
    content: "오늘은 정말 화난 하루였어요4",
    emotion: "Angry",
    createdAt: "2024-01-18T00:00:00.000Z",
  },
  {
    id: 19,
    title: "놀란 하루4",
    content: "오늘은 정말 놀란 하루였어요4",
    emotion: "Surprise",
    createdAt: "2024-01-19T00:00:00.000Z",
  },
  {
    id: 20,
    title: "기타 하루4",
    content: "오늘은 정말 기타 하루였어요4",
    emotion: "Etc",
    createdAt: "2024-01-20T00:00:00.000Z",
  },
  {
    id: 21,
    title: "행복한 하루5",
    content: "오늘은 정말 행복한 하루였어요5",
    emotion: "Happy",
    createdAt: "2024-01-21T00:00:00.000Z",
  },
  {
    id: 22,
    title: "슬픈 하루5",
    content: "오늘은 정말 슬픈 하루였어요5",
    emotion: "Sad",
    createdAt: "2024-01-22T00:00:00.000Z",
  },
  {
    id: 23,
    title: "화난 하루5",
    content: "오늘은 정말 화난 하루였어요5",
    emotion: "Angry",
    createdAt: "2024-01-23T00:00:00.000Z",
  },
  {
    id: 24,
    title: "놀란 하루5",
    content: "오늘은 정말 놀란 하루였어요5",
    emotion: "Surprise",
    createdAt: "2024-01-24T00:00:00.000Z",
  },
  {
    id: 25,
    title: "기타 하루5",
    content: "오늘은 정말 기타 하루였어요5",
    emotion: "Etc",
    createdAt: "2024-01-25T00:00:00.000Z",
  },
];

test.beforeEach(async ({ page }) => {
  // Set up localStorage with test data
  await page.goto("/diaries");
  await page.evaluate((diaries) => {
    localStorage.setItem("diaries", JSON.stringify(diaries));
  }, testDiaries);
});

test.describe("Diaries Pagination Tests", () => {
  test("should display 12 diary cards per page in 3 rows and 4 columns", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // Wait for diary cards to load
    await page.waitForSelector('[data-testid^="diary-card-"]', {
      timeout: 500,
    });

    // Check that exactly 12 cards are displayed
    const diaryCards = await page
      .locator('[data-testid^="diary-card-"]')
      .count();
    expect(diaryCards).toBe(12);
  });

  test("should display pagination with 5 page numbers in groups of 5", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // For 25 items with 12 per page, we get 3 pages total
    // But pagination should show 5 numbers when there are 5+ pages
    // Since we have only 3 pages, it should show 1, 2, 3
    const paginationNumbers = await page
      .locator('[data-testid^="pagination-number-"]')
      .count();
    expect(paginationNumbers).toBe(3);

    // Check specific page numbers
    await expect(
      page.locator('[data-testid="pagination-number-1"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pagination-number-2"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pagination-number-3"]')
    ).toBeVisible();
  });

  test("should navigate to different pages when clicking page numbers", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // Click on page 2
    await page.click('[data-testid="pagination-number-2"]');
    await page.waitForTimeout(100);

    // Verify page 2 is active
    await expect(
      page.locator('[data-testid="pagination-number-2"]')
    ).toHaveClass(/active/);

    // Click on page 3
    await page.click('[data-testid="pagination-number-3"]');
    await page.waitForTimeout(100);

    // Verify page 3 is active
    await expect(
      page.locator('[data-testid="pagination-number-3"]')
    ).toHaveClass(/active/);
  });

  test("should show correct diary content for each page", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // Get first page diary titles
    const firstPageTitles = await page
      .locator('[data-testid="diary-title"]')
      .allTextContents();
    expect(firstPageTitles).toContain("행복한 하루");
    expect(firstPageTitles).toContain("슬픈 하루");

    // Navigate to page 2
    await page.click('[data-testid="pagination-number-2"]');
    await page.waitForTimeout(300); // 페이지 변경 대기

    // Get second page diary titles
    const secondPageTitles = await page
      .locator('[data-testid="diary-title"]')
      .allTextContents();
    expect(secondPageTitles).toContain("행복한 하루4");
    expect(secondPageTitles).toContain("슬픈 하루4");
  });

  test("should update pagination when searching", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // Search for "행복한"
    await page.fill('input[placeholder="검색어를 입력해 주세요."]', "행복한");
    await page.waitForTimeout(500); // 디바운싱 대기

    // Check that pagination updates based on search results
    const paginationNumbers = await page
      .locator('[data-testid^="pagination-number-"]')
      .count();
    expect(paginationNumbers).toBeLessThanOrEqual(5);

    // Verify search results contain only "행복한" diaries
    const diaryTitles = await page
      .locator('[data-testid="diary-title"]')
      .allTextContents();
    diaryTitles.forEach((title) => {
      expect(title).toContain("행복한");
    });
  });

  test("should update pagination when filtering by emotion", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // Filter by Happy emotion
    await page.click('[data-testid="emotion-filter-select"]');
    await page.click("text=행복해요");
    await page.waitForTimeout(100);

    // Check that pagination updates based on filter results
    const paginationNumbers = await page
      .locator('[data-testid^="pagination-number-"]')
      .count();
    expect(paginationNumbers).toBeLessThanOrEqual(5);

    // Verify all displayed diaries have Happy emotion
    const emotionTexts = await page
      .locator('[data-testid="diary-emotion"]')
      .allTextContents();
    emotionTexts.forEach((emotion) => {
      expect(emotion).toBe("행복해요");
    });
  });

  test("should handle edge cases with few results", async ({ page }) => {
    // Set up minimal test data
    const minimalDiaries = [
      {
        id: 1,
        title: "Test 1",
        content: "Content 1",
        emotion: "Happy",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "Test 2",
        content: "Content 2",
        emotion: "Sad",
        createdAt: "2024-01-02T00:00:00.000Z",
      },
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, minimalDiaries);

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // Should show only 2 cards and minimal pagination
    const diaryCards = await page
      .locator('[data-testid^="diary-card-"]')
      .count();
    expect(diaryCards).toBe(2);

    // Should show only 1 page
    const paginationNumbers = await page
      .locator('[data-testid^="pagination-number-"]')
      .count();
    expect(paginationNumbers).toBe(1);
  });

  test("should display 5 page numbers when there are 5+ pages", async ({
    page,
  }) => {
    // Create test data for 7 pages (84 items: 7 * 12 = 84)
    const manyDiaries = Array.from({ length: 84 }, (_, i) => ({
      id: i + 1,
      title: `Test ${i + 1}`,
      content: `Content ${i + 1}`,
      emotion: ["Happy", "Sad", "Angry", "Surprise", "Etc"][i % 5],
      createdAt: new Date(2024, 0, i + 1).toISOString(),
    }));

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, manyDiaries);

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 500,
    });

    // Should show 5 page numbers (1, 2, 3, 4, 5) initially
    const paginationNumbers = await page
      .locator('[data-testid^="pagination-number-"]')
      .count();
    expect(paginationNumbers).toBe(5);

    // Check specific page numbers
    await expect(
      page.locator('[data-testid="pagination-number-1"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pagination-number-2"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pagination-number-3"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pagination-number-4"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="pagination-number-5"]')
    ).toBeVisible();
  });
});
