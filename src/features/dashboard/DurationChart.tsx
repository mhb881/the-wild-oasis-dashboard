import type { ComponentPropsWithRef } from "react";
import {
  Legend,
  Pie,
  PieChart,
  type PieSectorShapeProps,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

import { useDarkMode } from "~/context/DarkModeContext";
import { cn } from "~/lib/utils/cn";
import type { ItemOfGetStaysAfterDate } from "~/types/types";
import { Heading, Skeleton } from "~/ui";

import useRecentStays from "../bookings/useRecentStays";
import DashboardBox from "./DashboardBox";

export interface DurationChartProps extends ComponentPropsWithRef<"div"> {
  confirmedStays?: ItemOfGetStaysAfterDate[];
}

interface DurationData {
  duration: string; // name key
  value: number; // data key
  color: string;
  fill?: string;
}

const startDataLight: DurationData[] = [
  { duration: "1 night", value: 0, color: "#ef4444" },
  { duration: "2 nights", value: 0, color: "#f97316" },
  { duration: "3 nights", value: 0, color: "#eab308" },
  { duration: "4-5 nights", value: 0, color: "#84cc16" },
  { duration: "6-7 nights", value: 0, color: "#22c55e" },
  { duration: "8-14 nights", value: 0, color: "#14b8a6" },
  { duration: "15-21 nights", value: 0, color: "#3b82f6" },
  { duration: "22+ nights", value: 0, color: "#a855f7" },
];

const startDataDark: DurationData[] = [
  { duration: "1 night", value: 0, color: "#b91c1c" },
  { duration: "2 nights", value: 0, color: "#c2410c" },
  { duration: "3 nights", value: 0, color: "#a16207" },
  { duration: "4-5 nights", value: 0, color: "#4d7c0f" },
  { duration: "6-7 nights", value: 0, color: "#15803d" },
  { duration: "8-14 nights", value: 0, color: "#0f766e" },
  { duration: "15-21 nights", value: 0, color: "#1d4ed8" },
  { duration: "22+ nights", value: 0, color: "#7e22ce" },
];

function prepareData(
  startData: DurationData[],
  stays: ItemOfGetStaysAfterDate[] = [],
): DurationData[] {
  // 生成计数桶
  const counts = new Array<number>(startData.length).fill(0);

  // 统计每个持续时间的订单数量
  for (let i = 0; i < stays.length; i++) {
    const nums = stays[i].numNights;
    let idx = -1;

    if (nums === 1) idx = 0;
    else if (nums === 2) idx = 1;
    else if (nums === 3) idx = 2;
    else if (nums >= 4 && nums <= 5) idx = 3;
    else if (nums >= 6 && nums <= 7) idx = 4;
    else if (nums >= 8 && nums <= 14) idx = 5;
    else if (nums >= 15 && nums <= 21) idx = 6;
    else if (nums >= 22) idx = 7;

    if (idx !== -1) counts[idx]++;
  }

  const result: DurationData[] = [];

  for (let i = 0; i < startData.length; i++) {
    if (counts[i] > 0) {
      result.push({
        ...startData[i],
        value: counts[i],
        fill: startData[i].color,
      });
    }
  }

  return result;
}

export function DurationChartSkeleton({ className }: { className?: string }) {
  return (
    <DashboardBox className={cn("col-span-2 flex flex-col gap-4", className)}>
      <Heading as="h2">Stay duration summary</Heading>
      <div className="flex h-[240px] items-center justify-around px-4">
        <Skeleton className="h-44 w-44 rounded-full" />
        <div className="flex w-1/3 flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </DashboardBox>
  );
}

function DurationChart({
  confirmedStays: confirmedStaysProp,
  className,
  ...props
}: DurationChartProps) {
  const { confirmedStays: staysFromHook, isPending } = useRecentStays();
  const { isDarkMode } = useDarkMode();

  const isLoading = confirmedStaysProp === undefined && isPending;
  if (isLoading) return <DurationChartSkeleton className={className} />;

  const confirmedStays = confirmedStaysProp ?? (staysFromHook || []);
  const startData = isDarkMode ? startDataDark : startDataLight;
  const data = prepareData(startData, confirmedStays);

  return (
    <DashboardBox className={cn("col-span-2", className)} {...props}>
      <Heading as="h2">Stay duration summary</Heading>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            innerRadius={85}
            outerRadius={110}
            cx="40%"
            cy="50%"
            paddingAngle={3}
            shape={(props: PieSectorShapeProps) => {
              return (
                <Sector
                  {...props}
                  fill={props.payload?.color ?? props.fill}
                  stroke={props.payload?.color ?? props.stroke}
                />
              );
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#18212f" : "#ffffff",
              borderColor: isDarkMode ? "#374151" : "#e5e7eb",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{
              color: isDarkMode ? "#f3f4f6" : "#1f2937",
              fontSize: "0.875rem",
            }}
          />
          <Legend
            position="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
}

export default DurationChart;
