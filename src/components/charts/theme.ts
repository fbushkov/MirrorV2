// Тема ECharts в цветах бренда Mirror. Цвета совпадают с токенами из globals.css.
export const C = {
  external: "#d27be6",
  internal: "#5ee0c8",
  amber: "#f5b850",
  rose: "#f2727f",
  violet: "#8c7bff",
  ok: "#5ed39a",
  warn: "#f5b850",
  bad: "#f2727f",
  text: "#f4e5f3",
  muted: "#b4a0b8",
  grid: "rgba(234,223,238,0.08)",
  axis: "rgba(234,223,238,0.18)",
  tooltipBg: "#1e101e",
}

export const MIRROR_THEME = {
  color: [C.external, C.internal, C.amber, C.violet, C.rose],
  backgroundColor: "transparent",
  textStyle: { color: C.muted },
  legend: { textStyle: { color: C.muted }, icon: "roundRect", itemWidth: 12, itemHeight: 8 },
  tooltip: {
    backgroundColor: C.tooltipBg,
    borderColor: "rgba(234,223,238,0.14)",
    textStyle: { color: C.text, fontSize: 12 },
    extraCssText: "border-radius:10px;box-shadow:0 10px 30px -10px rgba(0,0,0,.6);",
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
