import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, FileLock2, EyeOff, Globe, Users, LineChart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow, Section, SectionHeader } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { Ph } from "@/components/site/ph"
import { IndexGauge } from "@/components/charts/brand-charts"
import { MirrorCard } from "@/components/home/mirror-card"
import { TwoSides } from "@/components/home/two-sides"
import { StartForm } from "@/components/start/start-form"
import { FAQ_HOME } from "@/content/faq"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Gap />
      <Section id="sides" className="bg-card">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>Две стороны бренда</Eyebrow>
            <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">Снаружи и изнутри — два разных зеркала</h2>
            <p className="text-muted-foreground md:text-lg">
              Опрос показывает, что думают сотрудники. Отзывы — что видят кандидаты. Mirror ставит обе картины рядом и
              проверяет одни и те же обещания с двух сторон.
            </p>
            <p className="text-muted-foreground">Переключите вид, чтобы увидеть разницу.</p>
          </div>
          <TwoSides />
        </div>
      </Section>
      <IndexBlock />
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
              <Link href="#how">Как это работает</Link>
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

function IndexBlock() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="surface-raised flex flex-col items-center gap-2 p-8 lg:order-2">
          <IndexGauge value={65} label="индекс культуры" className="h-56 w-full max-w-xs" />
          <p className="text-sm text-muted-foreground">Подтверждено 5 из 8 обещаний · пример</p>
        </div>
        <div className="flex flex-col items-start gap-5">
          <Eyebrow>Индекс культуры</Eyebrow>
          <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">Одна цифра, с которой трудно спорить</h2>
          <p className="text-muted-foreground md:text-lg">
            Индекс показывает, какая доля ваших обещаний подтверждается опытом людей. От 0 до 100, отдельно снаружи и
            изнутри.
          </p>
          <ol className="flex flex-col gap-3">
            {[
              ["Берём ваши слова", "Обещания из вакансий и коммуникаций. Чем чаще обещаете, тем больше вес."],
              ["Проверяем опытом людей", "Каждое обещание — по отзывам, упоминаниям, интервью."],
              ["Сводим в индекс", "И показываем, какие обещания тянут его вниз."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <p>
                  <span className="font-medium">{t}.</span> <span className="text-muted-foreground">{d}</span>
                </p>
              </li>
            ))}
          </ol>
          <Link href="/culture-index" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Как мы считаем <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  )
}

const STEPS = [
  {
    title: "Внешний срез",
    meta: "Бесплатно · 3 рабочих дня",
    free: true,
    we: "Собираем обещания из вакансий и соцсетей, проверяем их по отзывам, медиа и ответам нейросетей. Сравниваем с 2–3 конкурентами.",
    you: "Название компании и ссылка на hh.ru.",
    result: "Внешний индекс, карта обещаний, три первых шага.",
    link: { href: "/example", label: "Пример отчёта" },
  },
  {
    title: "Разбор с экспертом",
    meta: "Бесплатно · 30 минут",
    free: true,
    we: "Объясняем цифры и отвечаем на вопросы. Вместе решаем, нужна ли проверка изнутри.",
    you: "30 минут на звонок.",
    result: "Понятно, что делать дальше.",
  },
  {
    title: "Диагностика",
    meta: "С экспертом · около 4 недель",
    we: "Проверяем те же обещания изнутри: документы, данные компании, анонимные интервью.",
    you: "Документы по списку и письмо сотрудникам. Шаблон даём.",
    result: "Внутренний индекс, карта разрывов, план на 90 дней.",
  },
  {
    title: "Изменения и мониторинг",
    meta: "По подписке",
    we: "Эксперт помогает внести изменения. Раз в квартал повторяем замер и сообщаем о просадках.",
    you: "Встреча раз в две недели.",
    result: "Индекс в динамике: видно, что сработало.",
  },
]

function Journey() {
  return (
    <Section id="how" className="bg-card">
      <SectionHeader eyebrow="Как это работает" title="От бесплатного среза до изменений" description="Первые два шага ничего не стоят. Дальше — только если увидите в этом смысл." />
      <ol className="mx-auto flex max-w-4xl flex-col gap-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className={cn("surface grid gap-5 p-6 md:grid-cols-[220px_1fr] md:p-7", s.free && i === 0 && "border-brand-200 bg-brand-50/60")}>
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm font-medium text-muted-foreground tabular-nums">Шаг {i + 1}</span>
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
    { icon: EyeOff, t: "Сотрудники анонимны", d: <>Компания видит темы и обезличенные цитаты. Данные хранятся на серверах в России <Ph>[провайдер]</Ph>.</> },
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
  const plans = [
    { t: "Срез", p: "0 ₽", d: "Внешняя картина и разбор с экспертом.", free: true },
    { t: "Диагностика", p: "от 180 000 ₽", d: "Снаружи и изнутри, план на 90 дней.", hl: true },
    { t: "Сопровождение", p: "от 120 000 ₽ / мес", d: "Изменения и замер раз в квартал." },
  ]
  return (
    <Section className="bg-card">
      <SectionHeader eyebrow="Цены" title="Начните бесплатно. Платите, когда нужна глубина" />
      <div className="grid gap-3 md:grid-cols-3">
        {plans.map((x) => (
          <div
            key={x.t}
            className={cn(
              "flex flex-col gap-2 rounded-[1.25rem] border p-6",
              x.hl ? "border-transparent bg-primary text-primary-foreground shadow-[0_20px_40px_-20px_rgb(168_71_184/0.7)]" : "border-border bg-background",
            )}
          >
            <p className={cn("text-sm", x.hl ? "text-white/80" : "text-muted-foreground")}>{x.t}</p>
            <p className="text-2xl font-semibold">{x.free ? x.p : <Ph>{x.p}</Ph>}</p>
            <p className={cn("text-sm", x.hl ? "text-white/85" : "text-muted-foreground")}>{x.d}</p>
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
