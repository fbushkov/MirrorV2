/**
 * Отчёт Mirror как данные (ADR-0009). Один JSON по этой схеме — источник для PDF клиенту, PDF под брендом агентства
 * и, позже, личного кабинета. Описание полей и правила хранения — docs/product/report-data.md.
 *
 * Принципы:
 * — направления не смешиваются: `external` (снаружи) и `internal` (изнутри) — отдельные блоки со своими шкалами,
 *   связь между ними только по темам (`bridge`);
 * — в отчёте нет персональных данных: ни авторов отзывов, ни имён сотрудников, ответственный в плане — роль;
 * — изнутри только агрегаты групп от 5 человек, анонимные цитаты без привязки к подразделению;
 * — числа, которые выводятся из других чисел (индекс, статусы, зоны), проверяются по методике при разборе.
 */
import { z } from "zod"
import {
  INDUSTRY_MIN_PEERS,
  METHODOLOGY_VERSION,
  MIN_GROUP,
  average,
  exposedRemainder,
  externalIndex,
  level,
  promiseStatus,
} from "@/lib/report/methodology"

export const REPORT_SCHEMA_VERSION = "1.0"

/* ── Общие типы ─────────────────────────────────────────────── */

const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "id: латиница в нижнем регистре, цифры и дефис")
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "месяц в формате ГГГГ-ММ")
const date = z.iso.date()
const text = z.string().trim().min(1)
/** Балл и доля — от 0 до 100 */
const score = z.number().min(0).max(100)
const share = z.number().min(0).max(100)
const count = z.number().int().min(0)

export const LEVELS = ["ok", "warn", "bad"] as const
export const level$ = z.enum(LEVELS)
export const tone = z.enum(["positive", "neutral", "negative", "mixed"])
export const confidence = z.enum(["high", "medium", "low"])
/** Уровень доказанности причины: гипотеза → коррелирует → подтверждено пилотом */
export const evidence = z.enum(["hypothesis", "correlates", "pilot_confirmed"])

/** Ряд по месяцам с событиями (пунктир на графике) и зонами просадок и подъёмов */
export const series = z.object({
  points: z.array(z.object({ month, value: score })).min(1),
  events: z.array(z.object({ month, label: text })).default([]),
  areas: z.array(z.object({ from: month, to: month, kind: z.enum(["dip", "rise"]) })).default([]),
})

/** Цитата без автора. `checked` — проверена на узнаваемые детали (проекты, должности, даты) */
export const quote = z.object({
  text,
  source: text,
  tone,
  checked: z.literal(true),
})

/* ── Снаружи: оценка HR-бренда ──────────────────────────────── */

export const EXTERNAL_SOURCES = ["hh", "dreamjob", "vk", "dzen", "media", "telegram", "career_site", "ai", "other"] as const
export const externalSource = z.enum(EXTERNAL_SOURCES)

export const PROMISE_STATUSES = ["confirmed", "partial", "not_confirmed", "no_data"] as const

export const promise = z
  .object({
    id,
    title: text,
    /** Где компания это обещает */
    origins: z.array(z.enum(["vacancy", "career_site", "social", "media", "other"])).min(1),
    /** Доля обещания среди всех обещаний компании, 0–1 */
    weight: z.number().gt(0).max(1),
    /** Упоминаний темы с учётом давности (до 12 мес. вес 1, 12–24 мес. — 0,5) */
    mentions: count,
    confirmedShare: share.nullable(),
    status: z.enum(PROMISE_STATUSES),
    /** Доля подтверждений по источникам; null — тема в источнике не встречается */
    bySource: z.array(z.object({ source: externalSource, confirmedShare: share.nullable() })).default([]),
    quotes: z.array(quote).default([]),
  })
  .superRefine((p, ctx) => {
    const expected = promiseStatus(p.mentions, p.confirmedShare)
    if (p.status !== expected)
      ctx.addIssue({ code: "custom", path: ["status"], message: `статус по методике: ${expected}` })
  })

export const blindSpot = z.object({
  topic: text,
  /** Доля от всех упоминаний компании */
  share,
  /** Тон по большинству упоминаний */
  tone,
  quote: quote.optional(),
})

export const industry = z
  .object({
    /** Например «банки Урала» */
    peerGroup: text,
    peerCount: count,
    /** Доля работодателей, у которых условия хуже; null — в базе отрасли меньше 30 компаний */
    percentile: score.nullable(),
    tracks: z.array(z.object({ topic: text, percentile: score })),
  })
  .superRefine((v, ctx) => {
    if (v.peerCount < INDUSTRY_MIN_PEERS && v.percentile !== null)
      ctx.addIssue({ code: "custom", path: ["percentile"], message: `перцентиль считаем при ${INDUSTRY_MIN_PEERS}+ компаниях в отрасли` })
  })

