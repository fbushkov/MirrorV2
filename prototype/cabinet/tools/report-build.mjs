// Демо-отчёт «Банка N» из src/content/demo-report.ts → vendor/report.json, уже проверенный схемой (report.parse),
// и словарь терминов из src/content/glossary.ts → vendor/glossary.json.
// Прототип кабинета показывает те же данные, что получит настоящий кабинет (ADR-0009). Запуск: node prototype/cabinet/tools/report-build.mjs
import { build } from "vite";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeFile, rm } from "node:fs/promises";
const here = fileURLToPath(new URL(".", import.meta.url));
const repo = here + "../../../";
const tmp = here + ".tmp/";
await build({
  root: repo, logLevel: "warn", configFile: false,
  resolve: { alias: { "@": repo + "src" } },
  build: { outDir: tmp, emptyOutDir: true, minify: false, ssr: here + "report-entry.ts", rollupOptions: { output: { entryFileNames: "report.mjs" } } },
});
const { parsed, glossary } = await import(pathToFileURL(tmp + "report.mjs").href);
await writeFile(here + "../vendor/report.json", JSON.stringify(parsed) + "\n");
await writeFile(here + "../vendor/glossary.json", JSON.stringify(glossary) + "\n");
await rm(tmp, { recursive: true });
console.log("vendor/report.json:", parsed.id);
