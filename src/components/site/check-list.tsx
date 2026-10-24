import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function CheckList({ items, className, tone = "text-chart-2" }: { items: React.ReactNode[]; className?: string; tone?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px] md:text-base">
          <Check className={cn("mt-1 size-4 shrink-0", tone)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Steps({ steps }: { steps: { title: string; text: React.ReactNode }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="glass rounded-3xl p-6">
          <span className="text-gradient text-3xl font-semibold">{i + 1}</span>
          <h3 className="mt-3 mb-2 text-lg font-semibold">{s.title}</h3>
          <p className="text-muted-foreground">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}
