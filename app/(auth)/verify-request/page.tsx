"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function VerifyRequestRoute() {
  return (
    <Suspense fallback={<VerifyCardSkeleton />}>
      <VerifyRequest />
    </Suspense>
  );
}

function VerifyRequest() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [pending, startTransition] = useTransition();
  const params = useSearchParams();

  // The address is optional in the URL — the user may have opened the page
  // directly. Without it the form cannot be submitted, and the user is
  // pointed back to the sign-in screen.
  const email = params.get("email");

  function verifyOtp() {
    if (!email) return;

    startTransition(async () => {
      try {
        await authClient.signIn.emailOtp({
          email,
          otp,
          fetchOptions: {
            onSuccess: () => {
              toast.success("You're signed in.");
              router.replace("/dashboard");
              router.refresh();
            },
            onError: () => {
              toast.error("That code did not work. Please try again.");
            },
          },
        });
      } catch {
        toast.error("That code did not work. Please try again.");
      }
    });
  }

  if (!email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Start from the sign-in page</CardTitle>
          <CardDescription>
            We need your email address to send you a verification code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isComplete = otp.length === 6;

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <MailCheck className="mx-auto size-8 text-primary" />
        <CardTitle className="text-xl">Check your email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={setOtp}
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-sm text-muted-foreground">
            Enter the code from your inbox.
          </p>
        </div>

        <Button
          onClick={verifyOtp}
          disabled={pending || !isComplete}
          className="w-full"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify and continue"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Didn&apos;t get it?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Request a new code
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function VerifyCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
