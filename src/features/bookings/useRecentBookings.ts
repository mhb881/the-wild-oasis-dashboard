import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router";

import { getBookingsAfterDate } from "~/services/apiBooking";

export default function useRecentBookings() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { data, isPending, error } = useQuery({
    queryKey: ["bookings", `last-${numDays}`],
    queryFn: () => getBookingsAfterDate(queryDate),
  });

  return { data, isPending, error, numDays };
}
