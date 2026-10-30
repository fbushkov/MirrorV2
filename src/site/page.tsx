import type { Metadata } from "next"
import { SITE_PAGES, loadPageHtml } from "./index"

/** Метаданные страницы прототипа по её ключу (route в prototype/home/pages/*.html). */
export function siteMetadata(key: string): Metadata {
  const page = SITE_PAGES.find((p) => p.key === key)
  if (!page) throw new Error(`Нет страницы ${key} в src/site/manifest.json: выгрузите прототип командой python3 prototype/home/build.py --next`)
  return { title: { absolute: page.title }, description: page.description, alternates: { canonical: page.path } }
}

/** Страница в дизайне прототипа: разметка, стили и скрипты без изменений (ADR-0008). */
export async function SitePage({ name }: { name: string }) {
  const html = await loadPageHtml(name)
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />
}
