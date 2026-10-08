import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createUser } from "../../services/apiUsers";

export function useCreateUser() {
  const queryClient = useQueryClient();

  const { mutate: createUserMutation, isPending: isCreating } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("成功创建新用户！");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "创建用户失败");
    },
  });

  return { createUserMutation, isCreating };
}

export default useCreateUser;
