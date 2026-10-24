import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  FileLock2,
  FileText,
  Globe,
  Landmark,
  Layers,
  ListChecks,
  Megaphone,
  MessageSquareText,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
  Users,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeader, Eyebrow } from "@/components/site/section"
import { StatusPill } from "@/components/site/status"
import { FaqList } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"
import { BrandDynamicsChart, TopicGapChart } from "@/components/charts/brand-charts"
import { HowItWorks } from "@/components/home/how-it-works"
import { FAQ_GENERAL } from "@/content/faq"
import { CONTACTS, SOURCES_EXTERNAL, SOURCES_INTERNAL } from "@/content/site"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Sources />
      <Problems />
      <TwoSides />
      <Section id="how">
        <SectionHeader
          eyebrow="Как устроен Mirror"
          title="От бесплатного среза до изменений, которые видно в цифрах"
          description="Первый шаг — внешний срез через сервис Mirror, бесплатно. Дальше, если нужно, подключается эксперт и внутренняя проверка."
        />
        <HowItWorks />
      </Section>
      <ReportContents />
      <Stats />
      <Audience />
      <IndexTeaser />
      <PricingTeaser />
      <Security />
      <Section>
        <SectionHeader eyebrow="Вопрос-ответ" title="Что обычно спрашивают" description="по вашим возможным вопросам" />
        <div className="mx-auto max-w-3xl">
          <FaqList items={FAQ_GENERAL.slice(0, 7)} />
          <div className="mt-6 text-center">
            <Button asChild variant="ghost">
              <Link href="/faq">
                Все вопросы <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-40 md:pb-24">
      <div className="glow-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <Eyebrow>Новое: внешний и внутренний бренд в одном отчёте</Eyebrow>
          <p className="-mb-2 text-sm font-medium tracking-wide text-brand-200">mirror — зеркало вашей корпоративной культуры</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.07]">
            Диагностика <span className="text-gradient">HR-бренда</span> и независимый индекс культуры компании
          </h1>
          <p className="max-w-xl text-lg text-pretty text-brand-50/80">
            Mirror сравнивает внешний и внутренний бренд работодателя: что вы обещаете, что о вас пишут на hh.ru,
            Dreamjob, VK и в медиа и что говорят сами сотрудники. Показываем на графиках, где бренд проседает, а где
            растёт, — и помогаем закрыть разрывы.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="glow" size="xl">
              <Link href="/request?type=scan">
                Получить бесплатный срез
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-xl">
              <Link href="/dashboard">Посмотреть пример дашборда</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Внешний срез бесплатно · 3 рабочих дня · без доступа к вашим системам
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-accent/20 blur-3xl" />
          <div className="glass rounded-3xl p-5 shadow-2xl shadow-black/40 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Индекс культуры · Банк N</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold">65</span>
                  <span className="text-muted-foreground">/ 100</span>
                  <span className="ml-1 rounded-full bg-status-ok/15 px-2 py-0.5 text-xs text-status-ok">+7 за полгода</span>
                </div>
              </div>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">пример</span>
            </div>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-1" /> Внешний бренд
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-2" /> Внутренний бренд
              </span>
            </div>
            <BrandDynamicsChart compact className="mt-2 h-44" />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.04] p-3">
                <p className="text-xs text-muted-foreground">Подтверждено</p>
                <p className="mt-0.5 text-lg font-semibold">5 из 8 обещаний</p>
              </div>
              <div className="rounded-2xl bg-white/[0.04] p-3">
                <p className="text-xs text-muted-foreground">Главный разрыв</p>
                <p className="mt-0.5 text-lg font-semibold">
                  Карьерный рост <span className="text-status-bad">−22</span>
                </p>
              </div>
            </div>
          </div>
          <div className="glass absolute -top-12 -left-4 hidden max-w-[260px] rounded-2xl p-4 shadow-xl shadow-black/40 sm:block md:-left-10">
            <p className="text-[11px] text-muted-foreground">Отзыв · Dreamjob</p>
            <p className="mt-1 text-sm">«Коллектив отличный, но зарплата ниже рынка»</p>
            <StatusPill status="bad" className="mt-2" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Sources() {
  return (
    <section className="border-y border-border bg-white/[0.015] py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 md:px-6">
        <p className="text-center text-sm text-muted-foreground">
          Собираем и сверяем данные снаружи и изнутри компании
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {SOURCES_EXTERNAL.map((s) => (
            <span key={s} className="rounded-full border border-chart-1/25 bg-chart-1/[0.06] px-4 py-1.5 text-sm text-brand-50">
              {s}
            </span>
          ))}
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
          {SOURCES_INTERNAL.map((s) => (
            <span key={s} className="rounded-full border border-chart-2/25 bg-chart-2/[0.06] px-4 py-1.5 text-sm text-brand-50">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

const PROBLEMS = [
  {
    icon: Globe,
    title: "Репутация формируется снаружи",
    text: "Сегодня на ваш образ влияет не только карьерный сайт, но и отзывы, соцсети, медиа — вся поисковая выдача и ответы нейросетей. Mirror собирает все внешние сигналы и показывает реальную картину.",
  },
  {
    icon: Layers,
    title: "Разрыв между EVP и реальностью",
    text: "ИИ сравнивает компанию саму с собой: сопоставляет ваши обещания с тем, что говорят сотрудники и кандидаты. Показывает, где переобещали, где недоговорили и какие сильные стороны нужно масштабировать.",
  },
  {
    icon: Building2,
    title: "Внутренний бренд — вторая половина картины",
    text: "То, что сотрудники переживают внутри, рано или поздно становится внешним. Сверяем документы, опросы и интервью с тем, что видно снаружи, — до того как разрыв попадёт в отзывы.",
  },
  {
    icon: BarChart3,
    title: "Экономия времени на аналитику",
    text: "Вместо длительного ручного мониторинга сервис быстро формирует единый отчёт и дашборд, который можно отслеживать в динамике: индекс культуры, карта разрывов и приоритеты.",
  },
]

function Problems() {
  return (
    <Section>
      <SectionHeader
        align="left"
        eyebrow="решаем задачи бизнеса"
        title="Вы знаете, что о вас говорят как о работодателе — и что думают сотрудники?"
      />
      <ul className="grid gap-5 md:grid-cols-2">
        {PROBLEMS.map((p) => (
          <li key={p.title} className="glass group rounded-3xl p-7 transition-colors hover:border-brand-accent/40">
            <span className="mb-6 inline-flex size-11 items-center justify-center rounded-2xl bg-brand-accent/15 text-brand-50">
              <p.icon className="size-5" />
            </span>
            <h3 className="mb-3 text-xl font-semibold">{p.title}</h3>
            <p className="text-muted-foreground">{p.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function TwoSides() {
  return (
    <Section className="overflow-hidden">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow>внешний и внутренний бренд</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-[2.6rem] md:leading-[1.1]">
            Две стороны одного бренда — на одном графике
          </h2>
          <p className="text-muted-foreground md:text-lg">
            <b className="font-medium text-chart-1">Внешний бренд</b> — то, что видят кандидаты и рынок: вакансии,
            отзывы, соцсети, медиа, ответы нейросетей. <b className="font-medium text-chart-2">Внутренний</b> — то, что
            переживают сотрудники: документы, опросы, интервью. Mirror считает индекс для каждой стороны и показывает,
            где они расходятся.
          </p>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-status-bad/25 bg-status-bad/[0.07] p-4">
              <p className="text-sm font-medium text-status-bad">Снаружи выше, чем внутри</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Репутация опережает реальность — скоро это покажут новые отзывы.
              </p>
            </div>
            <div className="rounded-2xl border border-chart-2/25 bg-chart-2/[0.07] p-4">
              <p className="text-sm font-medium text-chart-2">Внутри выше, чем снаружи</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Вы недорассказываете: сильные стороны, о которых стоит говорить громче.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="xl" className="rounded-xl">
            <Link href="/dashboard">
              Открыть пример дашборда <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
        <div className="glass rounded-3xl p-5 md:p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Подтверждение обещаний, % · Банк N</p>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">пример</span>
          </div>
          <TopicGapChart />
        </div>
      </div>
    </Section>
  )
}

const REPORT_EXTERNAL = [
  { icon: Briefcase, title: "HR-бренд", text: "Анализ позиционирования на рынке труда." },
  { icon: MessageSquareText, title: "Отзывы сотрудников", text: "Тональность и ключевые темы с hh.ru, Dreamjob и VK." },
  { icon: Layers, title: "EVP vs. реальность", text: "Карта обещаний: что подтверждено, частично, оспорено." },
  { icon: Megaphone, title: "Медиа-присутствие", text: "Упоминания в Яндексе, Дзене, VK и медиа: поводы и риски." },
  { icon: UserRoundSearch, title: "Конкуренты", text: "Сравнение с 2–3 конкурентами по ключевым темам и тону." },
  { icon: Bot, title: "Нейросети", text: "Что Алиса и GigaChat отвечают кандидатам о вас." },
]

const REPORT_INTERNAL = [
  { icon: FileText, title: "Документы и данные", text: "EVP, политики, внутренние коммуникации, результаты опросов." },
  { icon: Users, title: "Анонимные интервью", text: "С сотрудниками разных подразделений и уровней." },
  { icon: BarChart3, title: "Внутренний индекс", text: "Те же обещания, проверенные изнутри, рядом с внешним индексом." },
  { icon: Search, title: "Карта разрывов", text: "Где репутация опережает реальность, а где отстаёт от неё." },
  { icon: ListChecks, title: "Рекомендации", text: "Ближайшие приоритеты, быстрая гигиена, стоп‑лист обещаний." },
  { icon: Sparkles, title: "План на 90 дней", text: "Что меняем, что перестаём обещать, кто отвечает." },
]

function ReportContents() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Что входит в отчёт"
        title="В каждом отчёте — расчёт индекса культуры"
        description="Внешняя часть — в бесплатном срезе. Внутренняя добавляется в диагностике вместе с экспертом."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          { title: "Снаружи", badge: "бесплатный срез", items: REPORT_EXTERNAL, tone: "text-chart-1 bg-chart-1/10" },
          { title: "Изнутри", badge: "диагностика", items: REPORT_INTERNAL, tone: "text-chart-2 bg-chart-2/10" },
        ].map((col) => (
          <div key={col.title} className="glass rounded-3xl p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">{col.title}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${col.tone}`}>{col.badge}</span>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2">
              {col.items.map((it) => (
                <li key={it.title} className="flex gap-3">
                  <it.icon className={`mt-0.5 size-5 shrink-0 ${col.tone.split(" ")[0]}`} />
                  <div>
                    <p className="font-medium">{it.title}</p>
                    <p className="text-sm text-muted-foreground">{it.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Stats() {
  const stats = [
    { value: "0 ₽", label: "стоит внешний срез" },
    { value: "3 дня", label: "от заявки до среза" },
    { value: "10", label: "источников снаружи и изнутри" },
    { value: "2 индекса", label: "внешний и внутренний" },
  ]
  return (
    <section className="py-8">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <dl className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4 md:p-10">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <dt className="order-2 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="text-gradient order-1 text-3xl font-semibold md:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Audience() {
  const items = [
    { icon: Landmark, title: "Первому лицу", text: "Одна страница: главный разрыв между словами и делами и три решения с ответственными." },
    { icon: Briefcase, title: "HR-директору", text: "Цифры вместо ощущений для разговора с руководством и план изменений на 90 дней." },
    { icon: Megaphone, title: "HR-бренду и внутренним коммуникациям", text: "Карта обещаний: что можно говорить уверенно, а что пока нет. Темы для историй из реального опыта сотрудников." },
    { icon: Globe, title: "Маркетингу и PR", text: "Единая картина репутации компании как работодателя: медиа, соцсети, ответы нейросетей." },
  ]
  return (
    <Section>
      <SectionHeader eyebrow="Кому помогает Mirror" title="Каждый видит свою часть картины" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <li key={it.title} className="glass flex flex-col gap-3 rounded-3xl p-6">
            <it.icon className="size-6 text-brand-200" />
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function IndexTeaser() {
  const steps = [
    { n: "01", title: "Ваши слова", text: "Берём обещания из ваших вакансий и коммуникаций. Чем громче обещаете, тем больше весит обещание." },
    { n: "02", title: "Опыт людей", text: "Проверяем каждое обещание снаружи — отзывами и упоминаниями, и изнутри — документами и интервью." },
    { n: "03", title: "Действие", text: "У каждого оспоренного обещания есть ответственный, срок и метрика, по которой видно результат." },
  ]
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow>Индекс культуры</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
            Индекс культуры как метрика доверия к бренду
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Индекс культуры — оценка того, насколько обещания работодателя совпадают с реальностью внутри. И если слова
            и дела расходятся, это всё чаще воспринимается как показная забота, как маркетинговая манипуляция.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="xl" className="rounded-xl">
              <Link href="/culture-index">Об индексе культуры</Link>
            </Button>
            <Button asChild variant="ghost" size="xl">
              <Link href="/methodology">
                Открытая методика <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <figure className="glass mt-4 w-full rounded-3xl p-6">
            <blockquote className="text-lg">
              «<Ph>Культура — это не ценности на стене, а то, что происходит с сотрудником каждый день. Мы помогаем руководителю увидеть компанию его глазами.</Ph>»
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3 text-sm">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-accent/25 font-medium">ЭК</span>
              <span>
                <Ph>Имя Фамилия</Ph>
                <span className="block text-muted-foreground">Эксперт по корпоративной культуре, ведёт проекты Mirror</span>
              </span>
            </figcaption>
          </figure>
        </div>
        <ol className="flex flex-col gap-4">
          {steps.map((s) => (
            <li key={s.n} className="glass flex gap-5 rounded-3xl p-6 md:p-7">
              <span className="text-gradient text-3xl font-semibold">{s.n}</span>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-muted-foreground">{s.text}</p>
              </div>
            </li>
          ))}
          <li className="rounded-3xl border border-dashed border-border p-6 text-muted-foreground">
            Раньше компании придумывали яркое EVP и красиво его упаковывали. Теперь порядок обратный:{" "}
            <span className="text-foreground">сначала проверяем реальность, потом обещаем.</span>
          </li>
        </ol>
      </div>
    </Section>
  )
}

function PricingTeaser() {
  const plans = [
    { title: "Срез", price: "0 ₽", note: "внешний бренд · 3 рабочих дня", href: "/scan", free: true },
    { title: "Диагностика", price: "от 180 000 ₽", note: "внешний и внутренний бренд · эксперт", href: "/diagnostics" },
    { title: "Сопровождение", price: "от 120 000 ₽ / мес", note: "3–6 месяцев изменений", href: "/support" },
    { title: "Мониторинг", price: "от 35 000 ₽ / мес", note: "замер индекса каждый квартал", href: "/support#monitoring" },
  ]
  return (
    <Section>
      <SectionHeader
        eyebrow="Форматы и цены"
        title="Первый шаг — бесплатно"
        description="Внешний срез через сервис Mirror бесплатен для каждой компании, которая хочет с нами сотрудничать. Платной становится работа эксперта и внутренняя проверка."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className={`group flex flex-col gap-3 rounded-3xl p-6 transition-colors ${p.free ? "border border-brand-accent/50 bg-brand-accent/15" : "glass hover:border-brand-accent/40"}`}
          >
            <p className="text-sm text-muted-foreground">{p.title}</p>
            <p className="text-2xl font-semibold">{p.free ? p.price : <Ph>{p.price}</Ph>}</p>
            <p className="text-sm text-muted-foreground">{p.note}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-brand-200 group-hover:text-foreground">
              Подробнее <ArrowRight className="size-4" />
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-center text-muted-foreground">
        Если остались вопросы, пишите нам на почту{" "}
        <a href={`mailto:${CONTACTS.email}`} className="text-brand-200 underline underline-offset-4">
          {CONTACTS.email}
        </a>{" "}
        — обсудим формат индивидуально.
      </p>
    </Section>
  )
}

function Security() {
  const items = [
    { icon: ServerCog, title: "Серверы в России", text: "Хранение и обработка данных по 152-ФЗ." },
    { icon: EyeOff, title: "Анонимно", text: "Компания видит только темы и обезличенные цитаты сотрудников." },
    { icon: FileLock2, title: "Документы под NDA", text: "Внутренние документы — только по соглашению о конфиденциальности, доступ у эксперта проекта." },
    { icon: ShieldCheck, title: "Без доступа к системам", text: "Для среза нужны только название компании и публичные ссылки." },
  ]
  return (
    <Section>
      <SectionHeader eyebrow="Безопасность" title="Данные компании и сотрудников под защитой" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <li key={it.title} className="glass flex flex-col gap-3 rounded-3xl p-6">
            <it.icon className="size-6 text-chart-2" />
            <h3 className="font-semibold">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <Button asChild variant="ghost">
          <Link href="/security">
            Данные и 152-ФЗ подробно <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </Section>
  )
}
