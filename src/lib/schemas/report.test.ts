import { describe, expect, it } from "vitest"
import { z } from "zod"
import { DEMO_REPORT } from "@/content/demo-report"
import { externalIndex, level, mentionAgeWeight, promiseLoss, promiseStatus } from "@/lib/report/methodology"
import { report, type ReportInput } from "./report"

const clone = (): ReportInput => structuredClone(DEMO_REPORT)
const issues = (input: unknown) => {
  const r = report.safeParse(input)
  return r.success ? [] : r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
}

describe("методика", () => {
  it("статус обещания по доле подтверждений и числу упоминаний", () => {
    expect(promiseStatus(64, 95)).toBe("confirmed")
    expect(promiseStatus(20, 60)).toBe("confirmed")
    expect(promiseStatus(26, 48)).toBe("partial")
    expect(promiseStatus(26, 40)).toBe("partial")
    expect(promiseStatus(118, 39)).toBe("not_confirmed")
    expect(promiseStatus(9, 95)).toBe("no_data")
  })

  it("давность упоминаний: до 12 месяцев 1, до 24 — 0,5, старше не учитываем", () => {
    expect(mentionAgeWeight(3)).toBe(1)
    expect(mentionAgeWeight(18)).toBe(0.5)
    expect(mentionAgeWeight(30)).toBe(0)
  })

  it("индекс «Банка N» 65 и недобор «Справедливой зарплаты» 16 баллов, как на странице методики", () => {
    const promises = DEMO_REPORT.external!.promises
    expect(Math.round(externalIndex(promises)!)).toBe(65)
    expect(Math.round(promiseLoss(promises.find((p) => p.id === "fair-pay")!))).toBe(16)
  })

  it("обещания без данных не входят в индекс, веса остальных пересчитываются", () => {
    const index = externalIndex([
      { weight: 0.5, confirmedShare: 80, status: "confirmed" },
      { weight: 0.5, confirmedShare: 10, status: "no_data" },
    ])
    expect(index).toBe(80)
  })

  it("зоны балла изнутри", () => {
    expect([level(65), level(64), level(50), level(49)]).toEqual(["ok", "warn", "warn", "bad"])
  })
})

describe("схема отчёта", () => {
  it("демо-отчёт проходит схему и методику", () => {
    expect(issues(DEMO_REPORT)).toEqual([])
  })

  it("статус обещания не по методике — ошибка", () => {
    const r = clone()
    r.external!.promises[1].status = "partial"
    expect(issues(r).join()).toMatch(/статус по методике: not_confirmed/)
  })

  it("индекс, не совпадающий с обещаниями, — ошибка", () => {
    const r = clone()
    r.external!.index.value = 72
    expect(issues(r).join()).toMatch(/индекс по обещаниям 64\.9/)
  })

  it("сумма весов обещаний не 1 — ошибка", () => {
    const r = clone()
    r.external!.promises[0].weight = 0.3
    expect(issues(r).join()).toMatch(/сумма весов/)
  })

  it("группа меньше 5 человек не может иметь балл", () => {
    const r = clone()
    r.internal!.slices!.push({ metric: "energy", unitId: "it", stage: "crisis", period: "30d", groupSize: 3, score: 41 })
    expect(issues(r).join()).toMatch(/группа меньше 5 человек/)
  })

  it("перцентиль отрасли без 30 компаний в базе — ошибка", () => {
    const r = clone()
    r.external!.industry!.peerCount = 12
    expect(issues(r).join()).toMatch(/перцентиль считаем при 30\+/)
  })

  it("зона метрики и балл нормы кода проверяются по метрикам", () => {
    const r = clone()
    r.internal!.metrics[0].level = "bad"
    r.internal!.code![0].score = 60
    const text = issues(r).join()
    expect(text).toMatch(/зона по баллу: ok/)
    expect(text).toMatch(/балл нормы по метрикам 49\.0/)
  })

  it("у анонимного сигнала нет подразделения", () => {
    const r = clone() as ReportInput & { internal: { signals: Record<string, unknown>[] } }
    r.internal.signals[0].unitId = "sales"
    const parsed = report.parse(r)
    expect(parsed.internal!.signals[0]).not.toHaveProperty("unitId")
  })

  it("цитата без проверки на узнаваемые детали не принимается", () => {
    const r = clone()
    ;(r.external!.blindSpots[0].quote as { checked: boolean }).checked = false
    expect(issues(r).length).toBeGreaterThan(0)
  })

  it("отчёт снаружи требует блок external, сверка — оба блока", () => {
    const r = clone()
    r.kind = "external_scan"
    delete r.external
    expect(issues(r).join()).toMatch(/без блока external/)
    expect(issues(r).join()).toMatch(/только при обоих блоках/)
  })

  it("внешний срез без внутреннего блока и сверки — корректный отчёт", () => {
    const r = clone()
    r.kind = "external_scan"
    delete r.internal
    r.bridge = []
    expect(issues(r)).toEqual([])
  })

  it("схема выгружается в JSON Schema для генерации отчёта ИИ", () => {
    const json = z.toJSONSchema(report, { io: "input", unrepresentable: "any" }) as { properties: Record<string, unknown> }
    expect(Object.keys(json.properties)).toEqual(expect.arrayContaining(["external", "internal", "bridge", "plan"]))
  })
})
