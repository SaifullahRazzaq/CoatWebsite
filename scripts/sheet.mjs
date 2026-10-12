// Contact sheet. Drives the page through a scroll range, then tiles the frames
// into one image so a whole sequence can be reviewed in a single look.
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const OUT = process.env.OUT ?? "./.sheets";
const NAME = process.env.NAME ?? "sheet";
const W = Number(process.env.W ?? 1440);
const H = Number(process.env.H ?? 900);
const STOPS = JSON.parse(process.env.STOPS ?? "[0,1,2,3,4,5,6,7]");
const COLS = Number(process.env.COLS ?? 4);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text().slice(0, 160)));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3200);

const frames = [];
for (const stop of STOPS) {
  await page.evaluate((s) => {
    const y = window.innerHeight * s;
    const l = window.__lenis;
    if (l) l.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, stop);
  await page.waitForTimeout(850);
  const file = `${OUT}/${NAME}-${String(stop).replace(".", "_")}.png`;
  await page.screenshot({ path: file });
  frames.push({ file, stop });
}
await ctx.close();

// Tile
const tile = await browser.newPage({
  viewport: { width: COLS * 460, height: Math.ceil(frames.length / COLS) * 300 },
});
// Inlined as data URIs: a page created by setContent cannot load file:// URLs,
// which silently yields a sheet of black tiles.
const inlined = await Promise.all(
  frames.map(async (f) => ({
    ...f,
    uri: `data:image/png;base64,${(await readFile(f.file)).toString("base64")}`,
  })),
);
const html = `<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${COLS},1fr);gap:3px;font:11px monospace;color:#c8a96b">
${inlined.map(f => `<div style="position:relative"><img src="${f.uri}" style="width:100%;display:block"><span style="position:absolute;left:3px;top:3px;background:#000c;padding:2px 5px">${f.stop}vh</span></div>`).join("")}
</body>`;
await tile.setContent(html, { waitUntil: "load" });
await tile.waitForTimeout(400);
const sheet = `${OUT}/${NAME}-SHEET.png`;
await tile.screenshot({ path: sheet, fullPage: true });
await browser.close();

if (errors.length) console.log("ERRORS:\n" + [...new Set(errors)].join("\n"));
else console.log("no page errors");
console.log("sheet ->", sheet);
