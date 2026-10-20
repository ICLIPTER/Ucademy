import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Youtube, Linkedin } from "lucide-react";

import Logo from "@/public/logo.png";
import { COURSE_CATEGORIES } from "@/lib/categories";
import { appUrl } from "@/lib/env";

const productLinks = [
  { name: "Browse courses", href: "/courses" },
  { name: "Categories", href: "/categories" },
  { name: "Pricing", href: "/pricing" },
  { name: "For instructors", href: "/instructors" },
  { name: "My learning", href: "/dashboard" },
];

const companyLinks = [
  { name: "About us", href: "/about" },
  { name: "Help centre", href: "/help" },
  { name: "Contact", href: "/help#contact" },
  { name: "Become an instructor", href: "/instructors#apply" },
];

const legalLinks = [
  { name: "Terms of service", href: "/terms" },
  { name: "Privacy policy", href: "/privacy" },
  { name: "Cookie policy", href: "/privacy#cookies" },
  { name: "Refund policy", href: "/help#refunds" },
];

const socials = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "X", href: "https://x.com", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src={Logo} alt="Ucademy" className="size-8" />
              <span className="text-lg font-bold tracking-tight">Ucademy</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A modern learning platform for people who want practical skills.
              Structured courses, measurable progress and certificates that
              mean something.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.name}
                  className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-foreground"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} Ucademy. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js ·{" "}
            <a
              href={appUrl}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {appUrl.replace(/^https?:\/\//, "")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Category links live in the footer as a dedicated column on wide screens.
 * Kept separate so the component above stays readable.
 */
export function FooterCategories() {
  return (
    <FooterColumn
      title="Categories"
      links={COURSE_CATEGORIES.map((category) => ({
        name: category.label,
        href: `/courses?category=${category.slug}`,
      }))}
    />
  );
}
