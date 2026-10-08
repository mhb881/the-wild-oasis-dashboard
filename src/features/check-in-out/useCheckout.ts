import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateBooking } from "../../services/apiBooking";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId: number) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        type: "active",
      });
      toast.success(`订单 #${data.id} 已成功退房`);
    },
    onError: () => toast.error("退房失败"),
  });

  return { checkout, isCheckingOut };
}
