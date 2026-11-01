// Демо-отчёт «Банка N» по схеме src/lib/schemas/report.ts. Данные условные и совпадают с демо-страницами прототипа:
// снаружи — prototype/home/pages/hr-brand-demo.html, изнутри — culture-health-demo.html.
// Это образец для генерации отчёта (ADR-0007), PDF и будущего кабинета; тест проверяет его схемой и методикой.
import { METHODOLOGY_VERSION } from "@/lib/report/methodology"
import { METRIC_IDS, REPORT_SCHEMA_VERSION, type ReportInput } from "@/lib/schemas/report"

const MONTHS_EXT = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"]
const MONTHS_INT = ["2025-11", "2025-12", ...MONTHS_EXT]
const points = (months: string[], values: number[]) => values.map((value, i) => ({ month: months[i], value }))

const SOURCES = ["hh", "dreamjob", "vk", "media", "ai"] as const
const bySource = (values: (number | null)[]) => values.map((confirmedShare, i) => ({ source: SOURCES[i], confirmedShare }))

/* Изнутри: 10 метрик с рядами за 12 месяцев */
const METRICS = {
  clarity: { score: 68, delta30: 2, confidence: "high", trend: [62, 63, 63, 65, 64, 66, 66, 67, 66, 68, 66, 68], drivers: [["Ежемесячные встречи с руководством и ответы на вопросы", "correlates"], ["Реже меняются приоритеты в квартале", "hypothesis"]] },
  belonging: { score: 74, delta30: 1, confidence: "high", trend: [71, 72, 71, 73, 72, 73, 74, 73, 74, 73, 73, 74], drivers: [["Наставник у каждого новичка в первый месяц", "pilot_confirmed"]] },
  growth: { score: 57, delta30: -1, confidence: "medium", trend: [59, 60, 59, 58, 59, 58, 57, 58, 58, 57, 58, 57], drivers: [["Нет описанных карьерных треков для специалистов", "hypothesis"], ["Внутренние вакансии публикуются после внешних", "correlates"]] },
  safety: { score: 50, delta30: -8, confidence: "medium", trend: [58, 59, 58, 59, 60, 59, 60, 59, 58, 57, 58, 50], drivers: [["Смена руководителя в двух командах ИТ в этом месяце", "correlates"], ["Разборы ошибок проходят с поиском виноватых", "hypothesis"]] },
  collab: { score: 72, delta30: 3, confidence: "high", trend: [67, 68, 68, 69, 69, 70, 69, 70, 71, 70, 69, 72], drivers: [["Регулярные встречи один на один у 80% руководителей", "pilot_confirmed"]] },
  voice: { score: 48, delta30: -3, confidence: "high", trend: [52, 53, 52, 52, 51, 52, 51, 50, 51, 50, 51, 48], drivers: [["Только 34% сигналов получают ответ", "correlates"], ["Нет публичной страницы «Решения по обратной связи»", "hypothesis"]] },
  energy: { score: 44, delta30: -11, confidence: "medium", trend: [56, 55, 56, 57, 56, 55, 56, 55, 56, 55, 55, 44], drivers: [["Квартальный план продаж вырос на 18% без изменения штата", "correlates"], ["Отпуска переносят на конец года", "hypothesis"]] },
  influence: { score: 55, delta30: 0, confidence: "medium", trend: [56, 55, 56, 55, 54, 55, 56, 55, 55, 54, 55, 55], drivers: [["Четыре уровня согласования для закупок от 50 000 ₽", "correlates"]] },
  fairness: { score: 59, delta30: 1, confidence: "low", trend: [57, 58, 57, 58, 58, 59, 58, 59, 58, 59, 58, 59], drivers: [["Критерии ревью опубликованы только для части отделов", "hypothesis"]] },
  recognition: { score: 63, delta30: 2, confidence: "high", trend: [59, 60, 60, 61, 60, 61, 62, 61, 62, 62, 61, 63], drivers: [["Ежемесячные благодарности на общих встречах", "correlates"]] },
} as const

const zone = (s: number) => (s >= 65 ? "ok" : s >= 50 ? "warn" : "bad") as "ok" | "warn" | "bad"
const clamp = (v: number) => Math.max(5, Math.min(98, v))

