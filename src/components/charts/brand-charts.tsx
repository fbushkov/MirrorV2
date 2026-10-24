"use client"

import { useMemo } from "react"
import {
  EVENTS,
  EXTERNAL_SERIES,
  HEATMAP,
  INTERNAL_SERIES,
  MONTHS,
  PROMISES,
  QUARTERS,
  QUARTER_EXTERNAL,
  QUARTER_INTERNAL,
  SOURCES,
  TONALITY,
} from "@/content/demo"
import { EChart } from "./echart"
import { C } from "./theme"

type TooltipParam = { seriesName: string; value: number; marker: string; name: string }

const lineArea = (color: string) => ({
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: color + "55" },
    { offset: 1, color: color + "00" },
  ],
})

/** Динамика внешнего и внутреннего индекса с отмеченными просадками и подъёмами */
export function BrandDynamicsChart({ compact = false, className }: { compact?: boolean; className?: string }) {
  const option = useMemo(() => {
    const eventPoints = EVENTS.map((e) => {
      const i = MONTHS.indexOf(e.month)
      return { coord: [e.month, EXTERNAL_SERIES[i]], value: e.text }
    })
    return {
      grid: compact ? { left: 8, right: 8, top: 16, bottom: 8, containLabel: true } : { left: 8, right: 16, top: 48, bottom: 8, containLabel: true },
      legend: compact ? { show: false } : { top: 0, left: 0, data: ["Внешний бренд", "Внутренний бренд"] },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: MONTHS, boundaryGap: false, },
      yAxis: { type: "value", min: 40, max: 75, splitNumber: 3, axisLabel: { show: !compact } },
      series: [
        {
          name: "Внешний бренд",
          type: "line",
          data: EXTERNAL_SERIES,
          color: C.external,
          areaStyle: { color: lineArea(C.external) },
          markPoint: compact
            ? undefined
            : {
                symbol: "pin",
                symbolSize: 38,
                label: { show: false },
                itemStyle: { color: C.external },
                data: eventPoints,
                tooltip: { formatter: (p: { value: string }) => p.value },
              },
        },
        {
          name: "Внутренний бренд",
          type: "line",
          data: INTERNAL_SERIES,
          color: C.internal,
          areaStyle: { color: lineArea(C.internal) },
          markArea: compact
            ? undefined
            : {
                itemStyle: { color: "rgba(242,114,127,0.08)" },
                label: { color: C.rose, fontSize: 11, position: "insideTop" },
                data: [[{ name: "просадка", xAxis: "Фев" }, { xAxis: "Апр" }]],
              },
        },
      ],
    }
  }, [compact])

  return (
    <EChart
      option={option}
      className={className ?? (compact ? "h-44" : "h-80")}
      ariaLabel="График индекса внешнего и внутреннего бренда по месяцам"
    />
  )
}

/** Внешний и внутренний индекс по каждому обещанию */
export function TopicGapChart({ className }: { className?: string }) {
  const option = useMemo(() => {
    const items = [...PROMISES].reverse()
    return {
      grid: { left: 8, right: 24, top: 36, bottom: 8, containLabel: true },
      legend: { top: 0, left: 0 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "value", max: 100, splitNumber: 4 },
      yAxis: { type: "category", data: items.map((p) => p.title), axisLabel: { width: 180, overflow: "truncate" } },
      series: [
        {
          name: "Снаружи",
          type: "bar",
          data: items.map((p) => p.external),
          color: C.external,
          barGap: "20%",
          barWidth: 9,
          itemStyle: { borderRadius: [0, 6, 6, 0] },
        },
        {
          name: "Изнутри",
          type: "bar",
          data: items.map((p) => p.internal),
          color: C.internal,
          barWidth: 9,
          itemStyle: { borderRadius: [0, 6, 6, 0] },
        },
      ],
    }
  }, [])
  return <EChart option={option} className={className ?? "h-[420px]"} ariaLabel="Подтверждение обещаний снаружи и изнутри" />
}

