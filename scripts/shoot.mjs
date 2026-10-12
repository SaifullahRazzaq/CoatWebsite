// Screenshot harness. Drives the page to given scroll fractions at given
// viewport widths and writes PNGs for review.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const OUT = process.env.OUT ?? "/private/tmp/claude-501/-Users-waleedjawaid-Desktop-Website/29cc814e-a046-4c76-b909-53068294816c/scratchpad/shots-site";

// [name, width, height]
const VIEWPORTS = JSON.parse(process.env.VIEWPORTS ?? '[["1440",1440,900]]');
// scroll positions in viewport-heights
const STOPS = JSON.parse(process.env.STOPS ?? "[0]");

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const [name, w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`  !! ${name} pageerror:`, e.message));
  page.on("console", (m) => m.type() === "error" && console.log(`  !! ${name} console:`, m.text().slice(0, 200)));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  for (const stop of STOPS) {
    await page.evaluate((s) => {
      const y = window.innerHeight * s;
      // Lenis owns scrolling; jump instantly then let ScrollTrigger settle.
      const l = window.__lenis;
      if (l) l.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    }, stop);
    await page.waitForTimeout(900);
    const label = String(stop).replace(".", "_");
    await page.screenshot({ path: `${OUT}/${name}-vh${label}.png` });
  }

  // horizontal overflow check
  const overflow = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth,
  }));
  if (overflow.doc > overflow.win + 1) {
    console.log(`  !! ${name} HORIZONTAL OVERFLOW: ${overflow.doc} > ${overflow.win}`);
  } else {
    console.log(`  ok ${name} no horizontal overflow (${overflow.doc}/${overflow.win})`);
  }

  await ctx.close();
}

await browser.close();
console.log("done ->", OUT);
