import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

import { parseRichText } from "@/lib/rich-text";

/**
 * Renders a TipTap document as HTML.
 *
 * This is a **server** component on purpose: generating the HTML on the
 * server means the course description is present in the initial HTML
 * response — no layout shift, and the TipTap runtime never has to be
 * downloaded by a reader who only wants to read.
 *
 * The input is the raw JSON string; invalid content degrades to a plain
 * paragraph instead of throwing.
 */
export function RenderDescription({ content }: { content: string | null }) {
  const json = parseRichText(content);

  if (!json) {
    if (!content?.trim()) return null;

    // Not a TipTap document — render it as plain text rather than dropping
    // the content entirely.
    return (
      <div className="prose dark:prose-invert prose-li:marker:text-primary">
        <p>{content}</p>
      </div>
    );
  }

  const html = generateHTML(json, [
    StarterKit,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(html)}
    </div>
  );
}
