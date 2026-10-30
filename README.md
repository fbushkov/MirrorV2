# Mirror V2

Новая версия сайта Mirror — диагностика HR-бренда и независимый индекс культуры компании.
Позиционирование V2: первый **внешний срез** через сервис Mirror бесплатный, дальше подключается эксперт и
**внутренняя проверка** (документы, данные компании, анонимные интервью) — это платная диагностика.
Парсер показывает на графиках просадки и подъёмы по внешней и внутренней стороне бренда.

Предыдущая версия: [`fbushkov/mirror.service`](https://github.com/fbushkov/mirror.service) — используется только как источник текстов и данных, не изменяется.

## Стек

- [Next.js 16](https://nextjs.org) (App Router, TypeScript) отдаёт разметку прототипа `prototype/home` (ADR-0008)
- Стили — `prototype/home/src/styles.css` (в Next — `src/site/styles.css`), шрифты Onest и JetBrains Mono
- [Apache ECharts 6](https://echarts.apache.org) — своя облегчённая сборка `prototype/home/vendor/echarts.mirror.min.js`
- Radix и shadcn/ui — в зависимостях для будущих форм, кабинета и админки на React

## Запуск

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production-сборка
npm run check   # тексты, линтер, типы, модульные тесты
```

Нужен Node.js 20+. Правка дизайна или текста страниц: правим `prototype/home`, затем

```bash
python3 prototype/home/build.py          # prototype/home/dist — просмотр и согласование
python3 prototype/home/build.py --next   # выгрузка в src/site и public/site
```

## Структура

```
prototype/home/        источник дизайна: страницы, общие блоки, стили, скрипты, дизайн-система
src/
  app/                 маршруты: страницы прототипа (SitePage), документы /docs/[slug], 404, sitemap, robots
  site/                выгрузка прототипа: pages/*.html, manifest.json, shell.json, styles.css
  content/site.ts      карта маршрутов ROUTES, навигация, ссылки на документы
  lib/                 typograf и другие чистые функции
public/site/           скрипты прототипа и сборка ECharts
docs/                  архитектура, ADR, тексты старого сайта и юридические документы
```

Форма заявки (`/start` и главная) пока никуда не отправляет данные — следующий этап, ADR-0003.

## Материалы

- [`docs/content/site-texts.md`](docs/content/site-texts.md) — все тексты публичных страниц старого сайта
- [`docs/content/legal/`](docs/content/legal) — юридические документы
