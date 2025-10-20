import { test, expect } from "@playwright/test";

test.describe("/pictures binding", () => {
  test("loads real images from dog.ceo and infinite scrolls", async ({
    page,
  }) => {
    await page.goto("/pictures");
    await page.getByTestId("pictures-sentinel").waitFor({ state: "attached" });

    const firstImages = page.getByTestId("pictures-grid").locator("img");
    await firstImages.nth(5).waitFor({ state: "attached", timeout: 1500 });

    // Verify src contains dog.ceo domain
    const srcs = await firstImages.evaluateAll((els) =>
      els.map((e) => (e as HTMLImageElement).src)
    );
    expect(srcs.some((s) => s.includes("dog.ceo"))).toBeTruthy();

    // Trigger infinite scroll by bringing sentinel into view
    await page.getByTestId("pictures-sentinel").scrollIntoViewIfNeeded();
    // Backup scroll in case layout needs more scroll distance
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Expect at least 12 images after fetching next page
    await page
      .getByTestId("pictures-grid")
      .locator("img")
      .nth(11)
      .waitFor({ state: "attached", timeout: 1500 });
  });

  test("handles API failure scenario (mocked)", async ({ page, context }) => {
    await context.route("https://dog.ceo/**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ status: "error" }),
      });
    });

    await page.goto("/pictures");
    await page.getByTestId("pictures-sentinel").waitFor({ state: "attached" });

    await expect(page.getByRole("alert")).toBeVisible({ timeout: 300 });
  });
});
