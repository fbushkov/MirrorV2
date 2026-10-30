import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Локальная сборка превью-артефакта (не в git)
    ".preview/**",
    // Статичный HTML-прототип по макету Figma — эталон для переноса, не код сайта
    "prototype/**",
    // Скрипты прототипа и своя сборка ECharts, выгруженные build.py --next (ADR-0008)
    "public/site/**",
  ]),
]);

export default eslintConfig;
