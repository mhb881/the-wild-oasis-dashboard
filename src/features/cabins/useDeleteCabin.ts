import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { delCabin } from "../../services/apiCabins";

export default function useDeleteCabin() {
  // Access the client
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: delCabinMutate } = useMutation({
    mutationFn: delCabin,
    onSuccess: () => {
      toast.success("成功删除小屋");
      // React Query 是通过 Invalidate and refetch 来重新获取数据的
      // 官方演示需要用到 query 实例，  queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isDeleting, delCabinMutate };
}
