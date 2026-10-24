import Link from "next/link"
import { cn } from "@/lib/utils"

const VIEWS = [
  { id: "external", label: "Внешний срез", href: "/example" },
  { id: "pulse", label: "Пульс культуры", href: "/example/pulse" },
] as const

/** Переключатель видов отчёта: ссылки, чтобы каждый вид можно было отправить отдельно */
export function ReportSwitch({ active }: { active: "external" | "pulse" }) {
  return (
    <nav aria-label="Вид отчёта" className="mb-6 flex justify-center">
      <div className="inline-flex rounded-xl bg-muted p-1">
        {VIEWS.map((v) => (
          <Link
            key={v.id}
            href={v.href}
            aria-current={v.id === active ? "page" : undefined}
            className={cn("rounded-lg px-4 py-2 text-sm transition-colors", v.id === active ? "bg-card font-medium shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            {v.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
