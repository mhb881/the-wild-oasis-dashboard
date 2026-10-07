// d:\WorkSpace\Udemy\Jonas\ultimate-react-course-main\17-the-wild-oasis\the-wild-oasis-self\src\features\bookings\useDeleteBooking.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { delBooking } from "../../services/apiBooking";

export default function useDeleteBooking() {
  // 解释一下这是什么
  // 这是一个 React Query 的 Mutation Hook，用于删除预订。
  // 它会调用 delBooking 函数，删除预订。
  // 删除成功后，会刷新预订列表。
  // 删除失败后，会显示错误信息。
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: delBookingMutate } = useMutation({
    mutationFn: delBooking,
    onSuccess: () => {
      toast.success("成功删除订单");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isDeleting, delBookingMutate };
}
