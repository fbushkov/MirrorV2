# Прототипы Mirror V2

Статичные HTML-прототипы по макету Figma «Elements» (fileKey `wSWcfUravCxcymezdlNoko`).
Это **эталон для переноса в Next.js**, а не код сайта: в сборку и линтер не входят.

## `home/` — главная, «О нас», «Цены»

```bash
cd prototype/home
python3 build.py        # pages/*.html → dist/*.html (самодостаточные файлы)
node qa.js              # Playwright: ошибки консоли, горизонтальная прокрутка, скриншоты в shots/
```

Открыть без сборки: `dist/index.html`, `dist/pricing.html`. Черновики остальных страниц в git не хранятся (`prototype/home/.gitignore`).
Общие блоки: `partials/pricing-plans.html` (тарифы), `src/content.js` (вопросы — страница выбирает группы через `data-groups`). Правила и токены: `design-system.html`.

| Прототип | Next.js |
|---|---|
| `partials/layout.html` | `src/app/layout.tsx` |
| `partials/header.html`, `footer.html` | `src/components/site/header.tsx`, `footer.tsx` |
| `ROUTES` в `build.py` | `ROUTES` / `NAV` в `src/content/site.ts` |
| `src/styles.css` | `src/app/globals.css` + варианты `src/components/ui` |
| `src/app.js` | клиентские компоненты (меню, форма, шейдер) + `src/lib/typograf.ts` |
| `pages/*.html` | `src/app/**/page.tsx` |

Правки прототипа — только в `src/`, `partials/`, `pages/`; `dist/` пересобирается `build.py` и коммитится вместе с исходниками.
