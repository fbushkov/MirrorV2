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
  description: "Внешний срез — бесплатно. Диагностика и Пульс культуры — с экспертом и проверкой изнутри.",
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
    features: ["Всё из среза", "Культурный код: что заявлено", "Первый замер Пульса: 10 метрик", "Анонимные интервью с сотрудниками", "Карта разрывов и план на 90 дней"],
    cta: { label: "Обсудить диагностику", href: "/start?type=diagnostics" },
  },
  {
    title: "Пульс культуры",
    price: "от 490 000 ₽",
    priced: true,
    highlight: true,
    note: "Кампания на 3 месяца, разово",
    features: [
      "Диагностика и культурный код — в составе",
      "Три волны пульс-опросов и анонимная обратная связь",
      "Дашборд для команды культуры, руководителей и топов",
      "10 метрик и разрыв с культурным кодом",
      "Эксперт с руководителями раз в 2 недели",
      "Страница «Вы сказали — мы сделали» для сотрудников",
    ],
    cta: { label: "Обсудить Пульс", href: "/start?type=pulse" },
  },
]

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Цены"
        title="Начните бесплатно"
        description="Внешний срез ничего не стоит. Платите, когда нужен взгляд изнутри: разовая диагностика или кампания «Пульс культуры»."
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
              <p className="mt-3 text-3xl font-semibold">{p.free || p.priced ? p.price : <Ph>{p.price}</Ph>}</p>
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
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="surface p-6">
            <p className="font-semibold">Диагностика по численности</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-[15px] text-muted-foreground">
              <li><Ph>до 300 сотрудников — 180 000 ₽</Ph></li>
              <li><Ph>300–1000 — 260 000 ₽</Ph></li>
              <li><Ph>больше 1000 — по запросу</Ph></li>
            </ul>
          </div>
          <div className="surface p-6">
            <p className="font-semibold">Пульс культуры по численности</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-[15px] text-muted-foreground">
              <li>до 300 сотрудников — 490 000 ₽</li>
              <li>300–1000 — 790 000 ₽</li>
              <li>1000–3000 — 1 290 000 ₽</li>
              <li>больше 3000 — по запросу</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">Диагностика уже входит в кампанию. После кампании замеры можно продлить.</p>
          </div>
        </div>

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
