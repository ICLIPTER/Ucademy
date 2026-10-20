"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

/**
 * Client-side renderer for the lesson description.
 *
 * The lesson player is already a client component, so the TipTap runtime is
 * in the bundle for that page anyway — rendering there costs nothing extra.
 */
export function ClientRenderDescription({ json }: { json: JSONContent }) {
  const html = useMemo(
    () =>
      generateHTML(json, [
        StarterKit,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ]),
    [json],
  );

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(html)}
    </div>
  );
}
