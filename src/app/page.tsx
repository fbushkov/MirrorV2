import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, FileLock2, EyeOff, Globe, Users, LineChart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow, Section, SectionHeader } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { Ph } from "@/components/site/ph"
import { MirrorCard } from "@/components/home/mirror-card"
import { CrossChecks } from "@/components/metrics/cross-checks"
import { ThreeMetrics } from "@/components/home/three-metrics"
import { Directions } from "@/components/home/directions"
import { DIRECTION_NAMES } from "@/content/site"
import { StartForm } from "@/components/start/start-form"
import { FAQ_HOME } from "@/content/faq"
import { GROUPS, PULSE_METRICS, type MetricGroup } from "@/content/pulse"
import { LevelIcon } from "@/components/pulse/parts"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Gap />
      <Section id="directions" className="bg-card">
        <SectionHeader
          eyebrow="Два направления"
          title="Снаружи и изнутри — два разных зеркала"
          description="Можно начать с любого. Внешняя оценка показывает, что видят кандидаты и рынок. Внутренний дашборд — что переживают сотрудники."
        />
        <Directions />
      </Section>
      <BrandSection />
      <HealthSection />
      <Section id="together" className="bg-card">
        <SectionHeader
          eyebrow="Вместе"
          title="Когда оба зеркала рядом"
          description="Показатели направлений не смешиваем. Но если подключены оба, сверяем общие темы: что подтверждается с двух сторон, а что пока видно только изнутри."
        />
        <CrossChecks />
        <p className="mt-3 text-xs text-muted-foreground">Пример на условных данных «Банка N»</p>
      </Section>
      <Journey />
      <Situations />
      <DataSafety />
      <PricingTeaser />
      <Section>
        <FaqSection
          items={FAQ_HOME}
          note={
            <>
              Не нашли ответ? Напишите нам —{" "}
              <Link href="/about#contacts" className="text-primary underline underline-offset-4">
                контакты
              </Link>
              .
            </>
          }
        />
      </Section>
      <Start />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col items-start gap-6">
          <Eyebrow>Первый срез — бесплатно</Eyebrow>
          <h1 className="text-4xl font-semibold sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            Совпадают ли ваши обещания с тем, что <span className="text-gradient">видят люди?</span>
          </h1>
          <p className="max-w-lg text-lg text-pretty text-muted-foreground">
            Mirror сверяет то, что компания обещает сотрудникам и кандидатам, с отзывами, соцсетями, ответами нейросетей
            и опытом самих сотрудников.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="glow" size="xl">
              <Link href="/start">
                Получить бесплатный срез
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="xl">
              <Link href="#directions">Два направления</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">3 рабочих дня · без доступа к вашим системам</p>
        </div>
        <MirrorCard />
      </div>
    </section>
  )
}

