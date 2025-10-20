import { test, expect } from "@playwright/test";

test.describe("Diaries Binding Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("binds and renders diary cards from localStorage with real data", async ({
    page,
  }) => {
    // Prepare real data in localStorage (no mocking libraries)
    const testDiaries = [
      {
        id: 1,
        title: "첫 번째 일기",
        content: "첫 번째 일기의 내용입니다.",
        emotion: "Happy",
        createdAt: new Date("2024-07-12T00:00:00.000Z").toISOString(),
      },
      {
        id: 2,
        title: "두 번째 일기",
        content: "두 번째 일기의 내용입니다.",
        emotion: "Sad",
        createdAt: new Date("2024-07-13T00:00:00.000Z").toISOString(),
      },
      {
        id: 3,
        title:
          "매우 긴 제목을 가진 일기입니다. 이 제목은 카드 크기를 넘어서므로 잘려야 합니다.",
        content: "긴 제목을 가진 일기의 내용입니다.",
        emotion: "Angry",
        createdAt: new Date("2024-07-14T00:00:00.000Z").toISOString(),
      },
    ];

    await page.addInitScript((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page load using fixed data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Assert that diary cards are rendered
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(3, { timeout: 300 });

    // Assert first diary card content
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    await expect(firstCard).toBeVisible({ timeout: 300 });
    await expect(firstCard.locator('[data-testid="diary-title"]')).toHaveText(
      "첫 번째 일기",
      { timeout: 300 }
    );
    await expect(firstCard.locator('[data-testid="diary-emotion"]')).toHaveText(
      "행복해요",
      { timeout: 300 }
    );
    await expect(firstCard.locator('[data-testid="diary-date"]')).toHaveText(
      "2024. 07. 12",
      { timeout: 300 }
    );

    // Assert second diary card content
    const secondCard = page.locator('[data-testid="diary-card-2"]');
    await expect(secondCard).toBeVisible({ timeout: 300 });
    await expect(secondCard.locator('[data-testid="diary-title"]')).toHaveText(
      "두 번째 일기",
      { timeout: 300 }
    );
    await expect(
      secondCard.locator('[data-testid="diary-emotion"]')
    ).toHaveText("슬퍼요", { timeout: 300 });

    // Assert third diary card with truncated title
    const thirdCard = page.locator('[data-testid="diary-card-3"]');
    await expect(thirdCard).toBeVisible({ timeout: 300 });
    await expect(thirdCard.locator('[data-testid="diary-title"]')).toHaveText(
      "매우 긴 제목을 가진 일기입니다. 이...",
      { timeout: 300 }
    );
    await expect(thirdCard.locator('[data-testid="diary-emotion"]')).toHaveText(
      "화나요",
      { timeout: 300 }
    );
  });

  test("shows empty state when no diaries in localStorage", async ({
    page,
  }) => {
    // Ensure storage is empty
    await page.addInitScript(() => {
      localStorage.setItem("diaries", JSON.stringify([]));
    });

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Assert no diary cards are rendered
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0, { timeout: 300 });
  });

  test("handles localStorage parsing errors gracefully", async ({ page }) => {
    // Set invalid JSON in localStorage
    await page.addInitScript(() => {
      localStorage.setItem("diaries", "invalid-json");
    });

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Should handle error gracefully and show empty state
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0, { timeout: 300 });
  });

  test("renders all emotion types correctly", async ({ page }) => {
    const testDiaries = [
      {
        id: 1,
        title: "행복한 일기",
        content: "행복한 내용",
        emotion: "Happy",
        createdAt: new Date("2024-07-12T00:00:00.000Z").toISOString(),
      },
      {
        id: 2,
        title: "슬픈 일기",
        content: "슬픈 내용",
        emotion: "Sad",
        createdAt: new Date("2024-07-13T00:00:00.000Z").toISOString(),
      },
      {
        id: 3,
        title: "화난 일기",
        content: "화난 내용",
        emotion: "Angry",
        createdAt: new Date("2024-07-14T00:00:00.000Z").toISOString(),
      },
      {
        id: 4,
        title: "놀란 일기",
        content: "놀란 내용",
        emotion: "Surprise",
        createdAt: new Date("2024-07-15T00:00:00.000Z").toISOString(),
      },
      {
        id: 5,
        title: "기타 일기",
        content: "기타 내용",
        emotion: "Etc",
        createdAt: new Date("2024-07-16T00:00:00.000Z").toISOString(),
      },
    ];

    await page.addInitScript((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Assert all emotion types are rendered correctly
    const emotions = ["행복해요", "슬퍼요", "화나요", "놀랐어요", "기타"];

    for (let i = 0; i < emotions.length; i++) {
      const card = page.locator(`[data-testid="diary-card-${i + 1}"]`);
      await expect(card.locator('[data-testid="diary-emotion"]')).toHaveText(
        emotions[i],
        { timeout: 300 }
      );
    }
  });
});
