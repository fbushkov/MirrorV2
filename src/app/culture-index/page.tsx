import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { FaqSection } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { StatusPill } from "@/components/site/status"
import { Ph } from "@/components/site/ph"
import { IndexCalculator } from "@/components/methodology/index-calculator"
import { FAQ_CULTURE } from "@/content/faq"

export const metadata: Metadata = {
  title: "Индекс культуры",
  description: "Что измеряет индекс культуры Mirror, зачем он нужен и как мы его считаем. Открытая методика и пример расчёта.",
}

const STEPS = [
  ["Собираем обещания", "Из вакансий, карьерного сайта, соцсетей, а в диагностике — из внутренних документов. Похожие формулировки объединяем."],
  ["Взвешиваем", "Вес обещания — его доля среди всех ваших обещаний. Если «карьерный рост» есть в каждой вакансии, он весит больше, чем «ДМС» в каждой пятой."],
  ["Проверяем", "Ищем упоминания темы в отзывах, медиа и ответах нейросетей, а изнутри — в документах и интервью. Считаем долю, где опыт совпадает с обещанием. Свежие упоминания важнее: старше года — с половинным весом, старше двух лет — не учитываем."],
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
        description="Индекс культуры — доля обещаний работодателя, которые подтверждает опыт людей. Это метрика доверия к бренду: снаружи и изнутри."
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

      <Section className="bg-card">
        <SectionHeader eyebrow="Три уровня" title="Индекс растёт вместе с данными" />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { tag: "в бесплатном срезе", t: "Снаружи", d: "Ваши обещания против отзывов, упоминаний и ответов нейросетей.", cls: "bg-brand-50 text-primary" },
            { tag: "в диагностике", t: "Изнутри", d: "Те же обещания, проверенные документами и анонимными интервью. Разница показывает, где репутация опережает реальность или отстаёт от неё.", cls: "bg-chart-2/10 text-chart-2" },
            { tag: "по мере роста базы", t: "Место в отрасли", d: <>Сравнение с работодателями вашей отрасли по тем же правилам. Сейчас в базе <Ph>N компаний</Ph>.</>, cls: "bg-muted text-muted-foreground" },
          ].map((x) => (
            <div key={x.t} className="surface flex flex-col items-start gap-3 bg-background p-6">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${x.cls}`}>{x.tag}</span>
              <p className="text-xl font-semibold">{x.t}</p>
              <p className="text-muted-foreground">{x.d}</p>
            </div>
          ))}
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
