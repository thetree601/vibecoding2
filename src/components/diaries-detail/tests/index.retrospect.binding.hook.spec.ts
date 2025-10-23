import { test, expect } from "@playwright/test";

test.describe("Diaries Detail - Retrospect Binding", () => {
  test("회고 데이터 바인딩 테스트", async ({ page }) => {
    // 실제 데이터 설정
    await page.addInitScript(() => {
      // 실제 다이어리 데이터
      const realDiary = {
        id: 1,
        title: "실제 일기",
        content: "실제 내용입니다.",
        emotion: "Happy",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("diaries", JSON.stringify([realDiary]));

      // 실제 회고 데이터
      const realRetrospects = [
        {
          id: 1,
          content: "이때가 그립다.",
          diaryId: 1,
          createdAt: new Date("2024-01-01T10:00:00Z").toISOString(),
        },
        {
          id: 2,
          content: "좋은 기억이었다.",
          diaryId: 1,
          createdAt: new Date("2024-01-02T11:00:00Z").toISOString(),
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(realRetrospects));
    });

    // 로그인 수행
    await page.goto("/auth/login");
    await page.fill('[data-testid="email-input"]', "749884738@dldl.com");
    await page.fill('[data-testid="password-input"]', "asdf12345");
    await page.click('[data-testid="login-button"]');

    // 로그인 성공 후 완료 모달 클릭
    await page.waitForSelector('[data-testid="login-success-modal"]', {
      timeout: 5000,
    });
    await page.click('[data-testid="modal-confirm-button"]');

    // /diaries/1 페이지 접속
    await page.goto("/diaries/1");

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-detail-page-loaded"]', {
      timeout: 500,
    });

    // 일기 제목 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(
      "실제 일기"
    );

    // 회고 데이터가 올바르게 바인딩되었는지 확인
    const retrospectItems = page.locator('[class*="retrospectItem"]');
    await expect(retrospectItems).toHaveCount(2);

    // 첫 번째 회고 내용 확인 (최신 순으로 정렬되므로 2024-01-02가 먼저)
    const firstRetrospect = retrospectItems.nth(0);
    await expect(
      firstRetrospect.locator('[class*="retrospectText"]')
    ).toHaveText("좋은 기억이었다.");

    // 두 번째 회고 내용 확인 (2024-01-01이 두 번째)
    const secondRetrospect = retrospectItems.nth(1);
    await expect(
      secondRetrospect.locator('[class*="retrospectText"]')
    ).toHaveText("이때가 그립다.");
  });
});
