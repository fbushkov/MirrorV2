import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, CalendarRange, Layers, UserRoundSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"

export const metadata: Metadata = {
  title: "Агентствам",
  description: "Внешний аудит HR-бренда за день под вашим брендом — для агентств HR-бренда, рекрутинговых агентств и консультантов.",
}

export default function AgenciesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Агентствам" }]}
        eyebrow="Агентствам и консультантам"
        title={
          <>
            Внешний аудит HR-бренда за день, <span className="text-gradient">под вашим брендом</span>
          </>
        }
        description="Для агентств HR-бренда, коммуникационных агентств и независимых консультантов. Карта EVP, тональность, конкуренты, ответы нейросетей и контент-план — сборка наша, выводы и логотип ваши."
      >
        <Button asChild variant="glow" size="xl">
          <Link href="/request?type=agency">
            Обсудить пилот <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </PageHero>
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Layers, t: "Карта EVP", d: "Что подтверждено, частично, оспорено — с цитатами." },
            { icon: UserRoundSearch, t: "Конкуренты", d: "Те же правила для 2–3 работодателей." },
            { icon: Bot, t: "Нейросети", d: "Что ассистенты говорят о клиенте." },
            { icon: CalendarRange, t: "Контент-план", d: "Темы, форматы, каналы — из подтверждённых сильных сторон." },
          ].map((x) => (
            <div key={x.t} className="glass rounded-3xl p-6">
              <x.icon className="mb-4 size-6 text-brand-200" />
              <h3 className="mb-2 font-semibold">{x.t}</h3>
              <p className="text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader eyebrow="Условия" title="Три отчёта бесплатно, дальше как удобнее" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { t: "Пилот", p: "0 ₽", d: "Три отчёта по вашим текущим клиентам.", hl: true },
            { t: "За отчёт", p: "15 000 ₽", d: "Если проекты нерегулярные." },
            { t: "Пакет", p: "60 000 ₽", d: "До 6 отчётов в месяц и повторные замеры." },
          ].map((x) => (
            <div key={x.t} className={x.hl ? "rounded-3xl border border-brand-accent/50 bg-brand-accent/12 p-6" : "glass rounded-3xl p-6"}>
              <p className="text-sm text-muted-foreground">{x.t}</p>
              <p className="mt-2 text-3xl font-semibold">{x.hl ? x.p : <Ph>{x.p}</Ph>}</p>
              <p className="mt-2 text-muted-foreground">{x.hl ? x.d : <Ph>{x.d}</Ph>}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand eyebrow="пилот" title="Обсудим пилот" text="Расскажите, с какими клиентами работаете. Ответим в течение рабочего дня." cta="Обсудить пилот" href="/request?type=agency" />
    </>
  )
}
