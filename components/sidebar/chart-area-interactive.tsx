"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type EnrollmentChartPoint = {
  date: string;
  label: string;
  count: number;
};

interface ChartAreaInteractiveProps {
  data: EnrollmentChartPoint[];
  title?: string;
  description?: string;
}

const chartConfig = {
  count: {
    label: "Enrollments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

/**
 * Daily enrolment chart.
 *
 * Recharts is a large dependency; it is only ever rendered inside the admin
 * area, so the parent loads it with `next/dynamic` and the public site never
 * downloads it.
 */
export function ChartAreaInteractive({
  data,
  title = "Total Enrollments",
  description,
}: ChartAreaInteractiveProps) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data],
  );

  return (
    <div className="@container/card border border-border/50 shadow-sm backdrop-blur-md rounded-xl">
      <div className="pb-3 px-6 pt-6">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description ?? (
            <>
              <span className="hidden @[540px]/card:block">
                Last 30 days: {total}
              </span>
              <span className="@[540px]/card:hidden">Total: {total}</span>
            </>
          )}
        </p>
      </div>

      <div className="px-2 pt-4 pb-6 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart data={data} margin={{ left: 4, right: 12 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-muted/40"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              interval="preserveStartEnd"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />

            <YAxis
              allowDecimals={false}
              width={32}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  labelFormatter={(value) =>
                    new Date(String(value)).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    })
                  }
                />
              }
            />

            <Bar
              dataKey="count"
              fill="var(--primary)"
              radius={[6, 6, 0, 0]}
              animationDuration={450}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
