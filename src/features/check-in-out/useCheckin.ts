import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { updateBooking } from "../../services/apiBooking";
import type { Booking } from "../../types/types";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending: isCheckingIn } = useMutation({
    mutationFn: ({
      bookingId,
      newBooking,
    }: {
      bookingId: number;
      newBooking: Partial<Booking>;
    }) =>
      updateBooking(bookingId, {
        ...newBooking,
        status: "checked-in",
        isPaid: true,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
      toast.success(`订单 #${data.id} 已成功登记入住`);
      navigate("/");
    },
    onError: () => toast.error("登记入住失败"),
  });

  return { checkin, isCheckingIn };
}
