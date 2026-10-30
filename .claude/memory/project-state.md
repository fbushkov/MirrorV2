# Состояние проекта Mirror V2

_Обновлено: 2026-10-30. Ведёт агент `mirror-context-keeper`._

## Цель
Новая версия сайта Mirror (mirror-com.ru) под новое позиционирование: бесплатный внешний срез → платная диагностика внешнего и внутреннего бренда с экспертом.

## Сделано
- **2026-10-30 — сайт на Next = прототип (ADR-0008).** Страницы: `/`, `/pricing`, `/start`, `/hr-brand` (+`/demo`, `/methodology`), `/culture-health` (+`/demo`, `/methodology`), `/docs/*`, 404. Разметка из `prototype/home` через `build.py --next` (`src/site`, `public/site`); сверка с прототипом 0 пикселей разницы; e2e 28/28. «О нас» убрана, `/about` на главную, `/methodology` 308 на методику HR-бренда. Неиспользуемые пакеты (shadcn, Tailwind, Radix, echarts из npm) — убрать отдельной задачей. Пункты ниже про shadcn-страницы и `src/content/pulse.ts` устарели.
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
- Тестовая страница «Цены» в прототипе (`prototype/home/pages/pricing.html`) — ждёт отзыва пользователя; условные цены (мониторинг, диагностика, число интервью, отчёт раз в квартал, NDA) — подтвердить.

## Этапы (`docs/architecture/site.md`)
Сайт (идёт) → заявки на почту → отчёт внешнего анализа (PDF) → админка (когда отчётов много) → кабинет клиента (отложен).

## Принятые решения 2026-10-27
- Заявки — только на почту; Telegram/CRM позже адаптерами (ADR-0003, принято частично).
- Хостинг — REG.RU, сервер ведёт пользователь; docker compose: Next standalone + Postgres + nginx/HTTPS (ADR-0006).
- Кабинет отложен, клиенту отчёт PDF (ADR-0004 отложено). Образец отчёта — старый сайт `public/demo.html` («Экспресс-аудит HR-бренда», 14 разделов);
  дорабатываем во внешнем направлении на демо «Банк N», реальную компанию не показываем (ADR-0007, предложено).
- Парсер отдаёт выгрузку файлом; цифры считает код, ИИ формулирует, эксперт проверяет, клиенту PDF.
- Старый репозиторий — действующий сайт, не трогаем; вся работа в MirrorV2.

## Дальше (кандидаты)
- Структура нового отчёта на основе `demo.html` + три показателя V2 (согласовать с пользователем: content + analyst).
- (позже, по команде) Подключить форму `/start` к почте (SMTP, Zod, антиспам, согласие 152-ФЗ; ADR-0003).
- (позже, по команде) Docker/compose, nginx и инструкция для REG.RU (`mirror-devops`, ADR-0006).
- Заменить условные тексты `<Ph>`: цены (в т.ч. мониторинг), команда, реквизиты, провайдер серверов (теперь REG.RU).
- Интеграция с существующим парсером (VK, Дзен, hh.ru, Dreamjob) — через файл выгрузки.
- Перенос главной из прототипа в Next — только по команде пользователя (план: общий слой токены/ui/Header/Footer/typograf,
  затем страницы по `prototype/home/design-system.html` раздел 12; route group (site) — вместе с переносом).

## Открытые вопросы
- ТЗ дашборда: реальные нормы культурного кода, подтверждение 10 метрик, примеры «Решения по обратной связи», согласование приватности с юристами и ИБ.
- Срок хранения заявок. (Сервер REG.RU, почта и SMTP у пользователя есть, уведомление в РКН подано — подключаем позже, сейчас только сайт.)
- Образец md-выгрузки парсера — для схемы файла (пока работаем на обезличенном образце отчёта).
- Образец выгрузки парсера (формат файла); где генерируется отчёт — у эксперта локально или на сервере.
- Состав разделов нового отчёта.
- ORM (предложен Drizzle, ADR-0003); библиотека сессий — позже, вместе с кабинетом.
- Перенос прототипа в Next — по команде пользователя.
- Реальные цены и состав команды.
- Агенты внутри продукта — когда переходить к реализации (`docs/architecture/agents.md`, раздел 8).

## Важные пути
- Старый сайт (только чтение): `fbushkov/mirror.service` → `/home/user/mirror.service`.
- Демо-данные и методика: `src/content/demo.ts`; тексты: `src/content/*.ts`; маршруты: `ROUTES` в `src/content/site.ts`.
- Тема: `src/app/globals.css`, `src/components/charts/theme.ts`.
- Архитектура сайта: `docs/architecture/site.md`; решения: `docs/adr/`; история: `CHANGELOG.md`.
- Прототип по Figma и дизайн-система: `prototype/home` (`design-system.html`, `build.py`, `qa.js`).
- Типограф: `src/lib/typograf.ts`; тесты: `src/**/*.test.ts`, `tests/e2e/`; CI: `.github/workflows/ci.yml`.
