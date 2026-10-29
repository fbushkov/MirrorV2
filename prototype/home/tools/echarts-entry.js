/* Своя сборка ECharts для прототипа: только то, что есть на страницах.
   Графики: линия, столбцы, точки, тепловая карта, спидометр. Компоненты: сетка, подсказка,
   пунктир событий (markLine), зоны (markArea), шкала цвета (visualMap). Отрисовка — SVG (mountChart в charts.js).
   Новый тип графика на странице — добавить сюда и пересобрать: node tools/echarts-build.mjs */
import * as echarts from "echarts/core";
import { LineChart, BarChart, ScatterChart, HeatmapChart, GaugeChart } from "echarts/charts";
import { GridComponent, TooltipComponent, MarkLineComponent, MarkAreaComponent, VisualMapComponent } from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
echarts.use([LineChart, BarChart, ScatterChart, HeatmapChart, GaugeChart, GridComponent, TooltipComponent, MarkLineComponent, MarkAreaComponent, VisualMapComponent, SVGRenderer]);
export const { init, graphic, use } = echarts;
