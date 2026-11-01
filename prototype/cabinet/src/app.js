/* Прототип личного кабинета клиента (docs/product/cabinet.md, ADR-0010).
   Данные — демо-отчёт «Банка N» (REPORT, по схеме src/lib/schemas/report.ts) и живые записи кабинета (data.js).
   Права по ролям и услугам — как в cabinet.md, раздел 4; в настоящем кабинете их проверяет сервер (can()). */
const EXT = REPORT.external, INT = REPORT.internal;
const $ = (s, r = document) => r.querySelector(s);
const tpl = (id) => document.getElementById(id).innerHTML;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const store = {
  get(k, d) { try { return localStorage.getItem("cab-" + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("cab-" + k, v); } catch { /* без хранилища — только в памяти */ } },
};
const state = { role: store.get("role", "owner"), mode: "campaign", service: "campaign", phase: "ready", unit: null, wave: null, stage: "all", period: "30", adding: false, ask: null, reminder: false, prefill: null };
/** Этап из полосы прототипа: услуга (диагностика или кампания) и фаза (запуск, идёт опрос, отчёт готов) */
function applyMode(m) { state.mode = MODES[m] ? m : "campaign"; state.service = MODES[state.mode].service; state.phase = MODES[state.mode].phase; }
applyMode(store.get("service", "campaign"));
const live = {
  decisions: INT.decisions.map((d) => ({ ...d })),
  launch: LAUNCH.map((l) => ({ ...l })),
  questions: QUESTIONS.map((q) => ({ ...q })),
  meetings: MEETINGS.map((m) => ({ ...m })),
  plan: REPORT.plan.map((p) => ({ ...p })),
  team: TEAM.map((t) => ({ ...t })),
  notify: { report: true, stage: true, alerts: true, waves: true, plan: true, rhythm: false },
};

/* ── Справочники ── */
const LEVEL = (s) => (s >= 65 ? "ok" : s >= 50 ? "warn" : "bad");
const LEVEL_WORD = { ok: "в норме", warn: "внимание", bad: "риск" };
const GAP_WORD = { ok: "совпадает", warn: "частичный разрыв", bad: "разрыв" };
const PROMISE = { confirmed: ["ok", "Подтверждается"], partial: ["warn", "Частично"], not_confirmed: ["bad", "Не подтверждается"], no_data: ["na", "Нет данных"] };
const TONE = { negative: ["bad", "негатив"], positive: ["ok", "позитив"], neutral: ["na", "нейтрально"], mixed: ["warn", "по-разному"] };
const EVIDENCE = { hypothesis: ["na", "гипотеза"], correlates: ["warn", "коррелирует"], pilot_confirmed: ["ok", "подтверждено пилотом"] };
const CONF = { high: "высокая", medium: "средняя", low: "низкая" };
const STEP = { proposed: "Предложен", in_progress: "В работе", done: "Сделан", dropped: "Отменён" };
const DECISION = { planned: ["na", "Запланировано"], in_progress: ["warn", "В работе"], done: ["ok", "Сделано"] };
const HORIZON = { quick: "2–4 недели", mid: "1–3 месяца", strategic: "3–12 месяцев" };
const SOURCES = { hh: "hh.ru", dreamjob: "Dreamjob", vk: "VK", dzen: "Дзен", media: "Медиа", telegram: "Telegram", career_site: "Карьерный сайт", ai: "Нейросети", other: "Другое" };
const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const mon = (m) => MONTHS[+m.slice(5) - 1];
const sign = (v) => (v > 0 ? "+" + v : v < 0 ? "−" + Math.abs(v) : "0");
const avg = (a) => Math.round(a.reduce((s, x) => s + x, 0) / a.length);
const badge = (lvl, text) => `<span class="badge badge--${lvl}">${text}</span>`;
const status = (lvl, word) => `<span class="cmp__status">${tpl("st-" + lvl)}${word}</span>`;
const delta = (v) => `<span class="delta delta--${v > 0 ? "up" : v < 0 ? "down" : "zero"}">${sign(v)}</span>`;
const range = (a, b) => { const f = (d, o) => new Date(d).toLocaleDateString("ru-RU", o); return a.slice(0, 7) === b.slice(0, 7) ? `${f(a, { day: "numeric" })}–${f(b, { day: "numeric", month: "long" })}` : `${f(a, { day: "numeric", month: "long" })} – ${f(b, { day: "numeric", month: "long" })}`; };
const unitName = (id) => INT.units.find((u) => u.id === id)?.name ?? "Вся компания";

/* Иконки интерфейса (lucide, ISC) */
const ICONS = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  pulse: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  compare: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  list: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  settings: '<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  external: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
};
const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;
const metricIco = (id) => tpl("ico-" + ({ compass: "compass", home: "house", sprout: "sprout", shield: "shield", handshake: "handshake", megaphone: "megaphone", battery: "battery-medium", target: "target", scale: "scale", award: "award" })[METRIC_DEFS[id].icon]);

/* ── Права: раздел × роль × услуга (cabinet.md, раздел 4) ── */
const NAV = [
  { id: "overview", label: "Обзор", icon: "home" },
  { id: "brief", label: "Сводка для руководства", icon: "chart" },
  { group: "Направления" },
  { id: "internal", label: "Изнутри", icon: "pulse", health: true },
  { id: "external", label: "Снаружи", icon: "eye" },
  { id: "bridge", label: "Снаружи и изнутри", icon: "compare" },
  { group: "Работа" },
  { id: "decisions", label: "Решения", icon: "message", health: true },
  { id: "data", label: "Сбор данных", icon: "upload", health: true },
  { id: "plan", label: "План и встречи", icon: "list" },
  { id: "questions", label: "Вопросы эксперту", icon: "help" },
  { group: "Компания" },
  { id: "reports", label: "Отчёты и документы", icon: "file" },
  { id: "team", label: "Команда", icon: "users" },
  { id: "settings", label: "Настройки", icon: "settings" },
];
const ACCESS = {
  overview: ["owner", "hrbp", "manager", "executive", "viewer"],
  internal: ["owner", "hrbp", "manager", "executive"],
  metric: ["owner", "hrbp", "manager", "executive"],
  external: ["owner", "hrbp", "executive", "viewer"],
  bridge: ["owner", "hrbp", "executive"],
  decisions: ["owner", "hrbp", "manager", "executive", "viewer"],
  data: ["owner", "hrbp", "manager"],
  plan: ["owner", "hrbp", "manager", "executive", "viewer"],
  reports: ["owner", "hrbp", "manager", "executive", "viewer"],
  team: ["owner", "hrbp"],
  settings: ["owner"],
  questions: ["owner", "hrbp", "manager", "executive"],
  glossary: ["owner", "hrbp", "manager", "executive", "viewer"],
  brief: ["owner", "hrbp", "executive"],
};
const can = (section) => ACCESS[section]?.includes(state.role);
/** Раздел закрыт услугой: показываем, что в нём будет */
const LOCKED = { decisions: { service: "campaign", text: "Решения по обратной связи и открытая страница для сотрудников входят в кампанию на 3 месяца. Сотрудники видят, что их услышали и что изменилось." } };
const locked = (section) => LOCKED[section] && LOCKED[section].service !== state.service;
/** До первого отчёта разделы с цифрами изнутри пусты: показываем, когда появятся данные (ADR-0011) */
const NEEDS_REPORT = ["internal", "metric", "bridge", "plan", "brief"];
const waitingData = (section) => state.phase !== "ready" && NEEDS_REPORT.includes(section);
const edits = () => ["owner", "hrbp"].includes(state.role);
const seesSignals = () => ["owner", "hrbp"].includes(state.role);
/** Подразделения, которые видит роль: руководитель — свою ветку, остальные — компанию и первый уровень */
function visibleUnits() {
  if (state.role === "manager") return INT.units.filter((u) => u.id === ROLES.manager.unit);
  return INT.units;
}
const waves = () => (state.service === "campaign" ? INT.waves : INT.waves.slice(0, 1));

/* ── Срезы: подразделение × волна. Правило 5 человек — по ответившим (respondents) ── */
const LAST_WAVE = INT.waves[INT.waves.length - 1].id;
/** Волна на экране: в кампании выбирается, в диагностике — единственный замер */
function currentWave() {
  const w = waves();
  if (!w.some((x) => x.id === state.wave)) state.wave = w[w.length - 1].id;
  return state.wave;
}
const slice = (metric, unit, wave = currentWave(), stage = "all") => INT.slices.find((s) => s.metric === metric && s.unitId === unit && s.stage === stage && s.period === "30d" && (s.waveId ?? LAST_WAVE) === wave);
/** Этапы жизненного цикла считаются по всей компании: в подразделениях группы по этапам слишком малы (ADR-0012) */
const currentStage = (unit) => (unit === "company" && ["owner", "hrbp", "executive"].includes(state.role) ? state.stage : "all");
/** Изменение метрики за период: 30 дней — из отчёта, 90 дней и 12 месяцев — по ряду метрики */
function periodDelta(m) {
  const pts = m.series.points.map((p) => p.value), now = pts[pts.length - 1];
  return state.period === "90" ? now - pts[pts.length - 4] : state.period === "365" ? now - pts[0] : m.delta30;
}
const waveName = (id) => INT.waves.find((w) => w.id === id).label;
/** Уверенность по доле ответивших — как responseConfidence() в src/lib/report/methodology.ts */
const responseConf = (r, n) => (r / n >= 0.5 ? "high" : r / n >= 0.3 ? "medium" : "low");
function unitMetrics(unit, wave = currentWave(), stage = "all") {
  return INT.metrics.map((m) => {
    const sl = slice(m.id, unit, wave, stage);
    return { ...m, hidden: sl ? sl.score === null : false, score: sl ? sl.score : m.waves.find((x) => x.waveId === wave)?.score ?? m.score };
  });
}
const unitIndex = (unit, wave, stage = "all") => avg(unitMetrics(unit, wave, stage).map((m) => m.score ?? 0));
/** Подразделение шага или решения видно роли: руководителю — своя ветка и общие, остальным — всё */
const ownUnit = (unitId) => state.role !== "manager" || unitId === ROLES.manager.unit;
function unitNorms(unit, stage = "all") {
  const ms = Object.fromEntries(unitMetrics(unit, currentWave(), stage).map((m) => [m.id, m.score]));
  return INT.code.map((n) => { const s = avg(n.metrics.map((id) => ms[id])); return { ...n, score: s, level: LEVEL(s) }; });
}
function currentUnit() {
  const units = visibleUnits();
  if (!units.some((u) => u.id === state.unit)) state.unit = units[0].id;
  return state.unit;
}

