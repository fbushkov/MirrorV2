/** Якорное меню по блокам длинной страницы. Прилипает под шапкой, на телефоне листается вбок. */
export function AnchorNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Разделы страницы" className="sticky top-[76px] z-40 md:top-[84px]">
      <div className="mx-auto w-full max-w-5xl px-3">
        <ul className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card/85 p-1.5 shadow-[0_8px_24px_-16px_rgb(26_19_32/0.3)] backdrop-blur-xl [scrollbar-width:none]">
          {items.map((i) => (
            <li key={i.id} className="shrink-0">
              <a href={`#${i.id}`} className="block rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
