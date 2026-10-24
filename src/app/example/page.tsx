import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { StatusPill } from "@/components/site/status"
import { CheckList } from "@/components/site/check-list"
import { BrandDynamicsChart } from "@/components/charts/brand-charts"
import { BANK_N, COMPETITORS } from "@/content/demo"

export const metadata: Metadata = {
  title: "Пример среза",
  description: "Как выглядит бесплатный срез Mirror: внешний индекс, карта обещаний, конкуренты и первые действия.",
}

function PageCard({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <article className="glass rounded-3xl p-6 md:p-10">
      <div className="mb-6 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{n}</span>
        <span className="rounded-full border border-border px-2 py-0.5">пример</span>
      </div>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {children}
    </article>
  )
}

export default function ExamplePage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Пример среза" }]}
        eyebrow="Пример бесплатного среза"
        title="Так выглядит срез, который вы получите"
        description="Основан на реальном отчёте по региональному банку. Название и детали изменены, цифры округлены."
      />
      <Section className="pt-0 md:pt-0" containerClassName="flex max-w-5xl flex-col gap-6">
        <PageCard n={`Страница 1 · главное · ${BANK_N.name} · ${BANK_N.size} · ${BANK_N.period}`} title="Вы теряете доверие IT и аналитиков: обещаете справедливую зарплату, а это самая частая жалоба">
          <p className="mb-6 text-muted-foreground">
            Коллектив, карьерный рост и официальное оформление сотрудники подтверждают. Зарплата и гибкий формат
            оспорены, и именно на них приходится основной недобор индекса.
          </p>
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Внешний индекс", "65", "надёжность высокая"],
              ["Обещания", "5 из 8", "подтверждены"],
              ["Вакансии без зарплаты", "8 из 28", "в том числе все IT-роли"],
            ].map(([l, v, n]) => (
              <div key={l} className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-xs text-muted-foreground">{l}</p>
                <p className="mt-1 text-3xl font-semibold">{v}</p>
                <p className="text-xs text-muted-foreground">{n}</p>
              </div>
            ))}
          </div>
          <h3 className="mb-3 font-semibold">Три действия</h3>
          <div className="overflow-hidden rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Действие</TableHead>
                  <TableHead>Ответственный</TableHead>
                  <TableHead>Срок</TableHead>
                  <TableHead className="pr-4">Зачем</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Указать зарплатные вилки во всех вакансиях", "Руководитель подбора", "2 недели", "Сейчас IT-кандидаты не видят цифр и сравнивают вас с федеральными банками вслепую"],
                  ["Убрать «справедливую зарплату» из текстов до пересмотра окладов", "HR-бренд", "2 недели", "Оспоренное обещание снижает доверие ко всем остальным"],
                  ["Описать правила гибридной работы для IT и бэк-офиса", "Директор по персоналу", "1 месяц", "Удалёнка не упоминается ни в одной вакансии, а кандидаты о ней спрашивают"],
                ].map((r) => (
                  <TableRow key={r[0]} className="hover:bg-white/[0.02]">
                    <TableCell className="pl-4 align-top font-medium whitespace-normal">{r[0]}</TableCell>
                    <TableCell className="align-top whitespace-normal">{r[1]}</TableCell>
                    <TableCell className="align-top">{r[2]}</TableCell>
                    <TableCell className="pr-4 align-top whitespace-normal text-muted-foreground">{r[3]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PageCard>

        <PageCard n="Страница 2 · обещания и конкуренты" title="Что подтверждается, а что нет">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Обещание</TableHead>
                  <TableHead>{BANK_N.name}</TableHead>
                  <TableHead>Федеральный банк А</TableHead>
                  <TableHead className="pr-4">Федеральный банк Б</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPETITORS.map((row) => (
                  <TableRow key={row.title} className="hover:bg-white/[0.02]">
                    <TableCell className="pl-4 font-medium">{row.title}</TableCell>
                    {row.values.map((v, i) => (
                      <TableCell key={i} className={i === 2 ? "pr-4" : undefined}>
                        <StatusPill status={v} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-status-ok/25 bg-status-ok/[0.06] p-5">
              <h3 className="mb-1 font-semibold text-status-ok">Где вы выигрываете</h3>
              <p className="text-sm text-muted-foreground">
                Самостоятельность и коллектив. «Больше свободы в решениях, чем в федеральных компаниях» — повторяющаяся
                тема отзывов. Об этом стоит говорить громче.
              </p>
            </div>
            <div className="rounded-2xl border border-status-bad/25 bg-status-bad/[0.06] p-5">
              <h3 className="mb-1 font-semibold text-status-bad">Где проигрываете</h3>
              <p className="text-sm text-muted-foreground">
                Зарплата IT и гибкий формат. Оба федеральных банка указывают вилки и описывают удалёнку.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-border p-4">
            <p className="mb-1 text-sm font-medium">Внешний бренд по месяцам</p>
            <BrandDynamicsChart className="h-64" />
          </div>
        </PageCard>

        <PageCard n="Страница 3 · что не видно снаружи" title="Чтобы понять причины разрывов, нужны данные изнутри">
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {[
              ["«У нас самый лучший начальник и коллектив. Только это удерживает. Очень жаль, что такие низкие зарплаты».", "сотрудник, Dreamjob"],
              ["«Низкая зарплата, повышения незначительные раз в год, нет системы грейдов».", "разработчик, Dreamjob"],
            ].map(([q, a]) => (
              <figure key={a} className="rounded-2xl bg-white/[0.04] p-5">
                <blockquote>{q}</blockquote>
                <figcaption className="mt-2 text-sm text-muted-foreground">{a}</figcaption>
              </figure>
            ))}
          </div>
          <h3 className="mb-3 font-semibold">Диагностика ответит на вопросы:</h3>
          <CheckList
            items={[
              "Подтверждают ли сами сотрудники то, что пишут в отзывах",
              "Что говорят внутренние документы и опросы о зарплатах, грейдах и формате работы",
              "Где внутренний бренд сильнее внешнего — и об этом стоит рассказывать",
              "Какой внутренний индекс у обещаний, по которым мало отзывов",
            ]}
          />
          <Button asChild variant="outline" size="xl" className="mt-6 rounded-xl">
            <Link href="/diagnostics">Подробнее о диагностике</Link>
          </Button>
        </PageCard>
      </Section>
      <CtaBand title="Получите такой срез по своей компании" cta="Получить срез" />
    </>
  )
}
