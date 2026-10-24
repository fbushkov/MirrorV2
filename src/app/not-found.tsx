import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 pt-24">
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="text-center">
        <p className="text-gradient text-8xl font-semibold">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Такой страницы нет</h1>
        <p className="mt-2 text-muted-foreground">Возможно, её перенесли. Начните с главной.</p>
        <Button asChild variant="glow" size="xl" className="mt-6">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  )
}
