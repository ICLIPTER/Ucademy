"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { issueCertificateAction } from "../actions";

export function ClaimCertificateButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      try {
        const result = await issueCertificateAction(courseId);

        if (result.status === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
      } catch {
        toast.error("Could not issue your certificate.");
      }
    });
  }

  return (
    <Button onClick={onClick} disabled={pending} variant="outline">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Issuing…
        </>
      ) : (
        <>
          <Award className="size-4" />
          Claim certificate
        </>
      )}
    </Button>
  );
}
