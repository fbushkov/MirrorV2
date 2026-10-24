import Link from "next/link"
import { cn } from "@/lib/utils"

const VIEWS = [
  { id: "brand", label: "HR-бренд и индекс культуры", href: "/hr-brand/demo", dot: "bg-brand-500" },
  { id: "health", label: "Здоровье культуры", href: "/culture-health/demo", dot: "bg-health-500" },
] as const

/** Переключатель между демо двух направлений: ссылки, чтобы каждое демо можно было отправить отдельно */
export function DemoSwitch({ active }: { active: "brand" | "health" }) {
  return (
    <nav aria-label="Демо направления" className="mb-6 flex justify-center">
      <div className="inline-flex max-w-full flex-wrap justify-center rounded-xl bg-muted p-1">
        {VIEWS.map((v) => (
          <Link
            key={v.id}
            href={v.href}
            aria-current={v.id === active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors",
              v.id === active ? "bg-card font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("size-1.5 rounded-full", v.dot)} aria-hidden />
            {v.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
