import { test, expect } from "@playwright/test";

test.describe("DiariesNew Form Functionality", () => {
  // Set viewport size to ensure modal is visible
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should show form validation when fields are empty", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Verify that register button is disabled when form is empty
    await expect(
      page.locator('[data-testid="register-button"]')
    ).toBeDisabled();

    // Try to click register button (should not work)
    await page.click('[data-testid="register-button"]', { force: true });

    // Verify no success modal appears
    await expect(page.locator('[data-testid="success-modal"]')).not.toBeVisible(
      {
        timeout: 400,
      }
    );
  });

  test("should enable register button when all fields are filled", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Fill in all form fields
    await page.click('input[value="Happy"]'); // Select emotion
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "Test Diary Title"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "Test diary content"
    );

    // Verify that register button is now enabled
    await expect(page.locator('[data-testid="register-button"]')).toBeEnabled();
  });

  test("should save diary to localStorage when register button is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Fill in all form fields
    await page.click('input[value="Happy"]'); // Select emotion
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "Test Diary Title"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "Test diary content"
    );

    // Click register button
    await page.click('[data-testid="register-button"]');

    // Wait for success modal to appear
    await page.waitForSelector('[data-testid="success-modal"]');

    // Verify success modal content
    await expect(
      page.locator('[data-testid="success-modal-title"]')
    ).toHaveText("등록 완료", { timeout: 400 });
    await expect(
      page.locator('[data-testid="success-modal-content"]')
    ).toHaveText("일기가 성공적으로 등록되었습니다.", { timeout: 400 });

    // Verify diary was saved to localStorage
    const diaries = await page.evaluate(() => {
      const stored = localStorage.getItem("diaries");
      return stored ? JSON.parse(stored) : [];
    });

    expect(diaries).toHaveLength(1);
    expect(diaries[0]).toMatchObject({
      id: 1,
      title: "Test Diary Title",
      content: "Test diary content",
      emotion: "Happy",
    });
    expect(diaries[0].createdAt).toBeDefined();
  });

  test("should handle different emotion types correctly", async ({ page }) => {
    const emotions = ["Happy", "Sad", "Angry", "Surprise", "Etc"];

    for (const emotion of emotions) {
      // Navigate to diaries page
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diaries-page-loaded"]');

      // Create diary with specific emotion
      await page.click('[data-testid="write-diary-button"]');
      await page.waitForSelector('[data-testid="diary-form-modal"]');
      await page.click(`input[value="${emotion}"]`);
      await page.fill(
        'input[placeholder="제목을 입력합니다."]',
        `Test ${emotion} Diary`
      );
      await page.fill(
        'textarea[placeholder="내용을 입력합니다."]',
        `Test ${emotion} content`
      );
      await page.click('[data-testid="register-button"]');
      await page.waitForSelector('[data-testid="success-modal"]');
      await page.click('[data-testid="success-confirm-button"]');

      // Verify emotion was saved correctly
      const diaries = await page.evaluate(() => {
        const stored = localStorage.getItem("diaries");
        return stored ? JSON.parse(stored) : [];
      });

      const lastDiary = diaries[diaries.length - 1];
      expect(lastDiary.emotion).toBe(emotion);
    }
  });

  test("should navigate to diary detail page when success modal confirm is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Fill in all form fields
    await page.click('input[value="Happy"]');
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "Test Diary Title"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "Test diary content"
    );

    // Click register button
    await page.click('[data-testid="register-button"]');

    // Wait for success modal to appear
    await page.waitForSelector('[data-testid="success-modal"]');

    // Click confirm button
    await page.click('[data-testid="success-confirm-button"]');

    // Verify that both modals are closed
    await expect(page.locator('[data-testid="success-modal"]')).not.toBeVisible(
      {
        timeout: 400,
      }
    );
    await expect(
      page.locator('[data-testid="diary-form-modal"]')
    ).not.toBeVisible({
      timeout: 400,
    });

    // Verify navigation to diary detail page
    await expect(page).toHaveURL(/\/diaries\/\d+/);
  });

  test("should trim whitespace from title and content before saving", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load using data-testid
    await page.waitForSelector('[data-testid="diaries-page-loaded"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Wait for the diary form modal to appear
    await page.waitForSelector('[data-testid="diary-form-modal"]');

    // Fill in form fields with leading/trailing whitespace
    await page.click('input[value="Happy"]');
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "  Test Title  "
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "  Test Content  "
    );

    // Click register button
    await page.click('[data-testid="register-button"]');

    // Wait for success modal to appear
    await page.waitForSelector('[data-testid="success-modal"]');

    // Verify that whitespace was trimmed in localStorage
    const diaries = await page.evaluate(() => {
      const stored = localStorage.getItem("diaries");
      return stored ? JSON.parse(stored) : [];
    });

    expect(diaries).toHaveLength(1);
    expect(diaries[0].title).toBe("Test Title");
    expect(diaries[0].content).toBe("Test Content");
  });
});
