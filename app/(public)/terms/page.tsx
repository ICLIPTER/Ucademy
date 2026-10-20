import type { ReactNode } from "react";

import { LegalToc, type LegalSection } from "../_components/LegalToc";

export const metadata = {
  title: "Terms of Service — Ucademy",
  description:
    "The rules that govern the use of Ucademy: accounts, purchases and refunds, intellectual property, course content, reviews, acceptable use, termination and liability.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "20 October 2026";

const sections: (LegalSection & { body: ReactNode })[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    body: (
      <>
        <p>
          These Terms of Service form a binding agreement between you and
          Ucademy. They apply to every account, every purchase and every
          course published on the platform. By creating an account, buying a
          course or publishing one, you agree to them. If you do not agree,
          please do not use the service.
        </p>
        <p>
          We have written these terms to be read. Where a clause is a summary
          of a longer rule, the full text of that rule is the one that
          applies. Nothing here limits rights you hold under consumer law
          that cannot lawfully be limited.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "Your Account",
    body: (
      <>
        <p>
          You need an account to enrol in a course, track progress, download a
          certificate or publish a course. Give us accurate information and
          keep it up to date, and keep your sign-in details to yourself.
        </p>
        <ul>
          <li>
            You must be at least 18 years old to hold an account, or the age
            of majority where you live, whichever is higher. If you are under
            that age, an organisation or guardian must hold the account on
            your behalf.
          </li>
          <li>
            You are responsible for everything that happens under your
            account, including activity by someone you gave your password to.
          </li>
          <li>
            One account per person. Team seats are provided through the Team
            plan and belong to the organisation that bought them.
          </li>
          <li>
            Tell us promptly if you suspect unauthorised access. We will
            suspend the account while we investigate.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "purchases",
    title: "Purchases and Refunds",
    body: (
      <>
        <p>
          Course prices are shown in Indian rupees on the course page before
          you pay, and any applicable tax appears on the invoice. Payments are
          processed by a third-party payment provider; your card details are
          entered on the provider&apos;s pages and never reach our servers.
        </p>
        <ul>
          <li>
            <strong>Lifetime access.</strong> A course you buy stays in your
            account, including every future update to that course. It is not
            a subscription and we do not switch it off.
          </li>
          <li>
            <strong>30-day money-back guarantee.</strong> If a course is not
            what we described, tell us within 30 days of the purchase and we
            refund it in full. No justification is required. Refunds go back
            to the original payment method and usually appear within 5 to 10
            working days.
          </li>
          <li>
            <strong>Subscriptions.</strong> When a subscription plan is
            available it renews at the end of each paid month or year until
            you cancel. You can cancel at any time, and access continues
            until the end of the period you have already paid for.
          </li>
          <li>
            <strong>Team purchases.</strong> Refunds on an order bought by an
            organisation are handled by the person or team that placed it.
          </li>
        </ul>
        <p>
          Purchases made more than 30 days ago are not refundable, except
          where the course is broken or materially different from its
          description. Full detail is in the{" "}
          <a
            href="/help#refunds"
            className="font-medium text-primary underline underline-offset-4"
          >
            refunds policy
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    body: (
      <>
        <p>
          Ucademy owns the platform: the software, the design, the course
          catalogue layout, the trade marks and the name. We own it or we have
          a licence to it, and you may not copy, resell or create something
          that looks like it.
        </p>
        <p>
          You keep ownership of everything you create and upload. When you
          publish a course you grant us a non-exclusive, worldwide licence to
          host, store, transmit and display it for the purpose of running the
          service. That licence ends when you delete the course, except for
          copies already made and for records we must keep for legal reasons.
        </p>
        <p>
          Course material is licensed to you for personal, non-commercial
          study. You may not redistribute it, resell it, publish it elsewhere
          or use it to train a competing course. If you want a commercial
          licence, ask us.
        </p>
      </>
    ),
  },
  {
    id: "course-content",
    title: "Course Content",
    body: (
      <>
        <p>
          Instructors are responsible for the accuracy and originality of
          their material. Their courses express their opinions, and the fact
          that a course is published here is not a statement by us that it is
          correct, complete or current.
        </p>
        <p>
          Course content is educational. It is not legal, medical, financial
          or other professional advice, and it should not be the only thing
          you rely on for a decision that matters. We may correct, update or
          remove material that is inaccurate, infringing or otherwise
          unlawful, and we will refund affected purchases where removal makes
          the course unusable.
        </p>
        <p>
          Where an instructor materially rewrites a course, we may mark it as
          a new edition. Your access and any certificate you earned remain
          valid.
        </p>
      </>
    ),
  },
  {
    id: "reviews",
    title: "Reviews and Ratings",
    body: (
      <>
        <p>
          Reviews help other people decide what to buy, so they have to be
          honest and useful. You can leave one review per course, and only
          for a course you have actually taken.
        </p>
        <ul>
          <li>Describe your own experience. Do not invent one, and do not post on behalf of someone else.</li>
          <li>No harassment, no personal information about other people, and nothing unlawful.</li>
          <li>No incentives, no competitor sabotage, and no bulk posting from the same account.</li>
          <li>
            Instructors cannot review their own course, and they cannot remove
            or retaliate against a critical review.
          </li>
        </ul>
        <p>
          We may remove a review that breaks these rules, and we may suspend
          the account that posted it. Reviews are the opinion of their author.
          We do not verify every claim, and we do not endorse what they say.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    body: (
      <>
        <p>
          You may not use Ucademy to break the law, to harm anyone, or to
          interfere with the service or the accounts of other people.
        </p>
        <ul>
          <li>No scraping, crawling or bulk downloading of the catalogue, and no reverse engineering of the platform.</li>
          <li>No sharing, lending or selling account access, and no sharing course material you have purchased.</li>
          <li>No uploading malware, or content that infringes someone else&apos;s rights.</li>
          <li>No impersonating other people, and no collecting other people&apos;s personal information.</li>
          <li>No automated systems that place orders or post reviews without a human behind them.</li>
          <li>No using the service to build a competing catalogue by systematically copying our course structure and content.</li>
        </ul>
        <p>
          We enforce these rules. Depending on what you did, we may remove
          content, limit your account, or suspend it.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    body: (
      <>
        <p>
          You can stop using Ucademy and delete your account at any time by
          writing to us. Deleting your account ends your access to the
          courses in it, and we then delete your personal data as described
          in the privacy policy.
        </p>
        <p>
          We may suspend or close an account that breaks these terms, that
          presents a legal risk to us or our users, that is used for fraud, or
          that has an unpaid outstanding balance. Where the situation allows
          it, we will warn you first and give you a chance to put it right.
        </p>
        <p>
          When an account is closed, access ends immediately. Certificates that
          were already issued stay verifiable, and anything you are owed under
          the refund policy is still paid out.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <>
        <p>
          Ucademy is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. We do not promise that the service will be
          uninterrupted, that every feature will always work, or that the
          platform will meet a service level agreement. We do offer a 30-day
          money-back guarantee, which is set out above.
        </p>
        <p>
          We do not guarantee that finishing a course will produce a
          particular job, salary, promotion or other outcome. We teach
          practical skills; what you do with them is between you and your
          employer.
        </p>
        <p>
          Features labelled as preview or beta may change, be removed, or
          behave differently from the documented behaviour. We will say so
          when that happens.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    body: (
      <>
        <p>
          To the fullest extent the law allows, Ucademy is not liable for
          indirect or consequential loss, including loss of profit, loss of
          anticipated savings, loss of business opportunity, loss of data, or
          damage to goodwill.
        </p>
        <p>
          Our total liability to you for any claim relating to a course or
          your use of the service is limited to the greater of the amount you
          paid us in the twelve months before the event giving rise to the
          claim, and the total amount you actually paid us for the course in
          question.
        </p>
        <p>
          Nothing in these terms excludes or limits liability that cannot be
          excluded by law, including liability for death or personal injury
          caused by negligence, for fraud, or for any other liability that
          the law does not permit us to limit.
        </p>
        <p>
          Payments and media are delivered by third-party providers who are
          responsible for their own services under their own terms. We are
          not responsible for their availability or for their acts and
          omissions.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    body: (
      <>
        <p>
          These terms are governed by the laws of India. The courts at
          Bengaluru, Karnataka have exclusive jurisdiction over any dispute
          that arises from them.
        </p>
        <p>
          If you live outside India and consumer law in your country gives
          you rights that cannot be waived, those rights still apply. Where
          you are a consumer bringing a claim in your own country, the courts
          there remain available to you.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    body: (
      <>
        <p>
          We may update these terms as the product changes. Material changes
          are announced by email and posted on this page at least 14 days
          before they take effect, and the previous version stays available
          so you can see what changed.
        </p>
        <p>
          The version published when you made a purchase governs that
          purchase. Changes apply to activity after they take effect, and
          continuing to use the service after that date means you accept
          them.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>
          Questions about these terms, or about anything else, go to{" "}
          <a
            href="mailto:support@ucademy.app"
            className="font-medium text-primary underline underline-offset-4"
          >
            support@ucademy.app
          </a>
          . Our postal address is: Ucademy, Bengaluru, Karnataka, India.
        </p>
        <p>
          If you are a resident of the European Economic Area or the United
          Kingdom, you may also complain to your local data protection
          authority about how we handle your personal data. See the{" "}
          <a
            href="/privacy"
            className="font-medium text-primary underline underline-offset-4"
          >
            privacy policy
          </a>{" "}
          for our contact details.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <header className="py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          The agreement between you and Ucademy when you use the platform. It
          is written to be read once, not skimmed repeatedly.
        </p>
      </header>

      <div className="sticky top-16 z-30 border-y bg-background/95 py-3 backdrop-blur">
        <p className="text-xs text-muted-foreground">
          Last updated:{" "}
          <span className="font-medium text-foreground">{LAST_UPDATED}</span>
          <span className="mx-2 text-border">|</span>
          Questions about these terms?{" "}
          <a
            href="#contact"
            className="font-medium text-primary underline underline-offset-4"
          >
            Contact us
          </a>
        </p>
      </div>

      <div className="grid gap-10 pb-20 pt-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <LegalToc sections={sections} />
          </div>
        </aside>

        <article className="min-w-0">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32 border-b pb-10 pt-2 last:border-b-0"
            >
              <h2 className="text-2xl font-bold tracking-tight text-balance">
                <span className="text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