/* ── Графики ── */
let charts = [];
const jobs = [];
const chart = (id, option) => jobs.push([id, option]);
function mountCharts() {
  charts.forEach((c) => c.dispose()); charts = [];
  jobs.splice(0).forEach(([id, option]) => {
    const el = document.getElementById(id); if (!el) return;
    const c = echarts.init(el, null, { renderer: "svg" });
    c.setOption({ animationDuration: 400, textStyle: { fontFamily: CH.font, color: CH.ink3, fontSize: 12 }, tooltip: { ...chTooltip, trigger: "axis" }, ...option });
    charts.push(c);
  });
}
addEventListener("resize", () => charts.forEach((c) => c.resize()));
function lineOption(points, color, { events = [], areas = [], min = 30, max = 90, name = "Индекс" } = {}) {
  const axis = { ...chAxis, axisLabel: { ...chAxis.axisLabel, fontSize: 12 } };
  return {
    grid: { left: 36, right: 16, top: events.length ? 40 : 16, bottom: 28 },
    xAxis: { type: "category", data: points.map((p) => mon(p.month)), boundaryGap: false, ...axis, splitLine: { show: false } },
    yAxis: { type: "value", min, max, interval: 10, ...axis },
    series: [{
      name, type: "line", data: points.map((p) => p.value), smooth: 0.3, symbol: "circle", symbolSize: 7, showSymbol: false,
      lineStyle: { color, width: 2 }, itemStyle: { color, borderColor: "#fff", borderWidth: 2 },
      markLine: events.length ? { ...eventMarks(events.map((e) => ({ x: mon(e.month), text: e.label }))), data: events.map((e) => ({ name: e.label, xAxis: mon(e.month), label: e.month === points[points.length - 1].month ? { align: "right" } : undefined })), label: { show: true, position: "end", distance: 6, color: CH.ink2, fontFamily: CH.font, fontSize: 12, formatter: (p) => p.name } } : undefined,
      markArea: areas.length ? { silent: true, itemStyle: { color: "rgba(219,79,79,.07)" }, data: areas.map((a) => [{ xAxis: mon(a.from) }, { xAxis: mon(a.to) }]) } : undefined,
    }],
  };
}
function sparkline(values) {
  const w = 96, h = 28, min = Math.min(...values) - 2, max = Math.max(...values) + 2;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min)) * h]);
  const [lx, ly] = pts[pts.length - 1];
  return `<svg class="spark spark--${LEVEL(values[values.length - 1])}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${pts.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1)).join(" ")}"/><circle cx="${lx}" cy="${ly}" r="3"/></svg>`;
}

/* ── Подсказки к терминам: тексты из src/content/glossary.ts (GLOSSARY) ── */
const info = (key) => `<button class="info" type="button" data-tip="${esc(GLOSSARY[key].text)}" aria-label="${GLOSSARY[key].title}: пояснение" aria-expanded="false">${ico("info")}</button>`;

/* ── Общие блоки ── */
const pageHead = (title, lead = "", actions = "") => `<header class="top"><div><h1 class="top__title">${title}</h1>${lead ? `<p class="top__lead">${lead}</p>` : ""}</div>${actions ? `<div class="top__actions">${actions}</div>` : ""}</header>`;
const panel = (title, body, hint = "", cls = "") => `<section class="panel ${cls}"><div class="panel__head"><h2 class="panel__title">${title}</h2>${hint ? `<p class="panel__hint">${hint}</p>` : ""}</div>${body}</section>`;
const kpi = (label, num, cap, cls = "") => `<div class="kpi ${cls}"><span class="kpi__label">${label}</span><span class="kpi__num">${num}</span><span class="kpi__cap">${cap}</span></div>`;
const note = (text, teal = false) => `<p class="note ${teal ? "note--teal" : ""}">${ico(teal ? "shield" : "info")}<span>${text}</span></p>`;
function lockedView(title, text, icon = "lock", action = `<a class="btn btn--primary btn--sm" href="#plan">Обсудить с экспертом</a>`) {
  return `<div class="locked"><span class="locked__ico">${ico(icon)}</span><h2>${title}</h2><p>${text}</p>${action}</div>`;
}
const noAccess = (label) => pageHead(label) + lockedView("Нет доступа к разделу", `У роли «${ROLES[state.role].name}» нет доступа к этому разделу. Права выдаёт владелец кабинета в разделе «Команда».`, "lock", `<a class="btn btn--ghost btn--sm" href="#overview">На обзор</a>`);

/* ── Разделы ── */
const PAGES = {};


const stagesList = (stages) => `<ol class="stages">${stages.map((s) => `<li class="is-${s.s}"><span class="stages__dot">${s.s === "done" ? ico("check") : ""}</span><b>${s.t}</b><span class="stages__date">${s.d}</span></li>`).join("")}</ol>`;

/* Запуск: чек-лист до первого опроса. Ведёт HR-директор, HRBP видит; остальным — только этапы */
function launchPanel() {
  const done = live.launch.filter((l) => l.done).length, all = live.launch.length;
  const items = live.launch.map((l) => `<li class="${l.done ? "is-done" : ""}"><span class="launch__mark">${l.done ? ico("check") : ""}</span><div class="rows__main"><b>${l.t}</b><span class="rows__sub">${l.hint}</span></div><div class="launch__act">${l.done ? `<span class="rows__meta">${l.auto ? "отмечено системой" : "готово"}</span>` : `<a class="btn btn--ghost btn--sm" href="${l.href}">Открыть</a>${!l.auto && state.role === "owner" ? `<button class="btn btn--primary btn--sm" data-launch="${l.id}">Готово</button>` : ""}`}</div></li>`).join("");
  return panel(`Подготовка к запуску · ${done} из ${all}`, `<div class="bar bar--teal" style="margin-bottom:16px"><i style="width:${(done / all) * 100}%"></i></div><ul class="launch">${items}</ul>`, "Опрос начнётся, когда всё готово. Большую часть шагов система отмечает сама по данным кабинета.");
}
function overviewSetup(stages) {
  const out = [];
  if (["owner", "hrbp"].includes(state.role)) out.push(launchPanel());
  out.push(`<div class="grid2">${panel("Ход работы", stagesList(stages), "Этапы отмечаются сами по действиям эксперта и системы")}${panel("Что дальше", `<ul class="rows"><li><div class="rows__main"><b>Эксперт проверяет подразделения</b><span class="rows__sub">После загрузки таблицы, обычно за 1 рабочий день. Подскажет, какие группы меньше 5 человек и с кем их объединить.</span></div></li><li><div class="rows__main"><b>Ссылки на опрос</b><span class="rows__sub">Появятся в «Сборе данных» после проверки. Рассылаете вы, по одной ссылке на подразделение.</span></div></li><li><div class="rows__main"><b>Цифры изнутри</b><span class="rows__sub">После опроса и проверки экспертом, примерно через 10 дней после закрытия опроса.</span></div></li></ul>`)}</div>`);
  out.push(note("Пока идёт подготовка, разделы с цифрами изнутри пустые. Внешний срез, если он был, уже доступен в разделе «Снаружи»."));
  return out;
}
/* Ход опроса: сколько ответили по подразделениям. Меньше 5 — без точного числа */
function waveProgress() {
  const units = LIVE_WAVE.units.filter((u) => state.role !== "manager" || u.id === ROLES.manager.unit);
  const total = units.reduce((s, u) => s + u.resp, 0), size = units.reduce((s, u) => s + u.size, 0);
  const rows = units.map((u) => {
    const rate = u.resp / u.size, small = u.resp < 5;
    const st = small ? badge("bad", "срез будет скрыт") : rate < 0.3 ? badge("warn", "низкая уверенность") : badge("ok", "достаточно");
    return `<li><div class="rows__main"><b>${u.name}</b><div class="barline" style="grid-template-columns:minmax(0,1fr) 120px"><div class="bar bar--teal"><i style="width:${small ? 1 : Math.round(rate * 100)}%"></i></div><span class="num">${small ? "меньше 5" : `${u.resp} из ${u.size}`}</span></div></div>${st}</li>`;
  }).join("");
  chart("ch-wave", { ...lineOption(LIVE_WAVE.daily.map((v, i) => ({ month: "2026-11", value: v, day: i + 3 })), CH.teal, { min: 0, max: Math.ceil(size / 100) * 100, name: "Ответили" }), xAxis: { type: "category", data: LIVE_WAVE.daily.map((_, i) => `${i + 3} ноя`), boundaryGap: false, ...chAxis, axisLabel: { ...chAxis.axisLabel, fontSize: 12 } }, yAxis: { type: "value", ...chAxis, axisLabel: { ...chAxis.axisLabel, fontSize: 12 } } });
  const actions = ["owner", "hrbp"].includes(state.role) ? `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px"><button class="btn btn--ghost btn--sm" data-act="reminder">${ico("message")}Текст напоминания</button><a class="btn btn--ghost btn--sm" href="#survey">${ico("eye")}Опрос глазами сотрудника</a></div>${state.reminder ? `<div class="reminder"><p>${REMINDER}<span class="mono">mirror-com.ru/s/7f3k-sales</span></p><button class="btn btn--ghost btn--sm" data-copytext="${esc(REMINDER)}https://mirror-com.ru/s/7f3k-sales">${ico("link")}Копировать текст</button><p class="rows__sub">Рассылаете вы, по каналам компании. Mirror не знает адресов сотрудников.</p></div>` : ""}` : "";
  return panel(`${LIVE_WAVE.label} идёт · ${LIVE_WAVE.dates}` + info("respondents"), `<div class="kpis kpis--3">${kpi("Ответили", `${Math.round((total / size) * 100)}<small> %</small>`, `${total} из ${size}`, "kpi--teal")}${kpi("До конца опроса", `${LIVE_WAVE.daysLeft}<small> ${LIVE_WAVE.daysLeft === 1 ? "день" : LIVE_WAVE.daysLeft < 5 ? "дня" : "дней"}</small>`, LIVE_WAVE.dates)}${kpi("Срез будет скрыт", `${units.filter((u) => u.resp < 5).length}<small> из ${units.length}</small>`, "подразделений, где ответили меньше 5")}</div><ul class="rows progress" style="margin-top:16px">${rows}</ul>${state.role === "manager" ? "" : `<div class="chart chart--sm" id="ch-wave" role="img" aria-label="Ответили по дням"></div>`}${actions}`, "Видно только, сколько ответили. Ответы отдельных людей не видит никто из компании.");
}
function overviewSurvey(stages) {
  return [waveProgress(), `<div class="grid2">${panel("Ход работы", stagesList(stages), "Этапы отмечаются сами по действиям эксперта и системы")}${panel("Что дальше", `<ul class="rows"><li><div class="rows__main"><b>Опрос закроется 14 ноября</b><span class="rows__sub">Если в подразделении меньше 5 ответов, его данные объединятся с уровнем выше. Напоминание обычно добавляет треть ответов.</span></div></li><li><div class="rows__main"><b>Анализ и проверка экспертом</b><span class="rows__sub">Около 10 дней. Эксперт проверяет цитаты на узнаваемые детали.</span></div></li><li><div class="rows__main"><b>Отчёт и встреча</b><span class="rows__sub">Цифры появятся в разделе «Изнутри», план на 90 дней — в «Плане и встречах».</span></div></li></ul>`)}</div>`];
}