export const competitor = z.object({
  name: text,
  index: score.nullable(),
  industryPercentile: score.nullable(),
  /** Статусы тех же обещаний по той же методике */
  promises: z.array(z.object({ promiseId: id, status: z.enum(PROMISE_STATUSES) })),
})

/** Мониторинг: резкий рост темы */
export const topicSignal = z.object({
  topic: text,
  /** Рост доли упоминаний, п. п. */
  growth: z.number(),
  month,
  note: text.optional(),
})

export const external = z
  .object({
    coverage: z.array(z.object({ source: externalSource, mentions: count, from: month, to: month })).min(1),
    index: z.object({
      value: score,
      /** Изменение и окно, например +2 за квартал */
      delta: z.object({ value: z.number(), window: z.enum(["month", "quarter", "year"]) }).optional(),
      series: series.optional(),
    }),
    promises: z.array(promise).min(1),
    blindSpots: z.array(blindSpot),
    industry: industry.optional(),
    competitors: z.array(competitor).default([]),
    signals: z.array(topicSignal).default([]),
  })
  .superRefine((e, ctx) => {
    const weights = e.promises.reduce((s, p) => s + p.weight, 0)
    if (Math.abs(weights - 1) > 0.011)
      ctx.addIssue({ code: "custom", path: ["promises"], message: `сумма весов обещаний ${weights.toFixed(2)}, должна быть 1` })
    const computed = externalIndex(e.promises)
    if (computed !== null && Math.abs(computed - e.index.value) > 1)
      ctx.addIssue({ code: "custom", path: ["index", "value"], message: `индекс по обещаниям ${computed.toFixed(1)}` })
    const ids = new Set(e.promises.map((p) => p.id))
    e.competitors.forEach((c, i) =>
      c.promises.forEach((p, j) => {
        if (!ids.has(p.promiseId))
          ctx.addIssue({ code: "custom", path: ["competitors", i, "promises", j], message: `нет обещания ${p.promiseId}` })
      }),
    )
  })

/* ── Изнутри: здоровье корпоративной культуры ───────────────── */

export const METRIC_IDS = [
  "clarity", "belonging", "growth", "safety", "collab", "voice", "energy", "influence", "fairness", "recognition",
] as const
export const metricId = z.enum(METRIC_IDS)

export const LIFECYCLE_STAGES = [
  "prehire", "onboarding", "work", "review", "growth", "rolechange", "return", "crisis", "leaving", "after",
] as const

/** Каналы, из которых приходят данные. Баллом становятся только опросы и тексты */
export const INTERNAL_CHANNELS = [
  "pulse", "team_survey", "enps", "onboarding_survey", "exit_interview", "interview", "review_comments",
  "anonymous_form", "survey_comments", "leadership_qa", "ideas_platform", "retro", "chats_aggregate", "other",
] as const
export const internalChannel = z.enum(INTERNAL_CHANNELS)

export const unit = z.object({
  id,
  name: text,
  parentId: id.nullable(),
  /** Численность подразделения */
  size: count,
})

/** Балл в каждой волне замера: так видна динамика кампании «волна 1 — волна 3». Последняя волна равна `score` */
export const waveScores = z.array(z.object({ waveId: id, score })).default([])

export const metricResult = z
  .object({
    id: metricId,
    score,
    waves: waveScores,
    level: level$,
    /** Изменение за 30 дней, баллы */
    delta30: z.number(),
    confidence,
    series: series.optional(),
    drivers: z.array(z.object({ text, evidence })).default([]),
    /** Вклад каналов в балл, % */
    channels: z.array(z.object({ channel: internalChannel, share })).default([]),
  })
  .superRefine((m, ctx) => {
    if (m.level !== level(m.score)) ctx.addIssue({ code: "custom", path: ["level"], message: `зона по баллу: ${level(m.score)}` })
    const last = m.waves.at(-1)
    if (last && last.score !== m.score) ctx.addIssue({ code: "custom", path: ["waves"], message: `последняя волна ${last.score}, а балл ${m.score}` })
  })

/**
 * Срез: метрика (или индекс) × подразделение × этап × период × волна. Хранится только агрегат.
 * Правило 5 человек — по ответившим (`respondents`), а не по численности (`groupSize`): меньше 5 ответивших — без балла,
 * такая группа объединяется с уровнем выше (`mergedInto`). Разность срезов проверяется в `internal` (защита от вычитания).
 */
