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
import { CONTACTS, DIRECTION_NAMES } from "@/content/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Цены",
  description: "Оценка HR-бренда начинается с бесплатного среза. Дашборд здоровья корпоративной культуры — диагностика и кампания на 3 месяца.",
}

type Plan = {
  title: string
  price: string
  fixed?: boolean
  free?: boolean
  highlight?: boolean
  note: string
  features: string[]
  cta: { label: string; href: string }
}

const GROUPS: { id: "brand" | "health"; name: string; text: string; plans: Plan[] }[] = [
  {
    id: "brand",
    name: DIRECTION_NAMES.brand,
    text: "Снаружи: что видят кандидаты и рынок.",
    plans: [
      {
        title: "Внешний срез",
        price: "0 ₽",
        fixed: true,
        free: true,
        note: "Разово, за 3 рабочих дня",
        features: ["Индекс культуры и карта обещаний", "Слепые зоны", "Место в отрасли и сравнение с 2–3 конкурентами", "Что говорят нейросети", "30 минут разбора с экспертом"],
        cta: { label: "Получить срез", href: "/start?type=scan" },
      },
      {
        title: "Мониторинг",
        price: "от 30 000 ₽ в месяц",
        note: "Обновление каждый месяц",
        features: ["Динамика индекса: просадки и подъёмы", "Новые слепые зоны", "Место в отрасли в динамике", "Сигнал, если тема резко выросла"],
        cta: { label: "Обсудить мониторинг", href: "/start?type=monitoring" },
      },
    ],
  },
  {
    id: "health",
    name: DIRECTION_NAMES.health,
    text: "Изнутри: что переживают сотрудники.",
    plans: [
      {
        title: "Диагностика",
        price: "от 180 000 ₽",
        note: "Около 4 недель",
        features: ["Культурный код: что заявлено", "Первый замер 10 метрик", "Анонимные интервью с сотрудниками", "Карта разрывов и план на 90 дней"],
        cta: { label: "Обсудить диагностику", href: "/start?type=diagnostics" },
      },
      {
        title: "Кампания на 3 месяца",
        price: "от 490 000 ₽",
        fixed: true,
        highlight: true,
        note: "Разово, диагностика в составе",
        features: [
          "Три волны пульс-опросов и анонимная обратная связь",
          "Дашборд для команды культуры, руководителей и топов",
          "10 метрик и разрыв с культурным кодом",
          "Эксперт с руководителями раз в 2 недели",
          "Страница «Вы сказали — мы сделали» для сотрудников",
        ],
        cta: { label: "Обсудить кампанию", href: "/start?type=health" },
      },
    ],
  },
]

function PlanCard({ p, tone }: { p: Plan; tone: "brand" | "health" }) {
  const hl = p.highlight
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border p-6 md:p-7",
        hl ? "border-transparent bg-health-500 text-white shadow-[0_24px_48px_-24px_rgb(18_165_148/0.75)]" : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between">
        <p className={cn("font-medium", hl ? "text-white/85" : "text-muted-foreground")}>{p.title}</p>
        {p.free && <span className="rounded-full bg-status-ok/10 px-2.5 py-0.5 text-xs font-medium text-status-ok">бесплатно</span>}
      </div>
      <p className="mt-3 text-3xl font-semibold">{p.fixed ? p.price : <Ph>{p.price}</Ph>}</p>
      <p className={cn("mt-1 text-sm", hl ? "text-white/80" : "text-muted-foreground")}>{p.note}</p>
      <ul className="my-6 flex flex-col gap-3 text-[15px]">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className={cn("mt-0.5 size-4 shrink-0", hl ? "text-white" : tone === "brand" ? "text-primary" : "text-health-500")} />
            {f}
          </li>
        ))}
      </ul>
      <Button
        asChild
        size="xl"
        variant={hl ? "outline" : p.free ? "glow" : "soft"}
        className={cn("mt-auto rounded-xl", hl && "border-white bg-white text-health-700 hover:bg-white/90")}
      >
        <Link href={p.cta.href}>{p.cta.label}</Link>
      </Button>
    </div>
  )
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Цены"
        title="Начните бесплатно"
        description="Внешний срез ничего не стоит. Платите, когда нужен мониторинг или взгляд изнутри."
      />
      <Section className="pt-0 md:pt-0">
        <div className="flex flex-col gap-6">
          {GROUPS.map((g) => (
            <section
              key={g.id}
              id={g.id === "brand" ? "hr-brand" : "culture-health"}
              aria-labelledby={`price-${g.id}`}
              className={cn("scroll-mt-36 rounded-[2rem] border p-4 md:p-6", g.id === "brand" ? "border-brand-100 bg-brand-50/50" : "border-health-100 bg-health-50/60")}
            >
              <div className="mb-4 flex flex-col gap-1 px-1 md:mb-5">
                <h2 id={`price-${g.id}`} className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
                  <span className={cn("size-2 rounded-full", g.id === "brand" ? "bg-brand-500" : "bg-health-500")} aria-hidden />
                  {g.name}
                </h2>
                <p className="text-sm text-muted-foreground">{g.text}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {g.plans.map((p) => (
                  <PlanCard key={p.title} p={p} tone={g.id} />
                ))}
              </div>
              {g.id === "health" && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <p className="font-semibold">Диагностика по численности</p>
                    <ul className="mt-3 flex flex-col gap-1.5 text-[15px] text-muted-foreground">
                      <li><Ph>до 300 сотрудников — 180 000 ₽</Ph></li>
                      <li><Ph>300–1000 — 260 000 ₽</Ph></li>
                      <li><Ph>больше 1000 — по запросу</Ph></li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-border bg-card p-6">
                    <p className="font-semibold">Кампания по численности</p>
                    <ul className="mt-3 flex flex-col gap-1.5 text-[15px] text-muted-foreground">
                      <li>до 300 сотрудников — 490 000 ₽</li>
                      <li>300–1000 — 790 000 ₽</li>
                      <li>1000–3000 — 1 290 000 ₽</li>
                      <li>больше 3000 — по запросу</li>
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">Диагностика уже входит в кампанию. После кампании замеры можно продлить.</p>
                  </div>
                </div>
              )}
            </section>
          ))}
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
