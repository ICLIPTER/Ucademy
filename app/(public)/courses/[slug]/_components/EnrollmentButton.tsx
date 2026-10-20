"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourseAction } from "../actions";
import { Loader2, Lock } from "lucide-react";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId),
      );

      if (error) {
        toast.error("An unexpected error occurred, please try again.");
        return;
      }

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      // A successful action either sends the learner to Stripe Checkout or
      // straight to the course they already own.
      if (result.redirectTo) {
        window.location.href = result.redirectTo;
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <Button onClick={onSubmit} disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Preparing checkout…
        </>
      ) : (
        <>
          <Lock className="size-4" />
          Enrol now
        </>
      )}
    </Button>
  );
}
