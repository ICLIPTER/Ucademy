import "server-only";

/**
 * Lightweight abuse protection.
 *
 * Replaces the previous paid bot-management integration with checks that
 * cost nothing, require no external service and add no latency to the
 * request path:
 *
 *  1. Honeypot field  — a hidden input only a bot would fill in.
 *  2. Elapsed time     — a form submitted in <1.5s was not typed by a human.
 *  3. Disposable mail  — a static blocklist of throwaway email domains.
 *  4. Email shape      — rejects addresses that cannot possibly be real.
 */

const DISPOSABLE_DOMAINS = new Set([
  "0-mail.com",
  "10minutemail.com",
  "20minutemail.com",
  "33mail.com",
  "burnermail.io",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "inboxbear.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mintemail.com",
  "moakt.com",
  "mohmal.com",
  "mytemp.email",
  "sharklasers.com",
  "spam4.me",
  "spamgourmet.com",
  "temp-mail.org",
  "tempmail.com",
  "tempmail.net",
  "tempmailo.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
  "tempmailaddress.com",
]);

const EMAIL_PATTERN = /^[^\s@,;:<>()[\]\\]+@[^\s@,;:<>()[\]\\]+\.[a-z]{2,}$/i;

export type EmailCheck =
  | { valid: true; email: string }
  | { valid: false; reason: string };

/** Validates the shape of an email address and rejects disposable domains. */
export function checkEmail(raw: unknown): EmailCheck {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return { valid: false, reason: "Email address is required." };
  }

  const email = raw.trim().toLowerCase();

  if (email.length > 254) {
    return { valid: false, reason: "That email address is too long." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      valid: false,
      reason: "That email address doesn't look right. Please check it for typos.",
    };
  }

  const domain = email.split("@")[1];
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: "Disposable email addresses are not allowed. Please use a permanent address.",
    };
  }

  return { valid: true, email };
}

/** Minimum time a form must stay open before it can be submitted. */
export const MIN_FORM_FILL_MS = 1500;

export type BotCheck = { allowed: true } | { allowed: false; reason: string };

/**
 * Evaluates the honeypot + elapsed-time signals.
 *
 * @param honeypot value of the hidden decoy field (empty for humans)
 * @param startedAt epoch milliseconds when the form was rendered
 */
export function checkBotSignals(
  honeypot: unknown,
  startedAt: unknown,
): BotCheck {
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { allowed: false, reason: "Request rejected." };
  }

  if (typeof startedAt === "number" && Number.isFinite(startedAt)) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= 0 && elapsed < MIN_FORM_FILL_MS) {
      return { allowed: false, reason: "Please slow down and try again." };
    }
  }

  return { allowed: true };
}
