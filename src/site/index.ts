import { readFile } from "node:fs/promises"
import path from "node:path"
import manifest from "./manifest.json"
import shell from "./shell.json"

/**
 * Страницы сайта в дизайне прототипа (ADR-0008). Разметку выгружает `python3 prototype/home/build.py --next`:
 * src/site/pages/*.html — содержимое страниц, manifest.json — адреса и метаданные, shell.json — шапка и подвал
 * для страниц на React (документы, 404). Править дизайн и тексты — в prototype/home, затем выгрузить снова.
 */
export type SitePage = { path: string; key: string; title: string; description: string }

export const SITE_PAGES = manifest as SitePage[]
export const SHELL = shell as { header: string; footer: string; tail: string }

export async function loadPageHtml(key: string): Promise<string> {
  "use cache"
  return readFile(path.join(process.cwd(), "src/site/pages", `${key}.html`), "utf8")
}
