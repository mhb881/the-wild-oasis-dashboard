import { Briefcase, Calendar, ChartBar, DollarSign } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

import { formateCurrency } from "~/lib/utils/helpers";
import type {
  ItemOfGetBookingsAfterDate,
  ItemOfGetStaysAfterDate,
} from "~/types/types";

import Stat from "./Stat";

interface StatsProps extends ComponentPropsWithRef<"div"> {
  bookings: ItemOfGetBookingsAfterDate[];
  confirmedStays: ItemOfGetStaysAfterDate[];
  numDays: number;
  cabinCnt: number;
  children?: React.ReactNode;
}

function Stats({ bookings, confirmedStays, numDays, cabinCnt }: StatsProps) {
  // 1
  const numBookings = bookings.length;

  // 2
  const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);

  // 3
  const checkIns = confirmedStays.length;

  // 4 num checked in nights / all available nights (num days * num)
  //   const occupancyRate = checkIns / cabinCnt;
  const occupancyRate =
    confirmedStays.reduce((acc, i) => acc + i.numNights, 0) /
    (numDays * cabinCnt);

  return (
    <>
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
        icon={<ChartBar />}
        value={Math.round(occupancyRate * 100) + "%"}
      />
    </>
  );
}

export default Stats;
