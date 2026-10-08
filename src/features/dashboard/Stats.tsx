import { Briefcase, Calendar, ChartColumn, DollarSign } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

import { cn } from "~/lib/utils/cn";
import { formateCurrency } from "~/lib/utils/helpers";
import type {
  ItemOfGetBookingsAfterDate,
  ItemOfGetStaysAfterDate,
} from "~/types/types";
import { Skeleton } from "~/ui";

import useRecentBookings from "../bookings/useRecentBookings";
import useRecentStays from "../bookings/useRecentStays";
import useCabins from "../cabins/useCabins";
import Stat from "./Stat";

interface StatsProps extends ComponentPropsWithRef<"div"> {
  bookings?: ItemOfGetBookingsAfterDate[];
  confirmedStays?: ItemOfGetStaysAfterDate[];
  numDays?: number;
  cabinCnt?: number;
  children?: React.ReactNode;
}

export function StatsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("col-span-full grid grid-cols-4 gap-4", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[4rem_1fr] grid-rows-[auto_auto] items-center gap-x-4 gap-y-2 rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900"
        >
          <Skeleton className="row-span-2 aspect-square h-16 w-16 rounded-full" />
          <Skeleton className="h-3 w-16 self-end" />
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );
}

function Stats({
  bookings: bookingsProp,
  confirmedStays: confirmedStaysProp,
  numDays: numDaysProp,
  cabinCnt: cabinCntProp,
  className,
  ...props
}: StatsProps) {
  const { data: bookingsFromHook, isPending: isBookingsPending } =
    useRecentBookings();
  const {
    confirmedStays: staysFromHook,
    numDays: daysFromHook,
    isPending: isStaysPending,
  } = useRecentStays();
  const { cabins, isPending: isCabinsPending } = useCabins();

  const isPending =
    (bookingsProp === undefined && isBookingsPending) ||
    (confirmedStaysProp === undefined && isStaysPending) ||
    (cabinCntProp === undefined && isCabinsPending);

  if (isPending) return <StatsSkeleton className={className} />;

  const bookings = bookingsProp ?? (bookingsFromHook || []);
  const confirmedStays = confirmedStaysProp ?? (staysFromHook || []);
  const numDays = numDaysProp ?? (daysFromHook || 7);
  const cabinCnt = cabinCntProp ?? (cabins?.length || 0);

  const numBookings = bookings.length;
  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);
  const checkIns = confirmedStays.length;
  const occupancyRate =
    cabinCnt > 0 && numDays > 0
      ? confirmedStays.reduce((acc, i) => acc + i.numNights, 0) /
        (numDays * cabinCnt)
      : 0;

  return (
    <div
      className={cn("col-span-full grid grid-cols-4 gap-4", className)}
      {...props}
    >
      <Stat
        title="订单数"
        color="blue"
        icon={<Briefcase />}
        value={numBookings}
      />
      <Stat
        title="销售额"
        color="green"
        icon={<DollarSign />}
        value={formateCurrency(sales)}
      />
      <Stat
        title="入住人数"
        color="indigo"
        icon={<Calendar />}
        value={checkIns}
      />
      <Stat
        title="入住率"
        color="yellow"
        icon={<ChartColumn />}
        value={Math.round(occupancyRate * 100) + "%"}
      />
    </div>
  );
}

export default Stats;
