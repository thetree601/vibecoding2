import { test, expect } from "@playwright/test";

test.describe("Diaries Detail - Retrospect Form", () => {
  test.beforeEach(async ({ page }) => {
    // 실제 다이어리 데이터 사용 (Mock 데이터 사용 안 함)
    await page.addInitScript(() => {
      // 실제 사용자 데이터 시뮬레이션
      const realDiary = {
        id: 1,
        title: "실제 일기",
        content: "실제 내용입니다.",
        emotion: "Happy",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("diaries", JSON.stringify([realDiary]));
    });
  });

  test("회고 폼 등록 기능 테스트", async ({ page }) => {
    // 1. /diaries/1에 접속하여 페이지 로드 확인
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-title"]', {
      timeout: 500,
    });

    // 페이지 로드 확인
    await expect(page.locator('[data-testid="diary-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(
      "실제 일기"
    );

    // 2. 회고 입력 필드 확인
    const retrospectInput = page.locator(
      'input[placeholder="회고를 남겨보세요."]'
    );
    const submitButton = page.locator('button:has-text("입력")');

    // 초기 상태: 입력 버튼 비활성화
    await expect(submitButton).toBeDisabled();

    // 3. 회고 내용 입력
    await retrospectInput.fill("이때가 그립다.");

    // 입력 후: 입력 버튼 활성화 확인
    await expect(submitButton).toBeEnabled();

    // 4. 등록하기 버튼 클릭
    await submitButton.click();

    // 폼 제출 완료 대기
    await page.waitForTimeout(1000);

    // 5. 로컬스토리지에 데이터 저장 확인
    const retrospectsData = await page.evaluate(() => {
      return localStorage.getItem("retrospects");
    });

    expect(retrospectsData).toBeTruthy();

    const retrospects = JSON.parse(retrospectsData!);
    expect(retrospects).toHaveLength(1);
    expect(retrospects[0]).toMatchObject({
      id: 1,
      content: "이때가 그립다.",
      diaryId: 1,
      createdAt: expect.any(String),
    });

    // 6. 페이지 새로고침 확인 (새로고침 후 페이지가 다시 로드되는지 확인)
    await page.waitForSelector('[data-testid="diaries-detail-page-loaded"]');
  });

  test("기존 회고가 있을 때 새로운 회고 추가 테스트", async ({ page }) => {
    // 기존 회고 데이터 설정
    const existingRetrospects = [
      {
        id: 1,
        content: "첫 번째 회고",
        diaryId: 1,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    await page.addInitScript((retrospects) => {
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    }, existingRetrospects);

    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-title"]', {
      timeout: 500,
    });

    // 회고 입력 및 등록
    const input = page.locator('input[placeholder="회고를 남겨보세요."]');
    await input.fill("두 번째 회고");

    // 버튼이 활성화되었는지 확인
    const submitButton = page.locator('button:has-text("입력")');
    await expect(submitButton).toBeEnabled();

    // 폼 제출 시도
    await submitButton.click();

    // 폼 제출 완료 대기
    await page.waitForTimeout(1000);

    // 로컬스토리지에 두 개의 회고가 있는지 확인
    const retrospectsData = await page.evaluate(() => {
      return localStorage.getItem("retrospects");
    });

    const retrospects = JSON.parse(retrospectsData!);
    expect(retrospects).toHaveLength(2);
    expect(retrospects[1]).toMatchObject({
      id: 2, // 기존 최대 id + 1
      content: "두 번째 회고",
      diaryId: 1,
      createdAt: expect.any(String),
    });
  });

  test("빈 내용으로 등록 시도 시 버튼 비활성화 테스트", async ({ page }) => {
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-title"]', {
      timeout: 500,
    });

    const retrospectInput = page.locator(
      'input[placeholder="회고를 남겨보세요."]'
    );
    const submitButton = page.locator('button:has-text("입력")');

    // 빈 문자열 입력
    await retrospectInput.fill("");
    await expect(submitButton).toBeDisabled();

    // 공백만 입력
    await retrospectInput.fill("   ");
    await expect(submitButton).toBeDisabled();

    // 유효한 내용 입력
    await retrospectInput.fill("유효한 회고 내용");
    await expect(submitButton).toBeEnabled();
  });
});
