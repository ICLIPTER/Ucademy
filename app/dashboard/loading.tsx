import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton shown while the learner area loads.
 *
 * The boundary is scoped to the dashboard segment on purpose: a
 * `loading.tsx` at the root of `app/` flushes the response shell before the
 * page renders, which turns every `notFound()` into a soft 404 (HTTP 200).
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-80 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
