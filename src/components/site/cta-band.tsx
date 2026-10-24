import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Финальный призыв на внутренних страницах. На главной вместо него — форма заявки. */
export function CtaBand({
  title = "Начните с бесплатного среза",
  text = "Пришлём внешний срез за 3 рабочих дня. Доступ к вашим системам не нужен.",
  cta = "Получить бесплатный срез",
  href = "/start",
}: {
  title?: string
  text?: string
  cta?: string
  href?: string
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-[#c77bd6] px-6 py-14 text-center text-white md:py-20">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 invert" />
          <div className="relative mx-auto flex max-w-xl flex-col items-center gap-5">
            <h2 className="text-3xl font-semibold md:text-5xl md:leading-[1.08]">{title}</h2>
            <p className="text-white/85 md:text-lg">{text}</p>
            <Button asChild size="xl" className="mt-2 bg-white text-brand-700 hover:bg-white/90">
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
