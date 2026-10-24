// Тема ECharts для светлого сайта Mirror. Цвета совпадают с токенами из globals.css.
export const C = {
  external: "#a847b8",
  internal: "#12a594",
  amber: "#d97706",
  rose: "#e5484d",
  violet: "#6e56cf",
  ok: "#16a34a",
  warn: "#d97706",
  bad: "#e5484d",
  text: "#1a1320",
  muted: "#6c6273",
  grid: "rgba(26,19,32,0.07)",
  axis: "rgba(26,19,32,0.14)",
  track: "#f0eaf3",
  surface: "#ffffff",
}

export const MIRROR_THEME = {
  color: [C.external, C.internal, C.amber, C.violet, C.rose],
  backgroundColor: "transparent",
  textStyle: { color: C.muted },
  legend: { textStyle: { color: C.muted }, icon: "roundRect", itemWidth: 12, itemHeight: 8 },
  tooltip: {
    backgroundColor: C.surface,
    borderColor: "rgba(26,19,32,0.1)",
    textStyle: { color: C.text, fontSize: 12 },
    extraCssText: "border-radius:10px;box-shadow:0 12px 32px -12px rgba(26,19,32,.25);",
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: C.axis } },
    axisTick: { show: false },
    axisLabel: { color: C.muted },
    splitLine: { lineStyle: { color: C.grid } },
  },
  valueAxis: {
    axisLine: { show: false },
    axisLabel: { color: C.muted },
    splitLine: { lineStyle: { color: C.grid } },
  },
  line: { symbol: "circle", symbolSize: 6, smooth: true, lineStyle: { width: 2.5 } },
  bar: { itemStyle: { borderRadius: [6, 6, 0, 0] } },
  radar: {
    axisName: { color: C.muted },
    splitLine: { lineStyle: { color: C.grid } },
    splitArea: { show: false },
    axisLine: { lineStyle: { color: C.grid } },
  },
}
