"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { NAV, NAV_GROUPS } from "@/content/site"
import { Logo } from "./logo"

const DOT = { brand: "bg-brand-500", health: "bg-health-500" }

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-4">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 rounded-2xl border border-border bg-card/85 pr-2 pl-4 shadow-[0_8px_30px_-16px_rgb(26_19_32/0.25)] backdrop-blur-xl">
        <Logo />
        <NavigationMenu viewport={false} aria-label="Основное меню" className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            {NAV_GROUPS.map((g) => {
              const active = g.items.some((i) => pathname === i.href.split("#")[0])
              return (
                <NavigationMenuItem key={g.id}>
                  <NavigationMenuTrigger
                    className={cn("bg-transparent font-normal text-muted-foreground hover:text-foreground", active && "text-foreground")}
                  >
                    <span className={cn("mr-2 size-1.5 rounded-full", DOT[g.id])} aria-hidden />
                    {g.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-2 md:w-80">
                    <p className="px-2 pt-1 pb-2 text-xs text-muted-foreground">{g.full}</p>
                    <ul className="flex flex-col">
                      {g.items.map((i) => (
                        <li key={i.href}>
                          <NavigationMenuLink asChild>
                            <Link href={i.href} className="flex-col items-start gap-0.5">
                              <span className="font-medium">{i.title}</span>
                              {i.note && <span className="text-xs text-muted-foreground">{i.note}</span>}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
            {NAV.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.href === pathname ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    item.href === pathname && "text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
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
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-5 px-4 pb-8">
                {NAV_GROUPS.map((g) => (
                  <div key={g.id}>
                    <p className="mb-1 flex items-center gap-2 px-2 text-xs font-medium text-muted-foreground">
                      <span className={cn("size-1.5 rounded-full", DOT[g.id])} aria-hidden />
                      {g.full}
                    </p>
                    {g.items.map((i) => (
                      <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-2.5 text-base hover:bg-muted">
                        {i.title}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="border-t border-border pt-3">
                  {NAV.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-2.5 text-base hover:bg-muted">
                      {item.title}
                    </Link>
                  ))}
                </div>
                <Button asChild variant="glow" size="xl" onClick={() => setOpen(false)}>
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
