import { test, expect } from "@playwright/test";

test("Simple filter test", async ({ page }) => {
  // 테스트 데이터
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
  ];

  // 페이지로 이동
  await page.goto("/diaries");
  
  // 페이지 로드 대기
  await page.waitForSelector('[data-testid="diaries-page-loaded"]', { timeout: 10000 });
  
  // 페이지 로드 후 로컬스토리지에 데이터 설정
  await page.evaluate((diaries) => {
    localStorage.setItem("diaries", JSON.stringify(diaries));
  }, testDiaries);
  
  // 페이지 새로고침하여 데이터 로드
  await page.reload();
  await page.waitForSelector('[data-testid="diaries-page-loaded"]', { timeout: 10000 });
  
  // 일기 카드가 표시되는지 확인
  const diaryCards = page.locator('[data-testid^="diary-card-"]');
  await expect(diaryCards).toHaveCount(2);
  
  console.log("Test completed successfully");
});
