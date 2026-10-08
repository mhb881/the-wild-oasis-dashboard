import { useQuery } from "@tanstack/react-query";

import { getStaysTodayActivity } from "~/services/apiBooking";

export function useTodayActivity() {
  const { data: activities = [], isPending, error } = useQuery({
    queryKey: ["today-activity"],
    queryFn: () => getStaysTodayActivity(),
  });

  return {
    activities,
    data: activities,
    isPending,
    error,
  };
}

export default useTodayActivity;
