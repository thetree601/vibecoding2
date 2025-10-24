import { test, expect } from "@playwright/test";

test.describe("Layout Area Visibility", () => {
  test("/diaries: header/banner/navigation/footer 보임, 로고 보임", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 400 });

    await expect(page.locator('[data-testid="area-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="header-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="area-banner"]')).toBeVisible();
    await expect(page.locator('[data-testid="area-navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="area-footer"]')).toBeVisible();
  });

  test("/diaries/[id]: header/footer 보임, 배너/네비게이션 숨김", async ({
    page,
  }) => {
    // 테스트 환경에서 인증 우회
    await page.addInitScript(() => {
      (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
    });
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="area-header"]', {
      timeout: 5000,
    });

    await expect(page.locator('[data-testid="area-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="header-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="area-banner"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="area-navigation"]')).toHaveCount(
      0
    );
    await expect(page.locator('[data-testid="area-footer"]')).toBeVisible();
  });

  test.skip("/auth/login: 모든 영역 숨김", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator('[data-testid="area-header"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="header-logo"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="area-banner"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="area-navigation"]')).toHaveCount(
      0
    );
    await expect(page.locator('[data-testid="area-footer"]')).toHaveCount(0);
  });

  test.skip("/auth/signup: 모든 영역 숨김", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.locator('[data-testid="area-header"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="header-logo"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="area-banner"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="area-navigation"]')).toHaveCount(
      0
    );
    await expect(page.locator('[data-testid="area-footer"]')).toHaveCount(0);
  });

  test.skip("/pictures: 영역 가시성은 스킵 정책 적용", async ({ page }) => {
    await page.goto("/pictures");
  });
});
