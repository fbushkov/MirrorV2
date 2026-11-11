// Демо-страницы сайта показывают те же цифры, что демо-отчёт по схеме (он же источник данных кабинета).
// Источник цифр — src/content/demo-report.ts. Разметка страниц лежит в прототипе, поэтому расхождение ловит этот тест:
// изменили цифру в отчёте или на странице — поправьте вторую сторону.
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { MIN_GROUP, ZONE_OK_FROM, ZONE_WARN_FROM } from "@/lib/report/methodology"
import { report } from "@/lib/schemas/report"
import { DEMO_REPORT } from "./demo-report"

const page = (name: string) => readFileSync(path.join(process.cwd(), "prototype/home/pages", name), "utf8")
const literal = <T>(source: string, pattern: RegExp): T => {
  const m = source.match(pattern)
  if (!m) throw new Error(`На странице не найдено: ${pattern}`)
  return JSON.parse(m[1]) as T
}

const data = report.parse(DEMO_REPORT)
const STATUS_WORD = { confirmed: "Подтверждается", partial: "Частично", not_confirmed: "Не подтверждается", no_data: "Нет данных" } as const

describe("демо-отчёт HR-бренда на сайте совпадает с отчётом по схеме", () => {
  const html = page("hr-brand-demo.html")
  const ext = data.external!

  it("четыре числа в итогах", () => {
    const kpis = [...html.matchAll(/rkpi__num">([^<]+)</g)].map((m) => Number(m[1]))
    expect(kpis).toEqual([
      ext.index.value,
      ext.promises.filter((p) => p.status === "confirmed").length,
      ext.blindSpots.length,
      ext.industry!.percentile,
    ])
  })

  it("таблица обещаний: вес, упоминания, доля, статус", () => {
    const rows = [...html.matchAll(/<span>([^<]+)<\/span><\/div><\/th><td>(\d+)%<\/td><td>(\d+)<\/td><td>(\d+)%<\/td><td><span class="cmp__status">.*?<\/span>([^<]+)<\/span>/g)]
    expect(rows.map((r) => [r[1], Number(r[2]), Number(r[3]), Number(r[4]), r[5]])).toEqual(
      ext.promises.map((p) => [p.title, Math.round(p.weight * 100), p.mentions, p.confirmedShare, STATUS_WORD[p.status]]),
    )
  })

  it("график динамики индекса", () => {
    const trend = literal<number[]>(html, /type: "line", data: (\[[\d, ]+\])/)
    expect(trend).toEqual(ext.index.series!.points.map((p) => p.value))
    expect(trend.at(-1)).toBe(ext.index.value)
  })

  it("тепловая карта по источникам", () => {
    expect(literal<string[]>(html, /const PROM = (\[.*?\]);/)).toEqual(ext.promises.map((p) => p.title))
    expect(literal<(number | null)[][]>(html, /const HEAT = (\[.*?\]);/)).toEqual(ext.promises.map((p) => p.bySource.map((s) => s.confirmedShare)))
  })

  it("карта «честность и условия»: компания и конкуренты", () => {
    const points = [...html.matchAll(/\{ name: "([^"]+)", x: (\d+), y: (\d+)/g)].map((m) => [m[1], Number(m[2]), Number(m[3])])
    expect(points).toEqual([
      [data.company.name, ext.index.value, ext.industry!.percentile],
      ...ext.competitors.map((c) => [c.name, c.index, c.industryPercentile]),
    ])
  })
})

describe("демо-дашборд здоровья культуры на сайте совпадает с отчётом по схеме", () => {
  const html = page("culture-health-demo.html")
  const int = data.internal!
  type SiteData = {
    metrics: { id: string; score: number; delta30: number; trend: number[] }[]
    depts: { id: string; name: string; size: number }[]
  }
  const site = literal<SiteData>(html, /const D = (\{[\s\S]*?\});\n/)

  it("десять метрик: балл, изменение за 30 дней, ряд за 12 месяцев", () => {
    expect(site.metrics.map((m) => [m.id, m.score, m.delta30, m.trend])).toEqual(
      int.metrics.map((m) => [m.id, m.score, m.delta30, m.series!.points.map((p) => p.value)]),
    )
  })

  it("подразделения и их численность", () => {
    expect(site.depts.map((d) => [d.name, d.size])).toEqual(int.units.map((u) => [u.name, u.size]))
  })

  it("пороги зон и правило 5 — из методики", () => {
    expect(html).toContain(`const MIN = ${MIN_GROUP},`)
    expect(html).toContain(`s >= ${ZONE_OK_FROM} ? "ok" : s >= ${ZONE_WARN_FROM} ? "warn" : "bad"`)
  })
})
