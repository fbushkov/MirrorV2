export type NavLink = { title: string; href: string; note?: string }

/** Два направления Mirror. Снаружи — фиолетовый, изнутри — бирюзовый. */
export const DIRECTION_NAMES = {
  brand: "Оценка HR-бренда и индекс культуры",
  health: "Дашборд здоровья корпоративной культуры",
} as const

export const LEGAL_LINKS: NavLink[] = [
  { title: "Политика конфиденциальности", href: "/docs/privacy-policy" },
  { title: "Пользовательское соглашение", href: "/docs/terms-of-use" },
  { title: "Согласие на обработку данных", href: "/docs/data-processing-consent" },
]

/**
 * Карта публичных страниц — единый источник для sitemap и смоук-тестов. Меню, подвал и контакты — в разметке прототипа (prototype/home/partials).
 * Новая страница сайта = запись здесь. Кабинет (/app) и админка (/admin) сюда не входят. См. ADR-0001.
 */
export const SITE_URL = "https://mirror-com.ru"

export type Route = { path: string; title: string; parent?: string }

export const ROUTES: Route[] = [
  { path: "/", title: "Главная" },
  { path: "/hr-brand", title: DIRECTION_NAMES.brand, parent: "/" },
  { path: "/hr-brand/demo", title: "Демо-отчёт", parent: "/hr-brand" },
  { path: "/hr-brand/methodology", title: "Как считаем индекс культуры", parent: "/hr-brand" },
  { path: "/culture-health", title: DIRECTION_NAMES.health, parent: "/" },
  { path: "/culture-health/demo", title: "Демо-дашборд", parent: "/culture-health" },
  { path: "/culture-health/methodology", title: "Как считаем переживаемую культуру", parent: "/culture-health" },
  { path: "/pricing", title: "Цены", parent: "/" },
  { path: "/start", title: "Заявка", parent: "/" },
  ...LEGAL_LINKS.map((l) => ({ path: l.href, title: l.title, parent: "/" })),
]
