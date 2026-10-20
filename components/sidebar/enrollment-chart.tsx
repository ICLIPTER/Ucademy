"use client";

import dynamic from "next/dynamic";

import type { EnrollmentChartPoint } from "./chart-area-interactive";

/**
 * Client boundary for the Recharts chart.
 *
 * Recharts measures its container in the browser, so it is loaded without
 * server-side rendering. `ssr: false` is only allowed inside a Client
 * Component, which is why this wrapper exists.
 */
const ChartAreaInteractive = dynamic(
  () =>
    import("./chart-area-interactive").then(
      (module) => module.ChartAreaInteractive,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] w-full animate-pulse rounded-xl bg-muted/50" />
    ),
  },
);

export function EnrollmentChart({ data }: { data: EnrollmentChartPoint[] }) {
  return <ChartAreaInteractive data={data} />;
}
