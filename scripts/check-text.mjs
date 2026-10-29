// Проверка символов и текстов: невидимые символы, эмодзи, NBSP символом в коде,
// стрелки и штампы в текстах для посетителя, дефис вместо тире, запрещённые темы.
// Запуск: npm run check:text (входит в npm run check и CI).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SCAN = ["src", "prototype/home/pages", "prototype/home/partials", "prototype/home/src", "prototype/home/build.py"];
const SKIP = /node_modules|\.next|\/dist\//;
const CODE = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".py"]);
const TEXT = new Set([...CODE, ".html"]);

const CLICHES = ["инновационн", "уникальн", "революцион", "откройте для себя", "узнать больше", "узнайте больше", "передов", "непревзойд", "важно отметить", "стоит отметить", "стоит подчеркнуть", "таким образом", "в современном мире", "погрузитесь", "раскройте потенциал", "бесшовн"];
const BANNED = [["пульс культуры", "название «Пульс культуры» не используем"], ["текучест", "текучесть — не наша тема"], ["подбор персонала", "подбор — не наша тема"]];

const files = [];
const walk = (p) => {
  const abs = join(ROOT, p);
  if (SKIP.test(abs)) return;
  if (statSync(abs).isDirectory()) readdirSync(abs).forEach((f) => walk(join(p, f)));
  else if (TEXT.has(extname(abs))) files.push(p);
};
SCAN.forEach(walk);

// Убираем комментарии, но сохраняем переводы строк, чтобы номера строк совпадали
const blank = (m) => m.replace(/[^\n]/g, " ");
function stripComments(s, ext) {
  s = s.replace(/<!--[\s\S]*?-->/g, blank).replace(/\/\*[\s\S]*?\*\//g, blank);
  if (ext === ".py") return s.replace(/"""[\s\S]*?"""/g, blank).replace(/(^|\s)#.*$/gm, blank);
  return s.replace(/(^|[\s;{}(,])\/\/.*$/gm, blank);
}

const problems = [];
const report = (file, text, index, msg) => problems.push(`${file}:${text.slice(0, index).split("\n").length}  ${msg}`);
const each = (text, re, fn) => { for (const m of text.matchAll(re)) fn(m); };

for (const file of files) {
  const raw = readFileSync(join(ROOT, file), "utf8");
  const ext = extname(file);
  each(raw, /[​-‍⁠﻿­]/g, (m) => report(file, raw, m.index, `невидимый символ U+${m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`));
  each(raw, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{2712}\u{2714}\u{2716}-\u{27BF}]/gu, (m) => report(file, raw, m.index, `эмодзи «${m[0]}»`));
  if (CODE.has(ext)) each(raw, / /g, (m) => report(file, raw, m.index, "неразрывный пробел символом — пишите \\u00a0"));
  const text = stripComments(raw, ext);
  const lower = text.toLowerCase();
  each(text, /→/g, (m) => report(file, text, m.index, "стрелка «→» в тексте"));
  each(text, /[А-Яа-яЁё»)] - [А-Яа-яЁё«(]/g, (m) => report(file, text, m.index, `дефис вместо тире: «${m[0]}»`));
  for (const w of CLICHES) for (let i = lower.indexOf(w); i >= 0; i = lower.indexOf(w, i + 1)) report(file, text, i, `штамп «${w}…»`);
  for (const [w, why] of BANNED) for (let i = lower.indexOf(w); i >= 0; i = lower.indexOf(w, i + 1)) report(file, text, i, why);
}

if (problems.length) {
  console.error(`check:text — найдено ${problems.length}:\n` + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log(`check:text — ${files.length} файлов, замечаний нет`);
