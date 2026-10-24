"use client"

import { useMemo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusPill } from "@/components/site/status"
import { IndexGauge } from "@/components/charts/brand-charts"
import { PROMISES, cultureIndex, statusOf } from "@/content/demo"
import { cn } from "@/lib/utils"

/** Пример расчёта: снимите галочку, чтобы увидеть индекс без этого обещания */
export function IndexCalculator() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(PROMISES.map((p) => [p.id, true])))

  const active = useMemo(() => PROMISES.filter((p) => enabled[p.id]), [enabled])
  const total = active.reduce((s, p) => s + p.weight, 0)
  const index = Math.round(cultureIndex(active))
  const confirmed = active.filter((p) => statusOf(p.external, p.mentions) === "ok").length

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <p className="text-sm font-medium">Обещания «Банка N»</p>
          <p className="text-xs text-muted-foreground">Снимите галочку, чтобы убрать обещание</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="py-3 pl-4 font-normal">Обещание</th>
                <th className="py-3 text-right font-normal">Вес</th>
                <th className="py-3 text-right font-normal">Подтверждают</th>
                <th className="py-3 pl-4 font-normal">Статус</th>
                <th className="py-3 pr-4 text-right font-normal">Вклад</th>
              </tr>
            </thead>
            <tbody>
              {PROMISES.map((p) => {
                const on = enabled[p.id]
                const w = on && total ? p.weight / total : 0
                return (
                  <tr key={p.id} className={cn("border-t border-border", !on && "opacity-40")}>
                    <td className="py-3 pl-4">
                      <label className="flex items-center gap-3">
                        <Checkbox checked={on} onCheckedChange={(v) => setEnabled((e) => ({ ...e, [p.id]: v === true }))} />
                        <span className="font-medium">{p.title}</span>
                      </label>
                    </td>
                    <td className="py-3 text-right tabular-nums">{on ? Math.round(w * 100) + "%" : "—"}</td>
                    <td className="py-3 text-right tabular-nums">{p.external}%</td>
                    <td className="py-3 pl-4">
                      <StatusPill status={statusOf(p.external, p.mentions)} />
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">{on ? (w * p.external).toFixed(1) : "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="surface flex flex-col items-center gap-1 p-5 lg:sticky lg:top-24 lg:self-start">
        <IndexGauge value={index} label="индекс культуры" className="h-48 w-full" />
        <p className="text-sm text-muted-foreground">
          Подтверждено {confirmed} из {active.length}
        </p>
      </div>
    </div>
  )
}
