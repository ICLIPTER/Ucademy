"use client";

import { FaqAccordion, type FaqEntry } from "../../_components/landing/FaqAccordion";

const faqs: FaqEntry[] = [
  {
    question: "Do I need a paid plan to buy a course?",
    answer:
      "No. Courses are sold individually today and every purchase includes lifetime access to that course. A free account is enough to buy, enrol and track progress.",
  },
  {
    question: "What does the Learner plan include?",
    answer:
      "The Learner plan is a subscription for people taking several courses. It covers full access to purchased courses, verified certificates, and the ability to write reviews. The plan is still in preparation, so it is not being billed yet.",
  },
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes. Subscriptions can be cancelled from your account at any time and stay active until the end of the period you have already paid for. There is no cancellation fee.",
  },
  {
    question: "What is the refund window?",
    answer:
      "Every course purchase is covered by a 30-day money-back guarantee. If the course is not what you expected, request a refund from the help centre and it is returned to the original payment method.",
  },
  {
    question: "Do you offer student or team discounts?",
    answer:
      "We do. Students with a valid ID can apply for a reduced price, and teams of ten or more get a quote. Contact us through the help centre and we will work out the details.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "Checkout is handled by Stripe, so you can pay with any major card, and with UPI and net banking for Indian accounts. We never see or store your card number.",
  },
  {
    question: "Will the prices change?",
    answer:
      "Course prices can change as a course is updated, and existing purchases keep their price for the lifetime of the access. Subscription pricing, once it launches, will be locked in for the first year for anyone who joins on day one.",
  },
];

export function PricingFaq() {
  return <FaqAccordion faqs={faqs} />;
}