/* Подразделения: сдвиг балла как в демо-дашборде. ИТ на этапе «Уход» ответили 2 человека: балл скрыт, группа объединена с уровнем выше */
const UNITS = [
  { id: "company", name: "Вся компания", parentId: null, size: 680, offset: 0 },
  { id: "sales", name: "Продажи", parentId: "company", size: 210, offset: -6 },
  { id: "it", name: "ИТ", parentId: "company", size: 85, offset: -3 },
  { id: "ops", name: "Операции", parentId: "company", size: 240, offset: 2 },
  { id: "back", name: "Бэк-офис", parentId: "company", size: 145, offset: 5 },
]

/* Три волны кампании: месяц в ряду метрики (август, сентябрь, октябрь) и сколько ответили в каждом подразделении */
const WAVES = [
  { id: "wave-1", month: 9, respondents: { company: 452, sales: 143, it: 51, ops: 160, back: 98 } },
  { id: "wave-2", month: 10, respondents: { company: 431, sales: 136, it: 47, ops: 155, back: 93 } },
  { id: "wave-3", month: 11, respondents: { company: 447, sales: 141, it: 49, ops: 162, back: 95 } },
] as const
const waveScore = (metric: (typeof METRIC_IDS)[number], w: (typeof WAVES)[number]) => METRICS[metric].trend[w.month]
const indexOf = (scores: number[]) => Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)

const slices: NonNullable<NonNullable<ReportInput["internal"]>["slices"]> = [
  ...WAVES.flatMap((w) =>
    UNITS.flatMap((u) => {
      const scores = METRIC_IDS.map((metric) => clamp(waveScore(metric, w) + u.offset))
      const base = { unitId: u.id, period: "30d" as const, waveId: w.id, groupSize: u.size, respondents: w.respondents[u.id as keyof typeof w.respondents] }
      return [...METRIC_IDS.map((metric, i) => ({ ...base, metric, score: scores[i] })), { ...base, metric: "index" as const, score: indexOf(scores) }]
    }),
  ),
  { metric: "index", unitId: "it", stage: "onboarding", period: "30d", waveId: "wave-3", groupSize: 7, respondents: 6, score: 59 },
  { metric: "index", unitId: "it", stage: "leaving", period: "30d", waveId: "wave-3", groupSize: 2, respondents: 2, score: null, mergedInto: "it" },
]

