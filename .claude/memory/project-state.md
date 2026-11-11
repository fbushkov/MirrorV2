# Состояние проекта Mirror V2

_Обновлено: 2026-11-11. Ведёт агент `mirror-context-keeper`._

## Цель
Новая версия сайта Mirror (mirror-com.ru) под новое позиционирование: бесплатный внешний срез → платная диагностика внешнего и внутреннего бренда с экспертом.

## Сделано
- **2026-11-11 — аудит проекта.** Находки с приоритетами — `docs/backlog.md`, раздел 7. Порядок работ: архитектура сайта, технический долг и проработка кабинета, затем почта и юридические тексты. Сделано по сайту: тест сверки демо-страниц с `demo-report.ts`, FAQ в разметке из `prototype/home/src/faq.json`, Open Graph и структурированные данные (`src/site/seo.tsx`), тесты поведения `tests/e2e/site.spec.ts`, правки формы и мобильной версии, исправлены меню и выпадающий список. Кабинет пока остаётся прототипом. Ранее в тот же день: удалён неиспользуемый код `src/content` (остались `site.ts`, `demo-report.ts`, `glossary.ts`), шрифты на своём сервере, заголовки безопасности, мобильный тест на 375. Упоминания `pulse.ts`, `bridge.ts`, `demo.ts` ниже относятся к удалённым файлам.
- **2026-11-01 — схема отчёта (ADR-0009):** `src/lib/schemas/report.ts`, `src/lib/report/methodology.ts`, `src/content/demo-report.ts`, `docs/product/report-data.md`. Описание кабинета готово (`docs/product/cabinet.md`, версия 0.3): кабинет для клиентов диагностики и кампании, снаружи PDF и письма; открытых вопросов нет. ADR-0010 кабинета принят (технические выборы: своя реализация входа, Drizzle — предложено). Прототип кабинета `prototype/cabinet` (dist/cabinet.html) сделан и опубликован (claude.ai/artifact/4YFbgvq5j3dwpqYUQcAMdN, сайт — claude.ai/artifact/AfvcrMxYgbydD36kVthhDu). Критический разбор: пункты 1–4 (ответившие, защита от вычитания, волны, подразделение у шагов и решений) сделаны 2026-11-01; пункты 5–8 (фазы и запуск, ход опроса, вопросы эксперту, словарь) сделаны 2026-11-01, ADR-0011; пункты 9–13 (петля, фильтры, ориентир, сводка, «что нового») сделаны 2026-11-01, ADR-0012. Критический разбор закрыт целиком; пункты 14–19 (отчёт страницей, выгрузка, безопасность владельца, договор и сроки, переключатель компаний, пустые состояния) — позже. Бизнес-правила — `docs/product/business-rules.md`, открытые вопросы в его разделе 7. Админка — `docs/product/admin.md` (проект 0.1, ждёт отзыва). HTML-версии — `docs/html/`. Решено 2026-11-01: парсер вручную, до 3 проектов одновременно, сырые данные удаляются в течение 30 дней после итогового отчёта (проверяет юрист). Было в плане: ADR кабинета (роли руководитель/топ, подразделения, опросы свои и из каналов клиента), прототип `prototype/cabinet`. Агентствам пока PDF под их брендом.
- **2026-10-30 — сайт на Next = прототип (ADR-0008).** Страницы: `/`, `/pricing`, `/start`, `/hr-brand` (+`/demo`, `/methodology`), `/culture-health` (+`/demo`, `/methodology`), `/docs/*`, 404. Разметка из `prototype/home` через `build.py --next` (`src/site`, `public/site`); сверка с прототипом 0 пикселей разницы; e2e 28/28. «О нас» убрана, `/about` на главную, `/methodology` 308 на методику HR-бренда. Tailwind удалён; `echarts` (devDependencies) нужен для пересборки графиков; Radix и shadcn оставлены для форм и кабинета. Пункты ниже про shadcn-страницы и `src/content/pulse.ts` устарели.
- Тексты старого сайта собраны: `docs/content/site-texts.md`, юр. документы — `docs/content/legal/`.
- Тестовый сайт на Next.js 16 + Tailwind 4 + shadcn/ui + ECharts 6 (ветка `claude/practical-gates-pzc7nm`), структура v2 (`docs/ux/site-structure.md`):
  светлая тема, акцент пока `#A847B8` (при переносе заменяется на `#7A2FD1`, ADR-0002), без старого логотипа и картинок.
  Страницы: `/`, `/hr-brand`, `/hr-brand/demo`, `/culture-health`, `/culture-health/demo`, `/methodology`, `/pricing`, `/about`, `/start`, `/docs/*`.