export const slice = z
  .object({
    metric: z.union([metricId, z.literal("index")]),
    unitId: id,
    stage: z.union([z.enum(LIFECYCLE_STAGES), z.literal("all")]).default("all"),
    period: z.enum(["30d", "90d", "12m"]),
    /** Волна замера; без волны — последняя */
    waveId: id.optional(),
    /** Численность группы */
    groupSize: count,
    /** Сколько ответили: по нему правило 5 человек */
    respondents: count,
    score: score.nullable(),
    mergedInto: id.optional(),
  })
  .superRefine((s, ctx) => {
    if (s.respondents > s.groupSize)
      ctx.addIssue({ code: "custom", path: ["respondents"], message: "ответивших больше численности: проверить волну до публикации" })
    if (s.respondents < MIN_GROUP && s.score !== null)
      ctx.addIssue({ code: "custom", path: ["score"], message: `ответили меньше ${MIN_GROUP} человек: балл не показываем` })
  })

export const codeNorm = z
  .object({
    id,
    title: text,
    metrics: z.array(metricId).min(1),
    score,
    level: level$,
  })
  .superRefine((n, ctx) => {
    if (n.level !== level(n.score)) ctx.addIssue({ code: "custom", path: ["level"], message: `зона по баллу: ${level(n.score)}` })
  })

/** Подтверждающие сигналы (уровень 2): баллом не становятся */
export const confirmingSignal = z.object({
  kind: z.enum(["absenteeism", "loop_closure", "offer_declines", "overtime", "unused_vacation", "internal_moves", "early_attrition", "other"]),
  label: text,
  value: z.number(),
  unit: z.enum(["percent", "days", "hours", "count"]),
  period: z.enum(["30d", "90d", "12m"]),
  unitId: id.optional(),
  /** Норма или ориентир, например «от 70%» */
  norm: text.optional(),
})

/** Решения по обратной связи: что услышали, что решили, что изменилось */
export const decision = z.object({
  id,
  topic: text,
  decision: text,
  outcome: text.optional(),
  metric: metricId.optional(),
  change: z.number().optional(),
  status: z.enum(["planned", "in_progress", "done"]),
  /** Подразделение решения; null — вся компания. Руководитель видит решения своей ветки */
  unitId: id.nullable().default(null),
  /** Показывать на публичной странице для сотрудников */
  public: z.boolean(),
  month,
})

