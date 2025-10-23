import { test, expect } from "@playwright/test";
import { Emotion } from "../../../commons/constants/enum";

test.describe("Diaries Link Routing", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("navigates to detail page when clicking diary card", async ({
    page,
  }) => {
    const diaries = [
      {
        id: 101,
        title: "라우팅 테스트",
        content: "내용",
        emotion: Emotion.Happy,
        createdAt: new Date("2024-07-12T00:00:00.000Z").toISOString(),
      },
    ];

    await page.addInitScript((data) => {
      localStorage.setItem("diaries", JSON.stringify(data));
    }, diaries);

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    const card = page.locator('[data-testid="diary-card-101"]');
    await expect(card).toBeVisible({ timeout: 300 });

    await card.click();

    // 라우팅이 완료될 때까지 기다림 (최대 5초)
    await expect(page).toHaveURL(/\/diaries\/101$/, { timeout: 5000 });
  });

  test("does not navigate when clicking delete icon on card", async ({
    page,
  }) => {
    const diaries = [
      {
        id: 202,
        title: "삭제 아이콘 클릭 테스트",
        content: "내용",
        emotion: Emotion.Sad,
        createdAt: new Date("2024-07-13T00:00:00.000Z").toISOString(),
      },
    ];

    await page.addInitScript((data) => {
      localStorage.setItem("diaries", JSON.stringify(data));
    }, diaries);

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    const card = page.locator('[data-testid="diary-card-202"]');
    await expect(card).toBeVisible({ timeout: 300 });

    // 클릭 전 URL 저장
    const beforeUrl = page.url();

    // 카드 내 삭제 버튼 클릭 (이미지에 fill을 사용하므로 버튼 자체를 찾는다)
    await card.locator("button").click();

    // URL 변화가 없어야 함
    await expect(page).toHaveURL(beforeUrl, { timeout: 300 });
  });
});
