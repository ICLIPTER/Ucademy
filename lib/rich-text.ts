import type { JSONContent } from "@tiptap/react";

/**
 * Parses the JSON payload produced by the TipTap editor.
 *
 * The `description` column is a plain string, so a row that was written by
 * an older version of the app (or edited by hand) may not contain valid
 * JSON. Parsing it without a guard used to crash the whole page.
 *
 * @returns the parsed document, or `null` when the value is not usable.
 */
export function parseRichText(value: string | null | undefined): JSONContent | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Legacy rows stored raw HTML instead of a TipTap document.
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;

  try {
    const parsed = JSON.parse(trimmed) as JSONContent;

    if (!parsed || typeof parsed !== "object" || !("type" in parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
