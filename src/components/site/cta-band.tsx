import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "./section"

export function CtaBand({
  eyebrow = "загляните в своё отражение",
  title = "Загляните в mirror",
  text = "Узнайте, что рынок думает о вашей компании. Оставьте заявку, и мы свяжемся с вами в течение одного рабочего дня. Мы не отправляем рекламу и спам.",
  cta = "Получить бесплатный срез",
  href = "/request?type=scan",
}: {
  eyebrow?: string
  title?: string
  text?: string
  cta?: string
  href?: string
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-brand-800 px-6 py-12 md:px-14 md:py-16">
          <div className="glow-bg pointer-events-none absolute inset-0" />
          <div className="relative flex max-w-2xl flex-col items-start gap-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
            <p className="text-base text-pretty text-brand-50/80 md:text-lg">{text}</p>
            <Button asChild variant="glow" size="xl" className="mt-2">
              <Link href={href}>
                {cta}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
