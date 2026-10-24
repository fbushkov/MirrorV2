import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { StatusPill } from "@/components/site/status"
import { Ph } from "@/components/site/ph"
import { IndexCalculator } from "@/components/methodology/index-calculator"

export const metadata: Metadata = {
  title: "Методика",
  description: "Открытая методика индекса культуры Mirror: как собираем обещания, взвешиваем их и проверяем снаружи и изнутри.",
}

const STEPS = [
  {
    title: "Собираем обещания",
    text: "Из вакансий, карьерного сайта, соцсетей и — в диагностике — внутренних документов выделяем всё, что вы обещаете: «белая зарплата», «наставник», «гибкий график». Похожие формулировки объединяем в одно обещание.",
    why: "Мы проверяем вас по вашим же словам, а не по чужому списку ценностей. С таким результатом трудно спорить.",
  },
  {
    title: "Взвешиваем по громкости",
    text: "Вес обещания — его доля среди всех ваших обещаний. Если «карьерный рост» есть в каждой вакансии, а «ДМС» — в каждой пятой, рост весит больше.",
    why: "Чем громче обещание, тем сильнее разочарование, если оно не выполняется. И никаких весов «на глаз».",
  },
  {
    title: "Проверяем каждое обещание — снаружи и изнутри",
    text: "Снаружи — находим упоминания темы в отзывах, комментариях, медиа и ответах нейросетей. Подтверждение — доля упоминаний, где опыт совпадает с обещанием. Упоминания за последние 12 месяцев считаются полностью, за 12–24 месяца — наполовину, старше не учитываются. Изнутри — то же обещание проверяем документами, данными компании и анонимными интервью.",
    why: "Отзывы смещены в негатив, поэтому считаем не общую тональность, а совпадение с конкретным обещанием. Внутренняя проверка закрывает темы, о которых мало пишут.",
  },
  {
    title: "Присваиваем статус",
    text: (
      <span className="flex flex-wrap items-center gap-2">
        <StatusPill status="ok" /> от 60% <StatusPill status="warn" /> 40–59% <StatusPill status="bad" /> до 40%{" "}
        <StatusPill status="none" /> меньше 10 упоминаний
      </span>
    ),
    why: "Статус понятен без методики. «Подтверждено 5 из 8» читается за секунду, а балл без контекста — нет. Обещание без данных в индекс не входит, но попадает в отчёт: его нужно проверить изнутри.",
  },
  {
    title: "Сводим в два индекса",
    text: (
      <>
        <code className="rounded-lg bg-white/[0.06] px-2 py-1 text-[15px] text-foreground">Индекс = Σ (вес обещания × % подтверждения)</code>
        <span className="mt-3 block">
          Внешний индекс считаем по открытым данным, внутренний — по тем же обещаниям и весам, но по данным изнутри.
          Рядом всегда показываем «подтверждено N из M» и надёжность: высокая при 30+ упоминаниях на обещание, средняя
          при 10–29.
        </span>
      </>
    ),
    why: "Одно число удобно для динамики и сравнения, а разница двух индексов показывает, где репутация расходится с реальностью.",
  },
  {
    title: "Привязываем к действию",
    text: "Для каждого оспоренного обещания называем ответственного, срок и метрику: внешний и внутренний индекс, тональность, долю подтверждённых обещаний, ответы нейросетей.",
    why: "Индекс без действия — диагноз без лечения. В понедельник должно быть понятно, кто и что делает.",
  },
]

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Индекс культуры", href: "/culture-index" }, { title: "Методика" }]}
        eyebrow={<>Методика · версия <Ph>1.0, октябрь 2026</Ph></>}
        title="Как мы считаем индекс культуры"
        description="Методика открыта: любой результат можно проверить по таблице. Веса не назначаются экспертом, а следуют из того, что вы сами обещаете."
      />
      <Section className="pt-0 md:pt-0">
        <ol className="flex flex-col gap-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="glass grid gap-4 rounded-3xl p-6 md:grid-cols-[80px_1fr_0.8fr] md:p-8">
              <span className="text-gradient text-4xl font-semibold">{i + 1}</span>
              <div>
                <h2 className="mb-3 text-xl font-semibold md:text-2xl">{s.title}</h2>
                <div className="text-muted-foreground">{s.text}</div>
              </div>
              <p className="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">
                <span className="mb-1 block font-medium text-foreground">Почему</span>
                {s.why}
              </p>
            </li>
          ))}
        </ol>
      </Section>
      <Section>
        <SectionHeader
          align="left"
          eyebrow="Пример расчёта"
          title="Банк N: что будет, если перестать обещать лишнее"
          description={
            <>
              Региональный банк, <Ph>около 700 сотрудников</Ph>. Данные обезличены и округлены. Снимите галочку с обещания,
              чтобы увидеть, как изменится индекс, если убрать его из коммуникаций, и переключите сторону бренда.
            </>
          }
        />
        <IndexCalculator />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="glass rounded-3xl p-6">
            <h3 className="mb-2 font-semibold">Что делать Банку N</h3>
            <p className="text-sm text-muted-foreground">
              Зарплата — 22% веса и почти половина недобора. Решение: зарплатные вилки во всех вакансиях, система грейдов,
              а до этого — убрать «справедливую зарплату» из текстов. Ответственный — <Ph>директор по персоналу</Ph>.
            </p>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="mb-2 font-semibold">Сравнение</h3>
            <p className="text-sm text-muted-foreground">
              С самим собой — повторный замер раз в квартал. С конкурентами — те же правила для 2–3 работодателей. С
              отраслью — процентиль, когда в базе отрасли будет 30+ компаний.
            </p>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="mb-2 font-semibold">Чего индекс не делает</h3>
            <p className="text-sm text-muted-foreground">
              Не оценивает, хорошая ли компания. Не заменяет опрос сотрудников. Не ставит оценку при малом числе данных:
              тогда пишем «мало данных».
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Изменения методики: каждая версия публикуется с датой и списком изменений. Пороги будут уточняться по мере
          накопления данных.
        </p>
      </Section>
      <CtaBand title="Узнайте свой индекс" />
    </>
  )
}
