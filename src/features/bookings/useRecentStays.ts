import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router";

import { getStaysAfterDate } from "~/services/apiBooking";

export default function useRecentStays() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { data, isPending, error } = useQuery({
    queryKey: ["stays", `last-${numDays}`],
    queryFn: () => getStaysAfterDate(queryDate),
  });

  const confirmedStays = data?.filter(
    (item) => item.status === "checked-in" || item.status === "checked-out",
  );

  return { confirmedStays, isPending, error, numDays };
}
