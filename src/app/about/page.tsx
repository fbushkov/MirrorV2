import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"
import { CONTACTS } from "@/content/site"

export const metadata: Metadata = {
  title: "О нас",
  description: "Команда Mirror: эксперт по корпоративной культуре, сервисный дизайнер и разработчик.",
}

const TEAM = [
  {
    initials: "ЭК",
    role: "Эксперт по корпоративной культуре · ведёт проекты",
    text: "12 лет в управлении персоналом и внутренних коммуникациях. Работала в [компании], отвечала за [задачи].",
    quote: "Культура — это не ценности на стене, а то, что происходит с сотрудником каждый день.",
    links: "Telegram: @username · TenChat: tenchat.ru/username",
  },
  { initials: "СД", role: "Продуктовый и сервисный дизайнер", text: "Превращает выводы в процессы: адаптация, обратная связь, путь сотрудника." },
  { initials: "РЗ", role: "Разработчик", text: "Парсер Mirror, сбор и обработка данных, ИИ-аналитика, защита данных." },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "О нас" }]}
        eyebrow="О нас"
        title="Нас трое, и каждый проект ведём сами"
        description="С вами работает один эксперт от первой встречи до плана изменений. ИИ и парсер Mirror берут на себя рутину: собрать, расшифровать, сгруппировать."
      />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {TEAM.map((m) => (
            <article key={m.initials} className="glass flex flex-col gap-4 rounded-3xl p-6">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-accent/25 text-lg font-semibold">{m.initials}</span>
              <div>
                <p className="font-semibold">
                  <Ph>Имя Фамилия</Ph>
                </p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
              <p className="text-muted-foreground">{m.initials === "ЭК" ? <Ph>{m.text}</Ph> : m.text}</p>
              {m.quote && <blockquote className="border-l-2 border-brand-accent pl-4">«<Ph>{m.quote}</Ph>»</blockquote>}
              {m.links && (
                <p className="mt-auto text-sm text-muted-foreground">
                  <Ph>{m.links}</Ph>
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="glass mt-6 grid gap-6 rounded-3xl p-6 md:grid-cols-3 md:p-8">
          <div>
            <p className="text-sm text-muted-foreground">Почта</p>
            <a href={`mailto:${CONTACTS.email}`} className="text-lg hover:text-brand-200">{CONTACTS.email}</a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Телефон ({CONTACTS.phoneNote})</p>
            <a href={CONTACTS.phoneHref} className="text-lg hover:text-brand-200">{CONTACTS.phone}</a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telegram</p>
            <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="text-lg hover:text-brand-200">{CONTACTS.telegramLabel}</a>
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
