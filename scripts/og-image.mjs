// Картинка для превью ссылок (Open Graph) public/og.png, 1200×630. Запуск из корня: node scripts/og-image.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const logo = readFileSync("prototype/home/assets/logo.svg", "utf8").replace(/<\?xml[^>]*>/, "").replace(/\spreserveAspectRatio="[^"]*"/, "");
const font = (f) => `data:font/woff2;base64,${readFileSync(`public/fonts/${f}`).toString("base64")}`;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Onest;font-weight:100 900;src:url(${font("onest-cyrillic.woff2")}) format("woff2");unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
@font-face{font-family:Onest;font-weight:100 900;src:url(${font("onest-latin.woff2")}) format("woff2")}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;padding:28px;background:#f7f7fb;font-family:Onest,sans-serif;color:#17142b}
.card{height:100%;padding:56px 64px;border-radius:32px;background:#fff;display:flex;flex-direction:column;justify-content:space-between}
.logo svg{height:44px;width:234px;display:block}
h1{font:400 76px/1.04 Onest;letter-spacing:-.025em}
p{display:flex;justify-content:space-between;font:400 26px/1.3 Onest;color:#5f5b76}p b{font-weight:400;color:#7a2fd1}
</style><div class="card"><div class="logo">${logo}</div><h1>Сверяем обещания<br>работодателя<br>с реальностью</h1><p><span>Оценка HR-бренда и здоровье культуры</span><b>mirror-com.ru</b></p></div>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: "public/og.png" });
await b.close();
console.log("public/og.png");
