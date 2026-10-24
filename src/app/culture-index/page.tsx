import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { StatusPill } from "@/components/site/status"
import { Ph } from "@/components/site/ph"
import { IndexCalculator } from "@/components/methodology/index-calculator"
import { CultureMatrixChart, IndexGauge } from "@/components/charts/brand-charts"
import { BlindSpots } from "@/components/metrics/blind-spots"
import { IndustryTracks } from "@/components/metrics/industry-tracks"
import { MATRIX_ZONES } from "@/content/demo"
import { cn } from "@/lib/utils"
import { FAQ_CULTURE } from "@/content/faq"

export const metadata: Metadata = {
  title: "Индекс культуры",
  description: "Что измеряет индекс культуры Mirror, зачем он нужен и как мы его считаем. Открытая методика и пример расчёта.",
}

const ZONE_TONE: Record<string, string> = {
  strong: "border-l-4 border-l-status-ok",
  honest: "border-l-4 border-l-status-warn",
  wrong: "border-l-4 border-l-chart-5",
  over: "border-l-4 border-l-status-bad",
}

function MetricCard({ name, base, question, text, children }: { name: string; base: string; question: string; text: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="surface flex flex-col gap-4 bg-background p-6">
      <div>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">{base}</span>
        <p className="mt-3 text-xl font-semibold">{name}</p>
        <p className="text-muted-foreground">{question}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">{children}</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

const STEPS = [
  ["Собираем обещания", "Из вакансий, карьерного сайта, соцсетей, а в диагностике — из внутренних документов. Похожие формулировки объединяем."],
  ["Взвешиваем", "Вес обещания — его доля среди всех ваших обещаний. Если «карьерный рост» есть в каждой вакансии, он весит больше, чем «ДМС» в каждой пятой."],
  ["Проверяем", "Ищем упоминания темы в отзывах, медиа и ответах нейросетей, а изнутри — в анонимных интервью, опросах и фактических данных. Документы компании — источник обещаний, а не подтверждение. Считаем долю, где опыт совпадает с обещанием. Свежие упоминания важнее: старше года — с половинным весом, старше двух лет — не учитываем."],
  ["Ставим статус", null],
  ["Сводим в индекс", "Индекс = Σ (вес обещания × % подтверждения). Снаружи и изнутри — отдельно, по одним и тем же обещаниям."],
  ["Привязываем к действию", "У каждого спорного обещания — ответственный, срок и показатель, по которому видно результат."],
] as const

export default function CultureIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Индекс культуры"
        title="Насколько ваши слова совпадают с делами"
        description="Индекс культуры — доля обещаний работодателя, которые подтверждает опыт людей. Рядом с ним — слепые зоны и место в отрасли: вместе они показывают и честность бренда, и его силу."
      />

      <Section className="pt-0 md:pt-4">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Бренд", "Люди верят людям. Когда сотрудники подтверждают ваши слова, коммуникации работают сильнее и дешевле."],
            ["Доверие", "Если обещание расходится с опытом, это всё чаще считают показной заботой. Страдает доверие и к остальным словам компании."],
            ["Скорость", "Когда сотрудники верят руководству, решения внедряются быстрее. Индекс показывает, где это доверие под вопросом."],
          ].map(([t, d]) => (
            <div key={t} className="surface p-6">
              <p className="mb-2 text-lg font-semibold">{t}</p>
              <p className="text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="metrics" className="bg-card">
        <SectionHeader
          eyebrow="Три показателя"
          title="У каждого показателя своя точка отсчёта"
          description="Индекс культуры меряет честность. Но честно можно обещать и мало. Поэтому рядом — ещё два показателя. В одну цифру мы их не смешиваем."
        />
        <div className="grid gap-3 lg:grid-cols-3">
          <MetricCard
            name="Индекс культуры"
            base="относительно ваших обещаний"
            question="Совпадают ли слова и дела?"
            text="Доля обещаний, которые подтверждает опыт людей. Снаружи — по отзывам и упоминаниям, изнутри — по интервью и фактам."
          >
            <IndexGauge value={65} label="снаружи" className="h-44 w-full" />
          </MetricCard>
          <MetricCard
            name="Слепые зоны"
            base="относительно того, что обсуждают люди"
            question="О чём говорят, а вы молчите?"
            text="Темы, которых нет в ваших текстах, хотя люди обсуждают их постоянно. Закрывают лазейку «пообещать поменьше, чтобы индекс был выше»."
          >
            <BlindSpots compact />
          </MetricCard>
          <MetricCard
            name="Место в отрасли"
            base="относительно рынка"
            question="Насколько хороши условия?"
            text={<>Базовые темы — зарплата, развитие, руководство, нагрузка — в сравнении с работодателями отрасли и региона. Считаем, когда в базе отрасли 30+ компаний. Сейчас в базе <Ph>N компаний</Ph>.</>}
          >
            <IndustryTracks showOverall={false} />
          </MetricCard>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Как читать вместе"
          title="Честность и условия — на одном поле"
          description="По вертикали — индекс культуры, по горизонтали — место в отрасли. Где вы стоите, подсказывает, что делать дальше."
        />
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="surface-raised p-4 md:p-6">
            <CultureMatrixChart />
            <p className="mt-2 text-xs text-muted-foreground">Пример на условных данных: Банк N и два конкурента</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {MATRIX_ZONES.map((z) => (
              <li key={z.id} className={cn("surface p-5", ZONE_TONE[z.id])}>
                <p className="font-semibold">{z.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{z.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="method">
        <SectionHeader
          eyebrow={<>Методика · версия <Ph>1.0</Ph></>}
          title="Как мы считаем"
          description="Методика открыта: любой результат можно проверить по таблице. Веса следуют из ваших же текстов, а не из мнения эксперта."
        />
        <ol className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="surface flex gap-4 p-6">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">{i + 1}</span>
              <div>
                <p className="mb-1.5 font-semibold">{t}</p>
                {d ? (
                  <p className="text-[15px] text-muted-foreground">{d}</p>
                ) : (
                  <div className="flex flex-col gap-1.5 text-[15px] text-muted-foreground">
                    <span className="flex items-center gap-2"><StatusPill status="ok" /> от 60%</span>
                    <span className="flex items-center gap-2"><StatusPill status="warn" /> 40–59%</span>
                    <span className="flex items-center gap-2"><StatusPill status="bad" /> до 40%</span>
                    <span className="flex items-center gap-2"><StatusPill status="none" /> меньше 10 упоминаний</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-card">
        <SectionHeader
          eyebrow="Пример расчёта"
          title="Что будет, если перестать обещать лишнее"
          description="Условный «Банк N». Уберите обещание из списка — увидите, как изменится индекс."
        />
        <IndexCalculator />
        <p className="mt-6 max-w-3xl text-muted-foreground">
          Почти половину недобора даёт одно обещание — «справедливая зарплата». Его можно исправить вилками в вакансиях и
          системой грейдов или временно убрать из текстов, пока оклады не пересмотрены.
        </p>
      </Section>

      <Section>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="surface p-6">
            <p className="mb-2 font-semibold">Чего индекс не делает</p>
            <p className="text-muted-foreground">Не решает, хорошая ли компания. Не заменяет опрос сотрудников. Не ставит оценку, если данных мало.</p>
          </div>
          <div className="surface p-6">
            <p className="mb-2 font-semibold">С чем сравнивать</p>
            <p className="text-muted-foreground">С собой — раз в квартал. С конкурентами — по тем же правилам. С отраслью — когда в базе будет 30+ компаний.</p>
          </div>
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <FaqSection items={FAQ_CULTURE} title="Вопросы об индексе" />
      </Section>
      <CtaBand title="Узнайте свой индекс" />
    </>
  )
}
