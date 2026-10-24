"use client"

import { useMemo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusPill } from "@/components/site/status"
import { IndexGauge } from "@/components/charts/brand-charts"
import { C } from "@/components/charts/theme"
import { PROMISES, cultureIndex, statusOf } from "@/content/demo"
import { cn } from "@/lib/utils"

/** Пример расчёта: снимите галочку с обещания, чтобы увидеть, как изменится индекс без него */
export function IndexCalculator() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PROMISES.map((p) => [p.id, true])),
  )
  const [side, setSide] = useState<"external" | "internal">("external")

  const active = useMemo(() => PROMISES.filter((p) => enabled[p.id]), [enabled])
  const totalWeight = active.reduce((s, p) => s + p.weight, 0)
  const index = Math.round(cultureIndex(active, side))
  const confirmed = active.filter((p) => statusOf(p[side], p.mentions) === "ok").length

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="glass overflow-hidden rounded-3xl">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <span className="text-sm text-muted-foreground">Сторона бренда:</span>
          {(["external", "internal"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={cn(
                "rounded-full px-3 py-1 text-sm transition-colors",
                side === s ? (s === "external" ? "bg-chart-1/20 text-chart-1" : "bg-chart-2/20 text-chart-2") : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s === "external" ? "Снаружи (срез)" : "Изнутри (диагностика)"}
            </button>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Обещаем</TableHead>
              <TableHead>Обещание</TableHead>
              <TableHead className="text-right">Вес</TableHead>
              <TableHead className="text-right">Упоминаний</TableHead>
              <TableHead className="text-right">Подтверждение</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="pr-4 text-right">Вклад</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROMISES.map((p) => {
              const on = enabled[p.id]
              const w = on && totalWeight ? p.weight / totalWeight : 0
              return (
                <TableRow key={p.id} className={cn("hover:bg-white/[0.02]", !on && "opacity-45")}>
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={on}
                      onCheckedChange={(v) => setEnabled((e) => ({ ...e, [p.id]: v === true }))}
                      aria-label={`Учитывать обещание «${p.title}»`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-right tabular-nums">{on ? Math.round(w * 100) + "%" : "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.mentions}</TableCell>
                  <TableCell className="text-right tabular-nums">{p[side]}%</TableCell>
                  <TableCell>
                    <StatusPill status={statusOf(p[side], p.mentions)} />
                  </TableCell>
                  <TableCell className="pr-4 text-right tabular-nums">{on ? (w * p[side]).toFixed(1) : "—"}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="glass flex flex-col items-center rounded-3xl p-6 lg:sticky lg:top-24 lg:self-start">
        <IndexGauge value={index} label={side === "external" ? "внешний индекс" : "внутренний индекс"} color={side === "external" ? C.external : C.internal} />
        <p className="text-center text-sm text-muted-foreground">
          Подтверждено {confirmed} из {active.length}
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Индекс растёт двумя путями: исправить то, на что жалуются, или перестать обещать то, что не выполняется.
        </p>
      </div>
    </div>
  )
}