PAGES.overview = () => {
  const r = ROLES[state.role];
  const unit = state.role === "manager" ? r.unit : "company";
  const stages = STAGES[state.mode] ?? STAGES[state.service];
  const parts = [pageHead(`Добрый день, ${r.person.split(" ")[0]}`, `${REPORT.company.name} · ${SERVICES[state.service].name}. ${SERVICES[state.service].note}.`)];
  if (state.phase === "setup") return parts.concat(overviewSetup(stages)).join("");
  if (state.phase === "survey") return parts.concat(overviewSurvey(stages)).join("");
  const kpis = [];
  if (can("internal")) {
    const idx = unitIndex(unit), norms = unitNorms(unit);
    kpis.push(kpi((state.role === "manager" ? `Индекс · ${unitName(unit)}` : "Индекс изнутри") + info("internalIndex"), `${idx}<small> /100</small>`, `${badge(LEVEL(idx), LEVEL_WORD[LEVEL(idx)])} за 30 дней ${delta(INT.index.delta30)}${state.role === "manager" ? ` · по компании ${unitIndex("company")}` : ""}`, "kpi--teal"));
    kpis.push(kpi("Разрыв с культурным кодом" + info("codeGap"), `${norms.filter((n) => n.level === "bad").length}<small> из ${norms.length}</small>`, (() => { const k = norms.filter((n) => n.level === "warn").length; return k === 1 ? "Ещё 1 норма расходится частично" : k ? `Ещё ${k} нормы расходятся частично` : "Частичных разрывов нет"; })(), "kpi--teal"));
  }
  if (can("external")) {
    kpis.push(kpi("Индекс культуры снаружи" + info("externalIndex"), `${EXT.index.value}<small> /100</small>`, `${delta(EXT.index.delta.value)} за квартал · подтверждено ${EXT.promises.filter((p) => p.status === "confirmed").length} из ${EXT.promises.length}`));
    kpis.push(kpi("Место в отрасли" + info("industry"), `${EXT.industry.percentile}<small> %</small>`, `условия лучше, чем у ${EXT.industry.percentile}% · ${EXT.industry.peerGroup}`));
  }
  if (state.role === "manager") kpis.push(kpi("Ответили в вашей группе" + info("respondents"), `${Math.round((SURVEY_LINKS[0].answered / SURVEY_LINKS[0].size) * 100)}<small> %</small>`, `${SURVEY_LINKS[0].answered} из ${SURVEY_LINKS[0].size} · последняя волна`, "kpi--teal"));
  if (kpis.length) parts.push(`<div class="kpis">${kpis.slice(0, 4).join("")}</div>`);
  const feed = FEED.filter((f) => f.roles.includes(state.role));
  if (feed.length) parts.push(panel(`Что нового с ${LAST_VISIT}`, `<ul class="rows">${feed.map((f) => `<li><a class="rows__main feed__link" href="${f.href}"><b>${f.text}</b></a><span class="rows__meta">${f.date}</span></li>`).join("")}</ul>`, "С вашего прошлого входа"));

  const stagesHtml = `<ol class="stages">${stages.map((s) => `<li class="is-${s.s}"><span class="stages__dot">${s.s === "done" ? ico("check") : ""}</span><b>${s.t}</b><span class="stages__date">${s.d}</span></li>`).join("")}</ol>`;
  const monitoring = can("external") ? `<p class="panel__hint" style="margin-top:20px">Мониторинг HR-бренда: ${STAGES.monitoring.map((s) => `${s.t.toLowerCase()} ${s.d}`).join(", ")}.</p>` : "";
  const visible = new Set(visibleUnits().map((u) => u.id));
  const alerts = INT.alerts.filter((a) => (state.role === "manager" ? a.unitId === ROLES.manager.unit : a.unitId === null || visible.has(a.unitId)));
  const alertsHtml = can("internal") ? `<ul class="alerts" style="display:flex;flex-direction:column;gap:12px">${alerts.map((a) => `<li><span class="alerts__text">${METRIC_DEFS[a.metric].name} ${sign(a.change)} за ${a.days === 14 ? "2 недели" : a.days + " дней"}</span><span class="alerts__ctx">${a.unitId ? unitName(a.unitId) : "Вся компания"} · ${a.context}</span>${edits() ? `<span><button class="btn btn--ghost btn--sm" data-decide="alert:${INT.alerts.indexOf(a)}">Завести решение</button></span>` : ""}</li>`).join("") || `<li class="alerts__none">Резких изменений нет</li>`}${can("external") ? EXT.signals.map((s) => `<li style="box-shadow:inset 3px 0 0 var(--c-violet)"><span class="alerts__text">Снаружи: тема «${s.topic}» +${s.growth} п. п.</span><span class="alerts__ctx">${s.note}</span></li>`).join("") : ""}</ul>` : "";
  parts.push(`<div class="grid2">${panel("Ход работы", stagesHtml + monitoring, "Этапы отмечаются сами по действиям эксперта и системы")}${can("internal") ? panel("Требует внимания", alertsHtml, "Резкие изменения за последние недели") : panel("Последний отчёт", `<p>${REPORT.summary[0].text}</p>`, "")}</div>`);

  if (state.role !== "manager") {
    const tags = { works: "Работает", risk: "Риск", start: "С чего начать" };
    parts.push(panel("Главное из последнего отчёта", `<div class="summary">${REPORT.summary.map((f) => `<div><span class="summary__tag">${tags[f.kind]}</span><p>${f.text}</p></div>`).join("")}</div>`));
  }
  const meetings = live.meetings.filter((m) => m.campaign === (state.service === "campaign"));
  const steps = live.plan.filter((p) => p.status !== "done" && (state.role === "manager" ? p.unitId === ROLES.manager.unit : true)).slice(0, 2);
  parts.push(panel("Ближайшее", `<ul class="rows">${meetings.map((m) => `<li><div class="rows__main"><b>${m.title}</b><span class="rows__sub">${m.who}</span></div><span class="rows__meta">${m.date}</span></li>`).join("")}${steps.map((p) => `<li><div class="rows__main"><b>${p.title}</b><span class="rows__sub">Шаг плана · ${p.ownerRole}</span></div><span class="rows__meta">срок ${p.due}</span></li>`).join("")}</ul>`));
  return parts.join("");
};

