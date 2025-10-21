import { test, expect } from "@playwright/test";

/**
 * AuthSignup Form Hook E2E 테스트
 *
 * 회원가입 폼의 검증, API 통합, 모달 동작을 테스트합니다.
 * TDD 방식으로 구현되었으며 실제 API를 사용합니다.
 */
test.describe("AuthSignup Form Hook", () => {
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto("/auth/signup");

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="auth-signup-container"]');
  });

  test.describe("Form Validation", () => {
    test("should show validation errors for empty fields", async ({ page }) => {
      // 빈 폼으로 제출 시도 - 폼 자체에 submit 이벤트 발생
      await page
        .locator("form")
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());

      // 에러 메시지들이 표시되는지 확인
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="password-error"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="password-confirm-error"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
    });

    test("should validate email format", async ({ page }) => {
      // 잘못된 이메일 형식 입력 (@ 포함하지만 형식이 틀림)
      await page.fill('[data-testid="email-input"]', "invalid@");
      await page
        .locator("form")
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());

      // 이메일 에러 메시지 확인
      await expect(page.locator('[data-testid="email-error"]')).toContainText(
        "올바른 이메일 형식을 입력해주세요"
      );
    });

    test("should validate email contains @ symbol", async ({ page }) => {
      // '@' 없는 이메일 입력
      await page.fill('[data-testid="email-input"]', "testexample.com");
      await page
        .locator("form")
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());

      // '@' 포함 에러 메시지 확인
      await expect(page.locator('[data-testid="email-error"]')).toContainText(
        "이메일에 '@'가 포함되어야 합니다"
      );
    });

    test("should validate name minimum length", async ({ page }) => {
      // 빈 이름 입력
      await page.fill('[data-testid="name-input"]', "");
      await page
        .locator("form")
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());

      // 이름 에러 메시지 확인
      await expect(page.locator('[data-testid="name-error"]')).toContainText(
        "이름을 입력해주세요"
      );
    });

    test("should validate password requirements", async ({ page }) => {
      // 짧은 비밀번호 입력
      await page.fill('[data-testid="password-input"]', "123");
      await page
        .locator("form")
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());

      // 비밀번호 길이 에러 확인
      await expect(
        page.locator('[data-testid="password-error"]')
      ).toContainText("비밀번호는 8자 이상이어야 합니다");

      // 영문+숫자 조건 위반
      await page.fill('[data-testid="password-input"]', "onlyletters");
      await page
        .locator("form")
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());

      await expect(
        page.locator('[data-testid="password-error"]')
      ).toContainText("영문과 숫자를 포함해야 합니다");
    });

    test("should validate password confirmation", async ({ page }) => {
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="password-confirm-input"]', "different123");
      await page
        .locator("form")
        .evaluate((form) => (form as HTMLFormElement).requestSubmit());

      // 비밀번호 불일치 에러 확인
      await expect(
        page.locator('[data-testid="password-confirm-error"]')
      ).toContainText("비밀번호가 일치하지 않습니다");
    });

    test("should enable submit button when all fields are valid", async ({
      page,
    }) => {
      // 유효한 데이터 입력
      await page.fill('[data-testid="email-input"]', "test@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="password-confirm-input"]', "password123");
      await page.fill('[data-testid="name-input"]', "테스트사용자");

      // 제출 버튼이 활성화되는지 확인
      await expect(
        page.locator('[data-testid="signup-submit-button"]')
      ).toBeEnabled();
    });
  });

  test.describe("API Integration - Success Scenario", () => {
    test("should successfully create user and show success modal", async ({
      page,
    }) => {
      // 실제 API 사용 (모킹하지 않음)
      const timestamp = Date.now();
      const uniqueEmail = `test${timestamp}@example.com`;

      // API 응답 감시 설정 (_id 반환 확인용)
      let apiResponse: unknown = null;
      await page.route("**/graphql", async (route) => {
        const response = await route.fetch();
        const responseBody = await response.text();
        apiResponse = JSON.parse(responseBody);
        await route.fulfill({ response });
      });

      // 유효한 데이터로 폼 작성
      await page.fill('[data-testid="email-input"]', uniqueEmail);
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="password-confirm-input"]', "password123");
      await page.fill('[data-testid="name-input"]', "테스트사용자");

      // 폼 제출
      await page.click('[data-testid="signup-submit-button"]');

      // 로딩 상태 확인
      await expect(
        page.locator('[data-testid="signup-submit-button"]')
      ).toContainText("가입 중...");

      // 성공 모달이 나타나는지 확인 (2초 이내)
      await expect(
        page.locator('[data-testid="signup-success-modal"]')
      ).toBeVisible({ timeout: 2000 });

      // API 응답에서 _id 반환 확인
      expect(apiResponse).toBeTruthy();
      const response = apiResponse as { data?: { createUser?: { _id?: string } } };
      expect(response.data?.createUser?._id).toBeTruthy();
      expect(typeof response.data?.createUser?._id).toBe("string");

      // 모달 내용 확인
      await expect(page.locator("text=가입 완료")).toBeVisible();
      await expect(
        page.locator("text=회원가입이 완료되었습니다.")
      ).toBeVisible();

      // 확인 버튼 클릭 (모달 내부의 버튼만 선택)
      await page
        .locator('[data-testid="signup-success-modal"] button:has-text("확인")')
        .click();

      // 로그인 페이지로 이동했는지 확인
      await expect(page).toHaveURL("/auth/login");
    });
  });

  test.describe("API Integration - Failure Scenario", () => {
    test("should show error modal when API fails", async ({ page }) => {
      // API 실패 시나리오를 위한 모킹
      await page.route("**/graphql", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [{ message: "이미 존재하는 이메일입니다." }],
          }),
        });
      });

      // 폼 작성 및 제출
      await page.fill('[data-testid="email-input"]', "existing@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="password-confirm-input"]', "password123");
      await page.fill('[data-testid="name-input"]', "테스트사용자");

      await page.click('[data-testid="signup-submit-button"]');

      // 에러 모달이 나타나는지 확인 (2초 이내)
      await expect(
        page.locator('[data-testid="signup-error-modal"]')
      ).toBeVisible({ timeout: 2000 });

      // 모달 내용 확인
      await expect(page.locator("text=가입 실패")).toBeVisible();
      await expect(
        page.locator("text=이미 존재하는 이메일입니다.")
      ).toBeVisible();

      // 확인 버튼 클릭 (모달 내부의 버튼만 선택)
      await page
        .locator('[data-testid="signup-error-modal"] button:has-text("확인")')
        .click();

      // 모달이 닫히고 같은 페이지에 남아있는지 확인
      await expect(
        page.locator('[data-testid="signup-error-modal"]')
      ).not.toBeVisible();
      await expect(page).toHaveURL("/auth/signup");
    });
  });

  test.describe("Modal Behavior", () => {
    test("should show error modal for each API failure", async ({ page }) => {
      // API 실패 모킹
      await page.route("**/graphql", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [{ message: "테스트 에러" }],
          }),
        });
      });

      // 폼 작성
      await page.fill('[data-testid="email-input"]', "test@example.com");
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="password-confirm-input"]', "password123");
      await page.fill('[data-testid="name-input"]', "테스트사용자");

      // 첫 번째 제출
      await page.click('[data-testid="signup-submit-button"]');

      // 에러 모달 확인 및 닫기
      await expect(
        page.locator('[data-testid="signup-error-modal"]')
      ).toBeVisible({ timeout: 2000 });

      await page
        .locator('[data-testid="signup-error-modal"] button:has-text("확인")')
        .click();
      await expect(
        page.locator('[data-testid="signup-error-modal"]')
      ).not.toBeVisible();

      // 두 번째 제출 (같은 조건)
      await page.click('[data-testid="signup-submit-button"]');

      // 모달이 다시 나타나는지 확인 (새로운 API 호출이므로 다시 표시되어야 함)
      await expect(
        page.locator('[data-testid="signup-error-modal"]')
      ).toBeVisible({ timeout: 2000 });
    });

    test("should show success modal and navigate to login", async ({
      page,
    }) => {
      const timestamp = Date.now();
      const uniqueEmail = `test${timestamp}@example.com`;

      // 폼 작성 및 제출
      await page.fill('[data-testid="email-input"]', uniqueEmail);
      await page.fill('[data-testid="password-input"]', "password123");
      await page.fill('[data-testid="password-confirm-input"]', "password123");
      await page.fill('[data-testid="name-input"]', "테스트사용자");

      await page.click('[data-testid="signup-submit-button"]');

      // 성공 모달 확인
      await expect(
        page.locator('[data-testid="signup-success-modal"]')
      ).toBeVisible({ timeout: 2000 });

      // 모달 닫기
      await page
        .locator('[data-testid="signup-success-modal"] button:has-text("확인")')
        .click();

      // 로그인 페이지로 이동 확인
      await expect(page).toHaveURL("/auth/login");
    });
  });
});
