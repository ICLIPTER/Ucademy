import { Suspense } from "react";
import { StorageImage } from "@/components/ui/storage-image";
import Link from "next/link";
import {
  IconCoin,
  IconShoppingCart,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

import {
  AdminGetEnrollmentStats,
  AdminGetRevenueStats,
  AdminGetTopCourses,
} from "@/app/data/admin/admin-get-enrollment-stats";
import { AdminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";
import { EnrollmentChart } from "@/components/sidebar/enrollment-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatCurrency } from "@/lib/format";
import { getPublicAssetUrl } from "@/lib/storage-url";

export const metadata = {
  title: "Analytics",
  description: "Enrolment, revenue and catalogue performance.",
};

export default async function AdminAnalyticsPage() {
  const [enrollmentData, revenue, topCourses, stats] = await Promise.all([
    AdminGetEnrollmentStats(30),
    AdminGetRevenueStats(),
    AdminGetTopCourses(8),
    AdminGetDashboardStats(),
  ]);

  const conversion =
    stats.totalUsers > 0
      ? Math.round((stats.totalCustomers / stats.totalUsers) * 100)
      : 0;

  const cards = [
    {
      label: "Revenue",
      value: formatCurrency(revenue.revenue),
      hint: "From active enrolments",
      icon: IconCoin,
    },
    {
      label: "Active enrolments",
      value: formatCompactNumber(revenue.active),
      hint: `${revenue.pending} awaiting payment`,
      icon: IconShoppingCart,
    },
    {
      label: "Conversion",
      value: `${conversion}%`,
      hint: "Signups that became paying learners",
      icon: IconUserCheck,
    },
    {
      label: "Total learners",
      value: formatCompactNumber(stats.totalUsers),
      hint: `${stats.totalCourses} courses published`,
      icon: IconUsers,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          How the catalogue and your learners are performing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {card.value}
                </CardTitle>
              </div>
              <card.icon className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {card.hint}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-[320px] animate-pulse rounded-xl bg-muted/50" />}>
            <EnrollmentChart data={enrollmentData} />
          </Suspense>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enrolment breakdown</CardTitle>
            <CardDescription>Where every enrolment currently stands.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BreakdownRow
              label="Active"
              value={revenue.active}
              total={revenue.active + revenue.pending + revenue.cancelled + revenue.refunded}
              tone="bg-emerald-500"
            />
            <BreakdownRow
              label="Pending payment"
              value={revenue.pending}
              total={revenue.active + revenue.pending + revenue.cancelled + revenue.refunded}
              tone="bg-amber-500"
            />
            <BreakdownRow
              label="Cancelled"
              value={revenue.cancelled}
              total={revenue.active + revenue.pending + revenue.cancelled + revenue.refunded}
              tone="bg-muted-foreground"
            />
            <BreakdownRow
              label="Refunded"
              value={revenue.refunded}
              total={revenue.active + revenue.pending + revenue.cancelled + revenue.refunded}
              tone="bg-destructive"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top performing courses</CardTitle>
          <CardDescription>Ranked by the number of learners enrolled.</CardDescription>
        </CardHeader>
        <CardContent>
          {topCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Publish a course to start collecting data.
            </p>
          ) : (
            <ul className="divide-y">
              {topCourses.map((course, index) => (
                <li
                  key={course.id}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <span className="w-5 text-sm font-semibold text-muted-foreground">
                    {index + 1}
                  </span>

                  <StorageImage
                    src={getPublicAssetUrl(course.fileKey)}
                    alt=""
                    width={64}
                    height={40}
                    className="h-10 w-16 rounded object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="line-clamp-1 text-sm font-medium hover:underline"
                    >
                      {course.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(course.price)} ·{" "}
                      {course.totalStudents} learners
                    </p>
                  </div>

                  {course.averageRating > 0 && (
                    <Badge variant="secondary">
                      {course.averageRating.toFixed(1)} ★
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">
          {formatCompactNumber(value)} · {percentage}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
