import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"
import { FAQ_PRICING } from "@/content/faq"
import { CONTACTS } from "@/content/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Цены",
  description: "Внешний срез — бесплатно. Диагностика и сопровождение — с экспертом и проверкой изнутри.",
}

const PLANS = [
  {
    title: "Срез",
    price: "0 ₽",
    free: true,
    note: "Внешняя картина за 3 рабочих дня",
    features: ["Индекс снаружи", "Карта обещаний", "Сравнение с 2–3 конкурентами", "Что говорят нейросети", "30 минут разбора с экспертом"],
    cta: { label: "Получить срез", href: "/start?type=scan" },
  },
  {
    title: "Диагностика",
    price: "от 180 000 ₽",
    note: "Снаружи и изнутри, около 4 недель",
    highlight: true,
    features: ["Всё из среза", "Разбор документов компании", "Анонимные интервью с сотрудниками", "Индекс изнутри и карта разрывов", "План на 90 дней"],
    cta: { label: "Обсудить диагностику", href: "/start?type=diagnostics" },
  },
  {
    title: "Сопровождение",
    price: "от 120 000 ₽ / мес",
    note: "Изменения и регулярный замер",
    features: ["Встречи с руководителями раз в две недели", "Правки EVP и текстов вакансий", "Замер индекса раз в квартал", "Сигналы о просадках"],
    cta: { label: "Обсудить", href: "/start?type=support" },
  },
]

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Цены"
        title="Начните бесплатно"
        description="Внешний срез ничего не стоит. Платите, когда понадобится взгляд изнутри и помощь эксперта."
      />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.title}
              className={cn(
                "flex flex-col rounded-3xl border p-6 md:p-7",
                p.highlight ? "border-transparent bg-primary text-primary-foreground shadow-[0_24px_48px_-24px_rgb(168_71_184/0.75)]" : "surface",
              )}
            >
              <div className="flex items-center justify-between">
                <p className={cn("font-medium", p.highlight ? "text-white/85" : "text-muted-foreground")}>{p.title}</p>
                {p.free && <span className="rounded-full bg-status-ok/10 px-2.5 py-0.5 text-xs font-medium text-status-ok">бесплатно</span>}
              </div>
              <p className="mt-3 text-3xl font-semibold">{p.free ? p.price : <Ph>{p.price}</Ph>}</p>
              <p className={cn("mt-1 text-sm", p.highlight ? "text-white/80" : "text-muted-foreground")}>{p.note}</p>
              <ul className="my-6 flex flex-col gap-3 text-[15px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={cn("mt-0.5 size-4 shrink-0", p.highlight ? "text-white" : "text-primary")} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="xl"
                variant={p.highlight ? "outline" : p.free ? "glow" : "soft"}
                className={cn("mt-auto rounded-xl", p.highlight && "border-white bg-white text-brand-700 hover:bg-white/90")}
              >
                <Link href={p.cta.href}>{p.cta.label}</Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Ph>Цены диагностики зависят от численности: до 300 сотрудников — 180 000 ₽, 300–1000 — 260 000 ₽, больше — по запросу.</Ph>
        </p>

        <div className="surface mt-10 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-lg font-semibold">Агентствам и консультантам</p>
            <p className="mt-1 text-muted-foreground">Внешний аудит HR-бренда для ваших клиентов, под вашим логотипом. Три отчёта — бесплатно.</p>
          </div>
          <Button asChild variant="soft" size="xl">
            <Link href="/start?type=other">Обсудить пилот</Link>
          </Button>
        </div>
      </Section>
      <Section className="bg-card">
        <FaqSection
          items={FAQ_PRICING}
          title="Оплата"
          note={<>Остались вопросы — напишите на {CONTACTS.email}.</>}
        />
      </Section>
      <CtaBand />
    </>
  )
}
