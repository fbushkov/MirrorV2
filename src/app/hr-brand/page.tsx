import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnchorNav } from "@/components/site/anchor-nav"
import { BackToTop } from "@/components/site/back-to-top"
import { CheckList } from "@/components/site/check-list"
import { CtaBand } from "@/components/site/cta-band"
import { FaqSection } from "@/components/site/faq-list"
import { Eyebrow, Section, SectionHeader } from "@/components/site/section"
import { MirrorCard } from "@/components/home/mirror-card"
import { ThreeMetrics } from "@/components/home/three-metrics"
import { MatrixBlock } from "@/components/metrics/matrix-block"
import { BrandDynamicsChart } from "@/components/charts/brand-charts"
import { BRAND_CHECK, BRAND_REPORT, BRAND_STEPS, FAQ_BRAND } from "@/content/hr-brand"
import { DIRECTION_NAMES } from "@/content/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: DIRECTION_NAMES.brand,
  description: "Что видят кандидаты и рынок и верят ли они вашим обещаниям. Индекс культуры, слепые зоны и место в отрасли. Первый срез — бесплатно.",
}

const NAV = [
  { id: "check", label: "Что проверяем" },
  { id: "metrics", label: "Три показателя" },
  { id: "matrix", label: "Матрица" },
  { id: "report", label: "Отчёт" },
  { id: "process", label: "Как проходит" },
  { id: "faq", label: "Вопросы" },
]

export default function HrBrandPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>Направление 1 · Снаружи</Eyebrow>
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              Оценка HR-бренда и <span className="text-gradient">индекс культуры</span>
            </h1>
            <p className="max-w-lg text-lg text-pretty text-muted-foreground">
              Что видят кандидаты и рынок, и верят ли они вашим обещаниям. Сверяем то, что вы обещаете, с отзывами, соцсетями,
              медиа и ответами нейросетей.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="glow" size="xl">
                <Link href="/start?type=scan">
                  Получить бесплатный срез <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="soft" size="xl">
                <Link href="/hr-brand/demo">Демо-отчёт</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">3 рабочих дня · без доступа к вашим системам</p>
          </div>
          <MirrorCard />
        </div>
      </section>

      <AnchorNav items={NAV} />

      <Section id="check">
        <SectionHeader eyebrow="Что проверяем" title="Ваши обещания против опыта людей" description="Проверяем по вашим же словам, а не по чужому списку ценностей." />
        <ol className="grid gap-3 md:grid-cols-3">
          {BRAND_CHECK.map((c, i) => (
            <li key={c.title} className="surface flex flex-col gap-3 p-6">
              <span className="text-sm font-medium text-muted-foreground tabular-nums">{i + 1}</span>
              <p className="text-lg font-semibold">{c.title}</p>
              <p className="text-muted-foreground">{c.text}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-2 text-sm">
                {c.items.map((x) => (
                  <li key={x} className="rounded-full border border-border bg-background px-3 py-1 text-muted-foreground">
                    {x}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="metrics" className="bg-card">
        <SectionHeader
          eyebrow="Три показателя"
          title="Три вопроса, на которые отвечает отчёт"
          description="У каждого показателя своя точка отсчёта, поэтому мы не смешиваем их в одну цифру."
        />
        <ThreeMetrics />
      </Section>

      <Section id="matrix">
        <SectionHeader
          eyebrow="Как читать вместе"
          title="Честность и условия — на одном поле"
          description="По вертикали — индекс культуры, по горизонтали — место в отрасли. Где вы стоите, подсказывает, что делать дальше."
        />
        <MatrixBlock />
      </Section>

      <Section id="report" className="bg-card">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex flex-col items-start gap-5">
            <Eyebrow>Отчёт</Eyebrow>
            <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">Что будет в отчёте</h2>
            <CheckList items={BRAND_REPORT} />
            <Button asChild variant="soft" size="xl">
              <Link href="/hr-brand/demo">
                Открыть демо-отчёт <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <div className="surface-raised min-w-0 p-4 md:p-6">
            <p className="font-semibold">Просадки и подъёмы</p>
            <p className="mt-1 text-sm text-muted-foreground">Индекс культуры по месяцам, метки — события, которые на него повлияли</p>
            <BrandDynamicsChart className="mt-4 h-72" />
          </div>
        </div>
      </Section>

      <Section id="process">
        <SectionHeader eyebrow="Как проходит" title="Первые два шага ничего не стоят" />
        <ol className="grid gap-3 md:grid-cols-3">
          {BRAND_STEPS.map((s, i) => (
            <li key={s.title} className={cn("surface flex flex-col gap-3 p-6", s.free && i === 0 && "border-brand-200 bg-brand-50/60")}>
              <span className="text-sm font-medium text-muted-foreground tabular-nums">Шаг {i + 1}</span>
              <p className="text-xl font-semibold">{s.title}</p>
              <span
                className={cn(
                  "w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
                  s.free ? "bg-status-ok/10 text-status-ok" : "bg-secondary text-secondary-foreground",
                )}
              >
                {s.meta}
              </span>
              <p className="text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Link
            href="/culture-health"
            className="group flex flex-col gap-2 rounded-3xl border border-health-200 bg-health-50/70 p-6 transition-colors hover:border-health-500"
          >
            <span className="flex items-center gap-2 text-xs font-medium text-health-700">
              <span className="size-1.5 rounded-full bg-health-500" aria-hidden />
              Направление 2 · Изнутри
            </span>
            <span className="text-lg font-semibold">Нужен взгляд изнутри?</span>
            <span className="text-muted-foreground">
              {DIRECTION_NAMES.health}: как сотрудники переживают культуру и где она расходится с заявленной.
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-health-700">
              О направлении <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <div className="surface flex flex-col gap-2 p-6">
            <p className="text-lg font-semibold">Агентствам и консультантам</p>
            <p className="text-muted-foreground">Внешний аудит HR-бренда для ваших клиентов, под вашим логотипом. Три отчёта — бесплатно.</p>
            <Link href="/start?type=other" className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Обсудить пилот <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      <Section id="faq" className="bg-card">
        <FaqSection items={FAQ_BRAND} title="Вопросы об оценке" />
      </Section>

      <CtaBand href="/start?type=scan" />
      <BackToTop />
    </>
  )
}
