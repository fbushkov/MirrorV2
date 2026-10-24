import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDownRight, ArrowUpRight, CalendarDays, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { CtaBand } from "@/components/site/cta-band"
import { StatusPill } from "@/components/site/status"
import {
  BrandDynamicsChart,
  GapDivergingChart,
  IndexGauge,
  SourcesHeatmap,
  TonalityChart,
  TopicRadarChart,
} from "@/components/charts/brand-charts"
import { C } from "@/components/charts/theme"
import { BANK_N, EVENTS, PROMISES, cultureIndex, statusOf } from "@/content/demo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Пример дашборда",
  description: "Как выглядит дашборд Mirror: внешний и внутренний бренд, просадки и подъёмы показателей, карта разрывов.",
}

function Panel({ title, hint, children, className }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("glass rounded-3xl p-5 md:p-6", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-medium">{title}</h2>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function Kpi({ label, value, delta, tone }: { label: string; value: string; delta?: number; tone?: string }) {
  return (
    <div className="glass rounded-2xl p-4 md:p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn("text-3xl font-semibold", tone)}>{value}</span>
        {delta !== undefined && (
          <span className={cn("inline-flex items-center text-xs", delta >= 0 ? "text-status-ok" : "text-status-bad")}>
            {delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {delta > 0 ? "+" : ""}
            {delta} за квартал
          </span>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const ext = Math.round(cultureIndex(PROMISES, "external"))
  const int = Math.round(cultureIndex(PROMISES, "internal"))
  const confirmed = PROMISES.filter((p) => statusOf(p.external) === "ok").length
  const mentions = PROMISES.reduce((s, p) => s + p.mentions, 0)
  const biggest = [...PROMISES].sort((a, b) => a.internal - a.external - (b.internal - b.external))[0]

  return (
    <>
      <PageHero
        crumbs={[{ title: "Индекс культуры", href: "/culture-index" }, { title: "Пример дашборда" }]}
        eyebrow="Данные условные"
        title={
          <>
            Дашборд: <span className="text-gradient">просадки и подъёмы</span> вашего бренда
          </>
        }
        description="Так выглядит результат работы парсера Mirror и диагностики: внешний и внутренний индекс в динамике, разрывы по каждому обещанию, тональность и источники. Внешняя часть доступна уже в бесплатном срезе."
      />

      <Section className="pt-0 md:pt-0">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2">
            <Building2 className="size-4 text-muted-foreground" /> {BANK_N.name} · {BANK_N.size}
          </span>
          <span className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2">
            <CalendarDays className="size-4 text-muted-foreground" /> Январь — октябрь 2026
          </span>
          <span className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2">
            <Users className="size-4 text-muted-foreground" /> Конкуренты: Федеральный банк А, Федеральный банк Б
          </span>
          <span className="ml-auto rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">пример</span>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Kpi label="Внешний индекс" value={String(ext)} delta={2} tone="text-chart-1" />
          <Kpi label="Внутренний индекс" value={String(int)} delta={5} tone="text-chart-2" />
          <Kpi label="Разрыв, снаружи − изнутри" value={(ext - int > 0 ? "+" : "") + (ext - int)} />
          <Kpi label="Подтверждено обещаний" value={`${confirmed} из ${PROMISES.length}`} />
          <Kpi label="Упоминаний за период" value={String(mentions)} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Panel
            title="Индекс по месяцам"
            hint="Сиреневый — внешний бренд, бирюзовый — внутренний. Метки — события, выделение — просадка."
            className="lg:col-span-2"
          >
            <BrandDynamicsChart />
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
              {EVENTS.map((e) => (
                <li key={e.month} className="flex gap-2">
                  <span className="w-10 shrink-0 text-foreground">{e.month}</span>
                  {e.text}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Индекс культуры" hint="Внешний и внутренний, из 100">
            <div className="grid grid-cols-2 gap-2">
              <IndexGauge value={ext} label="снаружи" className="h-40" />
              <IndexGauge value={int} label="изнутри" color={C.internal} className="h-40" />
            </div>
            <div className="mt-2 rounded-2xl bg-white/[0.04] p-4 text-sm">
              <p className="text-muted-foreground">Главный разрыв</p>
              <p className="mt-1 font-medium">
                {biggest.title}: снаружи {biggest.external}, изнутри {biggest.internal}
              </p>
              <p className="mt-1 text-muted-foreground">Репутация опережает реальность — скоро это покажут новые отзывы.</p>
            </div>
          </Panel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel title="Разрыв по обещаниям" hint="Изнутри минус снаружи: красное — переобещаете, бирюзовое — недорассказываете">
            <GapDivergingChart />
          </Panel>
          <Panel title="Снаружи и изнутри" hint="Подтверждение обещаний, %">
            <TopicRadarChart />
          </Panel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Panel title="Карта подтверждения по источникам" hint="% упоминаний, где опыт совпадает с обещанием">
            <SourcesHeatmap />
          </Panel>
          <Panel title="Тональность по источникам" hint="Доля упоминаний, %">
            <TonalityChart className="h-[440px]" />
          </Panel>
        </div>

        <Panel title="Обещания" hint="Первый статус — снаружи, второй — изнутри" className="mt-4">
          <ul className="grid gap-2 md:grid-cols-2">
            {PROMISES.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.03] px-4 py-3">
                <span className="text-sm">{p.title}</span>
                <span className="flex gap-1.5">
                  <StatusPill status={statusOf(p.external, p.mentions)} />
                  <StatusPill status={statusOf(p.internal)} className="opacity-80" />
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="glow" size="xl">
            <Link href="/request?type=scan">Получить такой срез бесплатно</Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="rounded-xl">
            <Link href="/methodology">Как считаем</Link>
          </Button>
        </div>
      </Section>
      <CtaBand />
    </>
  )
}
