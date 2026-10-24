"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart, GaugeChart, HeatmapChart, LineChart, RadarChart, ScatterChart } from "echarts/charts"
import {
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import type { EChartsCoreOption } from "echarts/core"
import { cn } from "@/lib/utils"
import { MIRROR_THEME } from "./theme"

// Подключаем только нужные модули — так бандл заметно легче полного echarts
echarts.use([
  BarChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  RadarChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
])
echarts.registerTheme("mirror", MIRROR_THEME)

export function EChart({
  option,
  className,
  ariaLabel,
}: {
  option: EChartsCoreOption
  className?: string
  ariaLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current, "mirror", { renderer: "canvas" })
    chartRef.current = chart
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    // Canvas не понимает CSS-переменные, поэтому берём реальное имя шрифта страницы
    const fontFamily = getComputedStyle(document.body).fontFamily
    chartRef.current?.setOption({ textStyle: { fontFamily }, ...option }, { notMerge: true })
  }, [option])

  return <div ref={ref} role="img" aria-label={ariaLabel} className={cn("h-72 w-full", className)} />
}
