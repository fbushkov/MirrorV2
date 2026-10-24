export type Article = {
  slug: string
  tag: string
  title: string
  excerpt: string
  readTime?: string
  href?: string
  ready?: boolean
}

export const ARTICLES: Article[] = [
  {
    slug: "ai-retail",
    tag: "Ритейл",
    readTime: "8 минут",
    title: "Что нейросети рассказывают о крупнейших ритейлерах как о работодателях",
    excerpt: "Задали Алисе, GigaChat и ChatGPT одни и те же вопросы о 10 сетях и нашли, откуда ассистенты берут устаревший негатив.",
    ready: true,
  },
  {
    slug: "external-vs-internal",
    tag: "Бренд работодателя",
    title: "Внешний и внутренний бренд: где репутация расходится с опытом сотрудников",
    excerpt: "Пять тем, в которых разрыв встречается чаще всего.",
  },
  {
    slug: "promises",
    tag: "Коммуникации",
    title: "10 обещаний, которые чаще всего опровергают отзывы",
    excerpt: "И как их переписать.",
  },
  {
    slug: "banks",
    tag: "Банки",
    title: "Индекс культуры региональных банков",
    excerpt: "Какие обещания подтверждаются чаще, чем у федеральных.",
  },
  {
    slug: "tomorrow",
    tag: "Практика",
    title: "Что можно начать делать уже завтра",
    excerpt: "Внешний обзор, стоп-сигнал для обещаний, мониторинг.",
    href: "/culture-index",
    ready: true,
  },
]
