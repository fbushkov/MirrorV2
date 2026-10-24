import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { FaqList } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"
import { FAQ_PRICING } from "@/content/faq"
import { CONTACTS } from "@/content/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Цены",
  description: "Внешний срез — бесплатно. Диагностика, сопровождение и мониторинг — с экспертом и внутренней проверкой.",
}

const PLANS = [
  {
    title: "Срез",
    price: "0 ₽",
    free: true,
    note: "Внешний бренд · 3 рабочих дня",
    features: ["Внешний индекс культуры", "Карта обещаний", "Графики просадок и подъёмов снаружи", "2–3 конкурента", "Ответы нейросетей", "30 минут разбора с экспертом"],
    cta: { label: "Получить срез", href: "/request?type=scan" },
  },
  {
    title: "Диагностика",
    price: "от 180 000 ₽",
    note: "Внешний и внутренний бренд · ~4 недели",
    highlight: true,
    features: ["Всё из среза", "Анализ документов и данных компании", "Анонимные интервью с сотрудниками", "Внутренний индекс и карта разрывов", "Приоритеты и план на 90 дней", "Эксперт на всём проекте"],
    cta: { label: "Обсудить", href: "/request?type=diagnostics" },
  },
  {
    title: "Сопровождение",
    price: "от 120 000 ₽ / мес",
    note: "3–6 месяцев",
    features: ["Работа с руководителями раз в две недели", "Корректировка EVP и коммуникаций", "Тексты вакансий и карьерного сайта", "Ежемесячный отчёт по индексу"],
    cta: { label: "Обсудить", href: "/request?type=support" },
  },
  {
    title: "Мониторинг",
    price: "от 35 000 ₽ / мес",
    note: "Подписка",
    features: ["Регулярное обновление внешних данных", "Внутренний замер раз в квартал", "Сигналы о просадках и новых темах", "Конкуренты в динамике"],
    cta: { label: "Подключить", href: "/request?type=monitoring" },
  },
]

export default function PricingPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Цены" }]}
        eyebrow="Форматы и цены"
        title={
          <>
            Первый срез — <span className="text-gradient">бесплатно</span>
          </>
        }
        description="Внешний срез через сервис Mirror бесплатен для каждой компании, которая хочет с нами сотрудничать. Платной становится работа эксперта и внутренняя проверка с документами и данными компании."
      />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.title}
              className={cn(
                "flex flex-col rounded-3xl p-6",
                p.highlight ? "border border-brand-accent/50 bg-brand-accent/12 shadow-[0_20px_60px_-30px_rgb(168_71_184/0.8)]" : "glass",
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{p.title}</h2>
                {p.free && <span className="rounded-full bg-chart-2/15 px-2.5 py-0.5 text-xs text-chart-2">бесплатно</span>}
              </div>
              <p className="mt-4 text-3xl font-semibold">{p.free ? p.price : <Ph>{p.price}</Ph>}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
              <ul className="my-6 flex flex-col gap-2.5 text-[15px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-chart-2" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={p.free || p.highlight ? "glow" : "outline"} size="xl" className="mt-auto rounded-xl">
                <Link href={p.cta.href}>{p.cta.label}</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="glass mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl p-6 md:flex-row md:items-center md:p-8">
          <div>
            <h3 className="text-xl font-semibold">Агентствам и консультантам</h3>
            <p className="mt-1 text-muted-foreground">Внешний аудит HR-бренда под вашим брендом. Три отчёта — бесплатно.</p>
          </div>
          <Button asChild variant="outline" size="xl" className="rounded-xl">
            <Link href="/agencies">Условия для агентств</Link>
          </Button>
        </div>
        <p className="mt-8 text-center text-muted-foreground">
          Нужен индивидуальный формат? Пишите на{" "}
          <a href={`mailto:${CONTACTS.email}`} className="text-brand-200 underline underline-offset-4">
            {CONTACTS.email}
          </a>{" "}
          — подберём решение вместе.
        </p>
      </Section>
      <Section>
        <SectionHeader eyebrow="Вопрос-ответ" title="Цены и оплата" />
        <div className="mx-auto max-w-3xl">
          <FaqList items={FAQ_PRICING} />
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
