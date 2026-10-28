import { Award, Battery, CheckCircle2, Compass, Handshake, Home, Megaphone, OctagonAlert, Scale, Shield, Sprout, Target, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { LEVEL_LABEL, pulseLevel, type PulseMetric } from "@/content/pulse"

const ICONS = { compass: Compass, home: Home, sprout: Sprout, shield: Shield, handshake: Handshake, megaphone: Megaphone, battery: Battery, target: Target, scale: Scale, award: Award }

export function MetricIcon({ icon, className }: { icon: PulseMetric["icon"]; className?: string }) {
  const I = ICONS[icon]
  return <I className={cn("size-4", className)} aria-hidden />
}

const LEVEL_STYLE = {
  ok: { cls: "bg-status-ok/10 text-status-ok", Icon: CheckCircle2 },
  warn: { cls: "bg-status-warn/10 text-status-warn", Icon: TriangleAlert },
  bad: { cls: "bg-status-bad/10 text-status-bad", Icon: OctagonAlert },
}

/** Уровень балла: цвет всегда продублирован иконкой и подписью */
export function LevelBadge({ score, className }: { score: number; className?: string }) {
  const level = pulseLevel(score)
  const { cls, Icon } = LEVEL_STYLE[level]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", cls, className)}>
      <Icon className="size-3.5" aria-hidden />
      {LEVEL_LABEL[level]}
    </span>
  )
}

/** Компактный значок зоны: иконка + скрытая подпись для экранных чтецов */
export function LevelIcon({ score, className }: { score: number; className?: string }) {
  const level = pulseLevel(score)
  const { cls, Icon } = LEVEL_STYLE[level]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums", cls, className)}>
      <Icon className="size-3.5" aria-hidden />
      {score}
      <span className="sr-only">, {LEVEL_LABEL[level]}</span>
    </span>
  )
}

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const w = 96
  const h = 28
  const min = Math.min(...values) - 2
  const max = Math.max(...values) + 2
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min)) * h])
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  const [lx, ly] = pts[pts.length - 1]
  const level = pulseLevel(values[values.length - 1])
  const color = level === "ok" ? "var(--status-ok)" : level === "warn" ? "var(--status-warn)" : "var(--status-bad)"
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-7 w-24 overflow-visible", className)} aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill={color} stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

export function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value === 0) return <span className="text-xs text-muted-foreground tabular-nums">0{suffix}</span>
  const up = value > 0
  return (
    <span className={cn("text-xs font-medium tabular-nums", up ? "text-status-ok" : "text-status-bad")}>
      {up ? "↑" : "↓"} {up ? "+" : "−"}
      {Math.abs(value)}
      {suffix}
    </span>
  )
}
