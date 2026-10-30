import type { Metadata } from "next"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { LEGAL_LINKS } from "@/content/site"
import { typograf } from "@/lib/typograf"
import { SiteShell } from "@/site/shell"

// Тексты документов перенесены без изменений из старого сайта (docs/content/legal)
const SLUGS = ["privacy-policy", "terms-of-use", "data-processing-consent"] as const

async function loadDoc(slug: string) {
  "use cache"
  if (!(SLUGS as readonly string[]).includes(slug)) return null
  const raw = await readFile(path.join(process.cwd(), "docs/content/legal", `${slug}.md`), "utf8")
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  const title = match?.[1].match(/title:\s*(.+)/)?.[1].trim() ?? slug
  // Типограф на сервере: текст на React не трогает скрипт прототипа (data-no-typograf), иначе гидратация расходится
  return { title: typograf(title), body: typograf(match ? raw.slice(match[0].length) : raw) }
}

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const doc = await loadDoc(slug)
  return { title: doc?.title ?? "Документ", alternates: { canonical: `/docs/${slug}` } }
}

export default async function DocPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params
  const doc = await loadDoc(slug)
  if (!doc) notFound()
  return (
    <SiteShell>
      <main data-no-typograf>
        <section className="page-hero" aria-labelledby="page-title">
          <ol className="crumbs" aria-label="Хлебные крошки">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- полная загрузка: скрипты страниц прототипа запускаются при открытии */}
            <li><a href="/">Главная</a></li>
            <li><span aria-current="page">{doc.title}</span></li>
          </ol>
          <div className="page-hero__head">
            <h1 className="hero__title" id="page-title">{doc.title}</h1>
          </div>
          <nav className="docnav" aria-label="Документы">
            {LEGAL_LINKS.map((l) => (
              <a key={l.href} href={l.href} aria-current={l.href.endsWith(slug) ? "page" : undefined}>{typograf(l.title)}</a>
            ))}
          </nav>
        </section>
        <section className="section section--first">
          <article className="doc">
            <ReactMarkdown>{doc.body}</ReactMarkdown>
          </article>
        </section>
      </main>
    </SiteShell>
  )
}
