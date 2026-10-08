import type { ComponentPropsWithRef } from "react";

import { cn } from "~/lib/utils/cn";
import type { ItemOfGetStaysTodayActivity } from "~/types/types";
import { Heading, RowLayout, Skeleton } from "~/ui";

import DashboardBox from "../dashboard/DashboardBox";
import TodayItem from "./TodayItem";
import { useTodayActivity } from "./useTodayActivity";

interface TodayActivityProps extends ComponentPropsWithRef<"div"> {
  activities?: ItemOfGetStaysTodayActivity[];
}

export function TodayActivitySkeleton({ className }: { className?: string }) {
  return (
    <DashboardBox
      className={cn("col-span-2 flex flex-col gap-6 pt-6", className)}
    >
      <RowLayout type="horizontal">
        <Heading type="h2">今日活动</Heading>
      </RowLayout>
      <div className="flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[9rem_2rem_1fr_7rem_9rem] items-center gap-3 border-b border-gray-100 py-3 first:border-t dark:border-gray-800"
          >
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-6 rounded-xs" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </DashboardBox>
  );
}

function TodayActivity({
  activities: activitiesProp,
  className,
  ...props
}: TodayActivityProps) {
  const { activities: activitiesFromHook, isPending } = useTodayActivity();

  // 如果父组件传入了 activities 则优先使用父组件数据，否则使用 hook 自带数据
  const activities = activitiesProp ?? activitiesFromHook;
  const isLoading = activitiesProp === undefined && isPending;

  if (isLoading) return <TodayActivitySkeleton className={className} />;

  return (
    <DashboardBox
      className={cn("col-span-2 flex flex-col gap-6 pt-6", className)}
      {...props}
    >
      <RowLayout type="horizontal">
        <Heading type="h2">今日活动</Heading>
      </RowLayout>

      {activities && activities.length > 0 ? (
        <ul className="flex-1 [scrollbar-width:none] overflow-x-hidden overflow-y-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {activities.map((activity) => (
            <TodayItem key={activity.id} activity={activity} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-center text-lg font-medium text-gray-500">
          今日暂无活动...
        </p>
      )}
    </DashboardBox>
  );
}

export default TodayActivity;
