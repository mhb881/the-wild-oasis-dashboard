import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { logout } from "../../services/apiAuth";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending: isLoggingOutPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 注销成功后，清除所有查询缓存
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    logoutMutation,
    isLoggingOutPending,
    error,
  };
}
