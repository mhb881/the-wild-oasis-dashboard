import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createCabin } from "../../services/apiCabins";

export default function useCreateCabin() {
  const queryClient = useQueryClient();
  const { isPending: isCreating, mutate: createCabinMutate } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("成功创建Cabin");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (error) => {
      toast.error(error.message || "创建Cabin失败: ");
    },
  });
  return { isCreating, createCabinMutate };
}
