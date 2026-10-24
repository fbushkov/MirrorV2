import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeader } from "@/components/site/section"
import { FaqList } from "@/components/site/faq-list"
import { CtaBand } from "@/components/site/cta-band"
import { StatusPill } from "@/components/site/status"
import { Ph } from "@/components/site/ph"
import { IndexGauge } from "@/components/charts/brand-charts"
import { FAQ_CULTURE } from "@/content/faq"

export const metadata: Metadata = {
  title: "Индекс культуры",
  description: "Индекс культуры — метрика доверия к бренду: насколько обещания работодателя совпадают с реальностью снаружи и изнутри.",
}

export default function CultureIndexPage() {
  return (
    <>
      <PageHero
        crumbs={[{ title: "Индекс культуры" }]}
        eyebrow="Индекс культуры как метрика доверия к бренду"
        title={
          <>
            Насколько ваши обещания <span className="text-gradient">совпадают с опытом людей</span>
          </>
        }
        description="Индекс культуры — оценка того, насколько обещания работодателя совпадают с реальностью внутри. И если слова и дела расходятся, это всё чаще воспринимается как показная забота, как маркетинговая манипуляция."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="glow" size="xl">
            <Link href="/request?type=scan">Узнать свой индекс</Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="rounded-xl">
            <Link href="/methodology">Как считаем</Link>
          </Button>
        </div>
      </PageHero>

      <Section className="pt-0 md:pt-0">
        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Пример · Банк N</p>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">пример</span>
            </div>
            <IndexGauge value={65} label="внешний индекс" />
            <p className="text-center text-sm text-muted-foreground">5 из 8 обещаний подтверждены</p>
            <div className="mt-4 flex justify-center gap-2">
              <StatusPill status="ok" />
              <StatusPill status="warn" />
              <StatusPill status="bad" />
            </div>
            <p className="mt-5 rounded-2xl bg-white/[0.04] p-4 text-sm">
              Почти половину недобора даёт одно обещание: «справедливая зарплата».
            </p>
          </div>
          <div className="flex flex-col gap-6 text-lg md:text-xl">
            <p>
              О нас говорят не только наши страницы и пресс‑релизы — о нас говорит рынок. По исследованиям рынка труда,
              большинство соискателей перед откликом читают отзывы о работодателе. Цифры доходят до 60–80% в зависимости
              от сегмента. Контент сотрудников стабильно даёт больший охват и вовлечённость, чем официальные каналы
              компании.
            </p>
            <p className="text-muted-foreground">
              Иначе говоря, образ складывается снаружи, а не только из того, что мы сами о себе рассказываем. А то, что
              происходит внутри, рано или поздно оказывается снаружи.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6 text-muted-foreground md:text-lg">
            <p>
              По данным международных исследований доверия к брендам, около 60% людей готовы поддерживать или
              бойкотировать компании из‑за несоответствия заявленных ценностей реальным действиям. На рынке труда до
              половины кандидатов отказываются от оффера, если внешний фон противоречит EVP.
            </p>
            <p>
              Почти всё мгновенно становится публичным. Несоответствия быстро всплывают, и гораздо дешевле говорить то,
              что можно подтвердить, чем затем тушить репутационные пожары.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/culture/hand.jpg" alt="" className="w-full rounded-3xl opacity-90" />
          </div>
          <div className="flex flex-col gap-6 text-muted-foreground md:text-lg">
            <p>
              Любая внутренняя диагностика полезна для управления, но это взгляд заинтересованной стороны. Для рынка
              доверие выше к внешней, сопоставимой оценке — когда правила общие, источник независимый, а выводы основаны
              на том, что видно снаружи.
            </p>
            <p>
              Поэтому Mirror показывает обе стороны рядом: внешний индекс — по открытым источникам, внутренний — по
              документам, данным и интервью. Речь не о том, «хорошая ли компания вообще», а о том, совпадают ли её
              публичные обещания с реальным опытом людей.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/culture/radio.jpg" alt="" className="w-full rounded-3xl opacity-90" />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader align="left" eyebrow="Это важно не только для HR" title="Разрыв между словами и делами бьёт по всем цифрам" />
        <ul className="grid gap-5 md:grid-cols-2">
          {[
            ["Бренд", "Люди верят людям. Если сотрудники не готовы делиться реальными историями, компания теряет самый дешёвый и доверенный канал. И наоборот — совпадение слов и практики поднимает отклик на коммуникации и экономит медийный бюджет."],
            ["Бизнес", "Целостность — это скорость. Когда внутри доверяют словам руководства, решения внедряются быстрее; при низком доверии сроки растягиваются, растут издержки и риски сбоев."],
            ["Найм", "Когда обещания не подтверждаются, падает отклик и растёт доля отказов от оффера. Время закрытия позиций увеличивается, а стоимость привлечения растёт."],
            ["Удержание", "Несоответствие ожиданий и факта — частая причина разочарования в работодателе. Честные обещания сохраняют доверие тех, кто уже работает в компании."],
          ].map(([t, d]) => (
            <li key={t} className="glass rounded-3xl p-6 md:p-7">
              <h3 className="mb-2 text-xl font-semibold">{t}</h3>
              <p className="text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader eyebrow="Три уровня" title="Индекс растёт вместе с данными" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { tag: "в бесплатном срезе", t: "Внешний индекс", d: "Обещания из вакансий и соцсетей против отзывов, упоминаний и ответов нейросетей.", tone: "text-chart-1 bg-chart-1/10" },
            { tag: "в диагностике", t: "Внутренний индекс", d: "Те же обещания, проверенные документами, данными компании и анонимными интервью. Разница внешнего и внутреннего показывает, где репутация отстаёт от реальности или опережает её.", tone: "text-chart-2 bg-chart-2/10" },
            { tag: "по мере роста базы", t: "Место в отрасли", d: <>Процентиль среди работодателей вашей отрасли и региона по тем же правилам. Сейчас в базе <Ph>N компаний</Ph>.</>, tone: "text-chart-3 bg-chart-3/10" },
          ].map((x) => (
            <div key={x.t} className="glass rounded-3xl p-6">
              <span className={`rounded-full px-3 py-1 text-xs ${x.tone}`}>{x.tag}</span>
              <h3 className="mt-4 mb-2 text-xl font-semibold">{x.t}</h3>
              <p className="text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-4xl">
          <p className="text-2xl leading-snug md:text-3xl">
            По сути, независимый индекс культуры — это метрика целостности компании. Насколько мы совпадаем сами с собой.
            И это должно стоять в одном ряду с ключевыми показателями: финансами, операциями, рынком и организационной
            устойчивостью.
          </p>
          <hr className="my-10 border-border" />
          <div className="grid gap-8 text-muted-foreground md:grid-cols-2 md:text-lg">
            <p>
              Если здесь красная зона, через какое‑то время это ударит по всем остальным цифрам. Раньше можно было сначала
              придумать яркое EVP и красиво его упаковать, теперь наоборот: сначала проверяем реальность, потом обещаем.
            </p>
            <p>
              Обещаем только то, что выдерживает внешнюю проверку. В брифах появляется простой фильтр — «проверка на
              правду»: что можем говорить уверенно, а что пока нет. Голоса сотрудников при соблюдении приватности — это не
              риск, а капитал доверия.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader align="left" title="Что можно начать делать уже завтра?" />
        <ul className="grid gap-5 md:grid-cols-2">
          {[
            ["Посмотреть на себя со стороны", "Посмотреть на себя глазами внешней среды. Разобрать свои обещания и понять, чем они подтверждаются снаружи в медийном поле."],
            ["Сначала исправить — потом рассказывать", "Честно убрать рискованные формулировки из публичной коммуникации, если сейчас реальность их не поддерживает."],
            ["Ввести «стоп‑сигнал» для обещаний", "Если по теме явный разрыв, не использовать её в рекламе и коммуникациях до исправления причины."],
            ["Наладить постоянный мониторинг", "Следить за совпадением слова и дела так же внимательно, как за продажами и сроками."],
          ].map(([t, d]) => (
            <li key={t} className="glass rounded-3xl p-6 md:p-7">
              <h3 className="mb-2 text-xl font-semibold">{t}</h3>
              <p className="text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/culture/bottle.jpg" alt="" className="w-full rounded-3xl opacity-90" />
          <p className="text-xl md:text-2xl">
            Мы входим в эпоху, где ценится не обещание, а подтверждённое соответствие. Независимый индекс культуры — не
            «мягкий» рейтинг про атмосферу, а инструмент зрелого рынка. Победят не те, кто громче говорит о ценностях, а
            те, чьи ценности выдерживают внешнюю проверку.
          </p>
        </div>
        <div className="mt-10">
          <Button asChild variant="ghost" size="xl">
            <Link href="/methodology">
              Открыть методику <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Вопрос-ответ" title="Об индексе культуры" />
        <div className="mx-auto max-w-3xl">
          <FaqList items={FAQ_CULTURE} />
        </div>
      </Section>
      <CtaBand title="Узнайте свой индекс" />
    </>
  )
}
