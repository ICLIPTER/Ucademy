"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, ShieldBan, ShieldCheck, UserCog, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toggleUserBanAction, updateUserRoleAction } from "../actions";

export function UserRowActions({
  userId,
  name,
  role,
  banned,
}: {
  userId: string;
  name: string;
  role: string | null;
  banned: boolean | null;
}) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function run(action: () => Promise<{ status: string; message: string }>) {
    startTransition(async () => {
      try {
        const result = await action();

        if (result.status === "error") {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Something went wrong.");
      }
    });
  }

  const isAdmin = role === "admin";

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Actions for ${name}`}>
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={pending}
            onSelect={() =>
              run(() =>
                updateUserRoleAction(userId, isAdmin ? "user" : "admin"),
              )
            }
          >
            <UserCog className="size-4" />
            {isAdmin ? "Revoke instructor" : "Make instructor"}
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={pending}
            onSelect={() => run(() => toggleUserBanAction(userId))}
            className={
              banned ? "text-foreground" : "text-destructive focus:text-destructive"
            }
          >
            {banned ? (
              <>
                <ShieldCheck className="size-4" />
                Reinstate learner
              </>
            ) : (
              <>
                <ShieldBan className="size-4" />
                Suspend learner
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {banned ? <Badge variant="destructive">Suspended</Badge> : null}
    </>
  );
}
