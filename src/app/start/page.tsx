import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { StartForm } from "@/components/start/start-form"
import { CONTACTS } from "@/content/site"

export const metadata: Metadata = {
  title: "Заявка",
  description: "Оставьте заявку на бесплатный срез, диагностику или сопровождение.",
}

export default function StartPage() {
  return (
    <>
      <PageHero eyebrow="Заявка" title="Расскажите о компании" description="Ответим в течение рабочего дня. Для бесплатного среза хватит названия компании и контакта." />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="surface-raised p-6 md:p-8">
            <Suspense>
              <StartForm variant="full" />
            </Suspense>
          </div>
          <aside className="flex flex-col gap-3">
            <div className="surface p-6">
              <p className="mb-4 font-semibold">Что будет дальше</p>
              <ol className="flex flex-col gap-3 text-[15px]">
                {["Ответим в течение рабочего дня", "Уточним конкурентов для сравнения", "Через 3 рабочих дня пришлём срез", "Созвонимся на 30 минут и разберём его"].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <div className="surface p-6 text-sm">
              <p className="mb-2 font-semibold">Удобнее написать?</p>
              <p className="text-muted-foreground">
                <span className="select-all">{CONTACTS.email}</span>
                <br />
                <span className="select-all">{CONTACTS.phone}</span> · {CONTACTS.phoneNote}
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
