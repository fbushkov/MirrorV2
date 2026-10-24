"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PulseTrendChart } from "@/components/charts/pulse-charts"
import { DEPARTMENTS, GROUPS, LIFECYCLE, MIN_GROUP, channelMix, type PulseMetric } from "@/content/pulse"
import { cn } from "@/lib/utils"
import { Delta, LevelBadge, MetricIcon } from "./parts"

const EVIDENCE: Record<string, string> = {
  гипотеза: "bg-muted text-muted-foreground",
  коррелирует: "bg-status-warn/10 text-status-warn",
  "подтверждено пилотом": "bg-status-ok/10 text-status-ok",
}

function Sources({ m }: { m: PulseMetric }) {
  return (
    <dl className="grid gap-2 text-sm">
      {[
        ["О", "Опросы", m.sources.o],
        ["Т", "Тексты", m.sources.t],
        ["П", "Поведение и HR-события в агрегате", m.sources.p],
      ].map(([k, label, v]) => (
        <div key={k} className="flex gap-3">
          <dt className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-primary" title={label}>
            {k}
          </dt>
          <dd>
            <span className="text-muted-foreground">{label}: </span>
            {v}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Bars({ items }: { items: { name: string; value: number | null }[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((it) => (
        <li key={it.name} className="grid grid-cols-[140px_1fr_40px] items-center gap-3 text-sm">
          <span className="truncate text-muted-foreground">{it.name}</span>
          {it.value === null ? (
            <span className="text-xs text-muted-foreground">группа меньше {MIN_GROUP} — не показываем</span>
          ) : (
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary/70" style={{ width: `${it.value}%` }} />
            </div>
          )}
          <span className="text-right tabular-nums">{it.value ?? "—"}</span>
        </li>
      ))}
    </ul>
  )
}

const clamp = (v: number) => Math.max(5, Math.min(98, v))

/**
 * Карточка метрики. mode="about" — описание и источники (страница продукта),
 * mode="data" — полная карточка дашборда на демо-данных.
 */
export function MetricDialog({ metric, mode, open, onOpenChange }: { metric: PulseMetric | null; mode: "about" | "data"; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!metric) return null
  const mix = channelMix(metric.id)
  const companySize = DEPARTMENTS[0].size
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto p-6 sm:max-w-2xl">
        <DialogHeader>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MetricIcon icon={metric.icon} className="text-primary" />
            {GROUPS[metric.group]}
          </p>
          <DialogTitle className="text-xl">{metric.name}</DialogTitle>
          <DialogDescription className="text-[15px]">{metric.detail}</DialogDescription>
        </DialogHeader>

        {mode === "data" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-4xl font-semibold tabular-nums">{metric.score}</span>
              <LevelBadge score={metric.score} />
              <Delta value={metric.delta30} suffix=" за 30 дней" />
              <span className="text-xs text-muted-foreground">уверенность данных: {metric.confidence}</span>
            </div>
            <section>
              <p className="mb-2 text-sm font-medium">Динамика за 12 месяцев</p>
              <PulseTrendChart values={metric.trend} name={metric.name} />
            </section>
            <section>
              <p className="mb-2 text-sm font-medium">Вклад каналов</p>
              <div className="flex h-3 overflow-hidden rounded-full">
                <div className="bg-primary" style={{ width: `${mix.o}%` }} />
                <div className="bg-chart-2" style={{ width: `${mix.t}%` }} />
                <div className="bg-brand-200" style={{ width: `${mix.p}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>опросы {mix.o}%</span>
                <span>тексты {mix.t}%</span>
                <span>поведенческие сигналы {mix.p}%</span>
              </div>
            </section>
            <div className="grid gap-6 md:grid-cols-2">
              <section>
                <p className="mb-2 text-sm font-medium">По подразделениям</p>
                <Bars items={DEPARTMENTS.slice(1).map((d) => ({ name: d.name, value: clamp(metric.score + d.offset) }))} />
              </section>
              <section>
                <p className="mb-2 text-sm font-medium">По этапам жизненного цикла</p>
                <Bars
                  items={LIFECYCLE.slice(1).map((l) => ({
                    name: l.name,
                    value: companySize * l.share < MIN_GROUP ? null : clamp(metric.score + l.offset),
                  }))}
                />
              </section>
            </div>
            <section>
              <p className="mb-2 text-sm font-medium">Что влияет</p>
              <ul className="flex flex-col gap-2">
                {metric.drivers.map((d) => (
                  <li key={d.text} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                    {d.text}
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", EVIDENCE[d.level])}>{d.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        <section>
          <p className="mb-2 text-sm font-medium">Откуда данные</p>
          <Sources m={metric} />
        </section>
        {mode === "data" && <p className="text-xs text-muted-foreground">Данные демонстрационные</p>}
      </DialogContent>
    </Dialog>
  )
}
