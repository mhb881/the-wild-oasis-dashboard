import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateCabin } from "../../services/apiCabins";
import type { CabinInput } from "../../types/types";

export default function useUpdateCabin() {
  const queryClient = useQueryClient();

  // 修正更新 mutation：包装参数，适配React Query类型
  const { isPending: isUpdating, mutate: updateCabinMutate } = useMutation({
    // 接收1个对象参数，解构后调用updateCabin服务
    mutationFn: ({
      newCabin,
      id,
    }: {
      newCabin: CabinInput;
      id: string | number;
    }) => updateCabin(newCabin, id),
    onSuccess: () => {
      toast.success("成功更新Cabin");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => {
      toast.error(error.message || "更新Cabin失败: ");
    },
  });

  return { isUpdating, updateCabinMutate };
}
