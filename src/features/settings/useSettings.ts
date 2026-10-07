import { useQuery } from "@tanstack/react-query";

import { getSettings } from "../../services/apiSettings";
import type { Setting } from "../../types/types";

export default function useSettings() {
  const {
    data: settings,
    isPending,
    error,
  } = useQuery<Setting>({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
  });

  return { settings, isPending, error };
}
