const steps = [
  {
    number: "01",
    title: "Pick a course",
    description:
      "Browse by topic or search for the exact skill you need. Every course page shows the full curriculum up front.",
  },
  {
    number: "02",
    title: "Learn at your pace",
    description:
      "Watch lessons, mark them complete and watch your progress bar fill. Your place is saved automatically.",
  },
  {
    number: "03",
    title: "Earn your certificate",
    description:
      "Finish every lesson to unlock a verified certificate you can add to your CV or share with your network.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.number} className="relative">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {step.number}
            </span>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className="hidden h-px flex-1 bg-border md:block"
              />
            )}
          </div>
          <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
