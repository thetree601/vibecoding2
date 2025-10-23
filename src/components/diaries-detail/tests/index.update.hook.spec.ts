import { test, expect } from "@playwright/test";

test.describe("일기 수정 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 환경에서 인증 우회
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
    });
    // 테스트용 일기 데이터 설정
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용입니다.",
      emotion: "Happy",
      createdAt: new Date().toISOString(),
    };

    // 로컬스토리지에 테스트 데이터 저장
    await page.addInitScript((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);

    // 이미 로그인된 상태라고 가정하고 일기 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-detail-page-loaded"]');
  });

  test("일기 수정 기능 - 성공 시나리오", async ({ page }) => {
    // 1. 일기상세에서 수정 버튼을 클릭
    await page.click('[data-testid="edit-button"]');

    // 2. 수정 모드로 변경되었는지 확인
    await expect(page.locator('[data-testid="edit-mode"]')).toBeVisible();

    // 3. 회고 비활성화 메시지가 표시되는지 확인
    await expect(
      page.locator('[data-testid="retrospect-disabled-text"]')
    ).toHaveText("수정중일땐 회고를 작성할 수 없어요.");

    // 4. 수정 폼의 기본값이 올바르게 설정되었는지 확인
    await expect(page.locator('[data-testid="edit-title-input"]')).toHaveValue(
      "테스트 일기"
    );
    await expect(
      page.locator('[data-testid="edit-content-input"]')
    ).toHaveValue("테스트 내용입니다.");
    await expect(
      page.locator('[data-testid="edit-emotion-happy"]')
    ).toBeChecked();

    // 5. 폼 필드 수정
    await page.fill('[data-testid="edit-title-input"]', "수정된 제목");
    await page.fill('[data-testid="edit-content-input"]', "수정된 내용입니다.");
    await page.click('[data-testid="edit-emotion-sad"]');

    // 6. 수정하기 버튼 클릭
    await page.click('[data-testid="submit-edit-button"]');

    // 7. 수정 모드가 종료되었는지 확인 (즉시)
    await expect(page.locator('[data-testid="edit-mode"]')).not.toBeVisible();

    // 8. 수정된 내용이 반영되었는지 확인 (로컬스토리지 직접 확인)
    const updatedDiary = await page.evaluate(() => {
      const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
      return diaries.find((d: { id: number }) => d.id === 1);
    });

    expect(updatedDiary.title).toBe("수정된 제목");
    expect(updatedDiary.content).toBe("수정된 내용입니다.");
    expect(updatedDiary.emotion).toBe("Sad");
  });

  test("일기 수정 기능 - 취소 시나리오", async ({ page }) => {
    // 1. 수정 모드 진입
    await page.click('[data-testid="edit-button"]');
    await expect(page.locator('[data-testid="edit-mode"]')).toBeVisible();

    // 2. 폼 필드 수정
    await page.fill('[data-testid="edit-title-input"]', "수정된 제목");
    await page.fill('[data-testid="edit-content-input"]', "수정된 내용입니다.");

    // 3. 취소 버튼 클릭
    await page.click('[data-testid="cancel-edit-button"]');

    // 4. 원래 화면으로 돌아갔는지 확인
    await expect(page.locator('[data-testid="edit-mode"]')).not.toBeVisible();

    // 5. 원래 내용이 그대로인지 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(
      "테스트 일기"
    );
    await expect(page.locator('[data-testid="diary-content"]')).toHaveText(
      "테스트 내용입니다."
    );
  });

  test("일기 수정 기능 - 유효성 검사", async ({ page }) => {
    // 1. 수정 모드 진입
    await page.click('[data-testid="edit-button"]');
    await expect(page.locator('[data-testid="edit-mode"]')).toBeVisible();

    // 2. 필수 필드를 비워둠
    await page.fill('[data-testid="edit-title-input"]', "");
    await page.fill('[data-testid="edit-content-input"]', "");

    // 3. 수정하기 버튼이 비활성화되어 있는지 확인
    await expect(
      page.locator('[data-testid="submit-edit-button"]')
    ).toBeDisabled();

    // 4. 제목만 입력
    await page.fill('[data-testid="edit-title-input"]', "제목만 입력");

    // 5. 여전히 비활성화되어 있는지 확인
    await expect(
      page.locator('[data-testid="submit-edit-button"]')
    ).toBeDisabled();

    // 6. 내용도 입력
    await page.fill('[data-testid="edit-content-input"]', "내용도 입력");

    // 7. 이제 활성화되어 있는지 확인
    await expect(
      page.locator('[data-testid="submit-edit-button"]')
    ).toBeEnabled();
  });

  test("일기 수정 기능 - 회고 입력 비활성화", async ({ page }) => {
    // 1. 수정 모드 진입
    await page.click('[data-testid="edit-button"]');
    await expect(page.locator('[data-testid="edit-mode"]')).toBeVisible();

    // 2. 회고 비활성화 메시지가 표시되는지 확인
    await expect(
      page.locator('[data-testid="retrospect-disabled-text"]')
    ).toHaveText("수정중일땐 회고를 작성할 수 없어요.");

    // 3. 회고 입력 버튼이 비활성화되어 있는지 확인
    await expect(
      page.locator('[data-testid="retrospect-disabled-button"]')
    ).toBeDisabled();
  });
});
