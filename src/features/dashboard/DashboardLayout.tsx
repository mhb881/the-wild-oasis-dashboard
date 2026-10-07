import type { ComponentPropsWithRef } from "react";

import { Spinner } from "~/ui";

import useRecentBookings from "../bookings/useRecentBookings";
import useRecentStays from "../bookings/useRecentStays";
import useCabins from "../cabins/useCabins";
import Stats from "./Stats";

interface DashboardLayoutProps extends ComponentPropsWithRef<"div"> {
  children?: React.ReactNode;
}

function DashboardLayout({ children, ...props }: DashboardLayoutProps) {
  const {
    data: bookings,
    isPending: isBookingsPending,
    error,
  } = useRecentBookings();

  const {
    confirmedStays,
    isPending: isStaysPending,
    error: staysError,
    numDays,
  } = useRecentStays();

  const {
    cabins,
    isPending: isCabinsPending,
    error: cabinsError,
  } = useCabins();

  if (isBookingsPending || isStaysPending || isCabinsPending)
    return <Spinner />;

  return (
    <div
      className="grid grid-cols-4 grid-rows-[auto_34rem_auto] gap-10 wrap-break-word"
      {...props}
    >
      <Stats
        bookings={bookings || []}
        confirmedStays={confirmedStays || []}
        numDays={numDays}
        cabinCnt={cabins?.length || 0}
      >
        {children}
      </Stats>
      <div>Today's Activity</div>
      <div>Chart stay durations</div>
      <div>Charts sales</div>
      {children}
    </div>
  );
}

export default DashboardLayout;
