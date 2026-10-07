import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUserMutation, isPending: isUpdatingUser } = useMutation(
    {
      mutationFn: updateUser,
      // onSuccess 中的参数是 mutationFn 函数的返回值
      onSuccess: ({ user }) => {
        console.log(user);
        toast.success("用户信息成功更新");
        queryClient.setQueryData(["user"], user);
      },
      onError: (err) => toast.error(err.message),
    },
  );

  return { updateUserMutation, isUpdatingUser };
}
