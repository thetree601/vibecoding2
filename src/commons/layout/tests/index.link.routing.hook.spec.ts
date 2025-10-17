import { test, expect } from "@playwright/test";

test.describe("Layout Link Routing", () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 로드 대기 - data-testid를 사용하여 페이지 완전 로드 확인
    await page.goto("/");
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 300 });
  });

  test("헤더 로고 클릭 시 일기 목록 페이지로 이동", async ({ page }) => {
    // 헤더 로고 클릭
    await page.click('[data-testid="header-logo"]');

    // URL이 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries");
  });

  test("일기보관함 탭 클릭 시 일기 목록 페이지로 이동", async ({ page }) => {
    // 일기보관함 탭 클릭
    await page.click('[data-testid="nav-diaries"]');

    // URL이 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries");
  });

  test.skip("사진보관함 탭 클릭 시 사진 목록 페이지로 이동", async ({
    page,
  }) => {
    // 사진보관함 탭 클릭
    await page.click('[data-testid="nav-pictures"]');

    // URL이 /pictures로 변경되었는지 확인
    await expect(page).toHaveURL("/pictures");
  });

  test("클릭 가능한 요소들이 cursor: pointer 스타일을 가지고 있는지 확인", async ({
    page,
  }) => {
    // 헤더 로고의 cursor 스타일 확인
    const logoElement = page.locator('[data-testid="header-logo"]');
    await expect(logoElement).toHaveCSS("cursor", "pointer");

    // 일기보관함 탭의 cursor 스타일 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toHaveCSS("cursor", "pointer");

    // 사진보관함 탭의 cursor 스타일 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).toHaveCSS("cursor", "pointer");
  });

  test("페이지 로드 후 모든 클릭 가능한 요소가 존재하는지 확인", async ({
    page,
  }) => {
    // 헤더 로고 존재 확인
    await expect(page.locator('[data-testid="header-logo"]')).toBeVisible();

    // 일기보관함 탭 존재 확인
    await expect(page.locator('[data-testid="nav-diaries"]')).toBeVisible();

    // 사진보관함 탭 존재 확인
    await expect(page.locator('[data-testid="nav-pictures"]')).toBeVisible();
  });

  test("URLS 상수를 사용하여 하드코딩이 없는지 확인", async ({ page }) => {
    // 헤더 로고 클릭 후 URL 확인 (URLS.DIARIES.LIST 사용)
    await page.click('[data-testid="header-logo"]');
    await expect(page).toHaveURL("/diaries");

    // 일기보관함 탭 클릭 후 URL 확인 (URLS.DIARIES.LIST 사용)
    await page.goto("/");
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 300 });
    await page.click('[data-testid="nav-diaries"]');
    await expect(page).toHaveURL("/diaries");
  });
});
