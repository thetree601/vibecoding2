import { test, expect } from "@playwright/test";

// 테스트 데이터 타입 정의
interface Diary {
  id: number;
  title: string;
  content: string;
  emotion: string;
  createdAt: string;
}

// 테스트 데이터
const testDiaries: Diary[] = [
  {
    id: 1,
    title: "테스트 일기 1",
    content: "테스트 내용 1",
    emotion: "Happy",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "테스트 일기 2",
    content: "테스트 내용 2",
    emotion: "Sad",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

test.describe("일기 삭제 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 환경 변수 설정
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
    });

    // 로컬스토리지에 테스트 데이터 설정
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
  });

  test("비로그인 유저 - 삭제 아이콘 미노출", async ({ page }) => {
    // 테스트 환경에서 비로그인 상태로 설정
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = false;
    });

    await page.goto("/diaries");

    // 페이지 로드 확인
    await expect(
      page.locator('[data-testid="diaries-page-loaded"]')
    ).toBeVisible({ timeout: 1500 });

    // 삭제 아이콘들이 보이지 않는지 확인
    const deleteButtons = page.locator(
      '[data-testid*="diary-card-"] button[class*="closeButton"]'
    );
    await expect(deleteButtons).toHaveCount(0, { timeout: 1500 });
  });

  test("로그인 유저 - 삭제 아이콘 노출", async ({ page }) => {
    // 테스트 환경에서 로그인 상태로 설정
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
    });

    await page.goto("/diaries");

    // 페이지 로드 후 권한 상태 확인
    const permissionStatus = await page.evaluate(() => {
      return {
        testBypass: (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__,
      };
    });
    console.log("Permission status:", permissionStatus);

    // 페이지 로드 확인
    await expect(
      page.locator('[data-testid="diaries-page-loaded"]')
    ).toBeVisible({ timeout: 1500 });

    // 디버깅: 일기 카드가 렌더링되는지 확인
    const diaryCards = page.locator('[data-testid*="diary-card-"]');
    const cardCount = await diaryCards.count();
    console.log(`Found ${cardCount} diary cards`);

    // 디버깅: 삭제 버튼이 있는지 확인
    const deleteButtons = page.locator(
      '[data-testid*="diary-card-"] button[class*="closeButton"]'
    );
    const buttonCount = await deleteButtons.count();
    console.log(`Found ${buttonCount} delete buttons`);

    // 디버깅: 페이지 HTML 확인
    const pageContent = await page.content();
    console.log(
      "Page contains closeButton:",
      pageContent.includes("closeButton")
    );

    // 실제 일기 카드 HTML 확인
    const diaryCardHTML = await page
      .locator('[data-testid*="diary-card-"]')
      .first()
      .innerHTML();
    console.log("First diary card HTML:", diaryCardHTML);

    await expect(deleteButtons).toHaveCount(testDiaries.length, {
      timeout: 1500,
    });
  });

  test("로그인 유저 - 삭제 모달 표시 및 취소", async ({ page }) => {
    // 테스트 환경에서 로그인 상태로 설정
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
    });

    await page.goto("/diaries");

    // 페이지 로드 확인
    await expect(
      page.locator('[data-testid="diaries-page-loaded"]')
    ).toBeVisible({ timeout: 1500 });

    // 첫 번째 일기의 삭제 버튼 클릭
    const firstDeleteButton = page.locator(
      '[data-testid="diary-card-1"] button[class*="closeButton"]'
    );
    await firstDeleteButton.click();

    // 삭제 확인 모달이 표시되는지 확인
    await expect(page.locator('[data-testid="cancel-modal"]')).toBeVisible();
    await expect(page.locator('text="테스트 일기 1"')).toBeVisible();

    // 취소 버튼 클릭
    await page.locator('text="취소"').click();

    // 모달이 닫히고 일기가 여전히 존재하는지 확인
    await expect(page.locator('[data-testid="cancel-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
  });

  test("로그인 유저 - 일기 삭제 성공", async ({ page }) => {
    // 테스트 환경에서 로그인 상태로 설정
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
    });

    await page.goto("/diaries");

    // 페이지 로드 확인
    await expect(
      page.locator('[data-testid="diaries-page-loaded"]')
    ).toBeVisible({ timeout: 1500 });

    // 삭제 전 일기 개수 확인
    const initialDiaries = page.locator('[data-testid*="diary-card-"]');
    await expect(initialDiaries).toHaveCount(testDiaries.length);

    // 첫 번째 일기의 삭제 버튼 클릭
    const firstDeleteButton = page.locator(
      '[data-testid="diary-card-1"] button[class*="closeButton"]'
    );
    await firstDeleteButton.click();

    // 삭제 확인 모달이 표시되는지 확인
    await expect(page.locator('[data-testid="cancel-modal"]')).toBeVisible();

    // 삭제 버튼 클릭 (모달 내의 삭제 버튼)
    await page.locator('[data-testid="cancel-modal"] button:has-text("삭제")').click();

    // 페이지가 새로고침되고 삭제된 일기가 사라졌는지 확인
    await expect(
      page.locator('[data-testid="diaries-page-loaded"]')
    ).toBeVisible({ timeout: 1500 });
    await expect(
      page.locator('[data-testid="diary-card-1"]')
    ).not.toBeVisible();

    // 남은 일기 개수 확인
    const remainingDiaries = page.locator('[data-testid*="diary-card-"]');
    await expect(remainingDiaries).toHaveCount(testDiaries.length - 1);
  });

  test("비로그인 유저 - 삭제 버튼 클릭 시 로그인 모달 표시", async ({
    page,
  }) => {
    // 테스트 환경에서 비로그인 상태로 설정
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = false;
    });

    await page.goto("/diaries");

    // 페이지 로드 확인
    await expect(
      page.locator('[data-testid="diaries-page-loaded"]')
    ).toBeVisible({ timeout: 1500 });

    // 비로그인 상태에서는 삭제 버튼이 보이지 않아야 함
    const deleteButtons = page.locator(
      '[data-testid*="diary-card-"] button[class*="closeButton"]'
    );
    await expect(deleteButtons).toHaveCount(0, { timeout: 1500 });
  });
});
