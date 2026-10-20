/**
 * Uniform return type for every server action.
 *
 * `redirectTo` lets an action hand a URL back to the client instead of
 * calling `redirect()` — a `redirect()` thrown inside a server action is
 * swallowed by the `tryCatch` wrapper the client uses, which silently breaks
 * the flow.
 */
export type ApiResponse = {
  status: "success" | "error";
  message: string;
  redirectTo?: string;
  /** Optional field-level validation messages. */
  fields?: Record<string, string>;
};
