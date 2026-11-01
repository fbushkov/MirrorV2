/**
 * Методика Mirror 1.0 в коде: пороги и расчёты, которые описаны на страницах «Как считаем».
 * Снаружи — /hr-brand/methodology, изнутри — /culture-health/methodology.
 * Цифры отчёта считает код, а не ИИ (ADR-0007): эти функции используются и при расчёте, и при проверке отчёта схемой.
 */

export const METHODOLOGY_VERSION = "1.0"

/** Снаружи: статус обещания по доле подтверждений */
export const PROMISE_MIN_MENTIONS = 10
export const PROMISE_CONFIRMED_FROM = 60
export const PROMISE_PARTIAL_FROM = 40
/** Снаружи: место в отрасли считаем, когда в базе отрасли не меньше 30 компаний */
export const INDUSTRY_MIN_PEERS = 30
/** Снаружи: упоминания до 12 месяцев весят 1, 12–24 месяца 0,5, старше не учитываем */
export const MENTION_AGE_WEIGHTS = [
  { maxMonths: 12, weight: 1 },
  { maxMonths: 24, weight: 0.5 },
] as const

/** Изнутри: зоны балла */
export const ZONE_OK_FROM = 65
export const ZONE_WARN_FROM = 50
/** Изнутри: минимальная группа показа */
export const MIN_GROUP = 5

export type PromiseStatus = "confirmed" | "partial" | "not_confirmed" | "no_data"
export type Level = "ok" | "warn" | "bad"

export function promiseStatus(mentions: number, confirmedShare: number | null): PromiseStatus {
  if (mentions < PROMISE_MIN_MENTIONS || confirmedShare === null) return "no_data"
  if (confirmedShare >= PROMISE_CONFIRMED_FROM) return "confirmed"
  if (confirmedShare >= PROMISE_PARTIAL_FROM) return "partial"
  return "not_confirmed"
}

export function mentionAgeWeight(ageMonths: number): number {
  return MENTION_AGE_WEIGHTS.find((w) => ageMonths < w.maxMonths)?.weight ?? 0
}

type WeightedPromise = { weight: number; confirmedShare: number | null; status: PromiseStatus }

/**
 * Индекс культуры = Σ вес × % подтверждения. Обещания без данных в индекс не входят,
 * веса остальных пересчитываются (так же работает калькулятор на странице методики).
 */
export function externalIndex(promises: WeightedPromise[]): number | null {
  const rated = promises.filter((p) => p.status !== "no_data" && p.confirmedShare !== null)
  const total = rated.reduce((s, p) => s + p.weight, 0)
  if (!rated.length || total === 0) return null
  return rated.reduce((s, p) => s + (p.weight / total) * (p.confirmedShare as number), 0)
}

/** Сколько баллов индекса теряет обещание: вес × доля, которая не подтвердилась */
export function promiseLoss(p: WeightedPromise): number {
  return p.status === "no_data" || p.confirmedShare === null ? 0 : p.weight * (100 - p.confirmedShare)
}

export function level(score: number): Level {
  if (score >= ZONE_OK_FROM) return "ok"
  if (score >= ZONE_WARN_FROM) return "warn"
  return "bad"
}

export const average = (values: number[]) => values.reduce((s, v) => s + v, 0) / values.length

/** Индекс переживаемой культуры = среднее по 10 метрикам; балл нормы кода = среднее по её метрикам */
export function internalIndex(scores: number[]): number {
  return average(scores)
}

/* ── Приватность срезов изнутри (ADR-0010, раздел 6) ── */

/**
 * Правило 5 человек считается по ответившим, а не по численности: в подразделении из 85 человек
 * трёх ответивших легко узнать. Срез показываем, только если ответили не меньше 5.
 */
export const sliceVisible = (respondents: number) => respondents >= MIN_GROUP

/**
 * Уверенность по доле ответивших: от 50% высокая, от 30% средняя, ниже — низкая.
 * Пороги — предложение, утверждаются экспертом (на сайте: уверенность зависит от числа ответов и согласия источников).
 */
export const RESPONSE_HIGH_FROM = 0.5
export const RESPONSE_MEDIUM_FROM = 0.3
export function responseConfidence(respondents: number, groupSize: number): "high" | "medium" | "low" {
  const rate = groupSize ? respondents / groupSize : 0
  return rate >= RESPONSE_HIGH_FROM ? "high" : rate >= RESPONSE_MEDIUM_FROM ? "medium" : "low"
}

/** Остаток «целое минус видимые части»: 1–4 человека — это группа, которую можно вычислить разностью срезов */
export function exposedRemainder(total: number, visibleParts: number[]): number | null {
  const rest = total - visibleParts.reduce((s, v) => s + v, 0)
  return rest > 0 && rest < MIN_GROUP ? rest : null
}

/**
 * Защита от вычитания (дополнительное скрытие). Части с ответившими меньше 5 скрыты сразу.
 * Если целое минус видимые части даёт 1–4 человека, скрываем ещё самую маленькую видимую часть и проверяем снова.
 * Возвращает id частей, которые нужно скрыть. Части — дочерние подразделения или этапы жизненного цикла.
 */
export function complementarySuppression(total: number, parts: { id: string; respondents: number }[]): Set<string> {
  const hidden = new Set(parts.filter((p) => !sliceVisible(p.respondents)).map((p) => p.id))
  for (;;) {
    const visible = parts.filter((p) => !hidden.has(p.id))
    if (exposedRemainder(total, visible.map((p) => p.respondents)) === null || !visible.length) return hidden
    hidden.add(visible.reduce((a, b) => (b.respondents < a.respondents ? b : a)).id)
  }
}
