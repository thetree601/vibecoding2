import { test, expect } from "@playwright/test";

test.describe("Diary Filter Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // 데이터 설정을 먼저 수행
    await page.addInitScript(() => {
      // 실제 사용자 데이터 시뮬레이션
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
          title: "슬픈 하루",
          content: "오늘은 정말 슬픈 하루였다.",
          emotion: "Sad",
          createdAt: "2024-01-02T00:00:00.000Z",
        },
        {
          id: 3,
          title: "화난 하루",
          content: "오늘은 정말 화난 하루였다.",
          emotion: "Angry",
          createdAt: "2024-01-03T00:00:00.000Z",
        },
        {
          id: 4,
          title: "놀란 하루",
          content: "오늘은 정말 놀란 하루였다.",
          emotion: "Surprise",
          createdAt: "2024-01-04T00:00:00.000Z",
        },
        {
          id: 5,
          title: "기타 하루",
          content: "오늘은 정말 기타 하루였다.",
          emotion: "Etc",
          createdAt: "2024-01-05T00:00:00.000Z",
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(testDiaries));
    });

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-page-loaded"]', {
      timeout: 1500,
    });
  });

  test("should display filter options correctly", async ({ page }) => {
    // 필터 선택박스 클릭
    await page.click('[data-testid="emotion-filter-select"]');

    // 드롭다운 메뉴가 나타나는지 확인
    await expect(page.locator('[role="listbox"]')).toBeVisible();

    // 메뉴 옵션들이 올바른지 확인
    const options = page.locator('[role="option"]');
    await expect(options.nth(0)).toHaveText("전체");
    await expect(options.nth(1)).toHaveText("행복해요");
    await expect(options.nth(2)).toHaveText("슬퍼요");
    await expect(options.nth(3)).toHaveText("화나요");
    await expect(options.nth(4)).toHaveText("놀랐어요");
    await expect(options.nth(5)).toHaveText("기타");
  });

  test("should display all diaries when no filter is applied", async ({
    page,
  }) => {
    // 모든 일기 카드가 표시되는지 확인 (5개)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(5);
  });

  test("should filter diaries by happy emotion", async ({ page }) => {
    // 필터 선택박스 클릭
    await page.click('[data-testid="emotion-filter-select"]');

    // 행복해요 옵션 선택
    await page.click('[role="option"]:has-text("행복해요")');

    // 행복한 일기만 표시되는지 확인 (1개)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 감정 텍스트가 "행복해요"인지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText(
      "행복해요"
    );
  });

  test("should filter diaries by sad emotion", async ({ page }) => {
    // 필터 선택박스 클릭
    await page.click('[data-testid="emotion-filter-select"]');

    // 슬퍼요 옵션 선택
    await page.click('[role="option"]:has-text("슬퍼요")');

    // 슬픈 일기만 표시되는지 확인 (1개)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 감정 텍스트가 "슬퍼요"인지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText(
      "슬퍼요"
    );
  });

  test("should filter diaries by angry emotion", async ({ page }) => {
    // 필터 선택박스 클릭
    await page.click('[data-testid="emotion-filter-select"]');

    // 화나요 옵션 선택
    await page.click('[role="option"]:has-text("화나요")');

    // 화난 일기만 표시되는지 확인 (1개)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 감정 텍스트가 "화나요"인지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText(
      "화나요"
    );
  });

  test("should filter diaries by surprise emotion", async ({ page }) => {
    // 필터 선택박스 클릭
    await page.click('[data-testid="emotion-filter-select"]');

    // 놀랐어요 옵션 선택
    await page.click('[role="option"]:has-text("놀랐어요")');

    // 놀란 일기만 표시되는지 확인 (1개)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 감정 텍스트가 "놀랐어요"인지 확인
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText(
      "놀랐어요"
    );
  });

  test("should filter search results by emotion", async ({ page }) => {
    // 검색창에 "하루" 입력
    await page.fill('input[placeholder="검색어를 입력해 주세요."]', "하루");

    // 검색 결과가 표시되는지 확인 (5개)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(5);

    // 필터 선택박스 클릭하여 행복해요 선택
    await page.click('[data-testid="emotion-filter-select"]');
    await page.click('[role="option"]:has-text("행복해요")');

    // 검색된 결과 중 행복한 일기만 표시되는지 확인 (1개)
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('[data-testid="diary-emotion"]')).toHaveText(
      "행복해요"
    );
  });
});
