// 모바일 뷰포트 스크린샷 (검수용)
import { createRequire } from "module";
import path from "path";
const require = createRequire(import.meta.url);
const gRoot = require("child_process").execSync("npm root -g").toString().trim();
const puppeteer = require(path.join(gRoot, "puppeteer-core"));
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
(await import("fs")).mkdirSync(path.join(root, "scripts/shots"), { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto("file:///" + path.join(root, "site/index.html").split(path.sep).join("/") + (process.env.Q || ""), { waitUntil: "load" });
const shots = process.argv.slice(2).length ? process.argv.slice(2) : ["0", "#map", "#s1", "#s4", "#s9", "#finish"];
for (const [i, t] of shots.entries()) {
  await page.evaluate((t) => { if (t.startsWith("#")) document.querySelector(t).scrollIntoView({ behavior: "instant" }); else scrollTo({ top: +t, behavior: "instant" }); }, t);
  await new Promise((r) => setTimeout(r, 3800));
  await page.screenshot({ path: path.join(root, `scripts/shots/${i}.png`) });
}
console.log("errors:", errs.length ? errs : "none");
await browser.close();