function Gap() {
  const chain = [
    { icon: Layers, title: "Вы обещаете", text: "в вакансиях, на карьерном сайте, в соцсетях" },
    { icon: Users, title: "Люди проверяют", text: "по отзывам, постам знакомых и ответам нейросетей" },
    { icon: LineChart, title: "Доверие растёт или падает", text: "и это видно раньше, чем вы успеете ответить" },
  ]
  return (
    <Section>
      <SectionHeader
        eyebrow="Разрыв"
        title="Образ работодателя складывается без вас"
        description="Люди верят тому, что пишут другие люди. Если обещание не подтверждается, перестают верить и остальному."
      />
      <ol className="grid gap-3 md:grid-cols-3">
        {chain.map((c, i) => (
          <li key={c.title} className="surface relative flex flex-col gap-3 p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <c.icon className="size-5" />
            </span>
            <p className="text-lg font-semibold">{c.title}</p>
            <p className="text-muted-foreground">{c.text}</p>
            {i < chain.length - 1 && (
              <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-6 -translate-y-1/2 rounded-full border border-border bg-card p-1 text-muted-foreground md:block" />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="surface flex items-center gap-5 p-6">
          <p className="text-gradient text-4xl font-semibold whitespace-nowrap">60–80%</p>
          <p className="text-muted-foreground">соискателей читают отзывы о работодателе, прежде чем откликнуться</p>
        </div>
        <div className="surface flex items-center gap-5 p-6">
          <p className="text-gradient text-4xl font-semibold whitespace-nowrap">~60%</p>
          <p className="text-muted-foreground">людей готовы отказаться от компании, если её ценности расходятся с делами</p>
        </div>
      </div>
    </Section>
  )
}

function BrandSection() {
  return (
    <Section id="hr-brand">
      <SectionHeader
        eyebrow="Направление 1 · Снаружи"
        title={DIRECTION_NAMES.brand}
        description="Три вопроса, на которые отвечает отчёт: честность, слепые зоны и место на рынке. У каждого показателя своя точка отсчёта, поэтому мы не смешиваем их в одну цифру."
      />
      <ThreeMetrics />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="soft" size="xl">
          <Link href="/hr-brand">
            Подробнее о направлении <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="xl">
          <Link href="/hr-brand/demo">Демо-отчёт</Link>
        </Button>
      </div>
    </Section>
  )
}

function HealthSection() {
  return (
    <Section id="culture-health" className="bg-health-50/50">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow tone="health">Направление 2 · Изнутри</Eyebrow>
          <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">{DIRECTION_NAMES.health}</h2>
          <p className="text-muted-foreground md:text-lg">
            Как в компании живут и работают на самом деле. 10 метрик переживаемой культуры и разрыв с вашим культурным
            кодом — на одном дашборде для команды культуры, руководителей и топ-менеджмента.
          </p>
          <ul className="flex flex-wrap gap-2 text-sm">
            {["не слежка", "не оценка людей", "группы от 5 человек"].map((x) => (
              <li key={x} className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground">
                {x}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="xl" className="bg-health-500 text-white hover:bg-health-700">
              <Link href="/culture-health">
                Подробнее о направлении <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="xl">
              <Link href="/culture-health/demo">Демо-дашборд</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(GROUPS) as MetricGroup[]).map((g) => (
            <div key={g} className="surface flex flex-col gap-3 p-4">
              <p className="text-xs font-medium text-muted-foreground">{GROUPS[g]}</p>
              <ul className="flex flex-col gap-2">
                {PULSE_METRICS.filter((m) => m.group === g).map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2 text-sm">
                    <span>{m.name}</span>
                    <LevelIcon score={m.score} className="shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-xs text-muted-foreground sm:col-span-3">Пример на демо-данных: балл и зона метрики — в норме, внимание или риск.</p>
        </div>
      </div>
    </Section>
  )
}

const STEPS = [
  {
    title: "Внешний срез",
    dir: "brand",
    meta: "Бесплатно · 3 рабочих дня",
    free: true,
    we: "Собираем обещания из вакансий и соцсетей, проверяем их по отзывам, медиа и ответам нейросетей. Сравниваем с 2–3 конкурентами.",
    you: "Название компании и ссылка на hh.ru.",
    result: "Внешний индекс, карта обещаний, три первых шага.",
    link: { href: "/hr-brand/demo", label: "Демо-отчёт" },
  },
  {
    title: "Разбор с экспертом",
    dir: "brand",
    meta: "Бесплатно · 30 минут",
    free: true,
    we: "Объясняем цифры и отвечаем на вопросы. Вместе решаем, нужна ли проверка изнутри.",
    you: "30 минут на звонок.",
    result: "Понятно, что делать дальше.",
  },
  {
    title: "Диагностика",
    dir: "health",
    meta: "С экспертом · около 4 недель",
    we: "Описываем культурный код и делаем первый замер: опросы, анонимная обратная связь, интервью.",
    you: "Культурный код или документы о ценностях. Письмо сотрудникам — шаблон даём.",
    result: "10 метрик, разрыв с кодом, план на 90 дней.",
  },
  {
    title: "Дашборд здоровья культуры",
    dir: "health",
    meta: "Кампания на 3 месяца",
    we: "Три волны замеров, дашборд для команды культуры, руководителей и топов. Эксперт помогает с решениями.",
    you: "Встреча с руководителями раз в 2 недели.",
    result: "Динамика метрик и страница «Решения по обратной связи» для сотрудников.",
    link: { href: "/culture-health", label: "О направлении" },
  },
]

function Journey() {
  return (
    <Section id="how" className="bg-card">
      <SectionHeader eyebrow="Как это работает" title="От бесплатного среза до изменений" description="Первые два шага — внешняя оценка, они ничего не стоят. Взгляд изнутри — только если увидите в этом смысл." />
      <ol className="mx-auto flex max-w-4xl flex-col gap-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className={cn("surface grid gap-5 p-6 md:grid-cols-[220px_1fr] md:p-7", s.free && i === 0 && "border-brand-200 bg-brand-50/60")}>
            <div className="flex flex-col items-start gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground tabular-nums">
                Шаг {i + 1}
                <span className={cn("size-1.5 rounded-full", s.dir === "brand" ? "bg-brand-500" : "bg-health-500")} aria-hidden />
                <span className="text-xs font-normal">{s.dir === "brand" ? "снаружи" : "изнутри"}</span>
              </span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", s.free ? "bg-status-ok/10 text-status-ok" : "bg-secondary text-secondary-foreground")}>
                {s.meta}
              </span>
            </div>
            <dl className="grid gap-4 text-[15px] sm:grid-cols-3">
              <div>
                <dt className="mb-1 text-xs text-muted-foreground">Что делаем</dt>
                <dd>{s.we}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted-foreground">Что нужно от вас</dt>
                <dd>{s.you}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs text-muted-foreground">Результат</dt>
                <dd>
                  {s.result}
                  {s.link && (
                    <Link href={s.link.href} className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      {s.link.label} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Situations() {
  const items = [
    ["Обновляете EVP или карьерный сайт", "Проверьте, какие обещания выдержат отзывы, до того как их публиковать."],
    ["Опросы и отзывы показывают разное", "Поймёте, где правда и почему картины не совпадают."],
    ["Руководству нужны цифры", "Индекс и карта обещаний вместо пересказа отзывов."],
    ["Компания меняется", "Слияние, новый собственник, быстрый рост. Увидите, какие обещания перестали работать."],
  ]
  return (
    <Section>
      <SectionHeader eyebrow="Когда приходят к нам" title="Узнаёте свою ситуацию?" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([t, d]) => (
          <li key={t} className="surface flex flex-col gap-2 p-6">
            <p className="font-semibold">{t}</p>
            <p className="text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function DataSafety() {
  const items = [
    { icon: Globe, t: "Для среза — только открытые данные", d: "Доступ к вашим системам не нужен. Имена авторов отзывов в отчёт не попадают." },
    { icon: FileLock2, t: "Документы — под NDA", d: "Вы сами выбираете, что передать. Доступ только у эксперта проекта." },
    { icon: EyeOff, t: "Мы смотрим на группы, а не на людей", d: <>Показываем группы от 5 человек, авторов не ищем, цитаты обезличены. Серверы в России <Ph>[провайдер]</Ph>.</> },
  ]
  return (
    <Section className="pt-0 md:pt-0">
      <div className="surface grid gap-8 p-6 md:grid-cols-3 md:p-10">
        {items.map((x) => (
          <div key={x.t} className="flex flex-col gap-3">
            <x.icon className="size-6 text-chart-2" />
            <p className="font-semibold">{x.t}</p>
            <p className="text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function PricingTeaser() {
  const groups = [
    {
      id: "brand",
      name: DIRECTION_NAMES.brand,
      plans: [
        { t: "Внешний срез", p: "0 ₽", d: "Индекс, слепые зоны, место в отрасли и разбор с экспертом.", fixed: true },
        { t: "Мониторинг", p: "от 30 000 ₽ в месяц", d: "Ежемесячное обновление индекса и конкурентов." },
      ],
    },
    {
      id: "health",
      name: DIRECTION_NAMES.health,
      plans: [
        { t: "Диагностика", p: "от 180 000 ₽", d: "Культурный код и первый замер 10 метрик." },
        { t: "Кампания на 3 месяца", p: "от 490 000 ₽", d: "Три волны замеров, дашборд, эксперт.", fixed: true },
      ],
    },
  ]
  return (
    <Section className="bg-card">
      <SectionHeader eyebrow="Цены" title="Начните бесплатно. Платите, когда нужна глубина" />
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((g) => (
          <div key={g.id} className={cn("flex flex-col gap-3 rounded-3xl border p-4 md:p-5", g.id === "brand" ? "border-brand-100 bg-brand-50/50" : "border-health-100 bg-health-50/60")}>
            <p className="flex items-center gap-2 px-1 text-sm font-medium">
              <span className={cn("size-1.5 rounded-full", g.id === "brand" ? "bg-brand-500" : "bg-health-500")} aria-hidden />
              {g.name}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.plans.map((x) => (
                <div key={x.t} className="flex flex-col gap-2 rounded-[1.25rem] border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">{x.t}</p>
                  <p className="text-xl font-semibold">{x.fixed ? x.p : <Ph>{x.p}</Ph>}</p>
                  <p className="text-sm text-muted-foreground">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Все условия <ArrowRight className="size-4" />
        </Link>
      </div>
    </Section>
  )
}

function Start() {
  return (
    <Section id="start">
      <div className="grid gap-10 rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-card to-card p-6 md:p-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow>Начать</Eyebrow>
          <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">Начните с бесплатного среза</h2>
          <p className="text-muted-foreground md:text-lg">Оставьте компанию и контакт. Остальное уточним сами.</p>
          <ol className="mt-2 flex flex-col gap-3 text-[15px]">
            {["Ответим в течение рабочего дня", "Уточним конкурентов для сравнения", "Через 3 рабочих дня пришлём срез и созвонимся"].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-primary shadow-sm">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>
        <div className="surface p-5 md:p-7">
          <Suspense>
            <StartForm variant="compact" />
          </Suspense>
        </div>
      </div>
    </Section>
  )
}
