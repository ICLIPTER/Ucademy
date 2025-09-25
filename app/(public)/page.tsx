"use client";

import { Badge } from "@/components/ui/badge";
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
   <>
   <section className="relative py-20">
    <div className="flex flex-col items-center text-center space-y-8">
        <Badge>
            The Future of Online Learning
        </Badge>
    </div>
   </section>
   
   </>
  );
}
