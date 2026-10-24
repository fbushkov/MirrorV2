export const CONTACTS = {
  email: "mirrorcom@mail.ru",
  phone: "+7 912 702-30-30",
  phoneHref: "tel:+79127023030",
  phoneNote: "Макс, Телеграм",
  telegram: "https://t.me/mirror_diary",
  telegramLabel: "@mirror_diary",
}

export type NavLink = { title: string; href: string; description?: string }
export type NavGroup = { title: string; items: NavLink[] }

export const NAV: (NavLink | NavGroup)[] = [
  {
    title: "Услуги",
    items: [
      { title: "Бесплатный срез", href: "/scan", description: "Внешний бренд работодателя за 3 рабочих дня" },
      { title: "Диагностика", href: "/diagnostics", description: "Внешний и внутренний бренд вместе с экспертом" },
      { title: "Сопровождение и мониторинг", href: "/support", description: "Изменения и регулярный замер индекса" },
      { title: "Агентствам", href: "/agencies", description: "Внешний аудит HR-бренда под вашим брендом" },
      { title: "Цены", href: "/pricing", description: "Все форматы работы и их стоимость" },
    ],
  },
  {
    title: "Индекс культуры",
    items: [
      { title: "Индекс культуры", href: "/culture-index", description: "Метрика доверия к бренду работодателя" },
      { title: "Методика", href: "/methodology", description: "Открытая формула и пример расчёта" },
      { title: "Пример среза", href: "/example", description: "Как выглядит бесплатный отчёт" },
      { title: "Пример дашборда", href: "/dashboard", description: "Просадки и подъёмы бренда на графиках" },
    ],
  },
  { title: "Нейросети о вас", href: "/ai" },
  { title: "Исследования", href: "/research" },
  { title: "О нас", href: "/about" },
  { title: "FAQ", href: "/faq" },
]

export const FOOTER_COLUMNS: NavGroup[] = [
  {
    title: "Услуги",
    items: [
      { title: "Бесплатный срез", href: "/scan" },
      { title: "Диагностика", href: "/diagnostics" },
      { title: "Сопровождение и мониторинг", href: "/support" },
      { title: "Агентствам", href: "/agencies" },
      { title: "Цены", href: "/pricing" },
    ],
  },
  {
    title: "Индекс",
    items: [
      { title: "Индекс культуры", href: "/culture-index" },
      { title: "Методика", href: "/methodology" },
      { title: "Пример среза", href: "/example" },
      { title: "Пример дашборда", href: "/dashboard" },
      { title: "Нейросети о вас", href: "/ai" },
    ],
  },
  {
    title: "Компания",
    items: [
      { title: "О нас", href: "/about" },
      { title: "Исследования", href: "/research" },
      { title: "Вопрос-ответ", href: "/faq" },
      { title: "Данные и 152-ФЗ", href: "/security" },
    ],
  },
]

export const LEGAL_LINKS: NavLink[] = [
  { title: "Политика конфиденциальности", href: "/docs/privacy-policy" },
  { title: "Пользовательское соглашение", href: "/docs/terms-of-use" },
  { title: "Согласие на обработку персональных данных", href: "/docs/data-processing-consent" },
]

export const SOURCES_EXTERNAL = ["hh.ru", "Dreamjob", "VK", "Дзен", "Яндекс", "Алиса", "GigaChat"]
export const SOURCES_INTERNAL = ["Документы компании", "Опросы сотрудников", "Анонимные интервью"]
