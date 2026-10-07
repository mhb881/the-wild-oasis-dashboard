import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../../services/apiAuth";
import type { UserFromSupabase } from "../../types/types";

export function useUser() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery<UserFromSupabase | null>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return {
    user,
    isPending,
    error,
    isAuthenticated: user?.role === "authenticated",
  };
}
