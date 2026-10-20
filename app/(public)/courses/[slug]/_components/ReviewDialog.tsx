"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquarePlus, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitReviewAction } from "../review-actions";

const RATINGS = [
  { value: "5", label: "Excellent" },
  { value: "4", label: "Good" },
  { value: "3", label: "Average" },
  { value: "2", label: "Poor" },
  { value: "1", label: "Terrible" },
];

export function ReviewDialog({
  courseId,
  existing,
}: {
  courseId: string;
  existing?: { rating: number; title: string | null; comment: string | null } | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const [rating, setRating] = useState(String(existing?.rating ?? 5));
  const [title, setTitle] = useState(existing?.title ?? "");
  const [comment, setComment] = useState(existing?.comment ?? "");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const result = await submitReviewAction({
          courseId,
          rating: Number(rating),
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        });

        if (result.status === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Could not save your review.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquarePlus className="size-4" />
          {existing ? "Update your review" : "Write a review"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {existing ? "Update your review" : "Write a review"}
          </DialogTitle>
          <DialogDescription>
            Share what you thought of the course — it helps other learners
            decide.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Your rating</Label>
            <RadioGroup
              value={rating}
              onValueChange={setRating}
              className="flex flex-wrap gap-4"
            >
              {RATINGS.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={`rating-${option.value}`} />
                  <Label
                    htmlFor={`rating-${option.value}`}
                    className="flex cursor-pointer items-center gap-1 font-normal"
                  >
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-title">Headline (optional)</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Sum it up in a few words"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-comment">Your review (optional)</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What did you like? What could be better?"
              rows={5}
              maxLength={2000}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {existing ? "Update review" : "Publish review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
