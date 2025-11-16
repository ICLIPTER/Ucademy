import { IconBook, IconPlaylistX, IconShoppingCart, IconUsers } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AdminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats"

export async function SectionCards() {
  const { totalCourses, totalLessons, totalSignups, totalCustomers } = await AdminGetDashboardStats()
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Signups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSignups}
          </CardTitle>
          </div>
          <IconUsers className="size-6" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Registered users on the platform</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers}
          </CardTitle>
          </div>
          <IconShoppingCart className="size-6" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Users who have enrolled in the courses</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCourses}
          </CardTitle>
          </div>
          <IconBook className="size-6"/>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Available Courses on the Platform</p>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription>Total Lessons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLessons}
          </CardTitle>
          </div>
          <IconPlaylistX className="size-6 text-muted-foreground"/>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Total Lessons Available</p>
        </CardFooter>
      </Card>
    </div>
  )
}
