/* Живые записи кабинета, которых нет в отчёте (ADR-0010, docs/product/cabinet.md, раздел 10): команда, ход работы,
   встречи, ссылки опроса, документы, импорт, журнал. Отчёт «Банка N» — vendor/report.json. Всё условное. */
const ROLES = {
  owner: { name: "HR-директор", role: "client_owner", person: "Ирина Соколова" },
  hrbp: { name: "HRBP", role: "client_hrbp", person: "Павел Ершов" },
  manager: { name: "Руководитель продаж", role: "client_manager", person: "Олег Минин", unit: "sales" },
  executive: { name: "Топ-менеджмент", role: "client_executive", person: "Сергей Лаптев" },
  viewer: { name: "Наблюдатель", role: "client_viewer", person: "Мария Котова" },
};
const ROLE_NAMES = { client_owner: "Владелец", client_hrbp: "HRBP", client_manager: "Руководитель", client_executive: "Топ-менеджмент", client_viewer: "Наблюдатель" };

const SERVICES = {
  diagnostics: { name: "Диагностика", note: "Один замер изнутри, отчёт и план на 90 дней" },
  campaign: { name: "Кампания на 3 месяца", note: "Три замера, роли, решения для сотрудников, сопровождение" },
};

/* Ход работы: этапы по услуге. done — пройден, now — текущий, next — впереди */
const STAGES = {
  campaign: [
    { t: "Договор и запуск", d: "28 июля", s: "done" },
    { t: "Культурный код и подразделения загружены", d: "1 августа", s: "done" },
    { t: "Волна 1: опрос", d: "4–15 августа · ответили 66%", s: "done" },
    { t: "Отчёт по волне 1 и встреча", d: "29 августа", s: "done" },
    { t: "Волна 2: опрос", d: "8–19 сентября · ответили 63%", s: "done" },
    { t: "Волна 3: опрос", d: "6–17 октября · ответили 66%", s: "done" },
    { t: "Эксперт проверяет итоговый отчёт", d: "до 5 ноября", s: "now" },
    { t: "Итоговая встреча с руководителями", d: "12 ноября", s: "next" },
  ],
  diagnostics: [
    { t: "Договор и запуск", d: "28 июля", s: "done" },
    { t: "Культурный код и подразделения загружены", d: "1 августа", s: "done" },
    { t: "Опрос", d: "4–15 августа · ответили 66%", s: "done" },
    { t: "Анализ и проверка экспертом", d: "до 26 августа", s: "done" },
    { t: "Отчёт и план на 90 дней", d: "27 августа", s: "done" },
    { t: "Встреча с экспертом", d: "6 ноября", s: "now" },
  ],
  monitoring: [
    { t: "Отчёт за октябрь вышел", d: "1 ноября", s: "done" },
    { t: "Следующий отчёт", d: "1 декабря", s: "next" },
  ],
};

const MEETINGS = [
  { date: "12 ноября, 11:00", title: "Итоговая встреча с руководителями", who: "Эксперт Mirror, HR-директор, руководители подразделений", campaign: true },
  { date: "6 ноября, 15:00", title: "Разбор отчёта с экспертом", who: "Эксперт Mirror, HR-директор, HRBP", campaign: false },
];
const MEETINGS_PAST = [
  { date: "17 октября", title: "Встреча с руководителями после волны 2", result: "Договорились о «тихих часах» в продажах и ответе на сигналы за 10 рабочих дней" },
  { date: "29 августа", title: "Разбор отчёта по волне 1", result: "Приоритеты квартала: нагрузка в продажах и психологическая безопасность в ИТ" },
];

/* Дерево подразделений из настроек: черновик следующей версии и действующая (заморожена на волну) */
const TREE = [
  { id: "company", name: "Банк N", parent: null, size: 680 },
  { id: "sales", name: "Продажи", parent: "company", size: 210 },
  { id: "sales-retail", name: "Розница", parent: "sales", size: 150 },
  { id: "sales-corp", name: "Корпоративные клиенты", parent: "sales", size: 60 },
  { id: "it", name: "ИТ", parent: "company", size: 85 },
  { id: "it-data", name: "Аналитика данных", parent: "it", size: 4 },
  { id: "it-dev", name: "Разработка", parent: "it", size: 81 },
  { id: "ops", name: "Операции", parent: "company", size: 240 },
  { id: "back", name: "Бэк-офис", parent: "company", size: 145 },
];

