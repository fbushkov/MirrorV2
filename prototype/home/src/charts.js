/* =========================================================
   Графики Mirror на ECharts (в Next — src/components/charts/theme.ts + echart.tsx).
   Подключается только на страницах с графиками. Тема: Onest, подписи #807C93 14 px,
   сетка #ECEBF1, снаружи — фиолетовый, изнутри — бирюзовый, анимация мягкая и короткая.
   События на графике — как в Nivo: вертикальный пунктир и подпись сверху (eventMarks).
   ========================================================= */
const CH = {
  violet: "#7a2fd1", violetSoft: "#d1aee8", violetBg: "#eee5fa", teal: "#0e9384",
  ink: "#17142b", ink2: "#5f5b76", ink3: "#807c93", ink4: "#8a86a0",
  grid: "#ecebf1", field: "#f5f5f8", page: "#f7f7fb", ok: "#3b9952", bad: "#db4f4f",
  font: "Onest, sans-serif",
};
const chAxis = {
  axisLine: { lineStyle: { color: CH.grid } }, axisTick: { show: false },
  axisLabel: { color: CH.ink3, fontSize: 14, fontFamily: CH.font }, splitLine: { lineStyle: { color: CH.grid } },
};
const chTooltip = {
  trigger: "item", backgroundColor: CH.ink, borderWidth: 0, padding: [10, 14],
  textStyle: { color: "#fff", fontFamily: CH.font, fontSize: 14 }, extraCssText: "border-radius:8px;box-shadow:0 12px 32px -12px rgba(23,20,43,.45)",
};
/** Пунктир и подпись над графиком — стиль событий из Nivo */
function eventMarks(events) {
  return {
    silent: true, symbol: "none",
    lineStyle: { color: CH.violetSoft, type: [4, 4], width: 1 },
    label: { show: true, position: "end", distance: 8, color: CH.ink, fontFamily: CH.font, fontSize: 14, formatter: (p) => p.name },
    data: events.map((e) => ({ name: e.text, xAxis: e.x })),
  };
}
function mountChart(el, option) {
  const chart = echarts.init(el, null, { renderer: "svg" });
  chart.setOption({ animationDuration: 500, textStyle: { fontFamily: CH.font, color: CH.ink3, fontSize: 14 }, tooltip: chTooltip, ...option });
  addEventListener("resize", () => chart.resize());
  return chart;
}
