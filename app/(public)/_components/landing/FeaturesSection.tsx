import {
  IconBook2,
  IconCertificate,
  IconChartDots3,
  IconDeviceLaptop,
  IconRosetteDiscountCheck,
  IconUsersGroup,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconBook2,
    title: "Structured, not scattered",
    description:
      "Every course is broken into chapters and bite-sized lessons with a clear order, so you always know what to do next.",
  },
  {
    icon: IconChartDots3,
    title: "Progress you can see",
    description:
      "Track completion across every course from a single dashboard, and pick up exactly where you left off.",
  },
  {
    icon: IconCertificate,
    title: "Certificates that verify",
    description:
      "Finish every lesson and unlock a certificate with a unique serial anyone can verify.",
  },
  {
    icon: IconUsersGroup,
    title: "Learn from practitioners",
    description:
      "Courses are written by people doing the work, not by content farms. Practical, current and opinionated.",
  },
  {
    icon: IconDeviceLaptop,
    title: "Any device, any time",
    description:
      "The player is fully responsive — continue a lesson on your phone during a commute and your laptop at home.",
  },
  {
    icon: IconRosetteDiscountCheck,
    title: "Buy once, keep forever",
    description:
      "Every purchase includes lifetime access to the course, all future updates and a 30-day money-back guarantee.",
  },
];

export function FeaturesSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
        >
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <feature.icon className="size-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
