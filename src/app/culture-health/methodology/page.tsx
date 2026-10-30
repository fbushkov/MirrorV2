import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { DIRECTION_NAMES } from "@/content/site"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { NOT_IN_METRICS, PULSE_FAQ, PULSE_METRICS } from "@/content/pulse"
import { LevelBadge } from "@/components/pulse/parts"

export const metadata: Metadata = {
  title: "Как считаем переживаемую культуру",
  description: "Методика дашборда здоровья корпоративной культуры: 10 метрик и их источники, зоны балла, уверенность данных, разрыв с культурным кодом.",
  alternates: { canonical: "/culture-health/methodology" },
}

export default function HealthMethodologyPage() {
  return (
    <>
      <PageHero
        eyebrow={DIRECTION_NAMES.health}
        title="Как считаем переживаемую культуру"
        description="Переживаемую культуру меряем по 10 метрикам. Индекс равен среднему по ним. Группы меньше 5 человек не показываем."
      />

      <Section id="health-method" className="bg-health-50/50">
        <SectionHeader
          eyebrow="10 метрик"
          title="У каждой метрики свои источники"
          description="Баллом становятся только опросы и тексты. Поведение и HR-события в агрегате подтверждают или опровергают сигнал."
        />
        <div className="surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-normal">Метрика</th>
                  <th scope="col" className="px-4 py-3 font-normal">Опросы</th>
                  <th scope="col" className="px-4 py-3 font-normal">Тексты</th>
                  <th scope="col" className="px-4 py-3 font-normal">Поведение и HR-события в агрегате</th>
                </tr>
              </thead>
              <tbody>
                {PULSE_METRICS.map((m) => (
                  <tr key={m.id} className="border-t border-border align-top">
                    <th scope="row" className="px-4 py-3 font-medium">{m.name}</th>
                    <td className="px-4 py-3 text-muted-foreground">{m.sources.o}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.sources.t}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.sources.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="surface p-5">
            <p className="mb-2 font-semibold">Зоны балла</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center justify-between gap-2"><LevelBadge score={70} /> от 65</li>
              <li className="flex items-center justify-between gap-2"><LevelBadge score={55} /> 50–64</li>
              <li className="flex items-center justify-between gap-2"><LevelBadge score={40} /> до 50</li>
            </ul>
          </div>
          <div className="surface p-5">
            <p className="mb-2 font-semibold">Уверенность данных</p>
            <p className="text-sm text-muted-foreground">У каждого балла: высокая, средняя или низкая. Зависит от числа ответов и согласия источников между собой.</p>
          </div>
          <div className="surface p-5">
            <p className="mb-2 font-semibold">Что влияет</p>
            <p className="text-sm text-muted-foreground">Каждая причина помечена уровнем доказанности: гипотеза, коррелирует или подтверждено пилотом.</p>
          </div>
          <div className="surface p-5">
            <p className="mb-2 font-semibold">Подтверждающие сигналы</p>
            <p className="text-sm text-muted-foreground">Отказы от офферов, абсентеизм, доля закрытых петель обратной связи. Баллом не становятся.</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{NOT_IN_METRICS} Разрыв считаем по нормам культурного кода: каждая норма привязана к одной или нескольким метрикам.</p>
        <div className="surface mt-6 p-6">
          <p className="font-semibold">Как направления сверяются между собой</p>
          <p className="mt-2 text-muted-foreground">
            Индекс культуры и индекс переживаемой культуры не смешиваем: у них разные точки отсчёта и источники. Если компания
            подключила оба направления, сверяем общие темы. Например, слепая зона «переработки» снаружи и низкая метрика «Энергия и
            ресурс» изнутри — значит, проблема видна с двух сторон.
          </p>
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Link href="/hr-brand/methodology" className="group flex flex-col gap-1.5 rounded-3xl border border-brand-100 bg-brand-50/60 p-6 transition-colors hover:border-foreground/20">
          <span className="text-xs font-medium text-muted-foreground">{DIRECTION_NAMES.brand}</span>
          <span className="inline-flex items-center gap-1 text-lg font-semibold">Как считаем снаружи <ArrowUpRight className="size-5 transition-transform group-hover:rotate-45" aria-hidden /></span>
          <span className="text-sm text-muted-foreground">Индекс культуры, слепые зоны и место в отрасли. Шесть шагов расчёта и калькулятор.</span>
        </Link>
      </Section>

      <Section>
        <FaqSection items={PULSE_FAQ} title="Частые вопросы сотрудников" note="Эти ответы можно использовать в рассылке перед запуском дашборда." />
      </Section>
      <CtaBand title="Запустите дашборд в своей компании" text="Начнём с диагностики и первого замера. Расскажите о компании, и мы предложим план кампании." cta="Обсудить кампанию" href="/start?type=health" />
    </>
  )
}
