import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { FaqItem } from "@/content/faq"

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="flex flex-col gap-3">
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q} className="surface border-b-0! px-5 data-[state=open]:bg-muted/60">
          <AccordionTrigger className="py-5 text-[15px] font-medium hover:no-underline md:text-base">{item.q}</AccordionTrigger>
          <AccordionContent className="pb-5 text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/** Блок вопросов: заголовок слева, аккордеон справа */
export function FaqSection({ items, title = "Частые вопросы", note }: { items: FaqItem[]; title?: string; note?: React.ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col items-start gap-4">
        <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">{title}</h2>
        {note && <p className="text-muted-foreground">{note}</p>}
      </div>
      <FaqList items={items} />
    </div>
  )
}