export const DEMO_REPORT: ReportInput = {
  schemaVersion: REPORT_SCHEMA_VERSION,
  methodologyVersion: METHODOLOGY_VERSION,
  id: "demo-bank-n-2026-10",
  kind: "campaign_final",
  status: "published",
  demo: true,
  company: { id: "bank-n", name: "Банк N", industry: "Банки", region: "Урал", headcount: 680 },
  period: { from: "2026-01", to: "2026-10" },
  preparedAt: "2026-10-30",
  branding: { kind: "mirror" },

  summary: [
    { kind: "works", text: "Коллектив, обучение, ДМС и оформление подтверждаются во всех источниках. Об этом можно говорить громче." },
    { kind: "risk", text: "«Справедливая зарплата» чаще всего встречается в текстах и хуже всего подтверждается в отзывах, всего 27%." },
    { kind: "start", text: "Вилки зарплат в вакансиях уже подняли индекс в августе. Следующим шагом стоит описать правила гибридной работы." },
  ],

  external: {
    coverage: [
      { source: "hh", mentions: 162, from: "2026-01", to: "2026-10" },
      { source: "dreamjob", mentions: 118, from: "2026-01", to: "2026-10" },
      { source: "vk", mentions: 74, from: "2026-01", to: "2026-10" },
      { source: "media", mentions: 31, from: "2026-01", to: "2026-10" },
      { source: "ai", mentions: 30, from: "2026-10", to: "2026-10" },
    ],
    index: {
      value: 65,
      delta: { value: 2, window: "quarter" },
      series: {
        points: points(MONTHS_EXT, [58, 60, 54, 57, 61, 62, 63, 66, 65, 65]),
        events: [
          { month: "2026-03", label: "Волна отзывов о задержке индексации" },
          { month: "2026-08", label: "Вилки зарплат во всех вакансиях" },
        ],
        areas: [{ from: "2026-02", to: "2026-04", kind: "dip" }],
      },
    },
    promises: [
      { id: "official", title: "Официальное оформление", origins: ["vacancy"], weight: 0.1, mentions: 64, confirmedShare: 95, status: "confirmed", bySource: bySource([96, 93, 97, null, 94]) },
      { id: "fair-pay", title: "Справедливая зарплата", origins: ["vacancy", "career_site"], weight: 0.22, mentions: 118, confirmedShare: 27, status: "not_confirmed", bySource: bySource([31, 22, 30, 35, 24]),
        quotes: [{ text: "Индексацию обещали весной, получили в конце лета.", source: "Dreamjob", tone: "negative", checked: true }] },
      { id: "career", title: "Карьерный рост", origins: ["vacancy", "career_site"], weight: 0.15, mentions: 47, confirmedShare: 80, status: "confirmed", bySource: bySource([84, 74, 82, 79, 76]) },
      { id: "team", title: "Дружный коллектив", origins: ["vacancy", "social"], weight: 0.14, mentions: 89, confirmedShare: 91, status: "confirmed", bySource: bySource([92, 89, 93, 88, 90]) },
      { id: "hybrid", title: "Гибкий формат", origins: ["vacancy"], weight: 0.09, mentions: 31, confirmedShare: 22, status: "not_confirmed", bySource: bySource([25, 18, 26, null, 21]),
        quotes: [{ text: "Удалёнку обещали на собеседовании. По факту офис пять дней в неделю.", source: "Dreamjob", tone: "negative", checked: true }] },
      { id: "indexation", title: "Ежегодная индексация", origins: ["career_site"], weight: 0.1, mentions: 26, confirmedShare: 48, status: "partial", bySource: bySource([50, 44, 52, 46, null]) },
      { id: "training", title: "Обучение за счёт компании", origins: ["vacancy", "career_site"], weight: 0.12, mentions: 22, confirmedShare: 88, status: "confirmed", bySource: bySource([90, 85, 89, 87, 84]) },
      { id: "dms", title: "ДМС", origins: ["vacancy"], weight: 0.08, mentions: 18, confirmedShare: 92, status: "confirmed", bySource: bySource([93, 90, null, null, 92]) },
    ],
    blindSpots: [
      { topic: "Переработки", share: 18, tone: "negative", quote: { text: "Уходим в восемь, если сдаём отчётность.", source: "Dreamjob", tone: "negative", checked: true } },
      { topic: "Руководители", share: 14, tone: "mixed", quote: { text: "Всё зависит от того, к какому начальнику попадёшь.", source: "hh.ru", tone: "mixed", checked: true } },
      { topic: "Нагрузка и планы", share: 11, tone: "negative", quote: { text: "Планы растут каждый квартал, людей не добавляют.", source: "VK", tone: "negative", checked: true } },
      { topic: "Офис и техника", share: 6, tone: "neutral", quote: { text: "Ноутбуки старые, но офис удобный.", source: "Dreamjob", tone: "neutral", checked: true } },
    ],
    industry: {
      peerGroup: "банки Урала",
      peerCount: 34,
      percentile: 62,
      tracks: [
        { topic: "Коллектив", percentile: 82 },
        { topic: "Стабильность", percentile: 77 },
        { topic: "Развитие", percentile: 71 },
        { topic: "Руководство", percentile: 58 },
        { topic: "Нагрузка", percentile: 41 },
        { topic: "Зарплата", percentile: 34 },
      ],
    },
    competitors: [
      { name: "Банк А", index: 74, industryPercentile: 72, promises: [
        { promiseId: "official", status: "confirmed" }, { promiseId: "fair-pay", status: "confirmed" }, { promiseId: "career", status: "partial" },
        { promiseId: "team", status: "not_confirmed" }, { promiseId: "hybrid", status: "confirmed" }] },
      { name: "Банк Б", index: 38, industryPercentile: 54, promises: [
        { promiseId: "official", status: "confirmed" }, { promiseId: "fair-pay", status: "partial" }, { promiseId: "career", status: "confirmed" },
        { promiseId: "team", status: "partial" }, { promiseId: "hybrid", status: "confirmed" }] },
    ],
    signals: [{ topic: "Переработки", growth: 6, month: "2026-10", note: "Доля упоминаний выросла с 12% до 18% за месяц" }],
  },

  internal: {
    waves: [
      { id: "wave-1", label: "Первый замер", from: "2026-08-04", to: "2026-08-15", invited: 680, responded: 452 },
      { id: "wave-2", label: "Второй замер", from: "2026-09-08", to: "2026-09-19", invited: 680, responded: 431 },
      { id: "wave-3", label: "Третий замер", from: "2026-10-06", to: "2026-10-17", invited: 680, responded: 447 },
    ],
    delayDays: 14,
    units: UNITS.map(({ id, name, parentId, size }) => ({ id, name, parentId, size })),
    index: { value: 59, level: "warn", delta30: -1, waves: WAVES.map((w) => ({ waveId: w.id, score: indexOf(METRIC_IDS.map((m) => waveScore(m, w))) })), series: { points: points(MONTHS_INT, MONTHS_INT.map((_, i) => Math.round(METRIC_IDS.reduce((s, m) => s + METRICS[m].trend[i], 0) / METRIC_IDS.length))), events: [{ month: "2026-10", label: "Смена руководителя в двух командах ИТ" }] } },
    metrics: METRIC_IDS.map((id) => {
      const m = METRICS[id]
      return {
        id, score: m.score, level: zone(m.score), delta30: m.delta30, confidence: m.confidence,
        waves: WAVES.map((w) => ({ waveId: w.id, score: waveScore(id, w) })),
        series: { points: points(MONTHS_INT, [...m.trend]) },
        drivers: m.drivers.map(([text, evidence]) => ({ text, evidence })),
      }
    }),
    slices,
    code: [
      { id: "openness", title: "Открытость", metrics: ["voice", "safety"], score: 49, level: "bad" },
      { id: "care", title: "Забота о людях", metrics: ["energy"], score: 44, level: "bad" },
      { id: "freedom", title: "Свобода и ответственность", metrics: ["influence"], score: 55, level: "warn" },
      { id: "teamwork", title: "Командность", metrics: ["collab"], score: 72, level: "ok" },
      { id: "development", title: "Развитие", metrics: ["growth"], score: 57, level: "warn" },
    ],
    discrepancies: [
      { kind: "anonymous_vs_units", text: "В анонимных сообщениях чаще всего пишут о переработках. В пульсах подразделений нагрузку оценивают как нормальную.", hint: "Возможно, о нагрузке боятся говорить открыто. Стоит проверить на встрече с командами." },
      { kind: "declared_vs_experienced", text: "В культурном коде заявлена «Открытость», а обратная связь и психологическая безопасность в зоне риска и внимания.", hint: "Норма заявлена громко, а опыт её не подтверждает. Это главный разрыв квартала." },
    ],
    alerts: [
      { metric: "energy", change: -11, days: 14, unitId: "sales", context: "Вырос квартальный план" },
      { metric: "safety", change: -8, days: 14, unitId: "it", context: "Смена руководителя в двух командах" },
      { metric: "voice", change: -3, days: 30, unitId: null, context: "Ответ получают только 34% сигналов, норма от 70%" },
    ],
    signals: [
      { metric: "energy", tone: "negative", text: "Третью неделю закрываем задачи по вечерам. Об этом не принято говорить вслух.", source: "анонимная форма", channel: "anonymous_form", month: "2026-10", checked: true },
      { metric: "collab", tone: "positive", text: "С соседней командой наконец договорились о едином трекере, стало проще.", source: "ретроспектива", channel: "retro", month: "2026-10", checked: true },
      { metric: "voice", tone: "negative", text: "Писали про парковку полгода назад. Ответа так и нет.", source: "платформа идей", channel: "ideas_platform", month: "2026-09", checked: true },
      { metric: "safety", tone: "negative", text: "После смены руководителя на планёрках стали меньше спорить.", source: "пульс-опрос", channel: "pulse", month: "2026-10", checked: true },
      { metric: "recognition", tone: "positive", text: "Приятно, что результат проекта отметили на общей встрече.", source: "комментарий", channel: "survey_comments", month: "2026-10", checked: true },
      { metric: "clarity", tone: "neutral", text: "Хотелось бы понимать, как наш отдел влияет на цели года.", source: "вопрос на встрече с руководством", channel: "leadership_qa", month: "2026-09", checked: true },
    ],
    confirming: [
      { kind: "loop_closure", label: "Доля закрытых петель обратной связи", value: 34, unit: "percent", period: "30d", norm: "от 70%" },
      { kind: "unused_vacation", label: "Перенесённые отпуска в продажах", value: 21, unit: "percent", period: "90d", unitId: "sales" },
    ],
    context: [
      { month: "2026-10", label: "Смена руководителя в двух командах ИТ", unitId: "it" },
      { month: "2026-10", label: "Квартальный план продаж вырос на 18%", unitId: "sales" },
    ],
    decisions: [
      { id: "sales-load", unitId: "sales", topic: "Переработки в отделе продаж", decision: "Пересчитали план с учётом штата и ввели «тихие часы» без встреч", outcome: "Энергия и ресурс +9 за квартал", metric: "energy", change: 9, status: "done", public: true, month: "2026-07" },
      { id: "loop", topic: "Сигналы остаются без ответа", decision: "Отвечать на каждый сигнал в течение 10 рабочих дней", outcome: "Доля закрытых петель выросла с 34% до 71%", metric: "voice", status: "in_progress", public: true, month: "2026-10" },
      { id: "review", unitId: null, topic: "Непонятные критерии ревью", decision: "Опубликовали критерии для всех отделов", outcome: "Справедливость и прозрачность +6", metric: "fairness", change: 6, status: "done", public: true, month: "2026-06" },
    ],
  },

  bridge: [
    { kind: "both_sides", external: { type: "blind_spot", topic: "Переработки", share: 18 }, internal: { metric: "energy", score: 44 }, text: "Проблему видят и кандидаты, и сотрудники. Это не шум в отзывах, начинать стоит с нагрузки." },
    { kind: "both_sides", external: { type: "blind_spot", topic: "Руководители", share: 14 }, internal: { metric: "voice", score: 48 }, text: "Опыт сильно зависит от руководителя. Изнутри это видно по тому, что людей не слышат." },
    { kind: "strength", external: { type: "promise", promiseId: "team", confirmedShare: 91 }, internal: { metric: "belonging", score: 74 }, text: "Обещание подтверждается и изнутри. Его можно ставить в центр коммуникаций." },
    { kind: "early_signal", external: { type: "promise", promiseId: "career", confirmedShare: 80 }, internal: { metric: "growth", score: 57 }, text: "Снаружи обещание выглядит убедительно, изнутри слабее. Через полгода это может дойти до отзывов." },
  ],

  plan: [
    { id: "sales-quiet-hours", unitId: "sales", title: "Проверить, соблюдаются ли «тихие часы» в продажах", why: "Энергия и ресурс в продажах упали на 11 баллов за 2 недели после роста плана.", ownerRole: "Руководитель продаж", due: "2 недели", horizon: "quick", impact: "high", effort: "low", kpi: "Энергия и ресурс в продажах", status: "in_progress" },
    { id: "it-retro", unitId: "it", title: "Разборы ошибок без поиска виноватых в двух командах ИТ", why: "После смены руководителей психологическая безопасность в ИТ упала на 8 баллов.", ownerRole: "Руководитель ИТ", due: "1 месяц", horizon: "mid", impact: "medium", effort: "medium", kpi: "Психологическая безопасность в ИТ" },
    { id: "salary-ranges", title: "Указать зарплатные вилки во всех вакансиях", why: "Сейчас вилок нет в 8 из 28 вакансий, включая все роли в ИТ.", ownerRole: "Руководитель подбора", due: "2 недели", horizon: "quick", impact: "high", effort: "low", kpi: "Подтверждение «Справедливой зарплаты»" },
    { id: "drop-fair-pay", title: "Убрать «справедливую зарплату» из текстов до пересмотра окладов", why: "Обещание, которое не подтверждается, бьёт по доверию сильнее, чем его отсутствие.", ownerRole: "HR-бренд", due: "2 недели", horizon: "quick", impact: "medium", effort: "low" },
    { id: "hybrid-rules", title: "Описать правила гибридной работы", why: "Кому, сколько дней и как договориться. Опубликовать в вакансиях и на карьерном сайте.", ownerRole: "Директор по персоналу", due: "1 месяц", horizon: "mid", impact: "high", effort: "medium", kpi: "Подтверждение «Гибкого формата»" },
  ],
  kpis: [
    { name: "Индекс культуры", current: 65, target6m: 70, target12m: 75, unit: "из 100" },
    { name: "Индекс переживаемой культуры", current: 59, target6m: 63, target12m: 66, unit: "из 100" },
    { name: "Доля закрытых петель обратной связи", current: 34, target6m: 70, unit: "%" },
  ],
  dataGaps: [{ gap: "Мало упоминаний ДМС в соцсетях", source: "Опрос новичков после испытательного срока", priority: "low" }],
}
