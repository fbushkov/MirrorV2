import type { Metadata } from "next"
import { Suspense } from "react"
import { Section } from "@/components/site/section"
import { RequestForm } from "@/components/request/request-form"

export const metadata: Metadata = {
  title: "Заявка",
  description: "Оставьте заявку на бесплатный срез, диагностику, сопровождение или мониторинг.",
}

export default function RequestPage() {
  return (
    <div className="relative">
      <div className="glow-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]" />
      <Section className="pt-28 md:pt-36">
        <Suspense>
          <RequestForm />
        </Suspense>
      </Section>
    </div>
  )
}
