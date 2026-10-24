export const CONTACTS = {
  email: "mirrorcom@mail.ru",
  phone: "+7 912 702-30-30",
  phoneHref: "tel:+79127023030",
  phoneNote: "Макс, Телеграм",
  telegram: "https://t.me/mirror_diary",
  telegramLabel: "@mirror_diary",
}

export type NavLink = { title: string; href: string }

export const NAV: NavLink[] = [
  { title: "Как это работает", href: "/#how" },
  { title: "Индекс культуры", href: "/culture-index" },
  { title: "Пример отчёта", href: "/example" },
  { title: "Цены", href: "/pricing" },
  { title: "О нас", href: "/about" },
]

export const FOOTER_COLUMNS: { title: string; items: NavLink[] }[] = [
  {
    title: "Сервис",
    items: [
      { title: "Как это работает", href: "/#how" },
      { title: "Индекс культуры", href: "/culture-index" },
      { title: "Пример отчёта", href: "/example" },
      { title: "Цены", href: "/pricing" },
    ],
  },
  {
    title: "Компания",
    items: [
      { title: "О нас", href: "/about" },
      { title: "Заявка на срез", href: "/start" },
    ],
  },
]

export const LEGAL_LINKS: NavLink[] = [
  { title: "Политика конфиденциальности", href: "/docs/privacy-policy" },
  { title: "Пользовательское соглашение", href: "/docs/terms-of-use" },
  { title: "Согласие на обработку данных", href: "/docs/data-processing-consent" },
]
