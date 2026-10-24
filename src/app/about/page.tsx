import type { Metadata } from "next"
import { Mail, MessageCircle, Phone } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"
import { CONTACTS } from "@/content/site"

export const metadata: Metadata = {
  title: "О нас",
  description: "Кто делает Mirror, во что мы верим и как с нами связаться.",
}

const TEAM = [
  { initials: "ЭК", role: "Эксперт по корпоративной культуре", text: "Ведёт проекты от первой встречи до плана изменений." },
  { initials: "СД", role: "Продуктовый дизайнер", text: "Превращает выводы в понятные процессы и отчёты." },
  { initials: "РЗ", role: "Разработчик", text: "Отвечает за сбор данных, аналитику и их защиту." },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О нас"
        title="Помогаем компаниям обещать то, что выдержит проверку"
        description="Раньше компании придумывали яркое EVP и упаковывали его. Теперь люди проверяют каждое слово. Поэтому мы начинаем с реальности, а обещания строим уже на ней."
      />

      <Section className="pt-0 md:pt-0">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="surface p-7">
            <p className="mb-2 text-lg font-semibold">Сначала проверить, потом говорить</p>
            <p className="text-muted-foreground">
              Сильнее всего бренд работодателя портят обещания, которые не выполняются. Честная скромная формулировка
              работает лучше красивой и пустой.
            </p>
          </div>
          <div className="surface p-7">
            <p className="mb-2 text-lg font-semibold">Изнутри видно раньше</p>
            <p className="text-muted-foreground">
              То, что сотрудники обсуждают сегодня, завтра окажется в отзывах. Мы смотрим на обе стороны, чтобы вы
              увидели разрыв до того, как он станет публичным.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-card">
        <SectionHeader eyebrow="Команда" title="Каждый проект ведём сами" description="С вами работает один эксперт. Рутину — собрать, расшифровать, сгруппировать — берут на себя наши инструменты." />
        <div className="grid gap-3 md:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.initials} className="surface flex flex-col gap-4 bg-background p-6">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-lg font-semibold text-primary">{m.initials}</span>
              <div>
                <p className="font-semibold">
                  <Ph>Имя Фамилия</Ph>
                </p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
              <p className="text-[15px] text-muted-foreground">{m.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="contacts">
        <SectionHeader eyebrow="Контакты" title="Напишите или позвоните" description="Отвечаем в течение рабочего дня." />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: Mail, t: "Почта", v: CONTACTS.email, href: `mailto:${CONTACTS.email}` },
            { icon: Phone, t: `Телефон · ${CONTACTS.phoneNote}`, v: CONTACTS.phone, href: CONTACTS.phoneHref },
            { icon: MessageCircle, t: "Telegram", v: CONTACTS.telegramLabel, href: CONTACTS.telegram },
          ].map((c) => (
            <a key={c.t} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="surface flex flex-col items-center gap-2 p-7 text-center transition-colors hover:border-brand-200">
              <span className="mb-2 inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <span className="text-sm text-muted-foreground">{c.t}</span>
              <span className="font-medium select-all">{c.v}</span>
            </a>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
