import { test, expect } from "@playwright/test";

test.describe("AuthLogin Form Hook", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto("/auth/login");
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="auth-login-form"]', { timeout: 2000 });
  });

  test.describe("폼 검증", () => {
    test("모든 필드가 비어있을 때 로그인 버튼이 비활성화되어야 함", async ({ page }) => {
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeDisabled();
    });

    test("이메일만 입력했을 때 로그인 버튼이 비활성화되어야 함", async ({ page }) => {
      await page.fill('[data-testid="email-input"]', "test@example.com");
      
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeDisabled();
    });

    test("비밀번호만 입력했을 때 로그인 버튼이 비활성화되어야 함", async ({ page }) => {
      await page.fill('[data-testid="password-input"]', "password123");
      
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeDisabled();
    });

    test("모든 필드가 입력되면 로그인 버튼이 활성화되어야 함", async ({ page }) => {
      await page.fill('[data-testid="email-input"]', "test@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeEnabled();
    });

    test("잘못된 이메일 형식일 때 에러 메시지가 표시되어야 함", async ({ page }) => {
      await page.fill('[data-testid="email-input"]', "invalid-email");
      await page.fill('[data-testid="password-input"]', "password123");
      
      // 다른 필드로 포커스 이동하여 validation 트리거
      await page.click('[data-testid="password-input"]');
      
      const errorMessage = page.locator('[data-testid="email-error"]');
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe("로그인 성공 시나리오", () => {
    test("유효한 계정으로 로그인 시 성공 모달이 표시되어야 함", async ({ page }) => {
      // 실제 데이터 사용
      await page.fill('[data-testid="email-input"]', "a@c.com");
      await page.fill('[data-testid="password-input"]', "1234qwer");
      
      // 로그인 버튼 클릭
      await page.click('[data-testid="login-button"]');
      
      // 로딩 상태 확인
      await expect(page.locator('[data-testid="login-button"]')).toContainText("로그인 중...");
      
      // 성공 모달이 표시되는지 확인 (timeout: 2000ms)
      await page.waitForSelector('[data-testid="login-success-modal"]', { timeout: 2000 });
      
      // 모달 내용 확인
      const modal = page.locator('[data-testid="login-success-modal"]');
      await expect(modal).toBeVisible();
      await expect(modal).toContainText("로그인 완료");
      
      // 로컬스토리지에 토큰이 저장되었는지 확인
      const accessToken = await page.evaluate(() => localStorage.getItem("accessToken"));
      expect(accessToken).toBeTruthy();
      
      // 로컬스토리지에 사용자 정보가 저장되었는지 확인
      const user = await page.evaluate(() => localStorage.getItem("user"));
      expect(user).toBeTruthy();
      
      const userData = JSON.parse(user || "{}");
      expect(userData._id).toBeTruthy();
      expect(userData.name).toBeTruthy();
    });

    test("로그인 성공 후 확인 버튼 클릭 시 일기 목록 페이지로 이동해야 함", async ({ page }) => {
      await page.fill('[data-testid="email-input"]', "a@c.com");
      await page.fill('[data-testid="password-input"]', "1234qwer");
      
      await page.click('[data-testid="login-button"]');
      
      // 성공 모달 대기
      await page.waitForSelector('[data-testid="login-success-modal"]', { timeout: 2000 });
      
      // 확인 버튼 클릭
      await page.click('[data-testid="modal-confirm-button"]');
      
      // 일기 목록 페이지로 이동 확인
      await page.waitForURL("/diaries", { timeout: 2000 });
      expect(page.url()).toContain("/diaries");
    });
  });

  test.describe("로그인 실패 시나리오", () => {
    test("잘못된 계정으로 로그인 시 실패 모달이 표시되어야 함", async ({ page }) => {
      // 잘못된 계정 정보
      await page.fill('[data-testid="email-input"]', "wrong@example.com");
      await page.fill('[data-testid="password-input"]', "wrongpassword");
      
      await page.click('[data-testid="login-button"]');
      
      // 실패 모달이 표시되는지 확인 (timeout: 2000ms)
      await page.waitForSelector('[data-testid="login-fail-modal"]', { timeout: 2000 });
      
      // 모달 내용 확인
      const modal = page.locator('[data-testid="login-fail-modal"]');
      await expect(modal).toBeVisible();
      await expect(modal).toContainText("로그인 실패");
    });

    test("로그인 실패 후 확인 버튼 클릭 시 모달이 닫혀야 함", async ({ page }) => {
      await page.fill('[data-testid="email-input"]', "wrong@example.com");
      await page.fill('[data-testid="password-input"]', "wrongpassword");
      
      await page.click('[data-testid="login-button"]');
      
      // 실패 모달 대기
      await page.waitForSelector('[data-testid="login-fail-modal"]', { timeout: 2000 });
      
      // 확인 버튼 클릭
      await page.click('[data-testid="modal-confirm-button"]');
      
      // 모달이 닫혔는지 확인
      await expect(page.locator('[data-testid="login-fail-modal"]')).not.toBeVisible();
    });
  });

  test.describe("API 호출 상태", () => {
    test("로그인 버튼 클릭 시 로딩 상태가 표시되어야 함", async ({ page }) => {
      await page.fill('[data-testid="email-input"]', "a@c.com");
      await page.fill('[data-testid="password-input"]', "1234qwer");
      
      await page.click('[data-testid="login-button"]');
      
      // 로딩 상태 확인
      await expect(page.locator('[data-testid="login-button"]')).toContainText("로그인 중...");
      await expect(page.locator('[data-testid="login-button"]')).toBeDisabled();
    });

    test("API 호출 완료 후 로딩 상태가 해제되어야 함", async ({ page }) => {
      await page.fill('[data-testid="email-input"]', "a@c.com");
      await page.fill('[data-testid="password-input"]', "1234qwer");
      
      await page.click('[data-testid="login-button"]');
      
      // 성공 모달이 표시될 때까지 대기
      await page.waitForSelector('[data-testid="login-success-modal"]', { timeout: 2000 });
      
      // 로딩 상태가 해제되었는지 확인 (모달이 표시되면 로딩이 완료된 것)
      await expect(page.locator('[data-testid="login-button"]')).not.toContainText("로그인 중...");
    });
  });
});
