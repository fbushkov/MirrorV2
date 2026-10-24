import { CultureMatrixChart } from "@/components/charts/brand-charts"
import { MATRIX_ZONES } from "@/content/demo"
import { cn } from "@/lib/utils"

const ZONE_TONE: Record<string, string> = {
  strong: "border-l-4 border-l-status-ok",
  honest: "border-l-4 border-l-status-warn",
  wrong: "border-l-4 border-l-chart-5",
  over: "border-l-4 border-l-status-bad",
}

/** Матрица «честность × условия» с расшифровкой четырёх зон */
export function MatrixBlock() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="surface-raised min-w-0 p-4 md:p-6">
        <CultureMatrixChart />
        <p className="mt-2 text-xs text-muted-foreground">Пример на условных данных: Банк N и два конкурента</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {MATRIX_ZONES.map((z) => (
          <li key={z.id} className={cn("surface p-5", ZONE_TONE[z.id])}>
            <p className="font-semibold">{z.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{z.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
