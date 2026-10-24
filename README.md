# Mirror V2

Новая версия сайта Mirror — диагностика HR-бренда и независимый индекс культуры компании.
Позиционирование V2: первый **внешний срез** через сервис Mirror бесплатный, дальше подключается эксперт и
**внутренняя проверка** (документы, данные компании, анонимные интервью) — это платная диагностика.
Парсер показывает на графиках просадки и подъёмы по внешней и внутренней стороне бренда.

Предыдущая версия: [`fbushkov/mirror.service`](https://github.com/fbushkov/mirror.service) — используется только как источник текстов и данных, не изменяется.

## Стек

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Radix, стиль `radix-nova`) — компоненты в `src/components/ui`
- [Apache ECharts 6](https://echarts.apache.org) — графики в `src/components/charts`

## Запуск

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production-сборка
npm run lint
```

Нужен Node.js 20+.

## Структура

```
src/
  app/                 страницы (главная, /scan, /diagnostics, /support, /pricing, /agencies,
                       /culture-index, /methodology, /example, /dashboard, /ai, /research,
                       /about, /security, /faq, /request, /docs/[slug])
  components/
    ui/                компоненты shadcn/ui
    site/              шапка, подвал, секции, статусы обещаний, подсветка условных текстов
    charts/            обёртка ECharts, тема бренда, графики
  content/             тексты и данные: навигация и контакты, FAQ, демо-данные «Банк N», исследования
docs/content/          тексты старого сайта и юридические документы (источник для /docs)
```

## Тема

Цвета бренда — CSS-переменные в `src/app/globals.css` (палитра старого сайта `#A847B8`, `#1E101E` и т. д.).
Те же цвета продублированы для графиков в `src/components/charts/theme.ts`:
сиреневый — внешний бренд, бирюзовый — внутренний.

## Условные тексты

Всё, что нужно заменить реальными данными (цены, имена, реквизиты, данные исследований), обёрнуто в `<Ph>` и
подсвечивается жёлтым. Подсветку можно выключить переключателем в подвале. Найти все места: `grep -rn "<Ph>" src`.

Форма заявки (`/request`) пока никуда не отправляет данные — нужно подключить API, Telegram-бот или CRM.

## Материалы

- [`docs/content/site-texts.md`](docs/content/site-texts.md) — все тексты публичных страниц старого сайта
- [`docs/content/legal/`](docs/content/legal) — юридические документы
