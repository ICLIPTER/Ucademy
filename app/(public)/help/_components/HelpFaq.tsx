"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { FaqAccordion, type FaqEntry } from "../../_components/landing/FaqAccordion";

const faqs: FaqEntry[] = [
  {
    question: "How do I find a course?",
    answer:
      "Search by keyword from the home page, browse the category directory at /categories, or filter the catalogue by level. Every course page shows the full curriculum before you pay.",
  },
  {
    question: "Do I need an account to preview a lesson?",
    answer:
      "No. Preview lessons play directly on the course page. An account is only needed to enrol, track progress and keep a certificate.",
  },
  {
    question: "Can I watch a course on more than one device?",
    answer:
      "Yes. Your progress is stored against your account, so you can start on a laptop and continue on your phone. The only limit is one stream at a time per account.",
  },
  {
    question: "How do I get a certificate?",
    answer:
      "Complete every lesson in the course. A certificate with a unique serial is then issued to your account, and the serial can be verified by anyone with the link.",
  },
  {
    question: "I finished a lesson but my progress did not move. What now?",
    answer:
      "Progress is saved as soon as the player reports completion, which can take a few seconds on a slow connection. Refresh the page first. If it is still wrong, tell us the course and lesson title and we will correct it.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes. Every purchase has a 30-day money-back guarantee. See the refunds section below for the process and the exceptions.",
  },
  {
    question: "How do I request an invoice?",
    answer:
      "Invoices are emailed to the address on your account when a payment completes. If you need one re-sent, or you need the billing address changed, contact support.",
  },
  {
    question: "Is my card safe on this site?",
    answer:
      "Yes. Payments are processed by Stripe. Card numbers are entered on Stripe's own pages and never reach our servers, so we cannot store or leak them.",
  },
  {
    question: "How do I become an instructor?",
    answer:
      "Send us a short outline of a course you would teach. If the topic fits a track we are missing, we will help you structure it and publish it. You keep 90% of the revenue.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Email support with the address on the account. We delete your profile, your progress and your personal data, and keep only the records we are legally required to retain, such as invoice details.",
  },
];

export function HelpFaq() {
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a question, a course or a policy"
          aria-label="Search the help centre"
          className="h-11 w-full rounded-md border bg-transparent pl-9 pr-3 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
      </div>

      {filteredFaqs.length > 0 ? (
        <FaqAccordion faqs={filteredFaqs} />
      ) : (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No answer matches &ldquo;{query}&rdquo;. Try a shorter word, or ask us
          directly from the{" "}
          <a
            href="#contact"
            className="font-medium text-primary underline underline-offset-4"
          >
            contact section
          </a>
          .
        </p>
      )}
    </div>
  );
}
