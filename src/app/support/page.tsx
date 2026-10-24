import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { CheckList } from "@/components/site/check-list"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"
import { BrandDynamicsChart, QuarterChart } from "@/components/charts/brand-charts"

export const metadata: Metadata = {
  title: "Сопровождение и мониторинг",
  description: "Эксперт ведёт изменения вместе с вами, а мониторинг показывает, как меняется индекс культуры каждый квартал.",
}

export default function SupportPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Сопровождение и мониторинг" }]}
        eyebrow="После диагностики"
        title={
          <>
            Поможем изменить и <span className="text-gradient">проверить результат</span>
          </>
        }
        description="Изменения в культуре делают руководители, каждый день. Мы рядом, пока новые правила не станут привычкой, и регулярно замеряем индекс — снаружи и изнутри."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div id="support" className="glass flex scroll-mt-28 flex-col rounded-3xl p-6 md:p-8">
            <span className="w-fit rounded-full bg-brand-accent/20 px-3 py-1 text-xs"><Ph>3–6 месяцев · ежемесячно</Ph></span>
            <h2 className="mt-4 mb-5 text-3xl font-semibold">Сопровождение</h2>
            <CheckList
              items={[
                "Эксперт раз в две недели работает с руководителями и HR",
                "Корректируем EVP и коммуникации так, чтобы их подтверждали отзывы и опыт сотрудников",
                "Разбираем процессы, на которые жалуются сотрудники: обратная связь, развитие, условия работы",
                "Переписываем тексты вакансий и карьерного сайта без оспоренных обещаний",
                "Каждый месяц — отчёт по индексу и ключевым показателям",
              ]}
            />
            <p className="mt-6 text-3xl font-semibold"><Ph>от 120 000 ₽ / мес</Ph></p>
            <Button asChild variant="glow" size="xl" className="mt-5 w-fit">
              <Link href="/request?type=support">Обсудить сопровождение</Link>
            </Button>
          </div>
          <div id="monitoring" className="glass flex scroll-mt-28 flex-col rounded-3xl p-6 md:p-8">
            <span className="w-fit rounded-full bg-chart-2/15 px-3 py-1 text-xs text-chart-2">Подписка</span>
            <h2 className="mt-4 mb-5 text-3xl font-semibold">Мониторинг</h2>
            <CheckList
              items={[
                "Парсер регулярно обновляет внешние данные: отзывы, упоминания, ответы нейросетей",
                "Повторный внутренний замер раз в квартал",
                "Сигнал, если показатель просел или появилась новая тема",
                "Сравнение с конкурентами в динамике",
              ]}
            />
            <p className="mt-6 text-3xl font-semibold"><Ph>от 35 000 ₽ / мес</Ph></p>
            <Button asChild variant="outline" size="xl" className="mt-5 w-fit rounded-xl">
              <Link href="/request?type=monitoring">Подключить мониторинг</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Метрики"
          title="По каким показателям видно изменения"
          description="Все показатели считаются отдельно для внешней и внутренней стороны бренда."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-3xl p-5 md:p-6">
            <p className="mb-2 text-sm font-medium">Индекс по месяцам · пример</p>
            <BrandDynamicsChart />
          </div>
          <div className="glass rounded-3xl p-5 md:p-6">
            <p className="mb-2 text-sm font-medium">Индекс по кварталам · пример</p>
            <QuarterChart className="h-80" />
          </div>
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Индекс культуры", "Сколько обещаний подтверждаются снаружи и изнутри."],
            ["Разрыв", "Разница внешнего и внутреннего индекса по каждому обещанию."],
            ["Тональность", "Доля позитивных и негативных упоминаний по источникам."],
            ["Ответы нейросетей", "Советуют ли ассистенты вас как работодателя."],
          ].map(([t, d]) => (
            <li key={t} className="glass rounded-3xl p-6">
              <h3 className="mb-2 font-semibold">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  )
}
