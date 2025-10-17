import { test, expect } from "@playwright/test";

test.describe("Diary Modal Functionality", () => {
  test("should open diary modal when write button is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load completely using data-testid
    await page.waitForSelector('[data-testid="diaries-page"]');

    // Click the write diary button
    await page.click('[data-testid="write-diary-button"]');

    // Verify modal content (DiariesNew) is displayed
    await expect(page.getByText("일기 쓰기")).toBeVisible();
  });

  test("should close diary modal when close button is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load completely
    await page.waitForSelector('[data-testid="diaries-page"]');

    // Open modal
    await page.click('[data-testid="write-diary-button"]');
    // Scope to modal container by stable class combo from provider
    const modal = page
      .locator(".bg-white.rounded-lg.shadow-lg.p-6.relative")
      .first();
    await expect(modal).toBeVisible({ timeout: 1000 });
    await expect(modal.getByText("일기 쓰기")).toBeVisible({ timeout: 1000 });

    // Click the close button inside the modal (avoids grid card close buttons)
    await modal.getByRole("button", { name: "닫기" }).click();

    // Verify modal is closed quickly
    await expect(modal).toBeHidden({ timeout: 1000 });
  });

  test("should close diary modal when backdrop is clicked", async ({
    page,
  }) => {
    // Navigate to diaries page
    await page.goto("/diaries");

    // Wait for page to load completely
    await page.waitForSelector('[data-testid="diaries-page"]');

    // Open modal
    await page.click('[data-testid="write-diary-button"]');
    await expect(page.getByText("일기 쓰기")).toBeVisible();

    // Click on backdrop to close modal (click a safe coordinate outside modal)
    await page.mouse.click(10, 10);

    // Verify modal is closed
    await expect(page.getByText("일기 쓰기")).not.toBeVisible();
  });
});
