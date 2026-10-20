"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      // `replace` removes the protected page from history and `refresh`
      // clears the server-rendered session state so the header updates
      // immediately instead of after a hard reload.
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    }
  };

  return handleSignOut;
}
