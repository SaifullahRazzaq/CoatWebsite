// Reduced-motion contract: every masked line must be handed to the visitor,
// no pin may be created, and the curtain must never play.
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
const problems = [];
page.on("pageerror", (e) => problems.push("pageerror: " + e.message));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

const report = await page.evaluate(() => {
  const hidden = [];
  // Any line still translated out of its mask is content the visitor will
  // never see.
  document
    .querySelectorAll("[data-hero-line] > *, [data-quote-line] > *, [data-reveal-line] > *")
    .forEach((el) => {
      const t = getComputedStyle(el).transform;
      const box = el.getBoundingClientRect();
      if (t && t !== "none") {
        const m = new DOMMatrixReadOnly(t);
        if (Math.abs(m.f) > 2 && box.height > 0) {
          hidden.push((el.textContent || "").trim().slice(0, 40) + ` [y=${m.f.toFixed(0)}]`);
        }
      }
    });

  const faded = [];
  document.querySelectorAll("[data-reveal-fade], [data-copy]").forEach((el) => {
    if (parseFloat(getComputedStyle(el).opacity) < 0.05 &&
        getComputedStyle(el).display !== "none") {
      faded.push((el.textContent || "").trim().slice(0, 40));
    }
  });

  const pre = document.querySelector('[class*="z-[150]"]');
  return {
    hidden,
    faded,
    preloaderVisible: pre ? getComputedStyle(pre).display !== "none" : false,
    pinSpacers: document.querySelectorAll(".pin-spacer").length,
    height: document.body.scrollHeight,
    h1: document.querySelector("h1")?.textContent?.trim().slice(0, 60) ?? null,
  };
});
await browser.close();

if (report.hidden.length) problems.push("lines still masked: " + JSON.stringify(report.hidden));
if (report.faded.length) problems.push("blocks still faded out: " + JSON.stringify(report.faded));
if (report.preloaderVisible) problems.push("preloader played under reduced motion");
if (report.pinSpacers > 0) problems.push(`created ${report.pinSpacers} pin(s) under reduced motion`);
if (!report.h1) problems.push("no h1 on the page");

console.log(JSON.stringify(report, null, 1));
if (problems.length) {
  console.log("\nPROBLEMS:\n" + problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("\nreduced-motion contract: ok");
}
