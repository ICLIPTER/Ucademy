import Link from "next/link";
import { Star } from "lucide-react";

import { getWishlist } from "@/app/data/wishlist/get-wishlist";
import { EmptyState } from "@/app/admin/courses/_components/general/EmptyState";
import { PublicCourseCard } from "../../(public)/_components/PublicCourseCard";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Saved courses",
  description: "Courses you have saved for later.",
};

export default async function WishlistPage() {
  const items = await getWishlist();

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Saved courses</h1>
        <p className="text-muted-foreground">
          The courses you are keeping an eye on.{" "}
          {items.length > 0 && (
            <Link href="/courses" className={buttonVariants({ variant: "link" })}>
              Keep browsing
            </Link>
          )}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the heart on any course to save it here for later."
          buttonText="Browse courses"
          href="/courses"
          icon={<Star className="size-10 text-primary" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PublicCourseCard
              key={item.id}
              data={item.course}
              saved
              showWishlist
            />
          ))}
        </div>
      )}
    </div>
  );
}
