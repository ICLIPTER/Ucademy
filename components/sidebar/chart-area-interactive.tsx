"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartAreaInteractiveProps {
  data: { date: string; enrollments: number }[];
}

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollments = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  );

  const safeFormatDate = (value: string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="@container/card border border-border/50 shadow-sm backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Total Enrollments
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground">
          <span className="hidden @[540px]/card:block">
            Last 30 days: {totalEnrollments}
          </span>
          <span className="@[540px]/card:hidden">Total: {totalEnrollments}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted/40"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              interval="preserveStartEnd"
              tickFormatter={safeFormatDate}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  labelFormatter={safeFormatDate}
                />
              }
            />

            <Bar
              dataKey="enrollments"
              fill="var(--primary)"
              radius={[6, 6, 0, 0]}
              animationDuration={450}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
