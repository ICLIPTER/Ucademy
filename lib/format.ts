/**
 * Shared formatting helpers.
 *
 * Centralised so prices, durations and dates render identically everywhere
 * (server-rendered pages and client components) and so the currency can be
 * switched without touching every component.
 */

export const DEFAULT_CURRENCY = "INR";
export const DEFAULT_LOCALE = "en-IN";

/** Formats an amount in the smallest currency unit (paise) as currency. */
export function formatCurrency(
  amountInSmallestUnit: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountInSmallestUnit / 100);
}

/** Formats a course duration (stored in hours). */
export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "Self-paced";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours === 1) return "1 hour";
  return `${hours} hours`;
}

/** Formats a number with thousands separators (e.g. 1,204). */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Formats a date for display. */
export function formatDate(
  value: Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, options).format(date);
}

/** Relative time, e.g. "3 days ago". */
export function formatRelativeTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  const formatter = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, {
    numeric: "auto",
  });

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return formatter.format(Math.round(seconds / secondsInUnit), unit);
    }
  }

  return formatter.format(seconds, "second");
}

/** Human readable course level, e.g. "BEGINNER" -> "Beginner". */
export function formatLevel(level: string): string {
  return level
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Human readable course status. */
export function formatStatus(status: string): string {
  return formatLevel(status);
}
