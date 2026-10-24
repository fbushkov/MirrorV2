import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { ARTICLES } from "@/content/research"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Исследования",
  description: "Разборы отзывов, интервью и ответов нейросетей по отраслям — с цифрами и выводами для руководителей.",
}

export default function ResearchPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Исследования" }]}
        eyebrow="Исследования"
        title="Что пишут о работодателях и что из этого следует"
        description="Разборы отзывов, интервью и ответов нейросетей по отраслям. С цифрами и выводами для руководителей."
      />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-5 md:grid-cols-2">
          {ARTICLES.map((a, i) => {
            const href = a.href ?? `/research/${a.slug}`
            const body = (
              <>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-brand-accent/20 px-2.5 py-0.5 text-brand-50">{a.tag}</span>
                  {a.readTime && <span>{a.readTime}</span>}
                  {!a.ready && <span className="rounded-full border border-border px-2 py-0.5">скоро</span>}
                </div>
                <h2 className={cn("mt-4 font-semibold tracking-tight", i === 0 ? "text-2xl md:text-3xl" : "text-xl")}>{a.title}</h2>
                <p className="mt-2 text-muted-foreground">{a.excerpt}</p>
                {a.ready && (
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm text-brand-200">
                    Читать <ArrowRight className="size-4" />
                  </span>
                )}
              </>
            )
            const cls = cn("glass flex flex-col rounded-3xl p-6 md:p-8", i === 0 && "md:col-span-2 glow-bg", a.ready ? "transition-colors hover:border-brand-accent/40" : "opacity-70")
            return a.ready ? (
              <Link key={a.slug} href={href} className={cls}>
                {body}
              </Link>
            ) : (
              <div key={a.slug} className={cls}>
                {body}
              </div>
            )
          })}
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
