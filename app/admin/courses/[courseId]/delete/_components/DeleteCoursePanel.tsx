"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteCourse } from "../actions";

export function DeleteCoursePanel({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      try {
        const result = await deleteCourse(courseId);

        if (result.status === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.push(result.redirectTo ?? "/admin/courses");
        router.refresh();
      } catch {
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="mt-10 border-destructive/40">
        <CardHeader>
          <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </span>
          <CardTitle className="mt-2">Delete this course?</CardTitle>
          <CardDescription>
            Every chapter, lesson, enrolment, review and certificate for this
            course is permanently removed. This action cannot be undone.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5 size-4 accent-destructive"
            />
            <span className="text-muted-foreground">
              I understand that this permanently deletes the course and all of
              its content.
            </span>
          </label>
        </CardContent>

        <CardFooter className="gap-2">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            Cancel
          </Link>
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={pending || !confirmed}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete course
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
