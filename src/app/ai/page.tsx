import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"

export const metadata: Metadata = {
  title: "Нейросети о вас",
  description: "Что Алиса, GigaChat и ChatGPT рассказывают кандидатам о вашей компании и на какие источники опираются.",
}

export default function AiPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Нейросети о вас" }]}
        eyebrow="Новое"
        title={
          <>
            Что нейросети рассказывают о вашей компании <span className="text-gradient">как о работодателе</span>
          </>
        }
        description="Люди всё чаще не читают отзывы, а спрашивают у ассистента. Мы задаём те же вопросы Алисе, GigaChat и ChatGPT и показываем ответы и их источники."
      >
        <Button asChild variant="glow" size="xl">
          <Link href="/request?type=scan">
            Проверить мою компанию <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </PageHero>
      <Section className="pt-0 md:pt-0">
        <div className="glass mx-auto max-w-3xl rounded-3xl p-6 md:p-8">
          <div className="flex gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
              <UserRound className="size-4" />
            </span>
            <div className="rounded-2xl rounded-tl-sm bg-white/[0.05] px-4 py-3">
              <p className="text-xs text-muted-foreground">Вопрос</p>
              <p>«Стоит ли идти работать в <Ph>[компания]</Ph>?»</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-accent/25">
              <Bot className="size-4" />
            </span>
            <div className="rounded-2xl rounded-tl-sm border border-brand-accent/30 bg-brand-accent/10 px-4 py-3">
              <p className="text-xs text-muted-foreground">Ответ ассистента</p>
              <p>«Сотрудники отмечают стабильную зарплату, но часто жалуются на переработки и отсутствие обучения…»</p>
              <p className="mt-2 text-xs text-status-warn">опирается на 3 отзыва 2022 года · пример</p>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeader eyebrow="Что проверяем" title="Пять вопросов, которые задают ассистентам" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["«Стоит ли идти работать в…»", "Советует, предупреждает или отговаривает."],
            ["«Какие минусы у работы в…»", "Какие претензии нейросеть считает главными."],
            ["«Сколько платят в…»", "Совпадают ли цифры с вашими вакансиями."],
            ["«Где лучше: у вас или у конкурента»", "Кого ассистент советует при сравнении."],
            ["«Какая культура в компании…»", "Совпадает ли описание с вашим EVP и с тем, что говорят сотрудники."],
          ].map(([q, d]) => (
            <li key={q} className="glass rounded-3xl p-6">
              <h3 className="mb-2 font-semibold">{q}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
          <li className="rounded-3xl border border-dashed border-border p-6">
            <h3 className="mb-2 font-semibold">Что с этим делать</h3>
            <p className="text-sm text-muted-foreground">
              Ответы меняются, когда меняется то, что о вас пишут. Покажем, какие источники влияют сильнее всего. Сначала
              исправьте то, на что жалуются, иначе новые отзывы повторят старые.
            </p>
          </li>
        </ul>
      </Section>
      <CtaBand title="Узнайте, что ассистенты говорят о вас" text="Входит в бесплатный срез, 3 рабочих дня." cta="Получить срез" />
    </>
  )
}
