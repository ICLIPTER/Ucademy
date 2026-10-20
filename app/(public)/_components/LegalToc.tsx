/**
 * Table of contents for the legal pages.
 *
 * The sections are supplied as plain data so the terms and the privacy policy
 * can share one layout without duplicating the markup.
 */
export type LegalSection = {
  id: string;
  title: string;
};

export function LegalToc({ sections }: { sections: LegalSection[] }) {
  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ol className="mt-3 space-y-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {index + 1}. {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
