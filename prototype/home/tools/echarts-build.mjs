// Сборка vendor/echarts.mirror.min.js из tools/echarts-entry.js (глобальная переменная echarts, как у полной сборки)
import { build } from "vite";
import { fileURLToPath } from "node:url";
const here = fileURLToPath(new URL(".", import.meta.url));
await build({
  root: here, logLevel: "warn", configFile: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production"), __DEV__: "false" }, // без отладочных проверок ECharts
  build: {
    outDir: here + "../vendor", emptyOutDir: false, minify: true,
    lib: { entry: here + "echarts-entry.js", name: "echarts", formats: ["iife"], fileName: () => "echarts.mirror.min.js" },
  },
});