const SURVEY_LINKS = [
  { unit: "Продажи", size: 210, answered: 141, token: "s/7f3k-sales" },
  { unit: "ИТ", size: 85, answered: 49, token: "s/q9d2-it" },
  { unit: "Операции", size: 240, answered: 162, token: "s/m4x8-ops" },
  { unit: "Бэк-офис", size: 145, answered: 95, token: "s/c1v6-back" },
];
const IMPORTS = [
  { name: "Пульс-опрос HR-платформы, сентябрь", kind: "Опрос", rows: 412, status: "Обработан", ok: true },
  { name: "Платформа идей, июль–октябрь", kind: "Тексты", rows: 238, status: "Обезличен, ждёт проверки экспертом", ok: false },
  { name: "Ретроспективы ИТ, октябрь", kind: "Тексты", rows: 37, status: "Обработан", ok: true },
];
const DOCUMENTS = [
  { name: "Культурный код Банка N.pdf", kind: "Культурный код", date: "1 августа" },
  { name: "Подразделения и численность.xlsx", kind: "Подразделения", date: "1 августа" },
  { name: "Договор № 14-К.pdf", kind: "Договор", date: "28 июля" },
  { name: "Договор на обработку данных сотрудников.pdf", kind: "152-ФЗ", date: "28 июля" },
  { name: "Соглашение о конфиденциальности.pdf", kind: "NDA", date: "28 июля" },
];

const TEAM = [
  { person: "Ирина Соколова", email: "i.sokolova@bank-n.ru", role: "client_owner", unit: null, last: "сегодня" },
  { person: "Павел Ершов", email: "p.ershov@bank-n.ru", role: "client_hrbp", unit: null, last: "вчера" },
  { person: "Олег Минин", email: "o.minin@bank-n.ru", role: "client_manager", unit: "Продажи", last: "3 дня назад" },
  { person: "Анна Белова", email: "a.belova@bank-n.ru", role: "client_manager", unit: "ИТ", last: "неделю назад" },
  { person: "Сергей Лаптев", email: "s.laptev@bank-n.ru", role: "client_executive", unit: null, last: "2 недели назад" },
  { person: "Мария Котова", email: "m.kotova@bank-n.ru", role: "client_viewer", unit: null, last: "не входила" },
];
const AUDIT = [
  { when: "сегодня, 10:12", who: "Ирина Соколова", what: "открыла итоговый отчёт кампании" },
  { when: "вчера, 17:40", who: "Павел Ершов", what: "опубликовал решение «Сигналы остаются без ответа» для сотрудников" },
  { when: "вчера, 16:05", who: "Павел Ершов", what: "скачал PDF «Продажи, волна 3»" },
  { when: "28 октября", who: "Ирина Соколова", what: "пригласила Марию Котову, роль «Наблюдатель»" },
  { when: "20 октября", who: "Эксперт Mirror", what: "опубликовал отчёт по волне 3" },
];

/* Отчёты: опубликованные версии. Внешние приходят из мониторинга */
const REPORTS = [
  { title: "Итоговый отчёт кампании", period: "август–октябрь 2026", kind: "Изнутри", status: "На проверке у эксперта", draft: true, campaign: true },
  { title: "Мониторинг HR-бренда, октябрь", period: "октябрь 2026", kind: "Снаружи", status: "Опубликован 1 ноября" },
  { title: "Отчёт по волне 3", period: "октябрь 2026", kind: "Изнутри", status: "Опубликован 20 октября", campaign: true },
  { title: "Мониторинг HR-бренда, сентябрь", period: "сентябрь 2026", kind: "Снаружи", status: "Опубликован 1 октября" },
  { title: "Отчёт по волне 2", period: "сентябрь 2026", kind: "Изнутри", status: "Опубликован 26 сентября", campaign: true },
  { title: "Диагностика: отчёт и план на 90 дней", period: "август 2026", kind: "Изнутри", status: "Опубликован 27 августа", fixed: "Исправлено 2 сентября: уточнён балл «Признания»" },
  { title: "Внешний срез", period: "июль 2026", kind: "Снаружи", status: "Опубликован 14 июля" },
];
