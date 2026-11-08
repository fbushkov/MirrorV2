// PDF презентации для заказчиков из slides.html: каждый <section class="slide"> — страница 1920×1080.
// Запуск из корня репозитория: node docs/presentation/shots.mjs (если сайт или кабинет менялись), затем node docs/presentation/build.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
const here = fileURLToPath(new URL(".", import.meta.url));

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(`file://${here}slides.html`, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.emulateMedia({ media: "print" });
await p.pdf({ path: `${here}mirror-presentation.pdf`, width: "1920px", height: "1080px", printBackground: true, preferCSSPageSize: true });
// Превью слайдов для проверки: по картинке на слайд
const n = await p.locator(".slide").count();
await p.emulateMedia({ media: "screen" });
await p.addStyleTag({ content: ".slide{margin:0!important;box-shadow:none!important}body{background:#fff}" });
for (let i = 0; i < n; i++) await p.locator(".slide").nth(i).screenshot({ path: `${process.env.PREVIEW_DIR ?? here + "preview"}/${String(i + 1).padStart(2, "0")}.png` });
console.log(`mirror-presentation.pdf: ${n} слайдов`);
await b.close();