export const internal = z
  .object({
    waves: z
      .array(z.object({ id, label: text, from: date, to: date, invited: count.optional(), responded: count.optional() }))
      .min(1),
    /** Задержка публикации данных, дней */
    delayDays: z.number().int().min(0),
    units: z.array(unit).min(1),
    index: z.object({ value: score, level: level$, delta30: z.number(), series: series.optional(), waves: waveScores }),
    metrics: z.array(metricResult).length(METRIC_IDS.length),
    slices: z.array(slice).default([]),
    code: z.array(codeNorm).default([]),
    /** Где разные каналы говорят разное */
    discrepancies: z.array(z.object({ kind: z.enum(["anonymous_vs_units", "declared_vs_experienced", "channels", "other"]), text, hint: text })).default([]),
    /** Резкие изменения: метрика, на сколько, за сколько дней, где */
    alerts: z.array(z.object({ metric: metricId, change: z.number(), days: z.number().int().positive(), unitId: id.nullable(), context: text })).default([]),
    /** Лента сигналов. Анонимные сообщения остаются на уровне компании: поля подразделения нет намеренно */
    signals: z.array(quote.extend({ metric: metricId, channel: internalChannel, month })).default([]),
    confirming: z.array(confirmingSignal).default([]),
    /** Контекст (уровень 3): реорганизации, смены руководителей, релизы */
    context: z.array(z.object({ month, label: text, unitId: id.optional() })).default([]),
    decisions: z.array(decision).default([]),
  })
  .superRefine((v, ctx) => {
    const ids = new Set(v.metrics.map((m) => m.id))
    if (ids.size !== METRIC_IDS.length) ctx.addIssue({ code: "custom", path: ["metrics"], message: "нужны все 10 метрик по одному разу" })
    const computed = average(v.metrics.map((m) => m.score))
    if (Math.abs(computed - v.index.value) > 1)
      ctx.addIssue({ code: "custom", path: ["index", "value"], message: `индекс по метрикам ${computed.toFixed(1)}` })
    const scores = new Map(v.metrics.map((m) => [m.id, m.score]))
    v.code.forEach((n, i) => {
      const s = average(n.metrics.map((m) => scores.get(m) ?? 0))
      if (Math.abs(s - n.score) > 1) ctx.addIssue({ code: "custom", path: ["code", i, "score"], message: `балл нормы по метрикам ${s.toFixed(1)}` })
    })
    const unitIds = new Set(v.units.map((u) => u.id))
    v.slices.forEach((s, i) => {
      if (!unitIds.has(s.unitId)) ctx.addIssue({ code: "custom", path: ["slices", i, "unitId"], message: `нет подразделения ${s.unitId}` })
    })
    v.decisions.forEach((d, i) => {
      if (d.unitId && !unitIds.has(d.unitId)) ctx.addIssue({ code: "custom", path: ["decisions", i, "unitId"], message: `нет подразделения ${d.unitId}` })
    })
    // Волны: только из списка замеров, индекс волны — среднее метрик этой волны
    const waveIds = new Set(v.waves.map((w) => w.id))
    const lastWave = v.waves.at(-1)!.id
    ;[...v.metrics.flatMap((m) => m.waves), ...v.index.waves, ...v.slices.filter((s) => s.waveId)].forEach((w) => {
      if (!waveIds.has(w.waveId!)) ctx.addIssue({ code: "custom", path: ["waves"], message: `нет волны ${w.waveId}` })
    })
    v.index.waves.forEach((w, i) => {
      const scores = v.metrics.map((m) => m.waves.find((x) => x.waveId === w.waveId)?.score).filter((x) => x !== undefined)
      if (scores.length === METRIC_IDS.length && Math.abs(average(scores) - w.score) > 1)
        ctx.addIssue({ code: "custom", path: ["index", "waves", i], message: `индекс волны по метрикам ${average(scores).toFixed(1)}` })
    })
    // Защита от вычитания: целое минус видимые части не должно давать группу из 1–4 ответивших
    const key = (s: { metric: string; stage: string; period: string; waveId?: string }) => [s.metric, s.stage, s.period, s.waveId ?? lastWave].join("|")
    const byUnit = new Map(v.slices.map((s) => [key(s) + "|" + s.unitId, s]))
    v.slices.forEach((parent, i) => {
      const children = v.units.filter((u) => u.parentId === parent.unitId).map((u) => byUnit.get(key(parent) + "|" + u.id)).filter((x) => x !== undefined)
      const stages = parent.stage === "all" ? v.slices.filter((s) => s.unitId === parent.unitId && s.stage !== "all" && s.metric === parent.metric && s.period === parent.period && (s.waveId ?? lastWave) === (parent.waveId ?? lastWave)) : []
      for (const [parts, what] of [[children, "подразделений"], [stages, "этапов"]] as const) {
        if (!parts.length) continue
        const rest = exposedRemainder(parent.respondents, parts.filter((s) => s.score !== null).map((s) => s.respondents))
        if (rest !== null)
          ctx.addIssue({ code: "custom", path: ["slices", i], message: `разность срезов ${what} открывает группу из ${rest} человек: скрыть ещё один срез` })
      }
    })
  })

/* ── Снаружи и изнутри: сверка тем ──────────────────────────── */

export const bridgeItem = z.object({
  kind: z.enum(["both_sides", "strength", "early_signal"]),
  external: z.discriminatedUnion("type", [
    z.object({ type: z.literal("blind_spot"), topic: text, share }),
    z.object({ type: z.literal("promise"), promiseId: id, confirmedShare: share }),
  ]),
  internal: z.object({ metric: metricId, score }),
  text,
})

/* ── Выводы, план, метрики успеха ───────────────────────────── */

export const finding = z.object({ kind: z.enum(["works", "risk", "start"]), text })

export const planStep = z.object({
  id,
  title: text,
  why: text,
  /** Роль, не имя: «Руководитель подбора» */
  ownerRole: text,
  /** Срок словами, как в отчёте: «2 недели» */
  due: text,
  horizon: z.enum(["quick", "mid", "strategic"]),
  impact: z.enum(["low", "medium", "high"]).optional(),
  effort: z.enum(["low", "medium", "high"]).optional(),
  kpi: text.optional(),
  /** Подразделение шага; null — вся компания. Руководитель отмечает шаги своей ветки */
  unitId: id.nullable().default(null),
  status: z.enum(["proposed", "in_progress", "done", "dropped"]).default("proposed"),
})

