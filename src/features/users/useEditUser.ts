import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateUser } from "../../services/apiUsers";
import type { UpdateUserInput } from "./types";

export function useEditUser() {
  const queryClient = useQueryClient();

  const { mutate: editUserMutation, isPending: isEditing } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      updateUser(id, data),
    onSuccess: () => {
      toast.success("用户信息已成功更新！");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "更新用户信息失败");
    },
  });

  return { editUserMutation, isEditing };
}

export default useEditUser;
