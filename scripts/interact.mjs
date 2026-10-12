import { chromium } from "playwright";
const OUT = "/private/tmp/claude-501/-Users-waleedjawaid-Desktop-Website/29cc814e-a046-4c76-b909-53068294816c/scratchpad/shots-site";
const browser = await chromium.launch();

// 1. Mobile menu curtain
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("!! menu pageerror:", e.message));
  await page.goto("http://127.0.0.1:3210", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: /open menu/i }).click();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/x-mobile-menu.png` });
  await ctx.close();
}

// 2. Anatomy hotspot hover + collection hover, desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("!! desktop pageerror:", e.message));
  await page.goto("http://127.0.0.1:3210", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const anatomy = page.locator("text=Read the garment.").first();
  await anatomy.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const spots = page.locator("[data-hotspot]");
  console.log("hotspots:", await spots.count());
  await spots.nth(0).hover();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/x-anatomy-hover.png` });

  const row = page.locator("article[data-collection]").nth(1);
  await row.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await row.hover();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/x-collection-hover.png` });
  await ctx.close();
}

// 3. Reduced motion: everything must still be readable and complete.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("!! reduced pageerror:", e.message));
  await page.goto("http://127.0.0.1:3210", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/x-reduced-hero.png` });
  const h = await page.evaluate(() => document.body.scrollHeight);
  console.log("reduced-motion page height:", h);
  await ctx.close();
}

await browser.close();
console.log("interactions done");
