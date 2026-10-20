"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Github, Loader, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  /*
   * Anti-bot signals. `honeypot` is a hidden field only an automated client
   * would fill in; `startedAt` proves the form was on screen for a moment
   * before it was submitted. Both are validated on the server.
   */
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    // Stamped when the form mounts, so the server can tell a human from a
    // script that submitted the form instantly.
    startedAt.current = Date.now();
  }, []);

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully");
            router.refresh();
          },
          onError: () => {
            toast.error("Something went wrong — please try again.");
          },
        },
      });
    });
  }

  function signInWithEmail() {
    const trimmed = email.trim();

    if (!trimmed) {
      toast.error("Please enter your email address.");
      return;
    }

    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: trimmed,
        type: "sign-in",
        fetchOptions: {
          headers: {
            // The server uses these to reject automated submissions.
            "x-hp": honeypot,
            "x-started-at": String(startedAt.current),
          },
          onSuccess: () => {
            toast.success("We've sent a verification code to your email.");
            // The address must be encoded — an unencoded `+` is decoded as
            // a space and the code would never arrive.
            router.push(
              `/verify-request?email=${encodeURIComponent(trimmed)}`,
            );
          },
          onError: () => {
            toast.error("We could not send the code. Please try again.");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in with GitHub or a one-time code sent to your email.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={githubPending}
          onClick={signInWithGithub}
          className="w-full"
          variant="outline"
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Signing you in…</span>
            </>
          ) : (
            <>
              <Github className="size-4" />
              Continue with GitHub
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            or continue with email
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Honeypot — hidden from humans, irresistible to bots. */}
          <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          <Button
            onClick={signInWithEmail}
            disabled={emailPending}
            size="lg"
          >
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Sending the code…</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Email me a code</span>
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            New here? The same button creates your account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
