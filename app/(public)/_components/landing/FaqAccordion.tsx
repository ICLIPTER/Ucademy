"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * A single question / answer pair.
 */
export type FaqEntry = {
  question: string;
  answer: string;
};

/**
 * Shared FAQ accordion.
 *
 * The landing page, the pricing page and the help centre all render the same
 * disclosure list, so the markup lives in one client component and the pages
 * only supply the data.
 */
export function FaqAccordion({
  faqs,
  className,
}: {
  faqs: FaqEntry[];
  className?: string;
}) {
  return (
    <Accordion type="single" collapsible className={className ?? "w-full"}>
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-base">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
