// Скриншоты для презентации: сайт (prototype/home/dist) и кабинет (prototype/cabinet/dist), демо-данные «Банка N».
// Запуск из корня репозитория: node docs/presentation/shots.mjs  →  docs/presentation/shots/*.jpg
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../../", import.meta.url));
const site = (f) => `file://${root}prototype/home/dist/${f}.html`;
const cab = `file://${root}prototype/cabinet/dist/cabinet.html`;
const out = (n) => `${root}docs/presentation/shots/${n}.jpg`;

// [имя, адрес, селектор раздела или null (верх страницы), роль и этап кабинета]
const SHOTS = [
  ["site-home", site("index"), null],
  ["site-check", site("hr-brand"), "#check"],
  ["site-metrics", site("hr-brand"), "#metrics"],
  ["demo-summary", site("hr-brand-demo"), "#r-sum"],
  ["demo-promises", site("hr-brand-demo"), "#r-prom"],
  ["demo-matrix", site("hr-brand-demo"), "#r-map"],
  ["health-layers", site("culture-health"), "#layers"],
  ["health-demo", site("culture-health-demo"), "#d-metrics"],
  ["cab-overview", cab + "#overview", null, "owner", "campaign"],
  ["cab-internal", cab + "#internal", null, "owner", "campaign"],
  ["cab-waves", cab + "#internal", ".panel:has(.tbl) .panel__title", "owner", "campaign"],
  ["cab-manager", cab + "#internal", null, "manager", "campaign"],
  ["cab-brief", cab + "#brief", null, "executive", "campaign"],
  ["cab-decisions", cab + "#decisions", null, "owner", "campaign"],
  ["cab-launch", cab + "#overview", null, "owner", "diag-setup"],
  ["cab-survey", cab + "#overview", null, "owner", "diag-survey"],
  ["cab-questions", cab + "#questions", null, "owner", "campaign"],
];

const b = await chromium.launch();
for (const [name, url, sel, role, mode] of SHOTS) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  if (role) await ctx.addInitScript(([r, m]) => { localStorage.setItem("cab-role", r); localStorage.setItem("cab-service", m); }, [role, mode]);
  const p = await ctx.newPage();
  await p.goto(url);
  // В кабинете прячем полосу прототипа: на скриншоте только интерфейс клиента
  if (role) await p.addStyleTag({ content: ".demo{display:none!important}.side{top:0!important;height:100vh!important}.app{min-height:100vh!important}" });
  await p.waitForTimeout(1200);
  if (sel) {
    await p.evaluate(([s, off]) => { const el = document.querySelector(s); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off); }, [sel, role ? 24 : 200]);
    await p.waitForTimeout(800);
  }
  await p.screenshot({ path: out(name), type: "jpeg", quality: 88 });
  console.log(name);
  await ctx.close();
}
await b.close();
