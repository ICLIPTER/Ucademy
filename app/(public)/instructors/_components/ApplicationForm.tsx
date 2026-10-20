"use client";

import { useState } from "react";
import { ChevronDown, Info, Mail, Send } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_CATEGORIES } from "@/lib/categories";

const TEACH_EMAIL = "teach@ucademy.app";

/**
 * Teaching application form.
 *
 * There is deliberately no server action here. The form collects what you
 * type and then hands it to your email client, so an application reaches a
 * human without us having to build (and secure) an intake pipeline first.
 */
export function ApplicationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [idea, setIdea] = useState("");

  const mailtoHref = `mailto:${TEACH_EMAIL}?subject=${encodeURIComponent(
    "Teaching application",
  )}&body=${encodeURIComponent(
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Area of expertise: ${expertise}`,
      "",
      "Course idea:",
      idea,
    ].join("\n"),
  )}`;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="rounded-2xl border bg-card p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="apply-name">Your name</Label>
          <Input
            id="apply-name"
            name="name"
            placeholder="Ananya Rao"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apply-email">Email</Label>
          <Input
            id="apply-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="apply-expertise">Area of expertise</Label>
        <div className="relative">
          <select
            id="apply-expertise"
            name="expertise"
            value={expertise}
            onChange={(event) => setExpertise(event.target.value)}
            className="border-input h-9 w-full appearance-none rounded-md border bg-transparent px-3 pr-9 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <option value="">Choose a track</option>
            {COURSE_CATEGORIES.map((category) => (
              <option key={category.slug} value={category.label}>
                {category.label}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="apply-idea">Your course idea</Label>
        <Textarea
          id="apply-idea"
          name="idea"
          rows={6}
          placeholder="What would you teach, who is it for, and what will a learner be able to do afterwards? A paragraph is plenty."
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => {
            window.location.href = mailtoHref;
          }}
          className={buttonVariants({ size: "lg" })}
        >
          <Send className="size-4" />
          Send application
        </button>
        <a
          href={`mailto:${TEACH_EMAIL}`}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          <Mail className="mr-1.5 inline size-4" />
          {TEACH_EMAIL}
        </a>
      </div>

      <div className="mt-6 flex gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">
            This form is a preview.
          </span>{" "}
          Nothing you type is sent to a server or stored in a database. The
          button opens your email client with your answers written into the
          message, and you send it from there.
        </p>
      </div>
    </form>
  );
}
