import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, GraduationCap, LineChart, Wallet } from "lucide-react";

const benefits = [
  {
    icon: LineChart,
    title: "Your own analytics",
    description:
      "See enrolments, completion rates and reviews for every course you publish.",
  },
  {
    icon: Wallet,
    title: "Keep 90% of revenue",
    description:
      "Stripe handles the money and pays out to your bank on a schedule that suits you.",
  },
  {
    icon: GraduationCap,
    title: "A real studio",
    description:
      "Write, structure, reorder and publish — no need to leave the platform.",
  },
];

export function InstructorCta() {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge variant="outline">For instructors</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Teach what you know. We handle the rest.
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
            Turn your experience into a structured course. You write and teach;
            we take care of hosting, video delivery, payments, certificates and
            the learner experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/instructors#apply">
                Start teaching
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/instructors">How it works</Link>
            </Button>
          </div>
        </div>

        <ul className="space-y-5">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <benefit.icon className="size-5" />
              </span>
              <span>
                <span className="block font-medium">{benefit.title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {benefit.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
