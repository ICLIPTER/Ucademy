"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { verifyCheckoutAction } from "@/app/(public)/courses/[slug]/actions";

type ResultState = {
  status: "loading" | "success" | "error";
  message: string;
  destination: string;
};

const MISSING_SESSION: ResultState = {
  status: "error",
  message:
    "We could not find the order reference. If you were charged, contact support and we will sort it out.",
  destination: "/dashboard",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<ResultCard loading />}>
      <PaymentSuccess />
    </Suspense>
  );
}

function PaymentSuccess() {
  const params = useSearchParams();
  const { triggerConfetti } = useConfetti();

  const sessionId = params.get("session_id");

  // The initial state is derived during render, so no `setState` is needed
  // inside the effect.
  const [result, setResult] = useState<ResultState>(() =>
    sessionId
      ? { status: "loading", message: "Confirming your payment…", destination: "/dashboard" }
      : MISSING_SESSION,
  );

  const celebrated = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await verifyCheckoutAction(sessionId);

        if (cancelled) return;

        if (response.status === "success") {
          setResult({
            status: "success",
            message: response.message,
            destination: response.redirectTo ?? "/dashboard",
          });
        } else {
          setResult({
            status: "error",
            message: response.message,
            destination: "/dashboard",
          });
        }
      } catch {
        if (cancelled) return;
        setResult({
          status: "error",
          message:
            "We could not confirm the payment yet. It usually takes a few seconds — refresh this page in a moment.",
          destination: "/dashboard",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    // Fire once, when the payment is confirmed.
    if (result.status === "success" && !celebrated.current) {
      celebrated.current = true;
      triggerConfetti();
    }
  }, [result.status, triggerConfetti]);

  if (result.status === "loading") {
    return <ResultCard loading />;
  }

  if (result.status === "error") {
    return (
      <ResultCard
        error
        title="We could not confirm this payment"
        message={result.message}
        actions={
          <>
            <Button asChild>
              <Link href={result.destination}>Go to my learning</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help#contact">Contact support</Link>
            </Button>
          </>
        }
      />
    );
  }

  return (
    <ResultCard
      title="You're enrolled"
      message="Your course is unlocked. Head over to your learning dashboard to start the first lesson."
      actions={
        <>
          <Button asChild>
            <Link href={result.destination}>Start learning</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">My learning</Link>
          </Button>
        </>
      }
    />
  );
}

function ResultCard({
  title,
  message,
  loading,
  error,
  actions,
}: {
  title?: string;
  message?: string;
  loading?: boolean;
  error?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          {loading ? (
            <Loader2 className="size-10 animate-spin text-primary" />
          ) : error ? (
            <XCircle className="size-10 text-destructive" />
          ) : (
            <CheckCircle2 className="size-10 text-emerald-500" />
          )}

          <CardTitle className="text-2xl">
            {loading ? "Confirming your payment" : (title ?? "Payment successful")}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        {actions && (
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {actions}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
