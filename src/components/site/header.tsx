"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { NAV } from "@/content/site"
import { Logo } from "./logo"

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-border bg-background/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
        <Logo />

        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList>
            {NAV.map((entry) =>
              "items" in entry ? (
                <NavigationMenuItem key={entry.title}>
                  <NavigationMenuTrigger className="bg-transparent text-brand-50/85">{entry.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[460px] grid-cols-2 gap-1 p-1">
                      {entry.items.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href} className="flex flex-col items-start gap-1 p-3">
                              <span className="text-sm font-medium">{item.title}</span>
                              <span className="text-xs leading-snug text-muted-foreground">{item.description}</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={entry.href}>
                  <NavigationMenuLink asChild active={pathname === entry.href}>
                    <Link
                      href={entry.href}
                      className={cn(navigationMenuTriggerStyle(), "bg-transparent text-brand-50/85")}
                    >
                      {entry.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild variant="glow" size="lg" className="hidden rounded-xl px-4 sm:inline-flex">
            <Link href="/request?type=scan">Бесплатный срез</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Открыть меню">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto bg-brand-800">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 px-4 pb-8">
                {NAV.map((entry) =>
                  "items" in entry ? (
                    <div key={entry.title} className="flex flex-col gap-1">
                      <p className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">{entry.title}</p>
                      {entry.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-2 py-2 text-[15px] hover:bg-muted"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      onClick={() => setOpen(false)}
                      className="-mt-4 rounded-lg px-2 py-2 text-[15px] hover:bg-muted"
                    >
                      {entry.title}
                    </Link>
                  ),
                )}
                <Button asChild variant="glow" size="xl" onClick={() => setOpen(false)}>
                  <Link href="/request?type=scan">Получить бесплатный срез</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
