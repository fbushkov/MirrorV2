export const CONTACTS = {
  email: "mirrorcom@mail.ru",
  phone: "+7 912 702-30-30",
  phoneHref: "tel:+79127023030",
  phoneNote: "Макс, Телеграм",
  telegram: "https://t.me/mirror_diary",
  telegramLabel: "@mirror_diary",
}

export type NavLink = { title: string; href: string; note?: string }

/** Два направления Mirror. Снаружи — фиолетовый, изнутри — бирюзовый. */
export const DIRECTION_NAMES = {
  brand: "Оценка HR-бренда и индекс культуры",
  health: "Дашборд здоровья корпоративной культуры",
} as const

export type NavGroup = { id: keyof typeof DIRECTION_NAMES; title: string; full: string; items: NavLink[] }

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "brand",
    title: "HR-бренд и индекс",
    full: DIRECTION_NAMES.brand,
    items: [
      { title: "Обзор направления", href: "/hr-brand", note: "Что видят кандидаты и рынок" },
      { title: "Демо-отчёт", href: "/hr-brand/demo", note: "Индекс, слепые зоны, место в отрасли" },
      { title: "Как считаем", href: "/methodology#brand-method", note: "Методика внешней оценки" },
    ],
  },
  {
    id: "health",
    title: "Здоровье культуры",
    full: DIRECTION_NAMES.health,
    items: [
      { title: "Обзор направления", href: "/culture-health", note: "Что переживают сотрудники" },
      { title: "Демо-дашборд", href: "/culture-health/demo", note: "10 метрик, срезы, сигналы" },
      { title: "Как считаем", href: "/methodology#health-method", note: "Методика внутреннего замера" },
    ],
  },
]

export const NAV: NavLink[] = [
  { title: "Цены", href: "/pricing" },
  { title: "О нас", href: "/about" },
]

export const FOOTER_COLUMNS: { title: string; items: NavLink[] }[] = [
  { title: DIRECTION_NAMES.brand, items: NAV_GROUPS[0].items },
  { title: DIRECTION_NAMES.health, items: NAV_GROUPS[1].items },
  {
    title: "Компания",
    items: [
      { title: "Методика", href: "/methodology" },
      { title: "Цены", href: "/pricing" },
      { title: "О нас", href: "/about" },
      { title: "Заявка", href: "/start" },
    ],
  },
]

export const LEGAL_LINKS: NavLink[] = [
  { title: "Политика конфиденциальности", href: "/docs/privacy-policy" },
  { title: "Пользовательское соглашение", href: "/docs/terms-of-use" },
  { title: "Согласие на обработку данных", href: "/docs/data-processing-consent" },
]
