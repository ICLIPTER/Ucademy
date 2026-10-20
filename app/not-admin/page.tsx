import Link from "next/link";
import { ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Access restricted",
  description: "You do not have permission to view this page.",
};

export default function NotAdminPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="size-7 text-destructive" />
          </span>
          <CardTitle className="text-2xl">Access restricted</CardTitle>
          <CardDescription>
            This area is for instructors. Your account does not have access to
            the studio.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/dashboard">Go to my learning</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/instructors#apply">Become an instructor</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
