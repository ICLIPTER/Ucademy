"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function Home() {
  const router = useRouter();
const { data: session } = authClient.useSession();

async function SignOut() {
  await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/");
      toast.success("Signed out successfully");
    },
  },
});
}

  return (
   <div className="p-24">
    Hello World

    <ThemeToggle />

    {session ? (
      <div>
        <p>{session.user.name}</p>
        <Button onClick={SignOut}>Logout</Button>
      </div>
    ) : (<Button>Login</Button>
    )}
   </div>
  );
}
