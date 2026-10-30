"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, EyeOff, Scale, Trophy } from "lucide-react"
import { IndexGauge } from "@/components/charts/brand-charts"
import { BlindSpots } from "@/components/metrics/blind-spots"
import { IndustryTracks } from "@/components/metrics/industry-tracks"
import { BLIND_SPOTS, INDUSTRY } from "@/content/demo"
import { cn } from "@/lib/utils"

const METRICS = [
  {
    id: "index",
    icon: Scale,
    name: "Индекс культуры",
    question: "Совпадают ли слова и дела?",
    base: "относительно ваших обещаний",
    value: "65",
    unit: "из 100",
    text: "Доля ваших обещаний, которые подтверждает опыт людей: в отзывах, соцсетях, медиа и ответах нейросетей.",
  },
  {
    id: "blind",
    icon: EyeOff,
    name: "Слепые зоны",
    question: "О чём говорят, а вы молчите?",
    base: "относительно того, что обсуждают люди",
    value: String(BLIND_SPOTS.length),
    unit: "темы",
    text: "Темы, которые часто встречаются в отзывах и разговорах, но которых нет в ваших текстах. Молчать выгодно только до первого отзыва.",
  },
  {
    id: "industry",
    icon: Trophy,
    name: "Место в отрасли",
    question: "Насколько хороши условия?",
    base: "относительно рынка",
    value: String(INDUSTRY.overall),
    unit: "перцентиль",
    text: "Сравниваем базовые темы — зарплату, развитие, руководство, нагрузку — с работодателями вашей отрасли и региона.",
  },
] as const

type Id = (typeof METRICS)[number]["id"]

/** Три показателя, три вопроса. Не смешиваются в одну цифру — каждый отвечает за своё. */
export function ThreeMetrics() {
  const [active, setActive] = useState<Id>("index")
  const m = METRICS.find((x) => x.id === active)!

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Показатели" className="grid gap-3 md:grid-cols-3">
        {METRICS.map((x) => {
          const on = x.id === active
          return (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="metric-panel"
              onClick={() => setActive(x.id)}
              className={cn(
                "group flex flex-col items-start gap-3 rounded-[1.25rem] border p-5 text-left transition-all",
                on
                  ? "border-brand-200 bg-gradient-to-br from-brand-50 to-card shadow-[0_16px_40px_-24px_rgb(113_43_125/0.5)]"
                  : "border-border bg-card hover:border-brand-200",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className={cn("inline-flex size-9 items-center justify-center rounded-xl transition-colors", on ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                  <x.icon className="size-4.5" />
                </span>
                <span className="text-right">
                  <span className={cn("text-2xl font-semibold tabular-nums", on && "text-gradient")}>{x.value}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{x.unit}</span>
                </span>
              </div>
              <div>
                <p className="font-semibold">{x.name}</p>
                <p className="text-sm text-muted-foreground">{x.question}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div id="metric-panel" role="tabpanel" className="surface-raised grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-9">
        <div key={m.id} className="flex animate-in flex-col items-start gap-4 fade-in duration-300">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{m.base}</span>
          <h3 className="text-2xl font-semibold md:text-3xl">{m.question}</h3>
          <p className="text-muted-foreground">{m.text}</p>
          <Link href="/hr-brand/methodology#metrics" className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Подробнее о показателях <ArrowRight className="size-4" />
          </Link>
        </div>
        <div key={m.id + "-v"} className="flex min-w-0 animate-in flex-col justify-center fade-in duration-500">
          {m.id === "index" && (
            <div className="flex flex-col items-center">
              <IndexGauge value={65} label="индекс культуры" className="h-56 w-full max-w-xs" />
              <p className="text-sm text-muted-foreground">Подтверждено 5 из 8 обещаний</p>
            </div>
          )}
          {m.id === "blind" && <BlindSpots compact />}
          {m.id === "industry" && <IndustryTracks />}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Пример на условных данных. Показатели не смешиваются в одну цифру: каждый отвечает на свой вопрос.</p>
    </div>
  )
}
