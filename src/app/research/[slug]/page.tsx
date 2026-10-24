import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { CheckList } from "@/components/site/check-list"
import { Ph } from "@/components/site/ph"
import { ARTICLES } from "@/content/research"

export function generateStaticParams() {
  return [{ slug: "ai-retail" }]
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  return { title: article?.title ?? "Исследование" }
}

export default async function ArticlePage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug && a.ready && !a.href)
  if (!article) notFound()

  return (
    <>
      <Section className="pt-28 md:pt-36" containerClassName="max-w-3xl">
        <Link href="/research" className="text-sm text-muted-foreground hover:text-foreground">
          ← Все исследования
        </Link>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-brand-accent/20 px-2.5 py-0.5 text-brand-50">{article.tag}</span>
          <span>{article.readTime}</span>
          <span className="rounded-full border border-status-warn/40 px-2 py-0.5 text-status-warn">
            <Ph>Данные условные</Ph>
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">{article.title}</h1>
        <div className="mt-8 flex flex-col gap-6 text-lg text-muted-foreground">
          <p>
            Человек, который думает о работе в сети, всё реже открывает страницу с отзывами. Он спрашивает у
            ассистента в телефоне: «Стоит ли идти работать в эту сеть?» Мы задали этот и ещё четыре вопроса Алисе,
            GigaChat и ChatGPT о <Ph>10 крупных сетях</Ph>.
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Что мы увидели</h2>
          <CheckList
            items={[
              <><Ph>В 7 случаях из 10</Ph> ассистенты пересказывают отзывы двух-трёхлетней давности</>,
              "Самая частая тема в ответах — переработки и отношение руководителей к сотрудникам, а не зарплата",
              "Ответы разных ассистентов об одной сети часто противоречат друг другу",
            ]}
          />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Почему это важно</h2>
          <p>
            Ответ ассистента звучит как мнение нейтрального эксперта. Если он опирается на старые негативные отзывы,
            образ работодателя портится раньше, чем человек увидит ваш карьерный сайт.
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Что можно сделать</h2>
          <p>
            Нейросети собирают ответ из того, что о вас написано. Сначала исправьте то, на что жалуются, иначе новые
            отзывы повторят старые. Потом — свежие честные истории сотрудников и ответы на критику.
          </p>
        </div>
        <div className="glass mt-12 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold">Узнайте, что ассистенты говорят о вас</h2>
          <p className="mt-2 text-muted-foreground">Входит в бесплатный срез, 3 рабочих дня.</p>
          <Button asChild variant="glow" size="xl" className="mt-5">
            <Link href="/request?type=scan">Получить срез</Link>
          </Button>
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
