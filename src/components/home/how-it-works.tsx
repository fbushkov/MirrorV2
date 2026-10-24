"use client"

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuarterChart } from "@/components/charts/brand-charts"
import { StatusPill } from "@/components/site/status"
import { Ph } from "@/components/site/ph"
import { PROMISES, statusOf } from "@/content/demo"

const STAGES = [
  {
    id: "scan",
    tab: "Срез",
    meta: "Бесплатно · 3 рабочих дня",
    title: "Внешний срез: какие обещания подтверждает рынок",
    text: "Парсер Mirror собирает ваши обещания из вакансий и соцсетей и проверяет каждое по отзывам, упоминаниям в медиа и ответам нейросетей. Сравниваем с 2–3 конкурентами.",
    bullets: [
      "Внешний индекс культуры и карта обещаний",
      "Графики: где бренд проседает и где растёт",
      "Что нейросети отвечают о вас кандидатам",
      "30 минут разбора с экспертом",
    ],
    cta: { label: "Получить срез", href: "/request?type=scan" },
    more: { label: "О срезе", href: "/scan" },
  },
  {
    id: "diagnostics",
    tab: "Диагностика",
    meta: "С экспертом · около 4 недель",
    title: "Проверьте те же обещания изнутри",
    text: "Подключается эксперт и внутренняя проверка: документы и данные компании, результаты опросов, анонимные интервью с сотрудниками. Внешний и внутренний индекс — рядом, по каждому обещанию.",
    bullets: [
      "Внутренний индекс по каждому обещанию",
      "Карта разрывов: снаружи и изнутри",
      "Приоритеты с ответственным и сроком",
      "План изменений на 90 дней",
    ],
    cta: { label: "Обсудить диагностику", href: "/request?type=diagnostics" },
    more: { label: "О диагностике", href: "/diagnostics" },
  },
  {
    id: "support",
    tab: "Сопровождение",
    meta: "3–6 месяцев",
    title: "Эксперт ведёт изменения вместе с вами",
    text: "Изменения в культуре делают руководители, каждый день. Мы рядом, пока новые правила не станут привычкой: корректируем EVP и коммуникации, разбираем то, на что жалуются сотрудники, раз в две недели работаем с руководителями.",
    bullets: [
      "Обновлённое EVP, которое выдерживает проверку",
      "Тексты вакансий и карьерного сайта без оспоренных обещаний",
      "Ежемесячный отчёт по индексу",
    ],
    cta: { label: "Обсудить сопровождение", href: "/request?type=support" },
    more: { label: "О сопровождении", href: "/support" },
  },
  {
    id: "monitoring",
    tab: "Мониторинг",
    meta: "Подписка",
    title: "Видите, как меняется индекс каждый квартал",
    text: "Парсер регулярно обновляет внешние данные: новые отзывы, упоминания, ответы нейросетей. Внутренний замер — раз в квартал. Сигнал, если появилась новая тема или показатель просел.",
    bullets: ["Повторный замер внешнего и внутреннего индекса", "Сигнал о просадках и новых темах", "Сравнение с конкурентами в динамике"],
    cta: { label: "Подключить мониторинг", href: "/request?type=monitoring" },
    more: { label: "О мониторинге", href: "/support#monitoring" },
  },
]

function StageVisual({ id }: { id: string }) {
  if (id === "scan") {
    return (
      <div className="flex flex-col gap-2">
        <p className="mb-1 text-sm font-medium">Карта обещаний</p>
        {PROMISES.slice(0, 5).map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
            <span className="text-sm">{p.title}</span>
            <StatusPill status={statusOf(p.external)} />
          </div>
        ))}
      </div>
    )
  }
  if (id === "diagnostics") {
    const p = PROMISES.find((x) => x.id === "career")!
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Внешний и внутренний индекс</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.03] p-5">
            <p className="text-xs text-muted-foreground">{p.title} · снаружи</p>
            <p className="mt-2 text-5xl font-semibold text-chart-1">{p.external}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] p-5">
            <p className="text-xs text-muted-foreground">{p.title} · изнутри</p>
            <p className="mt-2 text-5xl font-semibold text-chart-2">{p.internal}</p>
          </div>
        </div>
        <p className="rounded-xl border border-status-warn/30 bg-status-warn/10 px-4 py-3 text-sm text-status-warn">
          Репутация опережает реальность: новые отзывы скоро это покажут.
        </p>
      </div>
    )
  }
  if (id === "support") {
    return (
      <div className="flex flex-col gap-2">
        <p className="mb-1 text-sm font-medium">План на 90 дней</p>
        {[
          ["Вилки зарплат во всех вакансиях", "HR-бренд"],
          ["Правила гибридной работы", "Директор по персоналу"],
          ["Убрать «справедливую зарплату» из текстов до пересмотра окладов", "Коммуникации"],
        ].map(([task, owner]) => (
          <div key={task} className="flex flex-col gap-1 rounded-xl bg-white/[0.03] px-4 py-3">
            <span className="text-sm">{task}</span>
            <span className="text-xs text-muted-foreground">{owner}</span>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Индекс культуры по кварталам · пример</p>
      <QuarterChart />
    </div>
  )
}

export function HowItWorks() {
  return (
    <Tabs defaultValue="scan" className="gap-8">
      <TabsList className="glass mx-auto h-auto group-data-horizontal/tabs:h-auto w-full max-w-2xl flex-wrap justify-center gap-1 rounded-2xl p-1.5 sm:flex-nowrap">
        {STAGES.map((s, i) => (
          <TabsTrigger
            key={s.id}
            value={s.id}
            className="h-auto flex-1 rounded-xl px-4 py-2.5 text-sm dark:data-active:border-transparent dark:data-active:bg-brand-accent/25 data-active:text-foreground"
          >
            <span className="mr-1.5 text-muted-foreground">0{i + 1}</span>
            {s.tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {STAGES.map((s) => (
        <TabsContent key={s.id} value={s.id}>
          <div className="glass grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:p-10">
            <div className="flex flex-col items-start gap-4">
              <span className="rounded-full bg-brand-accent/20 px-3 py-1 text-xs font-medium text-brand-50">
                {s.id === "scan" ? s.meta : <Ph>{s.meta}</Ph>}
              </span>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{s.title}</h3>
              <p className="text-muted-foreground">{s.text}</p>
              <ul className="flex flex-col gap-2.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[15px]">
                    <Check className="mt-0.5 size-4 shrink-0 text-chart-2" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex flex-wrap gap-3">
                <Button asChild variant="glow" size="xl">
                  <Link href={s.cta.href}>
                    {s.cta.label}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="xl">
                  <Link href={s.more.href}>{s.more.label}</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-5">
              <StageVisual id={s.id} />
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
