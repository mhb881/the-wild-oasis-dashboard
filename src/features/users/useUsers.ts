import { useQuery } from "@tanstack/react-query";

import { getUsers } from "../../services/apiUsers";
import type { SystemUser } from "./types";

export function useUsers() {
  const {
    data: users,
    isPending,
    error,
  } = useQuery<SystemUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return { users, isPending, error };
}

export default useUsers;
