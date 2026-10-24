import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { CheckList, Steps } from "@/components/site/check-list"
import { CtaBand } from "@/components/site/cta-band"
import { BrandDynamicsChart } from "@/components/charts/brand-charts"
import { SOURCES_EXTERNAL } from "@/content/site"

export const metadata: Metadata = {
  title: "Бесплатный срез",
  description: "Внешний срез бренда работодателя через сервис Mirror: бесплатно, за 3 рабочих дня, без доступа к вашим системам.",
}

export default function ScanPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Бесплатный срез" }]}
        eyebrow="Бесплатно · 3 рабочих дня"
        title={
          <>
            Как вас видят снаружи: <span className="text-gradient">бесплатный срез</span>
          </>
        }
        description="Парсер Mirror соберёт, что вы обещаете в вакансиях и соцсетях, и проверит каждое обещание по отзывам, упоминаниям в медиа и ответам нейросетей. Сравним с 2–3 конкурентами. Первый внешний срез бесплатен для каждой компании, которая хочет с нами сотрудничать."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="glow" size="xl">
            <Link href="/request?type=scan">
              Получить бесплатный срез <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="rounded-xl">
            <Link href="/example">Посмотреть пример</Link>
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass rounded-3xl p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-semibold">Что внутри</h2>
            <CheckList
              items={[
                "Внешний индекс культуры и карта обещаний: что подтверждено, что оспорено",
                "Графики по внешнему бренду: где показатели проседают, а где растут",
                "Сравнение с 2–3 компаниями, с которыми вы конкурируете за людей",
                "Что отвечают Алиса и GigaChat на вопрос «стоит ли идти к вам работать»",
                "3 первых действия: что исправить и о чём говорить чаще",
                "30 минут разбора с экспертом",
              ]}
            />
          </div>
          <div className="glass rounded-3xl p-6 md:p-8">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Просадки и подъёмы</h2>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">пример</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              В срезе — внешняя линия. Внутренняя появится после диагностики.
            </p>
            <BrandDynamicsChart />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Источники" title="Только открытые данные" description="Доступ к вашим системам не нужен — достаточно названия компании и ссылки на страницу работодателя на hh.ru." />
        <div className="flex flex-wrap justify-center gap-2.5">
          {SOURCES_EXTERNAL.map((s) => (
            <span key={s} className="rounded-full border border-chart-1/25 bg-chart-1/[0.06] px-4 py-1.5 text-sm">
              {s}
            </span>
          ))}
          <span className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">медиа и поисковая выдача</span>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Как это происходит" title="Три шага до среза" />
        <Steps
          steps={[
            { title: "Заявка", text: "Вы оставляете заявку. В течение рабочего дня уточним конкурентов и каналы компании." },
            { title: "3 рабочих дня", text: "Парсер собирает данные, ИИ сопоставляет обещания с внешним отражением. Пришлём срез на 2–3 страницы." },
            { title: "Разбор", text: "30 минут с экспертом: что значат цифры и нужна ли внутренняя проверка." },
          ]}
        />
        <div className="mt-10 rounded-3xl border border-dashed border-border p-6 text-center text-muted-foreground md:p-8">
          Срез показывает только внешнюю сторону бренда. Чтобы проверить обещания изнутри — документами, данными и
          интервью с сотрудниками, — подключается эксперт.{" "}
          <Link href="/diagnostics" className="text-brand-200 underline underline-offset-4">
            О диагностике
          </Link>
        </div>
      </Section>

      <CtaBand title="Начните с бесплатного среза" text="Через 3 рабочих дня пришлём карту ваших обещаний и сравнение с конкурентами, потом созвонимся на 30 минут." />
    </>
  )
}
