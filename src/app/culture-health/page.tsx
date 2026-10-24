import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, EyeOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow, Section, SectionHeader } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { AnchorNav } from "@/components/site/anchor-nav"
import { BackToTop } from "@/components/site/back-to-top"
import { CheckList } from "@/components/site/check-list"
import { CultureLayers } from "@/components/pulse/layers"
import { MetricCards } from "@/components/pulse/metric-cards"
import { PulseDashboard } from "@/components/pulse/pulse-dashboard"
import {
  DATA_LEVELS,
  NOT_IN_DATA,
  NOT_IN_METRICS,
  PRIVACY_RULES,
  PULSE_FAQ,
  PULSE_IS,
  PULSE_IS_NOT,
  PULSE_QUESTIONS,
  PULSE_STEPS,
  PULSE_WHY,
  ROLES,
  SUCCESS,
  YOU_SAID,
} from "@/content/pulse"

export const metadata: Metadata = {
  title: "Дашборд здоровья корпоративной культуры",
  description: "Переживаемая культура и её разрыв с заявленной. 10 метрик, приватность по умолчанию, дашборд для руководителей и команды культуры.",
}

const NAV = [
  { id: "why", label: "Зачем" },
  { id: "how", label: "Как работает" },
  { id: "layers", label: "Два слоя" },
  { id: "metrics", label: "10 метрик" },
  { id: "data", label: "Данные" },
  { id: "privacy", label: "Приватность" },
  { id: "roles", label: "Кто что видит" },
  { id: "demo", label: "Дашборд" },
  { id: "results", label: "Результат" },
  { id: "faq", label: "Вопросы" },
]