export const kpi = z.object({ name: text, current: z.number(), target6m: z.number().optional(), target12m: z.number().optional(), unit: text })

export const dataGap = z.object({ gap: text, source: text, priority: z.enum(["low", "medium", "high"]) })

/* ── Развёрнутый отчёт: разделы «Экспресс-аудита» (ADR-0007) ── */

export const extended = z.object({
  positioning: z.array(z.object({ message: text, share: share.optional() })).default([]),
  perception: z
    .array(z.object({ aspect: text, positive: share, neutral: share, negative: share, trend: z.enum(["up", "down", "flat"]), driver: text.optional(), pain: text.optional() }))
    .default([]),
  vacancies: z
    .object({
      total: count,
      withSalary: count,
      roleFamilies: z.array(z.object({ name: text, count, experience: text.optional(), salaryFrom: count.optional(), salaryTo: count.optional() })),
      weakPoints: z.array(text).default([]),
    })
    .optional(),
  social: z.array(z.object({ channel: text, followers: count.optional(), note: text })).default([]),
  personas: z.array(z.object({ title: text, motivations: z.array(text), pains: z.array(text), channels: z.array(text) })).default([]),
  competitorsReview: z.array(z.object({ name: text, strengths: text, weaknesses: text, weWin: text, weLose: text })).default([]),
  contentPlan: z.array(z.object({ topic: text, driverOrPain: text, format: text, channel: text, frequency: text })).default([]),
  swot: z.object({ strengths: z.array(text), weaknesses: z.array(text), opportunities: z.array(text), threats: z.array(text) }).optional(),
})

/* ── Отчёт целиком ──────────────────────────────────────────── */

export const REPORT_KINDS = [
  "external_scan", // внешний срез, бесплатно
  "external_monitoring", // мониторинг, раз в месяц
  "internal_diagnostics", // диагностика, первый замер изнутри
  "internal_wave", // замер внутри кампании
  "campaign_final", // итоговый отчёт кампании
] as const

export const report = z
  .object({
    schemaVersion: z.literal(REPORT_SCHEMA_VERSION),
    methodologyVersion: z.literal(METHODOLOGY_VERSION),
    id,
    kind: z.enum(REPORT_KINDS),
    status: z.enum(["draft", "review", "published"]),
    /** Демо-данные: на сайте и в PDF помечаются «данные условные» */
    demo: z.boolean().default(false),
    company: z.object({ id, name: text, industry: text, region: text, headcount: count.optional() }),
    period: z.object({ from: month, to: month }),
    preparedAt: date,
    branding: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("mirror") }),
      z.object({ kind: z.literal("agency"), agencyName: text, logo: text.optional() }),
    ]),
    summary: z.array(finding).default([]),
    external: external.optional(),
    internal: internal.optional(),
    bridge: z.array(bridgeItem).default([]),
    plan: z.array(planStep).default([]),
    kpis: z.array(kpi).default([]),
    dataGaps: z.array(dataGap).default([]),
    extended: extended.optional(),
  })
  .superRefine((r, ctx) => {
    if (r.kind.startsWith("external") && !r.external)
      ctx.addIssue({ code: "custom", path: ["external"], message: "отчёт снаружи без блока external" })
    if ((r.kind.startsWith("internal") || r.kind === "campaign_final") && !r.internal)
      ctx.addIssue({ code: "custom", path: ["internal"], message: "отчёт изнутри без блока internal" })
    if (r.bridge.length && !(r.external && r.internal))
      ctx.addIssue({ code: "custom", path: ["bridge"], message: "сверка снаружи и изнутри нужна только при обоих блоках" })
    if (r.period.from > r.period.to) ctx.addIssue({ code: "custom", path: ["period"], message: "начало периода позже конца" })
    const units = new Set(r.internal?.units.map((u) => u.id))
    r.plan.forEach((p, i) => {
      if (p.unitId && !units.has(p.unitId)) ctx.addIssue({ code: "custom", path: ["plan", i, "unitId"], message: `нет подразделения ${p.unitId}` })
    })
    const promiseIds = new Set(r.external?.promises.map((p) => p.id))
    r.bridge.forEach((b, i) => {
      if (b.external.type === "promise" && !promiseIds.has(b.external.promiseId))
        ctx.addIssue({ code: "custom", path: ["bridge", i], message: `нет обещания ${b.external.promiseId}` })
    })
  })

export type Report = z.infer<typeof report>
export type ReportInput = z.input<typeof report>
export type External = z.infer<typeof external>
export type Internal = z.infer<typeof internal>
