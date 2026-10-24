// Условные данные примера «Банк N». Название и детали изменены, цифры округлены.

export type PromiseStatus = "ok" | "warn" | "bad" | "none"

export const STATUS_LABEL: Record<PromiseStatus, string> = {
  ok: "подтверждено",
  warn: "частично",
  bad: "оспорено",
  none: "нет данных",
}

export type BrandPromise = {
  id: string
  title: string
  /** Доля обещания среди всех обещаний компании, сумма = 1 */
  weight: number
  mentions: number
  /** % упоминаний снаружи, где опыт совпадает с обещанием */
  external: number
  /** % подтверждения изнутри: интервью, опросы, документы (диагностика) */
  internal: number
}

export const BANK_N = {
  name: "Банк N",
  size: "около 700 сотрудников",
  period: "данные за 6 месяцев",
}

export const PROMISES: BrandPromise[] = [
  { id: "official", title: "Официальное оформление", weight: 0.1, mentions: 64, external: 95, internal: 97 },
  { id: "salary", title: "Справедливая зарплата", weight: 0.22, mentions: 118, external: 27, internal: 35 },
  { id: "career", title: "Карьерный рост", weight: 0.15, mentions: 47, external: 80, internal: 58 },
  { id: "team", title: "Дружный коллектив", weight: 0.14, mentions: 89, external: 91, internal: 88 },
  { id: "flex", title: "Гибкий формат", weight: 0.09, mentions: 31, external: 22, internal: 55 },
  { id: "indexation", title: "Ежегодная индексация", weight: 0.1, mentions: 26, external: 48, internal: 40 },
  { id: "learning", title: "Обучение за счёт компании", weight: 0.12, mentions: 22, external: 88, internal: 74 },
  { id: "dms", title: "ДМС", weight: 0.08, mentions: 18, external: 92, internal: 90 },
]

export function statusOf(value: number, mentions = 99): PromiseStatus {
  if (mentions < 10) return "none"
  if (value >= 60) return "ok"
  if (value >= 40) return "warn"
  return "bad"
}

/** Индекс = Σ (вес × % подтверждения), веса нормируются по выбранным обещаниям */
export function cultureIndex(promises: BrandPromise[], side: "external" | "internal" = "external") {
  const total = promises.reduce((sum, p) => sum + p.weight, 0)
  if (!total) return 0
  return promises.reduce((sum, p) => sum + (p.weight / total) * p[side], 0)
}

export const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт"]
export const EXTERNAL_SERIES = [58, 60, 54, 57, 61, 62, 63, 66, 65, 65]
export const INTERNAL_SERIES = [52, 53, 47, 50, 54, 55, 57, 61, 62, 63]

export const EVENTS = [
  { month: "Мар", side: "external" as const, text: "Волна отзывов о задержке индексации" },
  { month: "Авг", side: "external" as const, text: "Вилки зарплат во всех вакансиях" },
]

export const QUARTERS = ["I кв.", "II кв.", "III кв.", "IV кв."]
export const QUARTER_EXTERNAL = [57, 60, 64, 65]
export const QUARTER_INTERNAL = [51, 53, 58, 63]

export const SOURCES = ["hh.ru", "Dreamjob", "VK", "Дзен и медиа", "Нейросети", "Интервью", "Документы"]

/** Тональность упоминаний по источникам, % */
export const TONALITY = {
  positive: [46, 38, 41, 52, 34, 44, 61],
  neutral: [31, 22, 37, 33, 45, 30, 29],
  negative: [23, 40, 22, 15, 21, 26, 10],
}

/** Подтверждение обещаний по источникам (null — тема не встречается) */
export const HEATMAP: (number | null)[][] = [
  // hh.ru, Dreamjob, VK, Дзен, Нейросети, Интервью, Документы
  [96, 93, 97, null, 94, 97, 100],
  [31, 22, 30, 35, 24, 35, 42],
  [84, 74, 82, 79, 76, 58, 63],
  [92, 89, 93, 88, 90, 88, null],
  [25, 18, 26, null, 21, 55, 60],
  [50, 44, 52, 46, null, 40, 35],
  [90, 85, 89, 87, 84, 74, 80],
  [93, 90, null, null, 92, 90, 95],
]

export const COMPETITORS = [
  { title: "Официальное оформление", values: ["ok", "ok", "ok"] },
  { title: "Справедливая зарплата", values: ["bad", "ok", "warn"] },
  { title: "Карьерный рост", values: ["ok", "warn", "ok"] },
  { title: "Дружный коллектив", values: ["ok", "bad", "warn"] },
  { title: "Гибкий формат", values: ["bad", "ok", "ok"] },
] as const satisfies { title: string; values: readonly PromiseStatus[] }[]
