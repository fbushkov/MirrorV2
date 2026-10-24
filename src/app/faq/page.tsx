import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { FaqList } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { FAQ_CULTURE, FAQ_GENERAL, FAQ_PRICING } from "@/content/faq"

export const metadata: Metadata = { title: "Вопрос-ответ" }

export default function FaqPage() {
  return (
    <>
      <PageHero crumbs={[{ title: "Вопрос-ответ" }]} title="Вопрос-ответ" description="Коротко о главном." />
      {[
        { title: "Общие вопросы", items: FAQ_GENERAL },
        { title: "Цены и оплата", items: FAQ_PRICING },
        { title: "Индекс культуры", items: FAQ_CULTURE },
      ].map((g, i) => (
        <Section key={g.title} className={i === 0 ? "pt-0 md:pt-0" : undefined}>
          <SectionHeader align="left" title={g.title} description="по вашим возможным вопросам" />
          <div className="max-w-3xl">
            <FaqList items={g.items} />
          </div>
        </Section>
      ))}
      <CtaBand />
    </>
  )
}