- Три показателя (индекс культуры, слепые зоны, место в отрасли) и матрица «честность × условия»: главная, `/hr-brand`, `/methodology`, `/hr-brand/demo`.
- Дашборд здоровья культуры по ТЗ: `/culture-health` (15 блоков), демо `/culture-health/demo` (фильтры, правило 5 человек), данные `src/content/pulse.ts`.
- Два направления (внешнее — фиолетовый, внутреннее — `health-*` бирюзовый), редиректы со старых `/pulse`, `/example`, `/example/pulse`, `/culture-index`.
- Мостик между направлениями без общего индекса: `src/content/bridge.ts`; единая демо-компания «Банк N», 680 сотрудников.
- Превью артефактом: https://claude.ai/artifact/KMyqLFdyA8zBzkdZqgU7sf (сборка `.preview/`, не в git).
- Коммит `adc7b5f`: HTML-прототип главной и «О нас» по макету Figma (fileKey `wSWcfUravCxcymezdlNoko`) в `prototype/home`
  (многостраничная сборка `build.py`, `design-system.html` разделы 1–12, `qa.js`); исключён из eslint.
- **Сессия 2026-10-27 — архитектура и инфраструктура разработки:**
  - ADR 0006 (хостинг REG.RU, принято) и 0007 (отчёт внешнего анализа, предложено) добавлены; 0003 принято частично, 0004 отложено.
  - Архитектура: `docs/architecture/site.md` (этапы сайт → заявки → отчёт → админка → кабинет; зоны маршрутов (site)/(cabinet)/(admin)/api; слои;
    таблицы leads/consents/outbox/companies/users/memberships/reports/audit_log; доступы; качество; окружения).
  - ADR в `docs/adr/`: README, 0001 многостраничность (принято), 0002 дизайн Figma (принято), 0003 заявки (предложено),
    0004 вход/роли (предложено), 0005 тесты и CI (принято).
  - Тесты (ADR-0005): Vitest + @playwright/test 1.63.0, `vitest.config.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`
    (26 проверок зелёные: 13 страниц × десктоп/телефон + 404), `src/lib/typograf.ts` + `typograf.test.ts`.
  - `.github/workflows/ci.yml` (права `contents: read`, без секретов, `persist-credentials: false`); `ROUTES` и `SITE_URL` в `src/content/site.ts`; `src/app/sitemap.ts`, `src/app/robots.ts`; `.env.example`; `CHANGELOG.md`.
  - Агенты: 7 новых (architect, design-system, tests, reviewer, release, access, seo); обновлены frontend, backend, qa, devops, content, context-keeper; обновлён `CLAUDE.md`.
- Агенты разработки, память и логирование: `.claude/agents/`, `.claude/memory/`, `.claude/hooks/`, `CLAUDE.md`. Архитектура агентов продукта: `docs/architecture/agents.md`.

## В работе
- 2026-11-11: владельцу отправлен `docs/status-and-questions.md` — состояние кабинета, сайта и продукта и 32 вопроса (В1–В32) со ссылками на бэклог. Ждём ответов; по ним обновить бэклог, бизнес-правила и журнал решений.
- Нет активной задачи. Последнее: бизнес-правила, админка, бэклог, `AGENTS.md` как общая память для любого ИИ (2026-11-01).

## Этапы (`docs/architecture/site.md`)
Сайт (сделан, не задеплоен) → заявки на почту → отчёт внешнего анализа (PDF) → админка и кабинет к первой диагностике
(спроектированы: `docs/product/admin.md`, `docs/product/cabinet.md`, прототип `prototype/cabinet`).

## Дальше (кандидаты)
- Ответы владельца по `docs/backlog.md` (цены, выгрузка парсера, юрист) — без них не начинать отчёт и кабинет.
- (по команде) Форма `/start` на почту (ADR-0003), Docker и деплой на REG.RU (ADR-0006).
- Шаблон PDF отчёта из JSON по схеме (ADR-0009).

## Открытые вопросы
Все открытые вопросы и отложенные задачи — `docs/backlog.md` (6 разделов: бизнес, юридическое, данные, кабинет и админка,
техника, документы). Здесь не дублируются.

## Важные пути
- Старый сайт (только чтение): `fbushkov/mirror.service` → `/home/user/mirror.service`.
- Методика: `src/lib/report/methodology.ts`; демо-отчёт: `src/content/demo-report.ts`; словарь: `src/content/glossary.ts`; маршруты: `ROUTES` в `src/content/site.ts`.
- Стили и цвета: `prototype/home/src/styles.css` (выгрузка в `src/site/styles.css`); шрифты: `src/app/fonts.css`, `public/fonts`.
- Архитектура сайта: `docs/architecture/site.md`; решения: `docs/adr/`; история: `CHANGELOG.md`.
- Прототип по Figma и дизайн-система: `prototype/home` (`design-system.html`, `build.py`, `qa.js`).
- Типограф: `src/lib/typograf.ts`; тесты: `src/**/*.test.ts`, `tests/e2e/`; CI: `.github/workflows/ci.yml`.
