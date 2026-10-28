import type { Metadata } from "next"
import { ArrowDown } from "lucide-react"
import { DIRECTION_NAMES } from "@/content/site"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { StatusPill } from "@/components/site/status"
import { Ph } from "@/components/site/ph"
import { IndexCalculator } from "@/components/methodology/index-calculator"
import { IndexGauge } from "@/components/charts/brand-charts"
import { BlindSpots } from "@/components/metrics/blind-spots"
import { IndustryTracks } from "@/components/metrics/industry-tracks"
import { MatrixBlock } from "@/components/metrics/matrix-block"
import { NOT_IN_METRICS, PULSE_METRICS } from "@/content/pulse"
import { LevelBadge } from "@/components/pulse/parts"
import { cn } from "@/lib/utils"
import { FAQ_CULTURE } from "@/content/faq"

export const metadata: Metadata = {
  title: "Методика",
  description: "Как Mirror считает оценку HR-бренда и индекс культуры снаружи и здоровье корпоративной культуры изнутри. Открытая методика и пример расчёта.",
}

function DirLabel({ n }: { n: 1 | 2 }) {
  return <>Направление {n} · {n === 1 ? "HR-бренд и индекс культуры" : "здоровье корпоративной культуры"}</>
}

function DirNav() {
  const items = [
    { href: "#metrics", n: 1, name: DIRECTION_NAMES.brand, text: "Индекс, слепые зоны, место в отрасли, матрица, расчёт", dot: "bg-brand-500", card: "border-brand-100 bg-brand-50/60" },
    { href: "#health-method", n: 2, name: DIRECTION_NAMES.health, text: "10 метрик, источники, зоны балла, уверенность данных", dot: "bg-health-500", card: "border-health-100 bg-health-50/70" },
  ]
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((i) => (
        <a key={i.href} href={i.href} className={cn("flex flex-col gap-1.5 rounded-3xl border p-6 transition-colors hover:border-foreground/20", i.card)}>
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className={cn("size-1.5 rounded-full", i.dot)} aria-hidden />
            Направление {i.n}
          </span>
          <span className="text-lg font-semibold">{i.name}</span>
          <span className="text-sm text-muted-foreground">{i.text}</span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">Перейти <ArrowDown className="size-4" /></span>
        </a>
      ))}
    </div>
  )
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
  ["Собираем обещания", "Из вакансий, карьерного сайта и соцсетей. Похожие формулировки объединяем."],
  ["Взвешиваем", "Вес обещания — его доля среди всех ваших обещаний. Если «карьерный рост» есть в каждой вакансии, он весит больше, чем «ДМС» в каждой пятой."],
  ["Проверяем", "Ищем упоминания темы в отзывах, соцсетях, медиа и ответах нейросетей. Считаем долю, где опыт совпадает с обещанием. Свежие упоминания важнее: старше года — с половинным весом, старше двух лет — не учитываем."],
  ["Ставим статус", null],
  ["Сводим в индекс", "Индекс = Σ (вес обещания × % подтверждения). По одним правилам для вас и для конкурентов."],
  ["Привязываем к действию", "У каждого спорного обещания — ответственный, срок и показатель, по которому видно результат."],
] as const

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Методика"
        title="Как мы считаем"
        description="Открытая методика двух направлений. Снаружи — насколько ваши обещания совпадают с тем, что видят люди. Изнутри — как сотрудники переживают культуру."
      />

      <Section className="pt-0 md:pt-0">
        <DirNav />
      </Section>

      <Section className="pt-0 md:pt-0">
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
          eyebrow={<DirLabel n={1} />}
          title="У каждого показателя своя точка отсчёта"
          description="Индекс культуры меряет честность. Но честно можно обещать и мало. Поэтому рядом — ещё два показателя. В одну цифру мы их не смешиваем."
        />
        <div className="grid gap-3 lg:grid-cols-3">
          <MetricCard
            name="Индекс культуры"
            base="относительно ваших обещаний"
            question="Совпадают ли слова и дела?"
            text="Доля обещаний, которые подтверждает опыт людей: по отзывам, соцсетям, медиа и ответам нейросетей."
          >
            <IndexGauge value={65} label="индекс культуры" className="h-44 w-full" />
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
        <MatrixBlock />
      </Section>

      <Section id="brand-method">
        <SectionHeader
          eyebrow={<>Направление 1 · методика, версия <Ph>1.0</Ph></>}
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

      <Section id="health-method" className="bg-health-50/50">
        <SectionHeader
          eyebrow={<DirLabel n={2} />}
          title="Как считаем изнутри"
          description="Переживаемую культуру меряем по 10 метрикам. У каждой — свои источники. Баллом становятся только опросы и тексты; остальное подтверждает или опровергает сигнал."
        />
        <div className="surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-normal">Метрика</th>
                  <th scope="col" className="px-4 py-3 font-normal">О · опросы</th>
                  <th scope="col" className="px-4 py-3 font-normal">Т · тексты</th>
                  <th scope="col" className="px-4 py-3 font-normal">П · поведение и HR-события в агрегате</th>
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

      <Section>
        <FaqSection items={FAQ_CULTURE} title="Вопросы об индексе" />
      </Section>
      <CtaBand title="Узнайте свой индекс культуры" />
    </>
  )
}
