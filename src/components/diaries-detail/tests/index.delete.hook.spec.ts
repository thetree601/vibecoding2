import { test, expect } from "@playwright/test";
import { Emotion } from "../../../commons/constants/enum";

// 테스트 데이터 타입 정의
interface TestDiary {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

test.describe("일기 삭제 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 환경에서 인증 우회
    await page.addInitScript(() => {
        (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
    });
    // 테스트용 일기 데이터 설정
    const testDiaries: TestDiary[] = [
      {
        id: 1,
        title: "테스트 일기 1",
        content: "테스트 내용 1",
        emotion: Emotion.Happy,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "테스트 일기 2",
        content: "테스트 내용 2",
        emotion: Emotion.Sad,
        createdAt: "2024-01-02T00:00:00.000Z",
      },
    ];

    // 로그인 상태 설정 (전역변수 사용)
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = true;
      // 테스트 환경 변수 설정
      (window as Window & { process?: { env: { NEXT_PUBLIC_TEST_ENV?: string } } }).process = { env: { NEXT_PUBLIC_TEST_ENV: "test" } };
      // 로그인 상태 시뮬레이션
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          name: "테스트 유저",
          email: "test@example.com",
        })
      );
    });

    // 페이지로 이동
    await page.goto("/diaries/1", { waitUntil: "domcontentloaded" });

    // 로컬스토리지에 테스트 데이터 설정 (페이지 로드 후)
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-detail-page-loaded"]', {
      timeout: 10000,
    });
  });

  test("삭제 버튼 클릭 시 모달이 노출됨", async ({ page }) => {
    // 삭제 버튼 클릭
    await page.getByTestId("delete-button").click();

    // 삭제 모달이 노출되는지 확인
    await expect(page.getByTestId("cancel-modal")).toBeVisible();
    await expect(page.getByTestId("cancel-modal-title")).toHaveText(
      "일기 삭제"
    );
    await expect(page.getByTestId("cancel-modal-content")).toHaveText(
      "일기를 삭제 하시겠어요?"
    );
  });

  test("취소 버튼 클릭 시 모달이 닫힘", async ({ page }) => {
    // /diaries/1 페이지로 이동
    await page.goto("/diaries/1", { waitUntil: "domcontentloaded" });

    // 페이지 로드 확인
    await expect(page.getByTestId("diaries-detail-page-loaded")).toBeVisible();

    // 삭제 버튼 클릭
    await page.getByTestId("delete-button").click();

    // 모달이 노출되는지 확인
    await expect(page.getByTestId("cancel-modal")).toBeVisible();

    // 취소 버튼 클릭 (공통 모달의 첫 번째 버튼)
    await page.locator('[data-testid="cancel-modal"] button').nth(0).click();

    // 모달이 닫혔는지 확인
    await expect(page.getByTestId("cancel-modal")).not.toBeVisible();
  });

  test("삭제 버튼 클릭 시 일기가 삭제되고 /diaries로 이동", async ({
    page,
  }) => {
    // /diaries/1 페이지로 이동
    await page.goto("/diaries/1", { waitUntil: "domcontentloaded" });

    // 페이지 로드 확인
    await expect(page.getByTestId("diaries-detail-page-loaded")).toBeVisible();

    // 삭제 버튼 클릭
    await page.getByTestId("delete-button").click();

    // 모달이 노출되는지 확인
    await expect(page.getByTestId("cancel-modal")).toBeVisible();

    // 삭제 확인 버튼 클릭 (공통 모달의 두 번째 버튼)
    await page.locator('[data-testid="cancel-modal"] button').nth(1).click();

    // /diaries 페이지로 이동했는지 확인
    await expect(page).toHaveURL("/diaries");

    // 로컬스토리지에서 해당 일기가 삭제되었는지 확인
    const remainingDiaries = await page.evaluate(() => {
      const diaries = localStorage.getItem("diaries");
      return diaries ? JSON.parse(diaries) : [];
    });

    // ID가 1인 일기가 삭제되었는지 확인
    const deletedDiary = remainingDiaries.find(
      (diary: TestDiary) => diary.id === 1
    );
    expect(deletedDiary).toBeUndefined();

    // ID가 2인 일기는 남아있는지 확인
    const remainingDiary = remainingDiaries.find(
      (diary: TestDiary) => diary.id === 2
    );
    expect(remainingDiary).toBeDefined();
  });
});