export default function CultureHealthPage() {
  return (
    <>
      {/* 1. Первый экран */}
      <section className="relative overflow-hidden pt-32 pb-10 md:pt-40 md:pb-14">
        <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 text-center md:px-6">
          <Eyebrow tone="health">Направление 2 · Изнутри</Eyebrow>
          <h1 className="text-4xl font-semibold md:text-6xl md:leading-[1.05]">
            Дашборд здоровья <span className="text-gradient">корпоративной культуры</span>
          </h1>
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
            Как в компании живут и работают на самом деле. Дашборд показывает, где заявленные ценности совпадают с опытом
            людей, а где расходятся.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="glow" size="xl">
              <a href="#how">
                Как это работает <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild variant="soft" size="xl">
              <Link href="/culture-health/demo">Демо-дашборд</Link>
            </Button>
            <Button asChild variant="ghost" size="xl">
              <a href="#privacy">Приватность</a>
            </Button>
          </div>
        </div>
      </section>

      <AnchorNav items={NAV} />

      {/* 2. Зачем + 3. Это / это не */}
      <Section id="why">
        <SectionHeader eyebrow="Зачем это нужно" title="Общая картина культуры, на которой строятся решения" description="Где культура работает, где расходится с заявленным кодом и куда направить усилия." />
        <div className="grid gap-3 md:grid-cols-3">
          {PULSE_WHY.map((w, i) => (
            <div key={w.title} className="surface p-6">
              <span className="text-gradient text-2xl font-semibold">0{i + 1}</span>
              <p className="mt-3 text-lg font-semibold">{w.title}</p>
              <p className="mt-1 text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="surface p-6">
            <p className="mb-4 font-semibold">Это</p>
            <ul className="flex flex-col gap-3">
              {PULSE_IS.map((x) => (
                <li key={x} className="flex items-center gap-3">
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-status-ok/10 text-status-ok">
                    <Check className="size-4" aria-hidden />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface p-6">
            <p className="mb-4 font-semibold">Это не</p>
            <ul className="flex flex-col gap-3">
              {PULSE_IS_NOT.map((x) => (
                <li key={x} className="flex items-center gap-3">
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-status-bad/10 text-status-bad">
                    <X className="size-4" aria-hidden />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. Вопросы */}
      <Section className="bg-card">
        <SectionHeader eyebrow="На какие вопросы отвечает" title="Девять вопросов, которые обычно остаются без ответа" />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PULSE_QUESTIONS.map((q, i) => (
            <li key={q} className={`surface flex gap-4 bg-background p-5 ${i === PULSE_QUESTIONS.length - 1 ? "border-brand-200 bg-brand-50/60 sm:col-span-2 lg:col-span-3" : ""}`}>
              <span className="text-sm font-semibold text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5. Как работает */}
      <Section id="how">
        <SectionHeader eyebrow="Как это работает" title="Четыре шага от сигнала до решения" />
        <ol className="grid gap-3 md:grid-cols-4">
          {PULSE_STEPS.map((s, i) => (
            <li key={s.title} className="surface relative flex flex-col gap-2 p-6">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
              <p className="mt-2 text-lg font-semibold">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.text}</p>
              {i < PULSE_STEPS.length - 1 && (
                <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-6 -translate-y-1/2 rounded-full border border-border bg-card p-1 text-muted-foreground md:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-muted-foreground">Любой балл можно проследить до исходных обезличенных сообщений. Баллы не выдумываются.</p>
      </Section>

      {/* 6. Два слоя */}
      <Section id="layers" className="bg-card">
        <SectionHeader
          eyebrow="Два слоя культуры"
          title="Разрыв — главный показатель"
          description="Заявленная культура — ценности и нормы из культурного кода. Переживаемая — то, что люди испытывают каждый день. Разрыв между ними показывает, куда направить усилия."
        />
        <CultureLayers />
      </Section>

      {/* 7. Десять метрик */}
      <Section id="metrics">
        <SectionHeader eyebrow="10 метрик" title="Из чего складывается переживаемая культура" description="Нажмите на метрику, чтобы увидеть, что она измеряет и откуда берутся данные." />
        <MetricCards />
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">{NOT_IN_METRICS}</p>
      </Section>

      {/* 8. Данные */}
      <Section id="data" className="bg-card">
        <SectionHeader eyebrow="Какие данные используем" title="Три уровня данных — и чётко сказано, чего в них нет" />
        <div className="grid gap-3 md:grid-cols-3">
          {DATA_LEVELS.map((d, i) => (
            <div key={d.title} className="surface flex flex-col gap-3 bg-background p-6">
              <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">уровень {i + 1}</span>
              <p className="text-lg font-semibold">{d.title}</p>
              <p className="text-sm text-muted-foreground">{d.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-4 rounded-[1.25rem] border border-dashed border-brand-200 p-6 md:flex-row md:items-center">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <EyeOff className="size-5" aria-hidden />
          </span>
          <p className="font-medium">Чего нет в данных:</p>
          <ul className="flex flex-wrap gap-2">
            {NOT_IN_DATA.map((x) => (
              <li key={x} className="rounded-full bg-muted px-3 py-1 text-sm">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 9. Приватность */}
      <Section id="privacy">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start gap-5 lg:sticky lg:top-40 lg:self-start">
            <Eyebrow>Приватность и анонимность</Eyebrow>
            <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">Мы смотрим на группы, а не на людей</h2>
            <p className="text-muted-foreground md:text-lg">Правила одинаковые для всех ролей, включая топ-менеджмент.</p>
            <div className="surface-raised flex items-center gap-4 p-5">
              <span className="text-gradient text-5xl font-semibold">5</span>
              <span className="text-sm text-muted-foreground">
                человек — минимальная группа,
                <br />
                которую видит руководитель
              </span>
            </div>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {PRIVACY_RULES.map((r, i) => (
              <li key={r} className="surface flex gap-3 p-5">
                <span className="text-sm font-semibold text-primary tabular-nums">{i + 1}</span>
                <span className="text-[15px]">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 10. Роли */}
      <Section id="roles" className="bg-card">
        <SectionHeader eyebrow="Кто что видит" title="Каждой роли — свой срез и свой ритм" />
        <div className="surface mx-auto max-w-4xl overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-normal">Роль</th>
                  <th scope="col" className="px-5 py-3 font-normal">Что видит</th>
                  <th scope="col" className="px-5 py-3 font-normal">Как часто</th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.role} className="border-t border-border">
                    <th scope="row" className="px-5 py-4 font-medium">{r.role}</th>
                    <td className="px-5 py-4 text-muted-foreground">{r.sees}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-secondary-foreground">{r.how}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* 11. Демо-дашборд */}
      <Section id="demo">
        <SectionHeader
          eyebrow="Образ дашборда"
          title="Попробуйте сами"
          description="Меняйте период, подразделение и этап. Нажмите на метрику, чтобы открыть её карточку. Попробуйте выбрать ИТ и этап «Уход» — увидите, как работает правило пяти человек."
        />
        <PulseDashboard />
        <p className="mt-3 text-center text-xs text-muted-foreground">Данные на иллюстрации демонстрационные</p>
      </Section>

      {/* 12. Вы сказали — мы сделали + 13. Критерии успеха */}
      <Section id="results" className="bg-card">
        <SectionHeader
          eyebrow="Что увидят сотрудники"
          title="Вы сказали — мы сделали"
          description="Публичная страница для сотрудников: какой сигнал пришёл, что решили и что изменилось. Без неё обратная связь превращается в пустую формальность."
        />
        <div className="grid gap-3 md:grid-cols-3">
          {YOU_SAID.map((y) => (
            <div key={y.topic} className="surface flex flex-col gap-4 bg-background p-6">
              <span className="w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">пример</span>
              <div>
                <p className="text-xs text-muted-foreground">Вы сказали</p>
                <p className="font-semibold">{y.topic}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Мы решили</p>
                <p>{y.decided}</p>
              </div>
              <div className="mt-auto rounded-xl bg-status-ok/10 px-3 py-2 text-sm font-medium text-status-ok">{y.changed}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start gap-4">
            <Eyebrow>Как поймём, что это работает</Eyebrow>
            <h3 className="text-2xl font-semibold md:text-3xl">Критерии успеха первого квартала</h3>
          </div>
          <div className="surface bg-background p-6">
            <CheckList items={SUCCESS} />
          </div>
        </div>
      </Section>

      {/* 14. Вопросы */}
      <Section id="faq">
        <FaqSection items={PULSE_FAQ} title="Частые вопросы сотрудников" note="Эти ответы можно использовать в рассылке перед запуском дашборда." />
      </Section>

      {/* 15. Заявка */}
      <CtaBand title="Запустите дашборд в своей компании" text="Начнём с диагностики и первого замера. Расскажите о компании — предложим план кампании." cta="Обсудить кампанию" href="/start?type=health" />
      <div className="-mt-10 pb-12 text-center text-sm text-muted-foreground">
        <Link href="/docs/privacy-policy" className="underline underline-offset-4 hover:text-foreground">
          Политика обработки данных
        </Link>
      </div>
      <BackToTop />
    </>
  )
}
