import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Payment cancelled",
  description: "Your checkout was cancelled and you have not been charged.",
};

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <XCircle className="size-10 text-muted-foreground" />
          <CardTitle className="text-2xl">Payment cancelled</CardTitle>
          <CardDescription>
            No money has been taken. Your cart is still waiting for you if you
            would like to try again.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/courses">Back to courses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">My learning</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
