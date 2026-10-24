"use client"

import { useMemo, useState } from "react"
import { Lock, MessageSquareQuote, Siren, Split } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ALERTS,
  CULTURE_CODE,
  DEPARTMENTS,
  DISCREPANCIES,
  GROUPS,
  LIFECYCLE,
  MIN_GROUP,
  PERIODS,
  PULSE_METRICS,
  SIGNALS,
  pulseLevel,
  type MetricGroup,
  type PulseMetric,
} from "@/content/pulse"
import { cn } from "@/lib/utils"
import { MetricDialog } from "./metric-dialog"
import { Delta, LevelBadge, MetricIcon, Sparkline } from "./parts"

const clamp = (v: number) => Math.max(5, Math.min(98, v))

function Filter({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: { id: string; name: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-9 w-full min-w-40 rounded-lg bg-card data-[size=default]:h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const TONE = {
  negative: "bg-status-bad/10 text-status-bad",
  positive: "bg-status-ok/10 text-status-ok",
  neutral: "bg-muted text-muted-foreground",
}
const TONE_LABEL = { negative: "негатив", positive: "позитив", neutral: "нейтрально" }

/** Демо-макет дашборда «Пульс культуры» на вымышленных данных */
export function PulseDashboard() {
  const [period, setPeriod] = useState("30")
  const [deptId, setDeptId] = useState("all")
  const [stageId, setStageId] = useState("all")
  const [open, setOpen] = useState<PulseMetric | null>(null)

  const dept = DEPARTMENTS.find((d) => d.id === deptId)!
  const requestedStage = LIFECYCLE.find((l) => l.id === stageId)!
  const requestedSize = Math.round(dept.size * requestedStage.share)
  // Правило приватности: группу меньше 5 человек не показываем — объединяем с уровнем выше
  const merged = requestedSize < MIN_GROUP
  const stage = merged ? LIFECYCLE[0] : requestedStage
  const groupSize = Math.round(dept.size * stage.share)

  const metrics = useMemo(
    () =>
      PULSE_METRICS.map((m) => {
        const off = dept.offset + stage.offset
        const score = clamp(m.score + off)
        const trend = m.trend.map((v) => clamp(v + off))
        const delta = period === "30" ? m.delta30 : period === "90" ? score - trend[8] : score - trend[0]
        return { ...m, score, trend, delta }
      }),
    [dept, stage, period],
  )

  const index = Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length)
  const indexDelta = Math.round(metrics.reduce((s, m) => s + m.delta, 0) / metrics.length)
  const norms = CULTURE_CODE.map((c) => {
    const ms = metrics.filter((m) => c.metrics.includes(m.id))
    return { norm: c.norm, level: pulseLevel(Math.round(ms.reduce((s, m) => s + m.score, 0) / ms.length)) }
  })
  const diverge = norms.filter((n) => n.level === "bad").length
  const alerts = ALERTS.filter((a) => deptId === "all" || a.where === dept.name || a.where === "Вся компания")
  const periodName = PERIODS.find((p) => p.id === period)!.name

  return (
    <div className="surface-raised overflow-hidden">
      {/* Шапка с фильтрами */}
      <div className="flex flex-col gap-4 border-b border-border bg-muted/40 p-4 md:flex-row md:items-end md:justify-between md:p-5">
        <div>
          <p className="font-semibold">Пульс культуры</p>
          <p className="text-xs text-muted-foreground">Демо-данные · компания на {DEPARTMENTS[0].size} человек</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Filter id="f-period" label="Период" value={period} onChange={setPeriod} options={PERIODS} />
          <Filter id="f-dept" label="Подразделение" value={deptId} onChange={setDeptId} options={DEPARTMENTS} />
          <Filter id="f-stage" label="Этап жизненного цикла" value={stageId} onChange={setStageId} options={LIFECYCLE} />
        </div>
      </div>

      {merged && (
        <div role="status" className="flex items-start gap-3 border-b border-border bg-secondary/60 px-4 py-3 text-sm md:px-5">
          <Lock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p>
            В группе «{dept.name} · {requestedStage.name}» меньше {MIN_GROUP} человек. Чтобы сохранить анонимность, показываем данные
            уровня выше: «{dept.name} · все этапы».
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 md:p-5">
        {/* Главные показатели */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface p-4">
            <p className="text-xs text-muted-foreground">Индекс переживаемой культуры</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-3xl font-semibold tabular-nums">{index}</span>
              <LevelBadge score={index} />
            </div>
            <p className="mt-1">
              <Delta value={indexDelta} suffix={` за ${periodName}`} />
            </p>
          </div>
          <div className="surface p-4">
            <p className="text-xs text-muted-foreground">Разрыв с культурным кодом</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {diverge} <span className="text-base font-normal text-muted-foreground">из {norms.length} норм</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">расходятся с опытом людей</p>
          </div>
          <div className="surface p-4">
            <p className="text-xs text-muted-foreground">Тренд</p>
            <div className="mt-2 flex flex-col gap-1 text-sm">
              <span className="flex justify-between">
                30 дней <Delta value={Math.round(metrics.reduce((s, m) => s + m.delta30, 0) / metrics.length)} />
              </span>
              <span className="flex justify-between">
                90 дней <Delta value={Math.round(metrics.reduce((s, m) => s + (m.score - m.trend[8]), 0) / metrics.length)} />
              </span>
            </div>
          </div>
          <div className="surface p-4">
            <p className="text-xs text-muted-foreground">Группа в срезе</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {groupSize} <span className="text-base font-normal text-muted-foreground">чел.</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">показываем группы от {MIN_GROUP} человек</p>
          </div>
        </div>

        {/* Сетка из 10 метрик */}
        <div className="grid gap-4 lg:grid-cols-3">
          {(Object.keys(GROUPS) as MetricGroup[]).map((g) => (
            <div key={g} className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">{GROUPS[g]}</p>
              {metrics
                .filter((m) => m.group === g)
                .map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setOpen(m)}
                    aria-label={`${m.name}: ${m.score}. Открыть детали`}
                    className="surface flex flex-col gap-2 p-3.5 text-left transition-colors hover:border-brand-200 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <MetricIcon icon={m.icon} className="text-primary" />
                        {m.name}
                      </span>
                    </span>
                    <span className="flex items-end justify-between gap-2">
                      <span className="flex flex-col gap-1">
                        <span className="flex items-center gap-2">
                          <span className="text-2xl font-semibold tabular-nums">{m.score}</span>
                          <LevelBadge score={m.score} />
                        </span>
                        <span className="flex items-center gap-2">
                          <Delta value={m.delta} />
                          <span className="text-[11px] text-muted-foreground">уверенность: {m.confidence}</span>
                        </span>
                      </span>
                      <Sparkline values={m.trend} />
                    </span>
                    <span className="text-xs font-medium text-primary">Детали →</span>
                  </button>
                ))}
            </div>
          ))}
        </div>

        {/* Внимание, расхождения, сигналы */}
        <div className="grid gap-3 lg:grid-cols-3">
          <section className="surface p-4">
            <p className="mb-3 flex items-center gap-2 font-medium">
              <Siren className="size-4 text-status-bad" aria-hidden /> Требует внимания
            </p>
            <ul className="flex flex-col gap-2.5">
              {alerts.map((a) => (
                <li key={a.text} className="rounded-xl border border-status-bad/20 bg-status-bad/5 p-3 text-sm">
                  <p className="font-medium">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.where} · {a.context}
                  </p>
                </li>
              ))}
              {!alerts.length && <li className="text-sm text-muted-foreground">В этом срезе тревожных изменений нет.</li>}
            </ul>
          </section>
          <section className="surface p-4">
            <p className="mb-3 flex items-center gap-2 font-medium">
              <Split className="size-4 text-status-warn" aria-hidden /> Расхождения
            </p>
            <ul className="flex flex-col gap-3">
              {DISCREPANCIES.map((d) => (
                <li key={d.kind} className="text-sm">
                  <p className="text-xs text-muted-foreground">{d.kind}</p>
                  <p className="mt-1">{d.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{d.hint}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="surface flex flex-col p-4">
            <p className="mb-3 flex items-center gap-2 font-medium">
              <MessageSquareQuote className="size-4 text-primary" aria-hidden /> Лента сигналов
            </p>
            <ul className="flex max-h-72 flex-col gap-2.5 overflow-y-auto pr-1">
              {SIGNALS.map((s) => {
                const m = PULSE_METRICS.find((x) => x.id === s.metric)!
                return (
                  <li key={s.text} className="rounded-xl border border-border p-3 text-sm">
                    <p>«{s.text}»</p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{m.name}</span>
                      <span className={cn("rounded-full px-2 py-0.5", TONE[s.tone])}>{TONE_LABEL[s.tone]}</span>
                      <span className="text-muted-foreground">{s.channel}</span>
                    </p>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 text-[11px] text-muted-foreground">Цитаты обезличены и проверены на узнаваемые детали</p>
          </section>
        </div>
      </div>
      <MetricDialog metric={open} mode="data" open={open !== null} onOpenChange={(v) => !v && setOpen(null)} />
    </div>
  )
}
