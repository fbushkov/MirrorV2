import { DIRECTION_NAMES } from "./site"

export type Direction = {
  id: "brand" | "health"
  side: string
  name: string
  question: string
  text: string
  bullets: { t: string; d: string }[]
  sources: string
  meta: string
  overview: string
  demo: string
  demoLabel: string
}

/** Два направления Mirror: внешнее (HR-бренд) и внутреннее (здоровье культуры) */
export const DIRECTIONS: Direction[] = [
  {
    id: "brand",
    side: "Снаружи",
    name: DIRECTION_NAMES.brand,
    question: "Что видят кандидаты и рынок? Верят ли они вашим обещаниям?",
    text: "Сверяем обещания из вакансий и коммуникаций с тем, что о вас пишут люди.",
    bullets: [
      { t: "Индекс культуры", d: "сколько ваших обещаний подтверждается" },
      { t: "Слепые зоны", d: "о чём говорят люди, а вы молчите" },
      { t: "Место в отрасли", d: "где вы среди похожих компаний" },
    ],
    sources: "Отзывы, соцсети, медиа, ответы нейросетей",
    meta: "Первый срез бесплатно · 3 рабочих дня",
    overview: "/hr-brand",
    demo: "/hr-brand/demo",
    demoLabel: "Демо-отчёт",
  },
  {
    id: "health",
    side: "Изнутри",
    name: DIRECTION_NAMES.health,
    question: "Как сотрудники переживают культуру? Где она расходится с заявленной?",
    text: "Измеряем культуру по опыту людей и сравниваем с вашим культурным кодом.",
    bullets: [
      { t: "Индекс переживаемой культуры", d: "одна цифра по 10 метрикам" },
      { t: "Разрыв с культурным кодом", d: "какие нормы живут, а какие нет" },
      { t: "Сигналы и срезы", d: "по подразделениям и этапам, группы от 5 человек" },
    ],
    sources: "Опросы, анонимная обратная связь, интервью",
    meta: "Диагностика и кампания на 3 месяца",
    overview: "/culture-health",
    demo: "/culture-health/demo",
    demoLabel: "Демо-дашборд",
  },
]
