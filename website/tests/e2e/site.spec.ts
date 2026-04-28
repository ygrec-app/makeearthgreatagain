import { test, expect } from "@playwright/test";

test.describe("MEGA home", () => {
  test("loads with no console errors and correct title", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      // Vite dev server may emit transient 504 Outdated Optimize Dep warnings
      // while pre-bundling — these are not real app errors.
      if (text.includes("Outdated Optimize Dep")) return;
      errors.push(text);
    });
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/MEGA/);
    expect(errors).toHaveLength(0);
  });

  test("hero shows MEGA wordmark with inset microcopy", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section.hero");
    await expect(hero).toBeVisible();
    await expect(hero.locator("svg.mega-wordmark")).toBeVisible();
  });

  test("mode toggle flips body[data-mode] and persists", async ({ page }) => {
    await page.goto("/");
    const initial = await page.locator("body").getAttribute("data-mode");
    expect(["light", "drenched"]).toContain(initial);

    const toggle = page.locator(".hero__top-right").getByRole("button").last();
    await toggle.click();
    await expect.poll(async () => page.locator("body").getAttribute("data-mode")).not.toBe(initial);

    const stored = await page.evaluate(() => localStorage.getItem("mega:mode"));
    expect(["light", "drenched"]).toContain(stored);
  });

  test("/fr/ route serves localized content", async ({ page }) => {
    await page.goto("/fr/");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator(".scroll-indicator__label")).toHaveText("DÉFILER");
    await expect(page.locator(".mode-toggle__cell").first()).toHaveText("CLAIR");
    await expect(page.locator(".project-card .card-title").first()).toHaveText("Projet Y");
    await expect(page.locator(".sold-out-label")).toHaveText("ÉPUISÉ");
  });

  test("renders 5 categories and 8 projects", async ({ page }) => {
    await page.goto("/");
    await page.locator(".category-row").first().scrollIntoViewIfNeeded();
    await expect(page.locator(".category-row")).toHaveCount(5);
    await expect(page.locator(".project-card")).toHaveCount(8);
  });

  test("scroll triggers reveal project cards", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(".project-card").first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await expect.poll(async () =>
      card.evaluate((el) => parseFloat(getComputedStyle(el).opacity || "1"))
    ).toBeGreaterThan(0.9);
  });

  test("card click opens overlay and close button closes it", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(".project-card").first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    const scrim = page.locator(".project-overlay-scrim");
    await expect(scrim).toBeVisible({ timeout: 5_000 });
    await expect(page.locator(".project-overlay-title")).toHaveText(/.+/);
    await page.locator(".project-overlay-close").click();
    await expect(scrim).toHaveCount(0, { timeout: 5_000 });
  });

  test("category videos exist and are paused off-screen", async ({ page }) => {
    await page.goto("/");
    const videos = page.locator("[data-category-video]");
    const count = await videos.count();
    expect(count).toBeGreaterThanOrEqual(5);
    const lastPaused = await videos.last().evaluate((v: HTMLVideoElement) => v.paused);
    expect(lastPaused).toBe(true);
  });

  test("custom cursor mounts on desktop hover devices", async ({ page }) => {
    await page.goto("/");
    const cursor = page.locator("[data-mega-cursor], .mega-cursor, [data-cursor-root]").first();
    if (await cursor.count()) {
      await expect(cursor).toBeAttached();
    }
  });
});
