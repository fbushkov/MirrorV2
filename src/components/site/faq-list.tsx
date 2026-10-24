import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { FaqItem } from "@/content/faq"

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="glass rounded-2xl px-2 md:px-4">
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q} className="border-border/70">
          <AccordionTrigger className="px-3 py-5 text-base font-medium hover:no-underline md:text-lg">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-5 text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground md:text-base">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
