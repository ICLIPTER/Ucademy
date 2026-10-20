/**
 * Canonical course taxonomy.
 *
 * The original project stored free-text categories, and several of the
 * stored values contained typos ("Developemnt", "Office Producitivity",
 * "Teaching & Acadamics"). Those rows still exist in the database, so the
 * canonical registry below is the single source of truth for *display* while
 * `normaliseCategory()` maps every legacy spelling onto the current one.
 *
 * New records store the canonical label; legacy records are normalised on
 * read, so the catalogue never shows a broken category.
 */

export type CourseCategory = {
  /** URL-safe identifier used in `/courses?category=<slug>` links. */
  slug: string;
  /** Human readable label. */
  label: string;
  /** Short description used on the landing page and category cards. */
  description: string;
  /** Tabler icon name. */
  icon: string;
  /** Accent colour token used for the category badge. */
  accent: string;
};

export const COURSE_CATEGORIES: CourseCategory[] = [
  {
    slug: "development",
    label: "Development",
    description:
      "Ship production software with languages, frameworks and architecture patterns.",
    icon: "code",
    accent: "blue",
  },
  {
    slug: "it-software",
    label: "IT & Software",
    description:
      "Master the tools that run modern teams, from cloud platforms to tooling.",
    icon: "server",
    accent: "violet",
  },
  {
    slug: "data-analytics",
    label: "Data & Analytics",
    description:
      "Turn raw data into decisions with SQL, dashboards and machine learning.",
    icon: "chart",
    accent: "emerald",
  },
  {
    slug: "design",
    label: "Design",
    description:
      "Craft interfaces, brand systems and motion that users love.",
    icon: "palette",
    accent: "pink",
  },
  {
    slug: "business",
    label: "Business",
    description:
      "Strategy, operations and management for ambitious operators.",
    icon: "briefcase",
    accent: "amber",
  },
  {
    slug: "marketing",
    label: "Marketing",
    description:
      "Growth, content and paid acquisition that compounds.",
    icon: "megaphone",
    accent: "orange",
  },
  {
    slug: "finance",
    label: "Finance",
    description:
      "Investing, accounting and financial modelling with real-world tools.",
    icon: "coin",
    accent: "lime",
  },
  {
    slug: "health-fitness",
    label: "Health & Fitness",
    description:
      "Evidence-based training, nutrition and sustainable habits.",
    icon: "heart",
    accent: "rose",
  },
  {
    slug: "personal-development",
    label: "Personal Development",
    description:
      "Communication, leadership and habits that compound over time.",
    icon: "user",
    accent: "cyan",
  },
  {
    slug: "office-productivity",
    label: "Office & Productivity",
    description:
      "Work smarter with spreadsheets, automation and modern workflows.",
    icon: "layout",
    accent: "teal",
  },
  {
    slug: "teaching-academics",
    label: "Teaching & Academics",
    description:
      "Curriculum design, pedagogy and research skills for educators.",
    icon: "school",
    accent: "indigo",
  },
  {
    slug: "photography",
    label: "Photography",
    description:
      "Composition, lighting and post-production for every camera.",
    icon: "camera",
    accent: "fuchsia",
  },
];

/** Legacy / misspelled category values that still exist in the database. */
const LEGACY_ALIASES: Record<string, string> = {
  developemnt: "development",
  development: "development",
  "it & software": "it-software",
  "office producitivity": "office-productivity",
  "office productivity": "office-productivity",
  "teaching & acadamics": "teaching-academics",
  "teaching & academics": "teaching-academics",
  "personal developement": "personal-development",
  "personal development": "personal-development",
  "health & fitness": "health-fitness",
  "health and fitness": "health-fitness",
};

const BY_SLUG = new Map(COURSE_CATEGORIES.map((c) => [c.slug, c]));
const BY_LABEL = new Map(
  COURSE_CATEGORIES.map((c) => [c.label.toLowerCase(), c]),
);

/** Resolves any stored category value to its canonical slug. */
export function normaliseCategory(value: string | null | undefined): string {
  if (!value) return "development";

  const raw = value.trim().toLowerCase();

  if (BY_LABEL.has(raw)) {
    return BY_LABEL.get(raw)!.slug;
  }

  if (LEGACY_ALIASES[raw]) {
    return LEGACY_ALIASES[raw];
  }

  // Slug-style values (e.g. "it-software") resolve directly.
  if (BY_SLUG.has(raw)) return raw;

  return "development";
}

/** Returns the canonical label for a stored category value. */
export function categoryLabel(value: string | null | undefined): string {
  const slug = normaliseCategory(value);
  return BY_SLUG.get(slug)?.label ?? value ?? "Uncategorised";
}

/** Returns the full registry entry for a stored category value. */
export function categoryBySlug(
  value: string | null | undefined,
): CourseCategory {
  const slug = normaliseCategory(value);
  return (
    BY_SLUG.get(slug) ?? {
      slug: "development",
      label: "Development",
      description: "Learn something new.",
      icon: "code",
      accent: "blue",
    }
  );
}

/** Canonical labels, used by the course form and the catalogue filters. */
export const CATEGORY_LABELS = COURSE_CATEGORIES.map((c) => c.label);

/** The canonical labels plus every legacy spelling, for validation. */
export const ALL_CATEGORY_ALIASES = [
  ...CATEGORY_LABELS,
  ...Object.keys(LEGACY_ALIASES),
];
