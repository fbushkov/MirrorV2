import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CheckList } from "@/components/site/check-list"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"

export const metadata: Metadata = {
  title: "Данные и 152-ФЗ",
  description: "Как Mirror собирает, хранит и удаляет данные: открытые источники, документы компании и анонимные интервью.",
}

export default function SecurityPage() {
  const blocks = [
    {
      title: "Бесплатный срез",
      items: ["Только открытые публикации", "Доступ к вашим системам не нужен", "Имена авторов отзывов в отчёт не попадают"],
    },
    {
      title: "Документы и данные компании",
      items: [
        "Передаются только по соглашению о конфиденциальности (NDA)",
        "Вы сами выбираете, какие документы передать",
        "Доступ к документам — только у эксперта проекта",
      ],
    },
    {
      title: "Интервью",
      items: [
        "Участие добровольное, с согласием на обработку данных",
        "Компания получает только темы и обезличенные цитаты",
        "Цитату не включаем, если по ней можно узнать человека",
      ],
    },
    {
      title: "Хранение",
      items: [
        <>Серверы в России: <Ph>[провайдер, город]</Ph></>,
        <>Записи и документы удаляем через <Ph>30 дней</Ph> после отчёта</>,
        "Доступ к сырым данным — только у эксперта проекта",
      ],
    },
    {
      title: "Модели ИИ",
      items: [
        <><Ph>[GigaChat / YandexGPT]</Ph> с хранением в РФ</>,
        "Данные клиентов не используются для обучения",
        "По запросу — обработка в вашем контуре",
      ],
    },
  ]
  return (
    <>
      <PageHero
        crumbs={[{ title: "Данные и 152-ФЗ" }]}
        eyebrow="Для службы безопасности и юристов"
        title="Данные и 152-ФЗ"
        description="Как мы собираем, храним и удаляем данные. Для согласования пришлём политику и соглашение о конфиденциальности."
      />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.title} className="glass rounded-3xl p-6">
              <h2 className="mb-4 text-xl font-semibold">{b.title}</h2>
              <CheckList items={b.items} />
            </div>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
