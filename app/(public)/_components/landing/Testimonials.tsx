import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "The lesson structure is the difference. I actually finished the course — the first one I've completed in years.",
    name: "Ananya Rao",
    role: "Frontend Engineer",
    rating: 5,
  },
  {
    quote:
      "I used the certificate as proof of skills during an interview. It came up within thirty seconds.",
    name: "Marcus Bell",
    role: "Data Analyst",
    rating: 5,
  },
  {
    quote:
      "As an instructor I publish straight from the studio and reach learners without any marketing budget.",
    name: "Priya Nair",
    role: "Engineering Manager",
    rating: 4,
  },
  {
    quote:
      "Progress tracking across several courses at once keeps me consistent. It is the habit I was missing.",
    name: "Daniel Okoye",
    role: "Product Designer",
    rating: 5,
  },
  {
    quote:
      "The curriculum preview is honest. I knew exactly what I was buying before I paid a rupee.",
    name: "Sofia Hernández",
    role: "QA Lead",
    rating: 5,
  },
  {
    quote:
      "Fast on a phone, which matters because that is where most of my learning actually happens.",
    name: "Jonas Weber",
    role: "DevOps Engineer",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {testimonials.map((testimonial) => (
        <figure
          key={testimonial.name}
          className="mb-6 break-inside-avoid rounded-xl border bg-card p-6"
        >
          <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={
                  index < testimonial.rating
                    ? "size-4 fill-amber-400 text-amber-400"
                    : "size-4 text-muted-foreground/30"
                }
              />
            ))}
          </div>

          <blockquote className="mt-4 text-sm leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          <figcaption className="mt-4">
            <span className="block text-sm font-medium">{testimonial.name}</span>
            <span className="block text-xs text-muted-foreground">
              {testimonial.role}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
