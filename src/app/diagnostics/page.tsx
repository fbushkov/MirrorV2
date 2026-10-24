import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FileText, MessagesSquare, ClipboardList, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { CheckList } from "@/components/site/check-list"
import { CtaBand } from "@/components/site/cta-band"
import { Ph } from "@/components/site/ph"
import { GapDivergingChart } from "@/components/charts/brand-charts"

export const metadata: Metadata = {
  title: "Диагностика",
  description: "Диагностика внешнего и внутреннего бренда работодателя с экспертом: документы, данные компании и анонимные интервью.",
}

const WEEKS = [
  ["1", "Встреча с первым лицом и HR, разбор внешнего среза, список документов и план интервью", "1 час, список подразделений"],
  ["1–2", "Анализ документов и данных компании: EVP, политики, внутренние коммуникации, результаты опросов", "Документы по списку (под NDA)"],
  ["2–3", "Анонимные интервью с сотрудниками разных подразделений и уровней", "Письмо сотрудникам от руководителя (шаблон даём)"],
  ["4", "Внутренний индекс, карта разрывов, план на 90 дней, встреча по итогам", "1 час встречи"],
]

export default function DiagnosticsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Диагностика" }]}
        eyebrow={<Ph>Диагностика · около 4 недель</Ph>}
        title={
          <>
            Проверьте бренд <span className="text-gradient">изнутри</span> — вместе с экспертом
          </>
        }
        description="К внешней картине добавляем внутреннюю: документы и данные компании, опросы и анонимные интервью с сотрудниками. Каждое обещание проверяем дважды — снаружи и изнутри — и показываем на графиках, где бренд проседает, а где растёт."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="glow" size="xl">
            <Link href="/request?type=diagnostics">
              Обсудить диагностику <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="rounded-xl">
            <Link href="/dashboard">Пример дашборда</Link>
          </Button>
        </div>
      </PageHero>

      <Section>
        <SectionHeader eyebrow="Когда нужна" title="Ситуации, с которыми к нам приходят" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Срез показал разрывы", "Внешний индекс ниже, чем хотелось бы, и нужно понять причины изнутри."],
            ["Новое EVP или ребрендинг", "Проверить, что новые обещания выдержат и отзывы, и опыт сотрудников."],
            ["Слияние или новый собственник", "Две культуры под одной вывеской: где они совпадают, а где нет."],
            ["Внутреннее и внешнее не сходятся", "Опросы вовлечённости хорошие, а отзывы — нет. Или наоборот."],
          ].map(([t, d]) => (
            <li key={t} className="glass rounded-3xl p-6">
              <h3 className="mb-2 font-semibold">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader eyebrow="Внутренняя проверка" title="Что добавляется к внешнему срезу" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileText, t: "Документы", d: "EVP, политики, положения о компенсациях и развитии, внутренние коммуникации." },
            { icon: ClipboardList, t: "Данные компании", d: "Результаты опросов вовлечённости и удовлетворённости, eNPS — если они есть." },
            { icon: MessagesSquare, t: "Анонимные интервью", d: "С сотрудниками разных подразделений и уровней. Имена в отчёт не попадают." },
            { icon: Users, t: "Эксперт", d: "Ведёт проект от первой встречи до плана изменений и разбора с руководством." },
          ].map((x) => (
            <div key={x.t} className="glass rounded-3xl p-6">
              <x.icon className="mb-4 size-6 text-chart-2" />
              <h3 className="mb-2 font-semibold">{x.t}</h3>
              <p className="text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              className="mb-6 md:mb-8"
              eyebrow="Результат"
              title="Карта разрывов: снаружи и изнутри"
              description="Отрицательная разница — репутация опережает реальность, и скоро это покажут новые отзывы. Положительная — вы недорассказываете о сильных сторонах."
            />
            <CheckList
              items={[
                "Страница для первого лица: главный разрыв и три решения",
                "Внешний и внутренний индекс культуры по каждому обещанию",
                "Графики просадок и подъёмов по обеим сторонам бренда",
                "Приоритеты с ответственным, сроком и метрикой",
                "План на 90 дней: что меняем, что перестаём обещать",
                "Обезличенные цитаты сотрудников по каждой теме",
              ]}
            />
          </div>
          <div className="glass rounded-3xl p-5 md:p-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Изнутри минус снаружи, п. · Банк N</p>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">пример</span>
            </div>
            <GapDivergingChart />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="По неделям" title="Как идёт работа" />
        <div className="glass overflow-hidden rounded-3xl">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24 pl-6">Неделя</TableHead>
                <TableHead>Что делаем</TableHead>
                <TableHead className="pr-6">Что нужно от вас</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WEEKS.map(([w, what, need]) => (
                <TableRow key={w} className="hover:bg-white/[0.02]">
                  <TableCell className="pl-6 align-top font-medium">{w}</TableCell>
                  <TableCell className="align-top whitespace-normal">{what}</TableCell>
                  <TableCell className="pr-6 align-top whitespace-normal text-muted-foreground">{need}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-brand-accent/40 bg-brand-accent/10 p-6 md:p-8">
            <p className="text-sm text-muted-foreground">Стоимость</p>
            <p className="mt-2 text-4xl font-semibold">
              <Ph>от 180 000 ₽</Ph>
            </p>
            <p className="mt-2 text-muted-foreground">Фиксированная цена, зависит от численности и числа подразделений.</p>
            <ul className="mt-5 flex flex-col gap-2 text-[15px]">
              <li><Ph>до 300 сотрудников — 180 000 ₽</Ph></li>
              <li><Ph>300–1000 — 260 000 ₽</Ph></li>
              <li><Ph>больше 1000 — по запросу</Ph></li>
            </ul>
            <Button asChild variant="glow" size="xl" className="mt-6">
              <Link href="/request?type=diagnostics">Обсудить диагностику</Link>
            </Button>
          </div>
          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="mb-4 text-xl font-semibold">Как происходит оплата</h3>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-muted-foreground">
              <li>Вы оставляете заявку (заявка не является договором, окончательные условия фиксируются в счёте и договоре).</li>
              <li>Менеджер связывается с вами и запрашивает реквизиты компании.</li>
              <li>Мы выставляем счёт и договор на e-mail вашей бухгалтерии.</li>
              <li>После оплаты по безналичному расчёту запускаем диагностику.</li>
            </ol>
            <p className="mt-5 text-sm text-muted-foreground">
              Если срез ещё не делали, начнём с него — он бесплатный, и по нему проще оценить масштаб работы.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand title="Обсудим диагностику" text="Расскажите о компании и задаче — в течение рабочего дня предложим план и стоимость." cta="Обсудить диагностику" href="/request?type=diagnostics" />
    </>
  )
}
