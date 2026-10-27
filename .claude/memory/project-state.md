# Состояние проекта Mirror V2

_Обновлено: 2026-10-27. Ведёт агент `mirror-context-keeper`._

## Цель
Новая версия сайта Mirror (mirror-com.ru) под новое позиционирование: бесплатный внешний срез → платная диагностика внешнего и внутреннего бренда с экспертом.

## Сделано
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
  - Архитектура: `docs/architecture/site.md` (этапы сайт → заявки → админка → кабинет; зоны маршрутов (site)/(cabinet)/(admin)/api; слои;
    таблицы leads/consents/outbox/companies/users/memberships/reports/audit_log; доступы; качество; окружения).
  - ADR в `docs/adr/`: README, 0001 многостраничность (принято), 0002 дизайн Figma (принято), 0003 заявки (предложено),
    0004 вход/роли (предложено), 0005 тесты и CI (принято).
  - Тесты (ADR-0005): Vitest + @playwright/test 1.63.0, `vitest.config.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`
    (26 проверок зелёные: 13 страниц × десктоп/телефон + 404), `src/lib/typograf.ts` + `typograf.test.ts`.
  - `.github/workflows/ci.yml` (права `contents: read`, без секретов, `persist-credentials: false`); `ROUTES` и `SITE_URL` в `src/content/site.ts`; `src/app/sitemap.ts`, `src/app/robots.ts`; `.env.example`; `CHANGELOG.md`.
  - Агенты: 7 новых (architect, design-system, tests, reviewer, release, access, seo); обновлены frontend, backend, qa, devops, content, context-keeper; обновлён `CLAUDE.md`.
- Агенты разработки, память и логирование: `.claude/agents/`, `.claude/memory/`, `.claude/hooks/`, `CLAUDE.md`. Архитектура агентов продукта: `docs/architecture/agents.md`.

## В работе
—

## Дальше (кандидаты)
- Перенос главной в Next по прототипу: сначала общий слой (токены, ui, Header, Footer, typograf в контент), затем внутренние страницы
  по плану из `prototype/home/design-system.html` раздел 12 (о нас, документы, 404 → start, pricing → hr-brand, culture-health → демо и методика).
  Перевод текущих страниц в route group (site) — вместе с переносом. Ждёт подтверждения пользователя.
- Заменить условные тексты `<Ph>`: цены (в т.ч. мониторинг), команда, реквизиты, провайдер серверов.
- Подключить форму `/start` (этап «заявки», ADR-0003).
- Интеграция с существующим парсером (VK, Дзен, hh.ru, Dreamjob).
- Деплой (хостинг не выбран).

## Открытые вопросы
- ТЗ дашборда: реальные нормы культурного кода, подтверждение 10 метрик, примеры «Решения по обратной связи», согласование приватности с юристами и ИБ.
- Куда слать заявки: почта / Telegram / CRM?
- Хостинг в РФ: Yandex Cloud / Selectel / свой сервер?
- ORM и библиотека сессий (ADR-0003 / ADR-0004).
- Нужен ли кабинет к первым продажам или достаточно PDF-отчёта?
- Как парсер отдаёт данные (формат, API, файлы)?
- Переносить ли главную в Next прямо сейчас (подтверждение пользователя)?
- Реальные цены и состав команды.
- Агенты внутри продукта — когда переходить к реализации (`docs/architecture/agents.md`, раздел 8).

## Важные пути
- Старый сайт (только чтение): `fbushkov/mirror.service` → `/home/user/mirror.service`.
- Демо-данные и методика: `src/content/demo.ts`; тексты: `src/content/*.ts`; маршруты: `ROUTES` в `src/content/site.ts`.
- Тема: `src/app/globals.css`, `src/components/charts/theme.ts`.
- Архитектура сайта: `docs/architecture/site.md`; решения: `docs/adr/`; история: `CHANGELOG.md`.
- Прототип по Figma и дизайн-система: `prototype/home` (`design-system.html`, `build.py`, `qa.js`).
- Типограф: `src/lib/typograf.ts`; тесты: `src/**/*.test.ts`, `tests/e2e/`; CI: `.github/workflows/ci.yml`.
