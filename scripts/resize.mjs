// Pins must release cleanly and re-measure on resize. A pinned section that
// keeps a stale spacer leaves a band of dead space or a section that scrolls
// under the next one.
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const problems = [];
page.on("pageerror", (e) => problems.push("pageerror: " + e.message));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const measure = async (label) => {
  const m = await page.evaluate(() => {
    const secs = [...document.querySelectorAll("main section")];
    const rects = secs.map((s) => {
      const r = s.getBoundingClientRect();
      return { id: s.id || "?", top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
    });
    // Sections must tile the page: each one's top is the previous one's bottom.
    const gaps = [];
    for (let i = 1; i < rects.length; i += 1) {
      const prevBottom = rects[i - 1].top + rects[i - 1].h;
      const delta = rects[i].top - prevBottom;
      if (Math.abs(delta) > 2) gaps.push(`${rects[i - 1].id}->${rects[i].id}: ${delta}px`);
    }
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      height: document.body.scrollHeight,
      pins: document.querySelectorAll(".pin-spacer").length,
      gaps,
    };
  });
  console.log(label, JSON.stringify(m));
  if (m.overflow > 1) problems.push(`${label}: horizontal overflow ${m.overflow}px`);
  if (m.gaps.length) problems.push(`${label}: section gaps ${JSON.stringify(m.gaps)}`);
  return m;
};

// Park inside the pinned detail sequence, then resize under it.
await page.evaluate(() => window.__lenis?.scrollTo(window.innerHeight * 12, { immediate: true }));
await page.waitForTimeout(900);
await measure("1440 @12vh ");

for (const [w, h] of [[1100, 800], [768, 1024], [390, 844], [1440, 900]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(1400);
  await measure(`${w}         `);
}

await browser.close();
if (problems.length) {
  console.log("\nPROBLEMS:\n" + problems.join("\n"));
  process.exitCode = 1;
} else console.log("\nresize: ok");