/** Разница «изнутри минус снаружи»: где переобещаете, а где недорассказываете */
export function GapDivergingChart({ className }: { className?: string }) {
  const option = useMemo(() => {
    const items = PROMISES.map((p) => ({ title: p.title, gap: p.internal - p.external })).sort((a, b) => a.gap - b.gap)
    return {
      grid: { left: 8, right: 32, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (ps: TooltipParam[]) => {
          const p = ps[0]
          const hint = p.value < 0 ? "репутация опережает реальность" : "реальность лучше репутации"
          return `${p.name}<br/><b>${p.value > 0 ? "+" : ""}${p.value} п.</b> — ${hint}`
        },
      },
      xAxis: { type: "value", min: -40, max: 40, splitNumber: 4 },
      yAxis: { type: "category", data: items.map((i) => i.title), axisLabel: { width: 180, overflow: "truncate" } },
      series: [
        {
          type: "bar",
          barWidth: 12,
          data: items.map((i) => ({
            value: i.gap,
            itemStyle: {
              color: i.gap < 0 ? C.rose : C.internal,
              borderRadius: i.gap < 0 ? [6, 0, 0, 6] : [0, 6, 6, 0],
            },
          })),
          label: {
            show: true,
            position: "right",
            color: C.muted,
            formatter: (p: { value: number }) => (p.value > 0 ? `+${p.value}` : `${p.value}`),
          },
        },
      ],
    }
  }, [])
  return <EChart option={option} className={className ?? "h-80"} ariaLabel="Разрыв между внутренним и внешним брендом по обещаниям" />
}

/** Индекс по кварталам — для мониторинга */
export function QuarterChart({ className }: { className?: string }) {
  const option = useMemo(
    () => ({
      grid: { left: 8, right: 8, top: 36, bottom: 8, containLabel: true },
      legend: { top: 0, left: 0 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "category", data: QUARTERS },
      yAxis: { type: "value", min: 0, max: 100, splitNumber: 4 },
      series: [
        { name: "Внешний", type: "bar", data: QUARTER_EXTERNAL, color: C.external, barWidth: 18 },
        { name: "Внутренний", type: "bar", data: QUARTER_INTERNAL, color: C.internal, barWidth: 18 },
      ],
    }),
    [],
  )
  return <EChart option={option} className={className ?? "h-60"} ariaLabel="Индекс культуры по кварталам" />
}

/** Радар по группам тем */
export function TopicRadarChart({ className }: { className?: string }) {
  const option = useMemo(() => {
    const items = PROMISES.slice(0, 7)
    return {
      legend: { bottom: 0, left: "center" },
      tooltip: {},
      radar: {
        radius: "62%",
        center: ["50%", "46%"],
        indicator: items.map((p) => ({ name: p.title.replace(" за счёт компании", ""), max: 100 })),
        axisName: { color: C.muted, fontSize: 11 },
      },
      series: [
        {
          type: "radar",
          symbolSize: 4,
          data: [
            {
              name: "Снаружи",
              value: items.map((p) => p.external),
              lineStyle: { color: C.external, width: 2 },
              itemStyle: { color: C.external },
              areaStyle: { color: C.external + "33" },
            },
            {
              name: "Изнутри",
              value: items.map((p) => p.internal),
              lineStyle: { color: C.internal, width: 2 },
              itemStyle: { color: C.internal },
              areaStyle: { color: C.internal + "2a" },
            },
          ],
        },
      ],
    }
  }, [])
  return <EChart option={option} className={className ?? "h-80"} ariaLabel="Радар обещаний: снаружи и изнутри" />
}

