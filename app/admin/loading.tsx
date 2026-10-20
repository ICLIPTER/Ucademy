import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton shown while the instructor studio loads.
 *
 * Scoped to the `admin` segment for the same reason as the dashboard
 * skeleton — a root-level `loading.tsx` would flush the response shell
 * before the page renders and turn `notFound()` into a soft 404.
 */
export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-80 w-full rounded-xl" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
