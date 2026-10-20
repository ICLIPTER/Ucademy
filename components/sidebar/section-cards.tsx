import { IconBook, IconPlaylistX, IconShoppingCart, IconUsers } from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";
import { formatCompactNumber } from "@/lib/format";

export async function SectionCards() {
  const {
    totalUsers,
    totalCustomers,
    totalCourses,
    totalLessons,
    publishedCourses,
  } = await AdminGetDashboardStats();

  const cards = [
    {
      label: "Total Signups",
      value: totalUsers,
      hint: "Registered users on the platform",
      icon: IconUsers,
    },
    {
      label: "Paying Learners",
      value: totalCustomers,
      hint: "Users with an active enrolment",
      icon: IconShoppingCart,
    },
    {
      label: "Published Courses",
      value: publishedCourses,
      hint: `${totalCourses} courses created in total`,
      icon: IconBook,
    },
    {
      label: "Total Lessons",
      value: totalLessons,
      hint: "Lessons available across the catalogue",
      icon: IconPlaylistX,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {formatCompactNumber(card.value)}
              </CardTitle>
            </div>
            <card.icon className="size-6 text-muted-foreground" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <p className="text-muted-foreground">{card.hint}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