PAGES.internal = () => {
  const unit = currentUnit(), units = visibleUnits(), stage = currentStage(unit), manager = state.role === "manager";
  const wave = currentWave(), metrics = unitMetrics(unit, wave, stage), norms = unitNorms(unit, stage);
  const idxSlice = slice("index", unit, wave, stage), hidden = idxSlice?.score === null;
  const idx = hidden ? null : unitIndex(unit, wave, stage), off = unitIndex(unit, LAST_WAVE) - INT.index.value;
  const size = stage === "all" ? INT.units.find((u) => u.id === unit).size : idxSlice?.groupSize ?? 0, resp = idxSlice?.respondents ?? size;
  const ref = manager ? unitMetrics("company", wave) : null, refIdx = manager ? unitIndex("company", wave) : null;
  const w = waves(), last = w[w.length - 1], dIdx = avg(metrics.map(periodDelta));
  const parts = [`<div class="is-health">`, pageHead("Изнутри: здоровье культуры", `${state.service === "campaign" ? "Кампания, три замера" : "Диагностика, один замер"}. Последний: ${last.label.toLowerCase()}, данные опубликованы с задержкой ${INT.delayDays} дней.`)];
  const stageOk = unit === "company" && !manager && state.role !== "viewer";
  const sel = (id, label, opts, val, extra = "") => `<label class="field"><span class="sr-only">${label}</span><select class="select" id="${id}" ${extra}>${opts.map(([v, t]) => `<option value="${v}" ${v === val ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
  const filters = [
    sel("f-unit", "Подразделение", units.map((u) => [u.id, u.name]), unit),
    manager ? "" : sel("f-stage", "Этап жизненного цикла", Object.entries(STAGE_NAMES), stageOk ? state.stage : "all", stageOk ? "" : 'disabled title="Этапы считаются по всей компании"'),
    sel("f-period", "Период изменения", Object.entries(PERIODS), state.period),
    w.length > 1 ? sel("f-wave", "Волна", w.map((x) => [x.id, x.label]), wave) : "",
  ].filter(Boolean);
  parts.push(`<div class="filters filters--many" style="--n:${filters.length}"><div><p class="filters__title">Срез</p><p class="filters__cap">${manager ? "Ваша ветка подразделений. Для ориентира рядом показано среднее по компании." : "Этапы жизненного цикла — по всей компании: в подразделениях такие группы слишком малы. Группы меньше 5 ответивших скрыты."}</p></div>${filters.join("")}</div>`);
  if (hidden) {
    parts.push(lockedView(`Срез «${STAGE_NAMES[stage]}» скрыт`, `Ответили ${idxSlice.respondents < 5 ? "меньше 5 человек" : `${idxSlice.respondents} человек, но разность с другими этапами открыла бы группу меньше 5`}. Данные этого этапа объединены с уровнем выше, чтобы никого нельзя было узнать.`, "shield", `<button class="btn btn--ghost btn--sm" data-act="stage-all">Все этапы</button>`));
    parts.push(`</div>`);
    return parts.join("");
  }
  const refCap = (v) => (manager ? ` · по компании ${v}` : "");
  parts.push(`<div class="kpis">${kpi("Индекс культуры изнутри" + info("internalIndex"), `${idx}<small> /100</small>`, `${badge(LEVEL(idx), LEVEL_WORD[LEVEL(idx)])} среднее по 10 метрикам${refCap(refIdx)}`)}${kpi("Разрыв с кодом" + info("codeGap"), `${norms.filter((n) => n.level === "bad").length}<small> из ${norms.length}</small>`, "норм расходятся с опытом людей")}${kpi(`Изменение за ${PERIODS[state.period]}`, `${sign(dIdx)}`, "баллов индекса, среднее по метрикам")}${kpi("Ответили в срезе" + info("respondents"), `${resp}<small> из ${size}</small>`, `уверенность данных ${CONF[responseConf(resp, size || resp)]} · ${STAGE_NAMES[stage].toLowerCase()}`)}</div>`);
  chart("ch-index", lineOption(INT.index.series.points.map((p) => ({ ...p, value: p.value + off })), CH.teal, { events: INT.index.series.events }));
  parts.push(panel("Динамика индекса", `<div class="chart" id="ch-index" role="img" aria-label="Индекс по месяцам"></div><ul class="legend"><li><i class="legend__line"></i>Индекс · ${unitName(unit)}</li><li><i class="legend__line legend__line--dash"></i>Событие</li></ul>`, "За 12 месяцев. Пунктиром отмечены события, которые могли повлиять на индекс."));
  const groups = Object.entries(METRIC_GROUPS).map(([g, name]) => `<div class="mgroup"><p class="mgroup__name">${name}</p>${metrics.filter((m) => METRIC_DEFS[m.id].group === g).map((m) => {
    const l = LEVEL(m.score), d = periodDelta(m), r = ref?.find((x) => x.id === m.id);
    return `<a class="mtile" href="#metric-${m.id}"><span class="mtile__head"><span class="mtile__ico">${metricIco(m.id)}</span><span class="mtile__name">${METRIC_DEFS[m.id].name}</span></span><span class="mtile__body"><span class="mtile__num">${m.score}</span>${sparkline(m.series.points.map((p) => p.value + (m.score - INT.metrics.find((x) => x.id === m.id).score)))}</span><span class="mtile__foot">${badge(l, `${LEVEL_WORD[l]} · ${sign(d)}`)}${r ? `<span class="mtile__ref">компания ${r.score}</span>` : ""}</span></a>`;
  }).join("")}</div>`).join("");
  parts.push(panel("10 метрик" + info("zones"), `<div class="mgroups">${groups}</div>`, `В норме от 65, внимание от 50 до 64, риск ниже 50. Изменение — за ${PERIODS[state.period]}. Откройте метрику, чтобы увидеть срезы, причины и источники.`, "panel--well"));
  if (w.length > 1 && stage === "all") {
    const ws = w.map((x) => unitMetrics(unit, x.id));
    const rows = INT.metrics.map((m, i) => { const first = ws[0][i].score, lastS = ws[ws.length - 1][i].score; return `<tr><th>${METRIC_DEFS[m.id].name}</th>${ws.map((x) => `<td class="num">${x[i].score}</td>`).join("")}<td>${delta(lastS - first)}</td><td>${status(LEVEL(lastS), LEVEL_WORD[LEVEL(lastS)])}</td></tr>`; }).join("");
    const idxs = w.map((x) => unitIndex(unit, x.id));
    parts.push(panel("Волны кампании" + info("wave"), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Метрика</th>${w.map((x) => `<th class="num">${x.label}</th>`).join("")}<th>Изменение</th><th>Сейчас</th></tr></thead><tbody>${rows}<tr><th>Индекс</th>${idxs.map((v) => `<td class="num"><b>${v}</b></td>`).join("")}<td>${delta(idxs[idxs.length - 1] - idxs[0])}</td><td>${status(LEVEL(idxs[idxs.length - 1]), LEVEL_WORD[LEVEL(idxs[idxs.length - 1])])}</td></tr></tbody></table></div>`, `${unitName(unit)}. Главный результат кампании: что изменилось от первого замера к последнему.`));
  }
  // Где просаживается: подразделения или этапы; руководителю — его ветка и ориентир по компании
  const byStages = stage !== "all" || (state.map === "stages" && stageOk);
  const cols = byStages ? Object.keys(STAGE_NAMES).map((id) => ({ id, name: STAGE_NAMES[id], stage: id === "all" ? "all" : id, unit: "company" })) : (manager ? [{ id: "company", name: "Вся компания · ориентир" }, ...units] : units).map((u) => ({ id: u.id, name: u.name, stage: "all", unit: u.id }));
  const heat = `<div class="tbl-wrap"><table class="tbl heat"><thead><tr><th>Метрика</th>${cols.map((c) => `<th>${c.name}</th>`).join("")}</tr></thead><tbody>${INT.metrics.map((m) => `<tr><th>${METRIC_DEFS[m.id].name}</th>${cols.map((c) => { const s = slice(m.id, c.unit, wave, c.stage)?.score; return `<td><span class="heat__cell heat__cell--${s == null ? "na" : LEVEL(s)}">${s ?? "<5"}</span></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
  const toggle = stageOk ? `<div class="seg seg--sm" role="tablist"><button class="seg__item ${byStages ? "" : "is-active"}" data-map="units" role="tab" aria-selected="${!byStages}">Подразделения</button><button class="seg__item ${byStages ? "is-active" : ""}" data-map="stages" role="tab" aria-selected="${byStages}">Этапы</button></div>` : "";
  parts.push(`<section class="panel"><div class="panel__head panel__head--row"><div><h2 class="panel__title">Где просаживается${info("hidden")}</h2><p class="panel__hint">${manager ? "Ваша ветка и среднее по компании для ориентира. Подгруппы появятся отдельно, когда в каждой ответят от 5 человек." : `Балл метрик по ${byStages ? "этапам жизненного цикла" : "подразделениям"}, ${waveName(wave).toLowerCase()}. «<5» — срез скрыт: ответили меньше 5 или его можно вычислить разностью.`}</p></div>${toggle}</div>${heat}</section>`);
  parts.push(panel("Культурный код" + info("codeGap"), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Норма из кода</th><th>Связанные метрики</th><th class="num">Балл</th><th>Разрыв</th></tr></thead><tbody>${norms.map((n) => `<tr><th>«${n.title}»</th><td>${n.metrics.map((id) => METRIC_DEFS[id].name).join(", ")}</td><td class="num">${n.score}</td><td>${status(n.level, GAP_WORD[n.level])}</td></tr>`).join("")}</tbody></table></div>`, "Балл нормы — среднее по её метрикам. Ниже 50 — разрыв, от 50 до 64 — частичный."));
  if (seesSignals()) {
    parts.push(`<div class="grid2">${panel("Расхождения", `<ul class="rows">${INT.discrepancies.map((d) => `<li><div class="rows__main"><b>${d.text}</b><span class="rows__sub">${d.hint}</span></div></li>`).join("")}</ul>`, "Где разные каналы говорят разное")}${panel("Лента сигналов", `<ul class="rows">${INT.signals.slice(0, 4).map((s, i) => `<li><div class="rows__main"><b>«${s.text}»</b><span class="rows__sub">${badge(TONE[s.tone][0], TONE[s.tone][1])} ${METRIC_DEFS[s.metric].name} · ${s.source}</span></div>${s.tone === "negative" ? `<button class="btn btn--ghost btn--sm" data-decide="signal:${i}">Завести решение</button>` : ""}</li>`).join("")}</ul>`, "Цитаты обезличены, проверены на узнаваемые детали и не привязаны к подразделениям")}</div>`);
  }
  parts.push(note("Группы меньше 5 ответивших не показываем ни одной роли. Сочетания срезов, из которых можно вычислить такую группу, тоже скрыты. Пример: на этапе «После ухода» ответили 3 человека, поэтому скрыт и самый маленький из остальных этапов, «Возврат после отсутствия».", true));
  parts.push(`</div>`);
  return parts.join("");
};

PAGES.metric = (id) => {
  const def = METRIC_DEFS[id], m = INT.metrics.find((x) => x.id === id);
  if (!def) return noAccess("Метрика");
  const unit = currentUnit(), units = visibleUnits();
  const score = slice(id, unit)?.score ?? m.score, l = LEVEL(score), off = (slice(id, unit, LAST_WAVE)?.score ?? m.score) - m.score;
  chart("ch-metric", lineOption(m.series.points.map((p) => ({ ...p, value: p.value + off })), CH.teal, { name: def.name }));
  const byUnits = units.filter((u) => u.id !== "company").map((u) => { const s = slice(id, u.id)?.score; return `<li class="barline"><div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>${u.name}</span><span class="num">${s ?? "<5"}</span></div><div class="bar bar--${s == null ? "" : LEVEL(s) === "ok" ? "ok" : LEVEL(s) === "bad" ? "bad" : "teal"}"><i style="width:${s ?? 0}%"></i></div></div><span class="num">${s == null ? "" : LEVEL_WORD[LEVEL(s)]}</span></li>`; }).join("");
  const signals = seesSignals() ? INT.signals.filter((s) => s.metric === id) : [];
  return `<div class="is-health"><p class="crumbs-sm"><a href="#internal">Изнутри</a> · ${METRIC_GROUPS[def.group]}</p>${pageHead(def.name, def.detail, can("questions") ? `<button class="btn btn--ghost btn--sm" data-ask="metric:${id}">${ico("help")}Спросить эксперта</button>` : "")}
    <div class="kpis">${kpi(`Балл · ${unitName(unit)}`, `${score}<small> /100</small>`, badge(l, LEVEL_WORD[l]))}${kpi("За 30 дней", sign(m.delta30), "баллов")}${kpi("Уверенность данных" + info("confidence"), `<span style="font-size:24px">${CONF[m.confidence]}</span>`, "по числу ответов и согласию источников")}${waves().length > 1 ? kpi("По волнам", `<span style="font-size:24px">${waves().map((x) => slice(id, unit, x.id)?.score ?? "—").join(" · ")}</span>`, waves().map((x) => x.label.split(" ")[0].toLowerCase()).join(" · ")) : kpi("Зона", `<span style="font-size:24px">${LEVEL_WORD[l]}</span>`, "в норме от 65, риск ниже 50")}</div>
    ${panel("Динамика за 12 месяцев", `<div class="chart" id="ch-metric" role="img" aria-label="${def.name} по месяцам"></div>`)}
    <div class="grid2">${byUnits ? panel("По подразделениям", `<ul class="tree" style="gap:16px;background:none">${byUnits}</ul>`, `Срез за 30 дней, ${waveName(currentWave()).toLowerCase()}`) : ""}
    ${panel("Что влияет" + info("evidence"), `<ul class="rows">${m.drivers.map((d) => `<li><div class="rows__main"><b>${d.text}</b></div>${badge(EVIDENCE[d.evidence][0], EVIDENCE[d.evidence][1])}</li>`).join("")}</ul>`, "У каждой причины указан уровень доказанности")}</div>
    ${panel("Откуда данные", `<ul class="rows"><li><div class="rows__main"><b>Опросы</b><span class="rows__sub">${def.sources.o}</span></div><span class="rows__meta">балл</span></li><li><div class="rows__main"><b>Тексты</b><span class="rows__sub">${def.sources.t}</span></div><span class="rows__meta">балл</span></li><li><div class="rows__main"><b>Поведение и HR-события</b><span class="rows__sub">${def.sources.p}</span></div><span class="rows__meta">подтверждают</span></li></ul>`, "Баллом становятся только опросы и тексты")}
    ${signals.length ? panel("Сигналы по метрике", `<ul class="quotes">${signals.map((s) => `<li><p>«${s.text}»</p><span class="quotes__meta">${badge(TONE[s.tone][0], TONE[s.tone][1])}${s.source}</span>${s.tone === "negative" && edits() ? `<button class="btn btn--ghost btn--sm" style="align-self:flex-start" data-decide="signal:${INT.signals.indexOf(s)}">Завести решение</button>` : ""}</li>`).join("")}</ul>`) : ""}</div>`;
};

PAGES.external = () => {
  const confirmed = EXT.promises.filter((p) => p.status === "confirmed").length;
  chart("ch-ext", lineOption(EXT.index.series.points, CH.violet, { events: EXT.index.series.events, areas: EXT.index.series.areas, min: 40, max: 80 }));
  const promises = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Обещание</th><th class="num">Вес</th><th class="num">Упоминаний</th><th class="num">Подтверждено</th><th>Статус</th></tr></thead><tbody>${EXT.promises.map((p) => `<tr><th>${p.title}</th><td class="num">${Math.round(p.weight * 100)}%</td><td class="num">${p.mentions}</td><td class="num">${p.confirmedShare ?? "—"}%</td><td>${status(PROMISE[p.status][0] === "na" ? "na" : PROMISE[p.status][0], PROMISE[p.status][1])}</td></tr>`).join("")}</tbody></table></div>`;
  const blind = `<ul class="rows">${EXT.blindSpots.map((b) => `<li style="display:block"><div class="barline"><div><div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:6px"><b style="font-weight:500">${b.topic}</b>${badge(TONE[b.tone][0], TONE[b.tone][1])}</div><div class="bar"><i style="width:${b.share * 4}%"></i></div></div><span class="num">${b.share}%</span></div>${b.quote ? `<p class="rows__sub" style="margin-top:8px">«${b.quote.text}» · ${b.quote.source}</p>` : ""}</li>`).join("")}</ul>`;
  const tracks = `<ul class="rows">${EXT.industry.tracks.map((t) => `<li style="display:block"><div class="barline"><div><div style="margin-bottom:6px">${t.topic}</div><div class="bar bar--${t.percentile >= 60 ? "ok" : t.percentile < 45 ? "bad" : ""}"><i style="width:${t.percentile}%"></i></div></div><span class="num">${t.percentile}</span></div></li>`).join("")}</ul>`;
  const comp = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Обещание</th><th>${REPORT.company.name}</th>${EXT.competitors.map((c) => `<th>${c.name}</th>`).join("")}</tr></thead><tbody>${EXT.competitors[0].promises.map((cp) => { const p = EXT.promises.find((x) => x.id === cp.promiseId); return `<tr><th>${p.title}</th><td>${status(PROMISE[p.status][0], PROMISE[p.status][1])}</td>${EXT.competitors.map((c) => { const st = c.promises.find((x) => x.promiseId === cp.promiseId).status; return `<td>${status(PROMISE[st][0], PROMISE[st][1])}</td>`; }).join("")}</tr>`; }).join("")}<tr><th>Индекс культуры</th><td class="num" style="text-align:left">${EXT.index.value}</td>${EXT.competitors.map((c) => `<td>${c.index}</td>`).join("")}</tr></tbody></table></div>`;
  return pageHead("Снаружи: оценка HR-бренда", `Мониторинг, отчёт за октябрь. Источники: ${EXT.coverage.map((c) => `${SOURCES[c.source]} ${c.mentions}`).join(", ")} упоминаний.`, `<a class="btn btn--ghost btn--sm" href="#reports">${ico("download")}PDF отчёта</a>`)
    + `<div class="kpis">${kpi("Индекс культуры" + info("externalIndex"), `${EXT.index.value}<small> /100</small>`, `${delta(EXT.index.delta.value)} за квартал`)}${kpi("Обещаний подтверждено" + info("promiseStatus"), `${confirmed}<small> из ${EXT.promises.length}</small>`, "зарплата и гибкий формат не подтверждаются")}${kpi("Слепые зоны" + info("blindSpots"), `${EXT.blindSpots.length}<small> темы</small>`, `чаще всего «${EXT.blindSpots[0].topic}», ${EXT.blindSpots[0].share}%`)}${kpi("Место в отрасли" + info("industry"), `${EXT.industry.percentile}<small> %</small>`, `среди ${EXT.industry.peerCount} компаний: ${EXT.industry.peerGroup}`)}</div>`
    + panel("Динамика индекса", `<div class="chart" id="ch-ext" role="img" aria-label="Индекс культуры по месяцам"></div>`, "Красной областью выделена просадка, пунктиром — события, которые на неё повлияли.")
    + panel("Обещания" + info("promiseStatus"), promises, "Вес — доля обещания в ваших текстах. «Подтверждено» — доля упоминаний, где опыт людей совпадает с обещанием.")
    + `<div class="grid2">${panel("Слепые зоны" + info("blindSpots"), blind, "О чём пишут люди, а в ваших текстах нет ни слова")}${panel("Место в отрасли по темам" + info("industry"), tracks, "Перцентиль: у скольких работодателей отрасли условия хуже")}</div>`
    + panel("Конкуренты", comp, "Те же обещания у конкурентов, по той же методике")
    + note("Отчёт мониторинга выходит раз в месяц. Если тема резко выросла, придёт письмо, а сигнал появится на обзоре.");
};

PAGES.bridge = () => {
  const KIND = { both_sides: ["bad", "Видно с двух сторон"], strength: ["ok", "Сильная сторона"], early_signal: ["warn", "Ранний сигнал"] };
  return pageHead("Снаружи и изнутри" + info("bridge"), "Шкалы направлений не смешиваем и сверяем только темы: что видят кандидаты и что переживают сотрудники.")
    + `<div class="grid2">${REPORT.bridge.map((b) => {
      const ext = b.external.type === "blind_spot" ? [`Слепая зона «${b.external.topic}»`, `${b.external.share}%`, "упоминаний"] : [`Обещание «${EXT.promises.find((p) => p.id === b.external.promiseId).title}»`, `${b.external.confirmedShare}%`, "подтверждений"];
      return panel(badge(KIND[b.kind][0], KIND[b.kind][1]), `<div class="vs"><div class="is-ext"><small>снаружи</small><span>${ext[0]}</span><span class="num">${ext[1]} <small>${ext[2]}</small></span></div><div class="is-int"><small>изнутри</small><span>${METRIC_DEFS[b.internal.metric].name}</span><span class="num">${b.internal.score} <small>${LEVEL_WORD[LEVEL(b.internal.score)]}</small></span></div></div><p style="margin-top:16px">${b.text}</p>`);
    }).join("")}</div>`;
};

/* Петля обратной связи: сигнал → решение с ответственным и сроком → результат → публикация для сотрудников (ADR-0012) */
const SOURCE = { alert: "Резкое изменение", signal: "Сигнал из ленты", meeting: "Встреча", question: "Вопрос эксперту", other: "Другое" };
const loopShare = () => INT.confirming.find((c) => c.kind === "loop_closure");
PAGES.decisions = () => {
  const list = (state.role === "viewer" ? live.decisions.filter((d) => d.public) : live.decisions).filter((d) => d.unitId === null || ownUnit(d.unitId));
  const f = state.prefill ?? {};
  const form = state.adding ? panel("Новое решение", `<form id="dec-form" class="form-row" style="grid-template-columns:1fr 1fr">${f.note ? `<p class="note" style="grid-column:1/-1;margin:0">${ico("info")}<span>${SOURCE[f.source]}: ${esc(f.note)}</span></p>` : ""}<label class="field"><span class="label">Тема сигнала</span><input class="input" name="topic" required value="${esc(f.topic ?? "")}" placeholder="Например, переработки в продажах"></label><label class="field"><span class="label">Подразделение</span><select class="select" name="unit"><option value="">Вся компания</option>${INT.units.filter((u) => u.id !== "company").map((u) => `<option value="${u.id}" ${u.id === f.unit ? "selected" : ""}>${u.name}</option>`).join("")}</select></label><label class="field"><span class="label">Связанная метрика</span><select class="select" name="metric">${INT.metrics.map((m) => `<option value="${m.id}" ${m.id === f.metric ? "selected" : ""}>${METRIC_DEFS[m.id].name}</option>`).join("")}</select></label><label class="field"><span class="label">Ответственный</span><input class="input" name="ownerRole" required placeholder="Роль, например «Руководитель продаж»"></label><label class="field" style="grid-column:1/-1"><span class="label">Что решили</span><input class="input" name="decision" required placeholder="Что меняем"></label><label class="field"><span class="label">Срок</span><input class="input" name="due" required placeholder="Например, до 1 декабря"></label><div style="display:flex;gap:12px;align-items:end"><button class="btn btn--primary btn--sm" type="submit">Сохранить</button><button class="btn btn--ghost btn--sm" type="button" data-act="cancel">Отмена</button></div></form>`, "Решение без ответственного и срока не закрывает петлю: сотрудники не увидят результата.") : "";
  const all = live.decisions, done = all.filter((d) => d.status === "done").length, pub = all.filter((d) => d.public).length, loop = loopShare();
  const kpis = state.role === "viewer" ? "" : `<div class="kpis">${kpi("Закрытые петли", `${loop.value}<small> %</small>`, `сигналов получают ответ · норма ${loop.norm}`)}${kpi("Решений", `${all.length}`, `сделано ${done}, в работе ${all.filter((d) => d.status === "in_progress").length}`)}${kpi("Видят сотрудники", `${pub}<small> из ${all.length}</small>`, "решений на открытой странице")}${kpi("Без срока или ответственного", `${all.filter((d) => !d.ownerRole || !d.due).length}`, "нужно дополнить")}</div>`;
  return pageHead("Решения по обратной связи", "Что услышали, что решили и что изменилось. Опубликованные решения видят сотрудники на открытой странице компании.", (edits() ? `<button class="btn btn--primary btn--sm" data-act="add">${ico("plus")}Новое решение</button>` : "") + `<a class="btn btn--ghost btn--sm" href="#public">${ico("external")}Страница для сотрудников</a>`)
    + kpis + form + `<section class="panel panel--well"><ul class="items">${list.map((d) => `<li class="item"><div class="item__head"><h3 class="item__title">${d.topic}</h3><span class="badges">${badge("soft", d.unitId ? unitName(d.unitId) : "Вся компания")}${badge(DECISION[d.status][0], DECISION[d.status][1])}</span></div><dl class="item__grid"><div><dt>Решение</dt><dd>${d.decision}</dd></div><div><dt>Что изменилось</dt><dd>${d.outcome ?? "Пока рано судить"}</dd></div><div><dt>Метрика</dt><dd>${d.metric ? METRIC_DEFS[d.metric].name : "—"}</dd></div><div><dt>Ответственный</dt><dd>${d.ownerRole ?? "не назначен"}</dd></div><div><dt>Срок</dt><dd>${d.due ?? "не назначен"}</dd></div><div><dt>Откуда</dt><dd>${d.source ? `${SOURCE[d.source.type]}${d.source.note ? ` · ${d.source.note}` : ""}` : "—"}</dd></div></dl><div class="item__foot"><label class="switch"><input type="checkbox" data-pub="${d.id}" ${d.public ? "checked" : ""} ${edits() ? "" : "disabled"}>Показывать сотрудникам</label><span class="rows__meta">${mon(d.month)} 2026</span></div></li>`).join("")}</ul></section>`
    + note("Перед публикацией текст решения проверяется на узнаваемые детали, как цитаты. На открытой странице нет цифр по группам меньше 5 человек.", true);
};

PAGES.data = () => {
  if (state.phase === "survey" && state.role === "manager") return `<div class="is-health">` + pageHead("Сбор данных", "Сколько ответили в вашей группе. Ответы отдельных людей не видит никто из компании.") + waveProgress() + `</div>`;
  if (state.role === "manager") {
    const l = SURVEY_LINKS[0];
    return `<div class="is-health">` + pageHead("Сбор данных", "Доля ответивших в вашей группе. Ответы отдельных людей не видит никто из компании.") + `<div class="kpis">${kpi("Ответили", `${Math.round((l.answered / l.size) * 100)}<small> %</small>`, `${l.answered} из ${l.size} · ${l.unit}`)}</div>` + note("Ссылку на опрос рассылает HR-директор. Если у вас нет ссылки, напишите ему.", true) + `</div>`;
  }
  const w = waves();
  const waveRows = w.map((x) => { const p = Math.round((x.responded / x.invited) * 100); return `<tr><th>${x.label}</th><td>${range(x.from, x.to)}</td><td class="num">${x.responded} из ${x.invited}</td><td style="width:200px"><div class="barline"><div class="bar bar--teal"><i style="width:${p}%"></i></div><span class="num">${p}%</span></div></td></tr>`; }).join("");
  const links = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Подразделение</th><th class="num">Ответили</th><th>Ссылка</th><th></th></tr></thead><tbody>${SURVEY_LINKS.map((l) => `<tr><th>${l.unit}</th><td class="num">${l.answered} из ${l.size}</td><td class="muted mono">mirror-com.ru/${l.token}</td><td><button class="btn btn--ghost btn--sm" data-copy="${l.token}">${ico("link")}Копировать</button></td></tr>`).join("")}</tbody></table></div>`;
  const depth = (n) => (n.parent === null ? 0 : n.parent === "company" ? 1 : 2);
  const tree = `<ul class="tree">${TREE.map((n) => `<li data-depth="${depth(n)}" class="${n.size < 5 ? "is-small" : ""}"><span>${n.name}</span>${n.size < 5 ? badge("warn", "меньше 5: объединяется с уровнем выше") : ""}<span class="tree__size">${n.size}</span></li>`).join("")}</ul>`;
  const setup = state.phase === "setup";
  const linksPanel = setup ? panel("Ссылки на опрос", `<p>Ссылки появятся после проверки подразделений экспертом. Загрузите таблицу подразделений, эксперт проверит её обычно за 1 рабочий день.</p>`, "Одна ссылка на подразделение. Рассылаете вы, так никто не знает, кто как ответил.") : panel("Ссылки на опрос", links, "Одна ссылка на подразделение. Разошлите её сотрудникам подразделения сами: так никто не знает, кто как ответил.");
  const wavesPanel = setup ? "" : state.phase === "survey" ? waveProgress() : panel("Замеры" + info("wave"), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Волна</th><th>Даты</th><th class="num">Ответили</th><th>Доля</th></tr></thead><tbody>${waveRows}</tbody></table></div>`, "Ответы отдельных людей не видит никто из компании. Видна только доля ответивших по группам от 5 человек.");
  return `<div class="is-health">` + pageHead("Сбор данных", setup ? "Подготовка к первому опросу: культурный код, подразделения и ссылки." : "Опрос по ссылке на подразделение, анонимная форма, выгрузки из ваших каналов и документы.")
    + wavesPanel + linksPanel
    + `<div class="grid2">${panel("Подразделения", tree + `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px"><button class="btn btn--ghost btn--sm" data-toast="В прототипе таблица не загружается">${ico("upload")}Загрузить таблицу</button><button class="btn btn--ghost btn--sm" data-toast="Шаблон: подразделение, входит в, численность">${ico("download")}Шаблон</button></div>`, setup ? "Черновик ждёт проверки экспертом. Подразделения меньше 5 человек отмечены сразу." : state.service === "campaign" ? "Дерево заморожено до конца кампании: изменения вступят со следующего замера." : "Дерево проверил эксперт при запуске. Изменения вступят со следующего замера.")}
      ${panel("Анонимная форма", `<p>Сотрудники пишут без входа и без имени. Сообщение обезличивается при приёме и проверяется экспертом, прежде чем попасть в анализ. В подразделения анонимные сообщения не попадают.</p><p class="mono muted" style="margin-top:12px;color:var(--c-ink-4)">mirror-com.ru/f/bank-n-9x2c</p><button class="btn btn--ghost btn--sm" style="margin-top:12px" data-copy="f/bank-n-9x2c">${ico("link")}Копировать ссылку</button>`, state.service === "campaign" ? "Открыта все 3 месяца кампании" : "Входит в кампанию")}</div>`
    + `<div class="grid2">${panel("Выгрузки из ваших каналов", `<ul class="rows">${IMPORTS.map((i) => `<li><div class="rows__main"><b>${i.name}</b><span class="rows__sub">${i.kind} · ${i.rows} записей</span></div>${badge(i.ok ? "ok" : "warn", i.status)}</li>`).join("")}</ul><div class="drop" style="margin-top:16px">${ico("upload")}<b>Перетащите файл выгрузки</b>Опросы, платформа идей, ретроспективы: CSV или XLSX</div>`, "Имена и персональные сведения убираются до записи в базу")}
      ${panel("Документы", `<ul class="rows">${DOCUMENTS.slice(0, 2).map((d) => `<li><div class="rows__main"><b>${d.name}</b><span class="rows__sub">${d.kind}</span></div><span class="rows__meta">${d.date}</span></li>`).join("")}</ul><div class="drop" style="margin-top:16px">${ico("upload")}<b>Загрузить культурный код или документы о ценностях</b>PDF, DOCX</div>`)}</div>`
    + note("Сырые ответы и сообщения хранятся отдельно и удаляются через 90 дней после окончания услуги. В кабинет попадают только агрегаты и проверенные цитаты.", true) + `</div>`;
};

PAGES.plan = () => {
  /* Шаг меняет HR-директор и HRBP; руководитель — шаги своего подразделения. Общие шаги руководитель только видит */
  const editable = (p) => edits() || (state.role === "manager" && p.unitId === ROLES.manager.unit);
  const card = (p) => `<li class="item"><div class="item__head"><h3 class="item__title">${p.title}</h3><span class="badges">${badge("soft", p.unitId ? unitName(p.unitId) : "Вся компания")}${badge(p.status === "done" ? "ok" : p.status === "in_progress" ? "warn" : "na", STEP[p.status])}</span></div><p class="rows__sub">${p.why}</p><dl class="item__grid"><div><dt>Ответственный</dt><dd>${p.ownerRole}</dd></div><div><dt>Срок</dt><dd>${p.due} · ${HORIZON[p.horizon]}</dd></div><div><dt>Показатель</dt><dd>${p.kpi ?? "—"}</dd></div></dl>${editable(p) ? `<div class="item__foot"><span class="rows__sub">Отметка видна эксперту</span><select class="select" data-step="${p.id}" aria-label="Статус шага">${Object.entries(STEP).map(([k, v]) => `<option value="${k}" ${k === p.status ? "selected" : ""}>${v}</option>`).join("")}</select></div>` : ""}</li>`;
  const mine = state.role === "manager" ? live.plan.filter((p) => p.unitId === ROLES.manager.unit) : [];
  const rest = state.role === "manager" ? live.plan.filter((p) => p.unitId === null) : live.plan;
  const steps = (mine.length ? `<h3 class="mgroup__name" style="margin-bottom:8px">Шаги вашего подразделения</h3><ul class="items">${mine.map(card).join("")}</ul><h3 class="mgroup__name" style="margin:20px 0 8px">Общие шаги компании</h3>` : "") + `<ul class="items">${rest.map(card).join("")}</ul>`;
  const hint = state.role === "manager" ? "Шаги своего подразделения отмечаете вы, общие — HR-директор и HRBP." : edits() ? "Отмечайте статус, эксперт видит изменения." : "Статус отмечают HR-директор, HRBP и руководители своих шагов.";
  const meetings = MEETINGS.filter((m) => m.campaign === (state.service === "campaign"));
  return pageHead("План и встречи", state.service === "campaign" ? "План и сопровождение изменений. Встречи с руководителями раз в 2 недели." : "План на 90 дней по итогам диагностики.")
    + `<section class="panel panel--well"><div class="panel__head"><h2 class="panel__title">Шаги</h2><p class="panel__hint">Из отчётов эксперта. ${hint}</p></div>${steps}</section>`
    + `<div class="grid2">${panel("Ближайшие встречи", `<ul class="rows">${meetings.map((m) => `<li><div class="rows__main"><b>${m.title}</b><span class="rows__sub">${m.who}</span></div><span class="rows__meta">${m.date}</span></li>`).join("")}</ul>`)}${panel("Прошедшие встречи", `<ul class="rows">${MEETINGS_PAST.map((m) => `<li><div class="rows__main"><b>${m.title}</b><span class="rows__sub">${m.result}</span></div><span class="rows__meta">${m.date}</span></li>`).join("")}</ul>`)}</div>`;
};

PAGES.reports = () => {
  if (state.role === "manager") {
    return pageHead("Отчёты", "Срезы вашей группы, которые выпустил эксперт.") + panel("Отчёты по вашей группе", `<ul class="rows"><li><div class="rows__main"><b>Продажи · волна 3</b><span class="rows__sub">Только агрегаты по группам от 5 человек</span></div><button class="btn btn--ghost btn--sm" data-toast="В прототипе PDF не формируется">${ico("download")}PDF</button></li></ul>`);
  }
  const list = REPORTS.filter((r) => (state.phase === "ready" || r.kind === "Снаружи") && (state.service === "campaign" || !r.campaign) && (r.kind === "Снаружи" ? can("external") : can("internal") || state.role === "viewer"));
  return pageHead("Отчёты и документы", "Каждая публикация — отдельная версия. Исправление создаёт новую версию, старая остаётся.")
    + panel("Отчёты", `<ul class="rows">${list.map((r) => `<li><div class="rows__main"><b>${r.title}</b><span class="rows__sub">${badge(r.kind === "Снаружи" ? "purple" : "teal", r.kind)} ${r.period} · ${r.status}${r.fixed ? ` · ${r.fixed}` : ""}</span></div>${r.draft ? `<span class="rows__meta">готовится</span>` : `<button class="btn btn--ghost btn--sm" data-toast="В прототипе PDF не формируется">${ico("download")}PDF</button>`}</li>`).join("")}</ul>`)
    + (state.role === "owner" ? panel("Документы", `<ul class="rows">${DOCUMENTS.map((d) => `<li><div class="rows__main"><b>${d.name}</b><span class="rows__sub">${d.kind}</span></div><span class="rows__meta">${d.date}</span></li>`).join("")}</ul>`) : "");
};

PAGES.team = () => {
  const owner = state.role === "owner";
  const rows = live.team.map((t) => `<tr><th>${t.person}<div class="rows__sub" style="font-weight:400">${t.email}</div></th><td>${ROLE_NAMES[t.role]}</td><td>${t.unit ?? "—"}</td><td class="muted">${t.last}</td>${owner ? `<td><button class="btn btn--ghost btn--sm" data-toast="Доступ отозван, сессии завершены">Убрать</button></td>` : ""}</tr>`).join("");
  const form = owner ? panel("Пригласить", `<form id="inv-form" class="form-row"><label class="field"><span class="label">Почта</span><input class="input" type="email" name="email" required placeholder="name@bank-n.ru"></label><label class="field"><span class="label">Роль</span><select class="select" name="role">${Object.entries(ROLE_NAMES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></label><label class="field"><span class="label">Подразделение</span><select class="select" name="unit"><option value="">для руководителя</option>${INT.units.filter((u) => u.id !== "company").map((u) => `<option>${u.name}</option>`).join("")}</select></label><button class="btn btn--primary btn--sm" type="submit">Пригласить</button></form>`, "Человек получит письмо со ссылкой для входа. Руководитель видит только своё подразделение.") : "";
  return pageHead("Команда", "Кто из компании работает в кабинете и что видит.") + form
    + panel("Люди", `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Человек</th><th>Роль</th><th>Подразделение</th><th>Последний вход</th>${owner ? "<th></th>" : ""}</tr></thead><tbody>${rows}</tbody></table></div>`)
    + panel("Журнал действий", `<ul class="rows">${AUDIT.map((a) => `<li><div class="rows__main"><b>${a.who}</b><span class="rows__sub">${a.what}</span></div><span class="rows__meta">${a.when}</span></li>`).join("")}</ul>`, "Входы, просмотры, выгрузки и изменения. Записи нельзя изменить или удалить.");
};

PAGES.settings = () => {
  const N = { report: "Новый отчёт", stage: "Смена этапа работы", alerts: "Резкое изменение метрики и сигналы снаружи", waves: "Начало и конец волны опроса", plan: "Срок шага плана", rhythm: "Напоминание по ритму роли" };
  return pageHead("Настройки", "Компания, источники и уведомления.")
    + `<div class="grid2">${panel("Компания", `<ul class="rows"><li><div class="rows__main"><b>${REPORT.company.name}</b><span class="rows__sub">${REPORT.company.industry} · ${REPORT.company.region} · ${REPORT.company.headcount} сотрудников</span></div></li><li><div class="rows__main"><b>Подразделения</b><span class="rows__sub">${TREE.length - 1} в дереве, ведёте вы</span></div><a class="btn btn--ghost btn--sm" href="#data">Открыть</a></li></ul>`)}
      ${panel("Снаружи: источники и конкуренты", `<ul class="rows"><li><div class="rows__main"><b>Страница работодателя на hh.ru</b><span class="rows__sub mono">hh.ru/employer/0000000</span></div></li><li><div class="rows__main"><b>Конкуренты</b><span class="rows__sub">${EXT.competitors.map((c) => c.name).join(", ")}</span></div><span class="rows__meta">до 5 в мониторинге</span></li></ul>`)}</div>`
    + panel("Уведомления на почту", `<ul class="rows">${Object.entries(N).map(([k, v]) => `<li><span>${v}</span><label class="switch"><input type="checkbox" data-notify="${k}" ${live.notify[k] ? "checked" : ""}><span class="sr-only">${v}</span></label></li>`).join("")}<li><span>Приглашения и вход</span><label class="switch"><input type="checkbox" checked disabled><span class="sr-only">Всегда включено</span></label></li></ul>`, "В письмах нет цифр по группам: они видны после входа");
};

/* Сводка для руководства: одна страница, то же письмом раз в месяц (ADR-0012). Без срезов по подразделениям */
PAGES.brief = () => {
  const w = waves(), first = w[0].id, lastW = w[w.length - 1].id, prev = w.length > 1 ? w[w.length - 2].id : null;
  const now = unitMetrics("company", lastW), idx = unitIndex("company", lastW), idx0 = unitIndex("company", first), norms = unitNorms("company"), loop = loopShare();
  const worst = [...now].sort((a, b) => a.score - b.score).slice(0, 3);
  const movers = prev ? INT.metrics.map((m) => { const a = m.waves.find((x) => x.waveId === prev).score, b = m.waves.find((x) => x.waveId === lastW).score; return { id: m.id, a, b, d: b - a }; }).sort((x, y) => Math.abs(y.d) - Math.abs(x.d)).slice(0, 4) : [];
  const decisions = live.decisions.filter((d) => d.outcome).slice(0, 3);
  return pageHead("Сводка для руководства", `${REPORT.company.name} · ${waveName(lastW).toLowerCase()}. Одна страница для первых лиц, то же приходит письмом раз в месяц.`, `<button class="btn btn--ghost btn--sm" data-toast="В прототипе PDF не формируется">${ico("download")}PDF сводки</button>`)
    + `<div class="kpis">${kpi("Индекс изнутри" + info("internalIndex"), `${idx}<small> /100</small>`, w.length > 1 ? `с первого замера ${delta(idx - idx0)}` : badge(LEVEL(idx), LEVEL_WORD[LEVEL(idx)]), "kpi--teal")}${can("external") ? kpi("Индекс снаружи" + info("externalIndex"), `${EXT.index.value}<small> /100</small>`, `${delta(EXT.index.delta.value)} за квартал`) : ""}${kpi("Разрыв с кодом" + info("codeGap"), `${norms.filter((n) => n.level === "bad").length}<small> из ${norms.length}</small>`, norms.filter((n) => n.level === "bad").map((n) => `«${n.title}»`).join(", "), "kpi--teal")}${kpi("Закрытые петли", `${loop.value}<small> %</small>`, `норма ${loop.norm}`, "kpi--teal")}</div>`
    + `<div class="grid2">${panel("Главные разрывы", `<ul class="rows">${worst.map((m) => `<li><div class="rows__main"><b>${METRIC_DEFS[m.id].name}</b><span class="rows__sub">${m.drivers[0]?.text ?? ""}</span></div>${status(LEVEL(m.score), `${m.score} · ${LEVEL_WORD[LEVEL(m.score)]}`)}</li>`).join("")}</ul>`, "Три самые низкие метрики по компании")}
      ${movers.length ? panel("Что изменилось с прошлого замера", `<ul class="rows">${movers.map((m) => `<li><div class="rows__main"><b>${METRIC_DEFS[m.id].name}</b><span class="rows__sub">было ${m.a}, стало ${m.b}</span></div>${delta(m.d)}</li>`).join("")}</ul>`, `${waveName(prev)} и ${waveName(lastW).toLowerCase()}`) : panel("Что изменилось", "<p>Сравнение появится со второго замера.</p>")}</div>`
    + panel("Решения и результат", `<ul class="rows">${decisions.map((d) => `<li><div class="rows__main"><b>${d.topic}</b><span class="rows__sub">${d.decision}</span></div><span class="rows__meta" style="max-width:280px">${d.outcome}</span></li>`).join("")}</ul>`, "Что сделали по обратной связи и что изменилось")
    + (can("external") ? panel("Снаружи", `<p>${REPORT.summary.find((x) => x.kind === "risk").text}</p><p class="rows__sub" style="margin-top:8px">Главная слепая зона: «${EXT.blindSpots[0].topic}», ${EXT.blindSpots[0].share}% упоминаний.</p>`) : "")
    + note("В сводке нет срезов по подразделениям: её можно показывать совету директоров целиком.");
};

PAGES.questions = () => {
  const mine = (q) => ["owner", "hrbp"].includes(state.role) || q.author === ROLES[state.role].person;
  const aboutLabel = (a) => (a.type === "metric" ? `Метрика · ${METRIC_DEFS[a.id].name}` : a.type === "plan" ? `Шаг плана · ${live.plan.find((p) => p.id === a.id)?.title ?? ""}` : a.type === "report" ? "Отчёт" : "Общий вопрос");
  const aboutHref = (a) => (a.type === "metric" ? `#metric-${a.id}` : a.type === "plan" ? "#plan" : a.type === "report" ? "#reports" : "");
  const threads = live.questions.filter(mine).map((q) => `<li class="item"><div class="item__head"><div class="rows__main"><b>${q.author}</b><span class="rows__sub">${ROLE_NAMES[q.role]} · ${q.date}</span></div><span class="badges">${aboutHref(q.about) ? `<a class="badge badge--soft" href="${aboutHref(q.about)}">${aboutLabel(q.about)}</a>` : badge("soft", aboutLabel(q.about))}${q.answer ? badge("ok", "Ответ получен") : badge("warn", "Ждёт ответа")}</span></div><p>${q.text}</p>${q.answer ? `<div class="answer"><span class="rows__sub">Эксперт Mirror · ${q.answer.date}</span><p>${q.answer.text}</p></div>` : `<p class="rows__sub">Эксперт отвечает в течение 2 рабочих дней. Ответ придёт на почту.</p>`}</li>`).join("");
  const ask = state.ask ?? "general";
  const options = [["general", "Общий вопрос"], ["report:final", "Отчёт"], ...INT.metrics.map((m) => [`metric:${m.id}`, `Метрика · ${METRIC_DEFS[m.id].name}`]), ...live.plan.filter((p) => p.unitId === null || ownUnit(p.unitId)).map((p) => [`plan:${p.id}`, `Шаг плана · ${p.title}`])];
  const form = `<form id="ask-form" class="qform"><label class="field"><span class="label">О чём вопрос</span><select class="select" name="about">${options.map(([v, l]) => `<option value="${v}" ${v === ask ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label><label class="field"><span class="label">Вопрос</span><textarea class="textarea" name="text" required rows="4" placeholder="Например, как отличить влияние плана от сезонности"></textarea></label><p class="rows__sub">Не пишите имена сотрудников и детали, по которым их можно узнать.</p><div><button class="btn btn--primary btn--sm" type="submit">Отправить эксперту</button></div></form>`;
  const slots = `<div class="slots">${SLOTS.map((t) => `<button class="btn btn--ghost btn--sm" data-slot="${t}">${ico("calendar")}${t}</button>`).join("")}</div><p class="rows__sub" style="margin-top:12px">Встреча 30 минут по видеосвязи. Приглашение придёт на почту всем, кого вы укажете.</p>`;
  return pageHead("Вопросы эксперту", "Эксперт Mirror отвечает в течение 2 рабочих дней. Срочное и большое удобнее обсудить на встрече.")
    + `<div class="grid2">${panel("Задать вопрос", form, "Вопрос виден вам, HR-директору и HRBP")}${panel("Записаться на встречу", slots, "Свободное время эксперта на ближайшие две недели")}</div>`
    + `<section class="panel panel--well"><div class="panel__head"><h2 class="panel__title">Вопросы и ответы</h2></div><ul class="items">${threads || `<li class="item">Вопросов пока нет.</li>`}</ul></section>`;
};

PAGES.glossary = () => {
  const SIDE = { external: "Снаружи", internal: "Изнутри", common: "Обе стороны" };
  return pageHead("Как читать цифры", "Термины кабинета и отчётов. Те же пояснения открываются по кнопке «i» рядом с показателями.")
    + Object.entries(SIDE).map(([side, name]) => panel(name, `<dl class="glossary">${Object.values(GLOSSARY).filter((t) => t.side === side).map((t) => `<div><dt>${t.title}</dt><dd>${t.text}</dd></div>`).join("")}</dl>`)).join("");
};

/* Без меню: вход и страница для сотрудников */
const SOLO = {
  survey() {
    const p = SURVEY_PREVIEW;
    return `<div class="solo"><span class="solo__logo">${tpl("logo")}</span><div class="public"><p class="crumbs-sm"><a href="#data">Вернуться в кабинет</a> · так опрос видит сотрудник</p><h1>Как нам работается</h1><p class="public__lead">${REPORT.company.name} · ${LIVE_WAVE.label.toLowerCase()}, ${LIVE_WAVE.dates}. ${p.intro}</p><form class="survey" id="survey-form">${p.questions.map((q, i) => `<fieldset class="item"><legend class="item__title">${q.q}</legend><div class="survey__scale">${p.scale.map((s, j) => `<label><input type="radio" name="q${i}" value="${j + 1}"><span>${s}</span></label>`).join("")}</div></fieldset>`).join("")}<label class="item field"><span class="item__title">${p.open}</span><textarea class="textarea" rows="3"></textarea></label><button class="btn btn--primary" type="submit">Отправить ответы</button></form><p class="public__foot">Пример вопросов: настоящий опрос эксперт собирает под культурный код компании, 15–20 вопросов, около 7 минут.</p></div></div>`;
  },
  login() {
    const step = state.login ?? 0;
    const body = step === 0
      ? `<h1>Вход в кабинет</h1><p>Пришлём ссылку для входа на почту. Пароль не нужен.</p><form id="login-form" style="display:flex;flex-direction:column;gap:12px"><label class="field"><span class="label">Почта</span><input class="input" type="email" required value="i.sokolova@bank-n.ru"></label><button class="btn btn--primary" type="submit">Получить ссылку</button></form><p class="login__small">Ссылка действует 15 минут. Если адреса нет в кабинете, письмо не придёт, но ответ будет тем же.</p>`
      : step === 1
        ? `<h1>Проверьте почту</h1><p>Если адрес есть в кабинете, ссылка уже в письме. Откройте её на этом устройстве.</p><button class="btn btn--primary" data-act="open-link">Открыть ссылку из письма</button><p class="login__small">В прототипе письмо не отправляется.</p>`
        : `<h1>Войти в кабинет</h1><p>Вы открыли ссылку для i.sokolova@bank-n.ru. Нажмите, чтобы войти.</p><button class="btn btn--primary" data-act="enter">Войти</button><p class="login__small">Вход по кнопке, а не сразу по ссылке: так почтовые сканеры не используют ссылку раньше вас.</p>`;
    return `<div class="solo"><span class="solo__logo">${tpl("logo")}</span><div class="login">${body}</div></div>`;
  },
  public() {
    return `<div class="solo"><span class="solo__logo">${tpl("logo")}</span><div class="public"><p class="crumbs-sm"><a href="#decisions">${"Вернуться в кабинет"}</a></p><h1>Решения по обратной связи</h1><p class="public__lead">${REPORT.company.name}. Что вы сказали, что мы решили и что изменилось. Страница обновляется по мере решений.</p><ul class="items">${live.decisions.filter((d) => d.public).map((d) => `<li class="item"><div class="item__head"><h2 class="item__title">${d.topic}</h2>${badge(DECISION[d.status][0], DECISION[d.status][1])}</div><dl class="item__grid" style="grid-template-columns:1fr 1fr"><div><dt>Что решили</dt><dd>${d.decision}</dd></div><div><dt>Что изменилось</dt><dd>${d.outcome ?? "Пока рано судить"}</dd></div></dl></li>`).join("") || `<li class="item">Пока нет опубликованных решений.</li>`}</ul><p class="public__foot">Есть что сказать? Напишите анонимно: mirror-com.ru/f/bank-n-9x2c. Мы не определяем авторов и показываем только группы от 5 человек.</p></div></div>`;
  },
};

/* ── Оболочка и маршрутизация ── */
function sideHtml(active) {
  const r = ROLES[state.role];
  const items = NAV.map((n) => {
    if (n.group) return `<p class="snav__label">${n.group}</p>`;
    if (!can(n.id)) return "";
    return `<a href="#${n.id === "settings" ? "prefs" : n.id}" class="${n.health ? "is-health" : ""}" ${n.id === active ? 'aria-current="page"' : ""}>${ico(n.icon)}${n.label}${locked(n.id) ? `<span class="snav__lock">${ico("lock")}</span>` : ""}</a>`;
  }).join("").replace(/(<p class="snav__label">[^<]*<\/p>)(?=<p|$)/g, "");
  return `<aside class="side" id="side"><a class="side__logo" href="#overview" aria-label="Mirror, на обзор">${tpl("logo")}</a><div class="company"><b>${REPORT.company.name}</b><span>${SERVICES[state.service].name}</span></div><nav class="snav" aria-label="Разделы кабинета">${items}</nav><a class="side__help" href="#glossary">${ico("book")}Как читать цифры</a><div class="side__user"><span class="avatar">${r.person.split(" ").map((w) => w[0]).join("")}</span><div><b>${r.person}</b><span>${r.name}</span></div><a href="#login" aria-label="Выйти">${ico("logout")}</a></div></aside>`;
}
/* Адрес раздела — простой якорь: #overview, #metric-energy. «Настройки» — #prefs: имя settings занято площадкой ссылок */
function route() {
  const h = location.hash.slice(1) || "overview";
  if (h.startsWith("metric-")) return { page: "internal", sub: h.slice(7) };
  return { page: h === "prefs" ? "settings" : h, sub: null };
}
function render() {
  const { page, sub } = route();
  const root = $("#root");
  root.className = "";
  if (SOLO[page]) { root.innerHTML = SOLO[page](); after(); return; }
  const section = page === "internal" && sub ? "metric" : page;
  let html;
  const label = NAV.find((n) => n.id === page)?.label ?? "Раздел";
  if (!PAGES[section] && !PAGES[page]) html = noAccess("Раздел не найден");
  else if (!can(section)) html = noAccess(label);
  else if (locked(section)) html = pageHead(label) + lockedView("Раздел входит в кампанию", LOCKED[section].text);
  else if (waitingData(section)) html = pageHead(label) + lockedView(state.phase === "setup" ? "Данные появятся после первого опроса" : "Опрос идёт", state.phase === "setup" ? "Сначала подготовка к запуску: культурный код, подразделения, ссылки опроса. Цифры изнутри появятся примерно через 10 дней после закрытия опроса." : `${LIVE_WAVE.label} идёт до 14 ноября. Цифры появятся после анализа и проверки экспертом, примерно через 10 дней.`, "info", `<a class="btn btn--ghost btn--sm" href="#overview">Ход работы</a>`);
  else html = section === "metric" ? PAGES.metric(sub) : PAGES[section]();
  root.innerHTML = `<div class="app" id="app">${sideHtml(page === "internal" ? "internal" : page)}<main class="main" id="main"><button class="burger" data-act="menu">${ico("menu")}Разделы</button>${html}</main></div>`;
  after();
}
function after() {
  typograf(document.getElementById("root"));
  requestAnimationFrame(mountCharts);
  window.scrollTo(0, 0);
}
let toastTimer;
function toast(text) {
  const t = $("#toast"); t.textContent = text; t.classList.add("is-on");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("is-on"), 2200);
}

/* ── События ── */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act],[data-copy],[data-copytext],[data-toast],[data-launch],[data-ask],[data-slot],[data-decide],[data-map]"); if (!el) return;
  if (el.dataset.map) { state.map = el.dataset.map; render(); return; }
  if (el.dataset.decide) {
    const [type, i] = el.dataset.decide.split(":"), x = type === "alert" ? INT.alerts[+i] : INT.signals[+i];
    state.prefill = type === "alert"
      ? { source: "alert", topic: `${METRIC_DEFS[x.metric].name}: ${x.context.toLowerCase()}`, metric: x.metric, unit: x.unitId, note: `${METRIC_DEFS[x.metric].name} ${sign(x.change)} за ${x.days === 14 ? "2 недели" : x.days + " дней"}, ${x.unitId ? unitName(x.unitId) : "вся компания"}` }
      : { source: "signal", topic: "", metric: x.metric, unit: null, note: `«${x.text}»` };
    location.hash = "#decisions"; return;
  }
  if (el.dataset.copytext) { navigator.clipboard?.writeText(el.dataset.copytext).catch(() => {}); toast("Текст скопирован"); return; }
  if (el.dataset.launch) { live.launch.find((l) => l.id === el.dataset.launch).done = true; render(); toast("Шаг отмечен"); return; }
  if (el.dataset.ask) { state.ask = el.dataset.ask; location.hash = "#questions"; return; }
  if (el.dataset.slot) { live.meetings.unshift({ date: el.dataset.slot, title: "Встреча с экспертом", who: "Эксперт Mirror и вы", campaign: state.service === "campaign" }); toast(`Встреча ${el.dataset.slot} назначена, приглашение придёт на почту`); return; }
  if (el.dataset.copy) { navigator.clipboard?.writeText("https://mirror-com.ru/" + el.dataset.copy).catch(() => {}); toast("Ссылка скопирована"); return; }
  if (el.dataset.toast) { toast(el.dataset.toast); return; }
  const act = el.dataset.act;
  if (act === "menu") { const app = $("#app"); app.classList.toggle("is-menu"); if (app.classList.contains("is-menu")) { const s = document.createElement("div"); s.className = "scrim"; s.dataset.act = "close"; app.append(s); } else app.querySelector(".scrim")?.remove(); }
  if (act === "close") { $("#app").classList.remove("is-menu"); el.remove(); }
  if (act === "add") { state.adding = true; render(); }
  if (act === "reminder") { state.reminder = !state.reminder; render(); }
  if (act === "cancel") { state.adding = false; state.prefill = null; render(); }
  if (act === "stage-all") { state.stage = "all"; render(); }
  if (act === "open-link") { state.login = 2; render(); }
  if (act === "enter") { state.login = 0; location.hash = "#overview"; toast("Вы вошли в кабинет"); }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.id === "f-unit") { state.unit = t.value; render(); }
  if (t.id === "f-wave") { state.wave = t.value; render(); }
  if (t.id === "f-stage") { state.stage = t.value; render(); }
  if (t.id === "f-period") { state.period = t.value; render(); }
  if (t.dataset.pub) { const d = live.decisions.find((x) => x.id === t.dataset.pub); d.public = t.checked; toast(t.checked ? "Решение опубликовано для сотрудников" : "Решение скрыто со страницы для сотрудников"); }
  if (t.dataset.step) { live.plan.find((x) => x.id === t.dataset.step).status = t.value; toast("Статус шага сохранён"); render(); }
  if (t.dataset.notify) { live.notify[t.dataset.notify] = t.checked; toast("Настройка сохранена"); }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, data = Object.fromEntries(new FormData(f));
  if (f.id === "login-form") { state.login = 1; render(); }
  if (f.id === "survey-form") { toast("Это пример: ответы не сохраняются"); return; }
  if (f.id === "ask-form") { const [type, id] = data.about.split(":"); live.questions.unshift({ id: "q" + Date.now(), author: ROLES[state.role].person, role: ROLES[state.role].role, about: { type, id }, text: data.text, date: "сегодня", answer: null }); state.ask = null; render(); toast("Вопрос отправлен эксперту"); }
  if (f.id === "dec-form") { live.decisions.unshift({ id: "new-" + Date.now(), unitId: data.unit || null, topic: data.topic, decision: data.decision, metric: data.metric, ownerRole: data.ownerRole, due: data.due, source: state.prefill ? { type: state.prefill.source, note: state.prefill.note } : undefined, status: "planned", public: false, month: "2026-11" }); state.adding = false; state.prefill = null; render(); toast("Решение добавлено. Опубликуйте его для сотрудников, когда будет результат"); }
  if (f.id === "inv-form") { live.team.push({ person: data.email, email: data.email, role: data.role, unit: data.unit || null, last: "приглашение отправлено" }); render(); toast("Приглашение отправлено"); }
});
addEventListener("hashchange", () => { state.adding = location.hash === "#decisions" && !!state.prefill; if (!state.adding) state.prefill = null; if (location.hash !== "#questions") state.ask = null; render(); });

/* Полоса прототипа */
const roleSel = $("#demo-role"), serviceSel = $("#demo-service");
roleSel.innerHTML = Object.entries(ROLES).map(([k, r]) => `<option value="${k}">${r.name}</option>`).join("");
serviceSel.innerHTML = Object.entries(MODES).map(([k, m]) => `<option value="${k}">${m.name}</option>`).join("");
roleSel.value = state.role; serviceSel.value = state.mode;
roleSel.addEventListener("change", () => { state.role = roleSel.value; state.unit = null; store.set("role", state.role); render(); });
serviceSel.addEventListener("change", () => { applyMode(serviceSel.value); state.wave = null; store.set("service", state.mode); render(); });

/* Подсказки «i»: та же логика, что на сайте (prototype/home/src/app.js). Наведение и фокус показывают, Esc и уход прячут */
const tip = $("#tip");
let tipFor = null;
function showTip(btn) {
  tipFor = btn;
  tip.textContent = btn.dataset.tip;
  typograf(tip);
  btn.setAttribute("aria-describedby", "tip"); btn.setAttribute("aria-expanded", "true");
  tip.classList.add("is-shown");
  const b = btn.getBoundingClientRect(), t = tip.getBoundingClientRect(), gap = 12;
  const left = Math.min(Math.max(16, b.left + b.width / 2 - t.width / 2), innerWidth - t.width - 16);
  const above = b.top - t.height - gap > 8;
  tip.dataset.side = above ? "top" : "bottom";
  tip.style.left = left + "px";
  tip.style.top = (above ? b.top - t.height - gap : b.bottom + gap) + "px";
  tip.style.setProperty("--tip-arrow", (b.left + b.width / 2 - left) + "px");
}
function hideTip() {
  if (!tipFor) return;
  tipFor.removeAttribute("aria-describedby"); tipFor.setAttribute("aria-expanded", "false");
  tip.classList.remove("is-shown"); tipFor = null;
}
const tipTarget = (e) => (e.target instanceof Element ? e.target.closest("[data-tip]") : null);
let lastPointer = "mouse";
document.addEventListener("pointerdown", (e) => { lastPointer = e.pointerType; }, true);
document.addEventListener("pointerover", (e) => { const t = tipTarget(e); if (e.pointerType === "mouse" && t && t !== tipFor) showTip(t); });
document.addEventListener("pointerout", (e) => { if (e.pointerType === "mouse" && tipFor && !tipFor.contains(e.relatedTarget)) hideTip(); });
document.addEventListener("focusin", (e) => { const t = tipTarget(e); if (t && t.matches(":focus-visible")) showTip(t); });
document.addEventListener("focusout", (e) => { if (tipTarget(e)) hideTip(); });
document.addEventListener("click", (e) => { const t = tipTarget(e); if (t) { if (lastPointer !== "mouse" && tipFor === t) hideTip(); else showTip(t); return; } hideTip(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTip(); });
addEventListener("scroll", hideTip, { passive: true });
addEventListener("hashchange", hideTip);

/* Типограф: короткие слова не висят в конце строки (как на сайте, src/lib/typograf.ts) */
function typograf(root) {
  const skip = "script,style,textarea,input,select,option,.mono";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest(skip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
  const short = /(^|[\s\u00a0(«"„—–/])([−+]?[A-Za-zА-Яа-яЁё0-9№]{1,3}%?)[ ]+(?=\S)/g;
  let n;
  while ((n = walker.nextNode())) {
    let t = n.nodeValue, prev;
    if (!t.trim()) continue;
    do { prev = t; t = t.replace(short, "$1$2\u00a0"); } while (t !== prev);
    t = t.replace(/ +([—–])/g, "\u00a0$1");
    if (t !== n.nodeValue) n.nodeValue = t;
  }
}

render();
