import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { DemoSwitch } from "@/components/site/demo-switch"
import { CultureLayers } from "@/components/pulse/layers"
import { CrossChecks } from "@/components/metrics/cross-checks"
import { PulseDashboard } from "@/components/pulse/pulse-dashboard"

export const metadata: Metadata = {
  title: "Демо · Дашборд здоровья корпоративной культуры",
  description: "Демо-дашборд здоровья корпоративной культуры: 10 метрик, разрыв с культурным кодом, сигналы и срезы с правилом пяти человек.",
}

export default function HealthDemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Демо · данные условные"
        title="Дашборд здоровья корпоративной культуры"
        description="Дашборд для команды культуры, руководителей и топ-менеджмента. Меняйте фильтры и открывайте карточки метрик."
      />
      <Section className="pt-0 md:pt-0">
        <DemoSwitch active="health" />
        <PulseDashboard />
        <div className="mt-10">
          <p className="mb-4 text-lg font-semibold">Разрыв с культурным кодом</p>
          <CultureLayers />
        </div>
        <div className="mt-14 flex flex-col items-start gap-2 border-t border-border pt-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
            <span className="size-1.5 rounded-full bg-brand-500" aria-hidden />
            Если подключена оценка HR-бренда
          </span>
          <p className="text-xl font-semibold">Снаружи и изнутри вместе</p>
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
            Показатели направлений не смешиваем: у каждого своя шкала. Сверяем только темы.
          </p>
          <CrossChecks />
        </div>
      </Section>
      <CtaBand title="Запустите дашборд в своей компании" text="Начнём с диагностики и первого замера." cta="Обсудить кампанию" href="/start?type=health" />
    </>
  )
}
