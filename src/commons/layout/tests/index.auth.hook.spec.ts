import { test, expect } from "@playwright/test";

test.describe("Layout Auth Hook Tests", () => {
  test.describe("비로그인유저 시나리오", () => {
    test("1. 비회원으로 /diaries에 접속하여 페이지 로드 확인", async ({
      page,
    }) => {
      await page.goto("/diaries");

      // 페이지 로드 확인 (data-testid 대기)
      await expect(page.locator('[data-testid="area-header"]')).toBeVisible();
    });

    test("2. layout의 로그인버튼 노출여부 확인", async ({ page }) => {
      await page.goto("/diaries");

      // 로그인 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    });

    test("3. 로그인버튼 클릭하여 /auth/login 페이지로 이동", async ({
      page,
    }) => {
      await page.goto("/diaries");

      // 로그인 버튼 클릭
      await page.click('[data-testid="login-button"]');

      // /auth/login 페이지로 이동 확인
      await expect(page).toHaveURL("/auth/login");
    });
  });

  test.describe("로그인유저 시나리오", () => {
    test("1. 비회원으로 /auth/login에 접속하여 페이지 로드 확인", async ({
      page,
    }) => {
      await page.goto("/auth/login");

      // 페이지 로드 확인 (로그인 폼이 표시되는지 확인)
      await expect(
        page.locator('[data-testid="auth-login-form"]')
      ).toBeVisible();
    });

    test("2. 로그인시도", async ({ page }) => {
      await page.goto("/auth/login");

      // 로그인 폼 입력
      await page.fill('[data-testid="email-input"]', "749884738@dldl.com");
      await page.fill('[data-testid="password-input"]', "asdf12345");

      // 로그인 버튼 클릭
      await page.click('[data-testid="login-button"]');

      // 로그인 성공 후 완료 모달 클릭 대기
      await page.waitForSelector('[data-testid="login-success-modal"]', {
        timeout: 5000,
      });
      await page.click('[data-testid="modal-confirm-button"]');
    });

    test("3. 로그인 성공 후, 완료 모달 클릭하여 /diaries 페이지 로드 확인", async ({
      page,
    }) => {
      await page.goto("/auth/login");

      // 로그인 폼 입력 및 제출
      await page.fill('[data-testid="email-input"]', "749884738@dldl.com");
      await page.fill('[data-testid="password-input"]', "asdf12345");
      await page.click('[data-testid="login-button"]');

      // 로그인 성공 후 완료 모달 클릭
      await page.waitForSelector('[data-testid="login-success-modal"]', {
        timeout: 5000,
      });
      await page.click('[data-testid="modal-confirm-button"]');

      // /diaries 페이지 로드 확인
      await expect(page).toHaveURL("/diaries");
      await expect(page.locator('[data-testid="area-header"]')).toBeVisible();
    });

    test("4. layout에서 유저이름, 로그아웃버튼 노출여부 확인", async ({
      page,
    }) => {
      await page.goto("/auth/login");

      // 로그인 수행
      await page.fill('[data-testid="email-input"]', "749884738@dldl.com");
      await page.fill('[data-testid="password-input"]', "asdf12345");
      await page.click('[data-testid="login-button"]');

      // 로그인 성공 후 완료 모달 클릭
      await page.waitForSelector('[data-testid="login-success-modal"]', {
        timeout: 5000,
      });
      await page.click('[data-testid="modal-confirm-button"]');

      // /diaries 페이지에서 header가 표시되는지 확인
      await expect(page.locator('[data-testid="area-header"]')).toBeVisible();

      // 인증 상태 업데이트를 위해 페이지 새로고침
      await page.reload();
      await expect(page.locator('[data-testid="area-header"]')).toBeVisible();

      // 유저이름과 로그아웃 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="auth-status"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
    });

    test("6. 로그아웃버튼 클릭하여 /auth/login 페이지 로드 확인", async ({
      page,
    }) => {
      await page.goto("/auth/login");

      // 로그인 수행
      await page.fill('[data-testid="email-input"]', "749884738@dldl.com");
      await page.fill('[data-testid="password-input"]', "asdf12345");
      await page.click('[data-testid="login-button"]');

      // 로그인 성공 후 완료 모달 클릭
      await page.waitForSelector('[data-testid="login-success-modal"]', {
        timeout: 5000,
      });
      await page.click('[data-testid="modal-confirm-button"]');

      // 로그아웃 버튼 클릭
      await page.click('[data-testid="logout-button"]');

      // /auth/login 페이지로 이동 확인
      await expect(page).toHaveURL("/auth/login");
    });

    test("8. /diaries에 접속하여 페이지 로드 확인", async ({ page }) => {
      await page.goto("/auth/login");

      // 로그인 수행
      await page.fill('[data-testid="email-input"]', "749884738@dldl.com");
      await page.fill('[data-testid="password-input"]', "asdf12345");
      await page.click('[data-testid="login-button"]');

      // 로그인 성공 후 완료 모달 클릭
      await page.waitForSelector('[data-testid="login-success-modal"]', {
        timeout: 5000,
      });
      await page.click('[data-testid="modal-confirm-button"]');

      // 로그아웃 수행
      await page.click('[data-testid="logout-button"]');

      // /diaries에 접속
      await page.goto("/diaries");

      // 페이지 로드 확인
      await expect(page.locator('[data-testid="area-header"]')).toBeVisible();
    });

    test("9. layout에 로그인버튼 노출여부 확인", async ({ page }) => {
      await page.goto("/auth/login");

      // 로그인 수행
      await page.fill('[data-testid="email-input"]', "749884738@dldl.com");
      await page.fill('[data-testid="password-input"]', "asdf12345");
      await page.click('[data-testid="login-button"]');

      // 로그인 성공 후 완료 모달 클릭
      await page.waitForSelector('[data-testid="login-success-modal"]', {
        timeout: 5000,
      });
      await page.click('[data-testid="modal-confirm-button"]');

      // 로그아웃 수행
      await page.click('[data-testid="logout-button"]');

      // /diaries에 접속
      await page.goto("/diaries");

      // 로그인 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    });
  });
});
