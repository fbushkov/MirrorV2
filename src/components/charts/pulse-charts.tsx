"use client"

import { useMemo } from "react"
import { PULSE_MONTHS } from "@/content/pulse"
import { EChart } from "./echart"
import { C } from "./theme"

/** Динамика метрики Пульса за 12 месяцев с границами зон «риск» (50) и «в норме» (65) */
export function PulseTrendChart({ values, name, className }: { values: number[]; name: string; className?: string }) {
  const option = useMemo(
    () => ({
      grid: { left: 8, right: 16, top: 20, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: PULSE_MONTHS, boundaryGap: false },
      yAxis: { type: "value", min: 30, max: 90, splitNumber: 3 },
      series: [
        {
          name,
          type: "line",
          data: values,
          color: C.external,
          areaStyle: {
            color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: C.external + "30" }, { offset: 1, color: C.external + "00" }] },
          },
          markLine: {
            silent: true,
            symbol: "none",
            label: { position: "insideEndTop", color: C.muted, fontSize: 10 },
            data: [
              { yAxis: 65, lineStyle: { color: C.ok, type: "dashed", opacity: 0.6 }, label: { formatter: "в норме" } },
              { yAxis: 50, lineStyle: { color: C.bad, type: "dashed", opacity: 0.6 }, label: { formatter: "риск" } },
            ],
          },
        },
      ],
    }),
    [values, name],
  )
  return <EChart option={option} className={className ?? "h-56"} ariaLabel={`${name}: динамика за 12 месяцев`} />
}
