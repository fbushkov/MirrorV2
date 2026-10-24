import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { ReportSwitch } from "@/components/site/report-switch"
import { CultureLayers } from "@/components/pulse/layers"
import { PulseDashboard } from "@/components/pulse/pulse-dashboard"

export const metadata: Metadata = {
  title: "Пример отчёта · Пульс культуры",
  description: "Демо-дашборд Пульса культуры: 10 метрик, разрыв с культурным кодом, сигналы и срезы с правилом пяти человек.",
}

export default function ExamplePulsePage() {
  return (
    <>
      <PageHero
        eyebrow="Данные условные"
        title="Так выглядит Пульс культуры"
        description="Дашборд для команды культуры, руководителей и топ-менеджмента. Меняйте фильтры и открывайте карточки метрик."
      />
      <Section className="pt-0 md:pt-0">
        <ReportSwitch active="pulse" />
        <PulseDashboard />
        <div className="mt-10">
          <p className="mb-4 text-lg font-semibold">Разрыв с культурным кодом</p>
          <CultureLayers />
        </div>
      </Section>
      <CtaBand title="Запустите Пульс в своей компании" text="Начнём с диагностики и первого замера." cta="Обсудить Пульс культуры" href="/start?type=pulse" />
    </>
  )
}
