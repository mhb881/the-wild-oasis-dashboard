import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteUser } from "../../services/apiUsers";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("用户已成功删除！");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "删除用户失败");
    },
  });

  return { deleteUserMutation, isDeleting };
}

export default useDeleteUser;
