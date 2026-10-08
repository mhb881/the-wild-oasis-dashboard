import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { ComponentPropsWithRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDarkMode } from "~/context/DarkModeContext";
import { cn } from "~/lib/utils/cn";
import type { ItemOfGetBookingsAfterDate } from "~/types/types";
import { Heading, Skeleton } from "~/ui";

import useRecentBookings from "../bookings/useRecentBookings";
import DashboardBox from "./DashboardBox";

export interface SalesChartProps extends ComponentPropsWithRef<"div"> {
  bookings?: ItemOfGetBookingsAfterDate[];
  numDays?: number;
  className?: string;
}

export function SalesChartSkeleton({ className }: { className?: string }) {
  return (
    <DashboardBox
      className={cn("col-span-full flex flex-col gap-6", className)}
    >
      <div className="flex justify-center">
        <Skeleton className="h-7 w-72" />
      </div>
      <div className="flex h-[400px] w-full flex-col justify-between p-4">
        <div className="flex h-[320px] items-end justify-between gap-3 border-b border-gray-100 pb-2 dark:border-gray-800">
          {Array.from({ length: 14 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full rounded-t-sm"
              style={{ height: `${25 + ((i * 43) % 70)}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between pt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-12" />
          ))}
        </div>
      </div>
    </DashboardBox>
  );
}

export function SalesChart({
  bookings: bookingsProp,
  numDays: numDaysProp,
  className,
  ...props
}: SalesChartProps) {
  const { isDarkMode } = useDarkMode();
  const {
    data: bookingsFromHook,
    numDays: numDaysFromHook,
    isPending,
  } = useRecentBookings();

  const isLoading = bookingsProp === undefined && isPending;
  if (isLoading) return <SalesChartSkeleton className={className} />;

  const bookings = bookingsProp ?? (bookingsFromHook || []);
  const numDays = numDaysProp ?? (numDaysFromHook || 7);

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd", { locale: zhCN }),
      totalSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + (cur.totalPrice || 0), 0),
      extrasSales: bookings
        .filter((booking) => isSameDay(date, new Date(booking.created_at)))
        .reduce((acc, cur) => acc + (cur.extraPrice || 0), 0),
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#6366f1", fill: "#4f46e5" },
        extrasSales: { stroke: "#22c55e", fill: "#15803d" },
        text: "#e5e7eb",
        background: "#18212f",
        grid: "#374151",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        extrasSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#ffffff",
        grid: "#e5e7eb",
      };

  const startDateFormatted = format(allDates[0] ?? new Date(), "MMM dd yyyy", {
    locale: zhCN,
  });
  const endDateFormatted = format(
    allDates[allDates.length - 1] ?? new Date(),
    "MMM dd yyyy",
    { locale: zhCN },
  );

  return (
    <DashboardBox
      className={cn("col-span-full flex flex-col items-center", className)}
      {...props}
    >
      <Heading as="h2">
        从 {startDateFormatted} &mdash; {endDateFormatted} 的销售额趋势
      </Heading>

      <ResponsiveContainer height={400} width="100%">
        <AreaChart data={data} className="p-2">
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="¥"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" stroke={colors.grid} />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="总销售额"
            unit="¥"
          />
          <Area
            dataKey="extrasSales"
            type="monotone"
            stroke={colors.extrasSales.stroke}
            fill={colors.extrasSales.fill}
            strokeWidth={2}
            name="额外销售额"
            unit="¥"
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
}

export default SalesChart;
