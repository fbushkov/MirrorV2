import type { Metadata } from "next"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { ReportSwitch } from "@/components/site/report-switch"
import { StatusPill } from "@/components/site/status"
import { BrandDynamicsChart, CultureMatrixChart, GapDivergingChart, SourcesHeatmap } from "@/components/charts/brand-charts"
import { BlindSpots } from "@/components/metrics/blind-spots"
import { IndustryTracks } from "@/components/metrics/industry-tracks"
import { BANK_N, BLIND_SPOTS, COMPETITORS, EVENTS, INDUSTRY, PROMISES, cultureIndex, statusOf } from "@/content/demo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Пример отчёта",
  description: "Как выглядит отчёт Mirror: индекс снаружи и изнутри, слепые зоны, место в отрасли, просадки и подъёмы, сравнение с конкурентами.",
}

function Panel({ title, hint, children, className }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("surface min-w-0 p-5 md:p-6", className)}>
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Kpi({ label, value, delta, tone }: { label: string; value: string; delta?: number; tone?: string }) {
  return (
    <div className="surface p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn("text-3xl font-semibold tabular-nums", tone)}>{value}</span>
        {delta !== undefined && (
          <span className={cn("inline-flex items-center text-xs", delta >= 0 ? "text-status-ok" : "text-status-bad")}>
            {delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {delta > 0 ? "+" : ""}
            {delta} за квартал
          </span>
        )}
      </div>
    </div>
  )
}

const ACTIONS = [
  ["Указать зарплатные вилки во всех вакансиях", "Руководитель подбора", "2 недели"],
  ["Убрать «справедливую зарплату» из текстов до пересмотра окладов", "HR-бренд", "2 недели"],
  ["Описать правила гибридной работы", "Директор по персоналу", "1 месяц"],
]

export default function ExamplePage() {
  const ext = Math.round(cultureIndex(PROMISES, "external"))
  const int = Math.round(cultureIndex(PROMISES, "internal"))
  const confirmed = PROMISES.filter((p) => statusOf(p.external) === "ok").length

  return (
    <>
      <PageHero
        eyebrow="Данные условные"
        title="Так выглядит отчёт"
        description={`Пример по условному «${BANK_N.name}», ${BANK_N.size}. Внешний срез есть уже в бесплатной версии. Пульс культуры появляется после диагностики.`}
      />
      <Section className="pt-0 md:pt-0">
        <ReportSwitch active="external" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
          <Kpi label="Индекс снаружи" value={String(ext)} delta={2} tone="text-chart-1" />
          <Kpi label="Индекс изнутри · Пульс" value={String(int)} delta={5} tone="text-chart-2" />
          <Kpi label="Подтверждено обещаний" value={`${confirmed} из ${PROMISES.length}`} />
          <Kpi label="Слепые зоны" value={`${BLIND_SPOTS.length} темы`} />
          <Kpi label="Место в отрасли" value={`${INDUSTRY.overall}`} />
        </div>

        <Panel title="Просадки и подъёмы" hint="Индекс по месяцам. Выделена просадка, метки — события, которые на неё повлияли." className="mt-3">
          <BrandDynamicsChart />
          <ul className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
            {EVENTS.map((e) => (
              <li key={e.month}>
                <span className="text-foreground">{e.month}:</span> {e.text}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Panel title="Где слова расходятся с делом" hint="Изнутри минус снаружи. Красное — переобещаете, бирюзовое — недорассказываете.">
            <GapDivergingChart />
          </Panel>
          <Panel title="Обещания" hint="Статус снаружи и изнутри">
            <ul className="flex flex-col divide-y divide-border">
              {PROMISES.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="text-sm">{p.title}</span>
                  <span className="flex gap-1.5">
                    <StatusPill status={statusOf(p.external, p.mentions)} />
                    <StatusPill status={statusOf(p.internal)} className="opacity-75" />
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Откуда подтверждения" hint="Доля упоминаний, где опыт совпадает с обещанием, по источникам" className="mt-3">
          <SourcesHeatmap />
        </Panel>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Panel title="Слепые зоны" hint="О чём люди пишут, а в ваших текстах нет ни слова">
            <BlindSpots />
          </Panel>
          <Panel title="Место в отрасли" hint="Базовые темы в сравнении с работодателями отрасли и региона">
            <IndustryTracks />
          </Panel>
        </div>

        <Panel title="Где вы на карте" hint="Честность против условий. Банк N — в зоне «сильный и честный», но зарплата и нагрузка тянут вниз." className="mt-3">
          <CultureMatrixChart />
        </Panel>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Panel title="Три первых шага">
            <ol className="flex flex-col gap-3">
              {ACTIONS.map(([what, who, when], i) => (
                <li key={what} className="flex gap-3">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">{i + 1}</span>
                  <div>
                    <p className="text-[15px]">{what}</p>
                    <p className="text-sm text-muted-foreground">
                      {who} · {when}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel title="Сравнение с конкурентами" hint="Одни правила для всех">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-normal">Обещание</th>
                    <th className="pb-2 font-normal">{BANK_N.name}</th>
                    <th className="pb-2 font-normal">Банк А</th>
                    <th className="pb-2 font-normal">Банк Б</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((row) => (
                    <tr key={row.title} className="border-t border-border">
                      <td className="py-2.5 pr-2">{row.title}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="py-2.5 pr-2">
                          <StatusPill status={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </Section>
      <CtaBand title="Получите такой срез по своей компании" />
    </>
  )
}
