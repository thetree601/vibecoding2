import { test, expect } from "@playwright/test";

test.describe("DiariesDetail Binding Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("binds and renders diary detail by id from localStorage", async ({
    page,
  }) => {
    // Prepare real data in localStorage (no mocking libraries)
    const diary = {
      id: 9999,
      title: "테스트 제목",
      content: "테스트 내용",
      emotion: "Happy",
      createdAt: new Date("2024-07-12T00:00:00.000Z").toISOString(),
    };

    await page.addInitScript((d) => {
      const existing = localStorage.getItem("diaries");
      const arr = existing ? JSON.parse(existing) : [];
      const filtered = arr.filter((x: { id: number }) => x.id !== d.id);
      localStorage.setItem("diaries", JSON.stringify([...filtered, d]));
    }, diary);

    // Navigate directly to detail page
    await page.goto(`/diaries/${diary.id}`);

    // Wait for page load using fixed data-testid
    await page.waitForSelector('[data-testid="diaries-detail-page-loaded"]');

    // Assert bound fields
    await expect(page.getByTestId("diary-title")).toHaveText(diary.title, {
      timeout: 400,
    });
    await expect(page.getByTestId("diary-content")).toHaveText(diary.content, {
      timeout: 400,
    });
    await expect(page.getByTestId("diary-emotion")).toBeVisible({
      timeout: 400,
    });
    await expect(page.getByTestId("diary-createdAt")).toBeVisible({
      timeout: 400,
    });
  });

  test("shows not found when diary id is absent in storage", async ({
    page,
  }) => {
    // Ensure storage has no matching item
    await page.addInitScript(() => {
      localStorage.setItem("diaries", JSON.stringify([]));
    });

    await page.goto(`/diaries/123456789`);
    await page.waitForSelector('[data-testid="diaries-detail-page-loaded"]');

    await expect(page.getByTestId("diaries-detail-not-found")).toBeVisible({
      timeout: 400,
    });
  });
});
