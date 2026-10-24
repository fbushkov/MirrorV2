"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { NAV } from "@/content/site"
import { Logo } from "./logo"

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-4">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 rounded-2xl border border-border bg-card/85 pr-2 pl-4 shadow-[0_8px_30px_-16px_rgb(26_19_32/0.25)] backdrop-blur-xl">
        <Logo />
        <nav aria-label="Основное меню" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = item.href === pathname
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                      active && "text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild variant="glow" size="lg" className="hidden rounded-xl px-4 sm:inline-flex">
            <Link href="/start">Бесплатный срез</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Открыть меню">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-8">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-base hover:bg-muted">
                    {item.title}
                  </Link>
                ))}
                <Button asChild variant="glow" size="xl" className="mt-4" onClick={() => setOpen(false)}>
                  <Link href="/start">Получить бесплатный срез</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
