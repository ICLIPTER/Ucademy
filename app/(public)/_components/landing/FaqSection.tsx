"use client";

import { FaqAccordion, type FaqEntry } from "./FaqAccordion";

const faqs: FaqEntry[] = [
  {
    question: "How much does a course cost?",
    answer:
      "Each course is priced individually and shown on its page before you buy. Many courses are free to preview, and every purchase includes lifetime access plus a 30-day money-back guarantee.",
  },
  {
    question: "Do I get a certificate?",
    answer:
      "Yes. Complete every lesson in a course and a certificate is issued to your account with a unique serial number that can be verified by anyone with the link.",
  },
  {
    question: "Can I learn on my phone?",
    answer:
      "Absolutely. The course player is fully responsive, and your progress is synced to your account so you can switch between devices at any time.",
  },
  {
    question: "Can I teach a course on Ucademy?",
    answer:
      "Yes. Instructors get a studio to write courses, upload video and thumbnails, structure chapters and lessons, and publish when they are ready.",
  },
  {
    question: "How do I get a refund?",
    answer:
      "Every purchase is covered by a 30-day money-back guarantee. Contact support from the help centre and the refund is processed to the original payment method.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Payments are handled entirely by Stripe. Card details never touch our servers, and every transaction is verified by a signed webhook before access is granted.",
  },
];

export function FaqSection() {
  return <FaqAccordion faqs={faqs} />;
}
