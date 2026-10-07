import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateSettings } from "../../services/apiSettings";

export default function useUpdateSettings() {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: updateSettingsMutate } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("成功更新 设置");
    },
    onError: (error) => {
      toast.error(`更新设置失败: ${error.message}`);
    },
  });

  return { isUpdating, updateSettingsMutate };
}