/** Тепловая карта: подтверждение обещаний по источникам */
export function SourcesHeatmap({ className }: { className?: string }) {
  const option = useMemo(() => {
    const data: [number, number, number | "-"][] = []
    HEATMAP.forEach((row, y) => row.forEach((v, x) => data.push([x, y, v ?? "-"])))
    return {
      grid: { left: 8, right: 8, top: 8, bottom: 48, containLabel: true },
      tooltip: {
        formatter: (p: { value: [number, number, number | "-"] }) =>
          `${PROMISES[p.value[1]].title}<br/>${SOURCES[p.value[0]]}: <b>${p.value[2] === "-" ? "нет данных" : p.value[2] + "%"}</b>`,
      },
      xAxis: { type: "category", data: SOURCES, splitArea: { show: false }, axisLabel: { interval: 0, fontSize: 11, rotate: 30 } },
      yAxis: {
        type: "category",
        inverse: true,
        data: PROMISES.map((p) => p.title),
        axisLabel: { width: 180, overflow: "truncate" },
      },
      visualMap: {
        min: 0,
        max: 100,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        itemHeight: 160,
        itemWidth: 10,
        text: ["подтверждено", "оспорено"],
        textStyle: { color: C.muted, fontSize: 11 },
        inRange: { color: [C.bad, C.warn, C.ok] },
      },
      series: [
        {
          type: "heatmap",
          data,
          label: { show: true, color: "#1e101e", fontSize: 11, fontWeight: 600, formatter: (p: { value: [number, number, number | "-"] }) => (p.value[2] === "-" ? "" : p.value[2]) },
          itemStyle: { borderColor: "#0e0710", borderWidth: 3, borderRadius: 6 },
          emphasis: { itemStyle: { borderColor: C.text } },
        },
      ],
    }
  }, [])
  return <EChart option={option} className={className ?? "h-[440px]"} ariaLabel="Тепловая карта подтверждения обещаний по источникам" />
}

/** Тональность упоминаний по источникам */
export function TonalityChart({ className }: { className?: string }) {
  const option = useMemo(() => {
    const common = { type: "bar", stack: "t", barWidth: 14 }
    return {
      grid: { left: 8, right: 16, top: 36, bottom: 8, containLabel: true },
      legend: { top: 0, left: 0 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (v: number) => v + "%" },
      xAxis: { type: "value", max: 100, splitNumber: 4, axisLabel: { formatter: "{value}%" } },
      yAxis: { type: "category", data: [...SOURCES].reverse() },
      series: [
        { ...common, name: "Позитив", data: [...TONALITY.positive].reverse(), color: C.ok, itemStyle: { borderRadius: [6, 0, 0, 6] } },
        { ...common, name: "Нейтрально", data: [...TONALITY.neutral].reverse(), color: "#6f5c74", itemStyle: { borderRadius: 0 } },
        { ...common, name: "Негатив", data: [...TONALITY.negative].reverse(), color: C.bad, itemStyle: { borderRadius: [0, 6, 6, 0] } },
      ],
    }
  }, [])
  return <EChart option={option} className={className ?? "h-80"} ariaLabel="Тональность упоминаний по источникам" />
}

/** Индекс культуры — круговая шкала */
export function IndexGauge({ value, label, color = C.external, className }: { value: number; label: string; color?: string; className?: string }) {
  const option = useMemo(
    () => ({
      series: [
        {
          type: "gauge",
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          radius: "92%",
          progress: { show: true, width: 12, roundCap: true, itemStyle: { color } },
          axisLine: { roundCap: true, lineStyle: { width: 12, color: [[1, "rgba(234,223,238,0.08)"]] } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          anchor: { show: false },
          title: { offsetCenter: [0, "38%"], color: C.muted, fontSize: 12 },
          detail: { offsetCenter: [0, "0%"], valueAnimation: true, fontSize: 40, fontWeight: 600, color: C.text, formatter: "{value}" },
          data: [{ value, name: label }],
        },
      ],
    }),
    [value, label, color],
  )
  return <EChart option={option} className={className ?? "h-52"} ariaLabel={`${label}: ${value} из 100`} />
}
