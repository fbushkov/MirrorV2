import type { Metadata } from "next"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Section } from "@/components/site/section"
import { LEGAL_LINKS } from "@/content/site"

// Тексты документов перенесены без изменений из старого сайта (docs/content/legal)
const SLUGS = ["privacy-policy", "terms-of-use", "data-processing-consent"] as const

async function loadDoc(slug: string) {
  "use cache"
  if (!(SLUGS as readonly string[]).includes(slug)) return null
  const raw = await readFile(path.join(process.cwd(), "docs/content/legal", `${slug}.md`), "utf8")
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  const title = match?.[1].match(/title:\s*(.+)/)?.[1].trim() ?? slug
  return { title, body: match ? raw.slice(match[0].length) : raw }
}

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const doc = await loadDoc(slug)
  return { title: doc?.title ?? "Документ" }
}

export default async function DocPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params
  const doc = await loadDoc(slug)
  if (!doc) notFound()
  return (
    <Section className="pt-28 md:pt-36" containerClassName="max-w-3xl">
      <nav className="mb-8 flex flex-wrap gap-2 text-sm">
        {LEGAL_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={l.href.endsWith(slug) ? "rounded-full bg-secondary px-3 py-1 text-secondary-foreground" : "rounded-full px-3 py-1 text-muted-foreground hover:text-foreground"}
          >
            {l.title}
          </a>
        ))}
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{doc.title}</h1>
      <article className="prose-mirror mt-6">
        <ReactMarkdown>{doc.body}</ReactMarkdown>
      </article>
    </Section>
  )
}
