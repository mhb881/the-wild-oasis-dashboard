import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import { getBooking } from "../../services/apiBooking";
import type { ItemOfGetBooking } from "../../types/types";

/*
当 TanStack Query 进行 Query 失败时，
默认情况下 TanStack Query 会重试 3 次，

但在本场景下，找不到数据可能意味着一开始就不存在该数据，
所以不需要重试
 */
export function useBooking() {
  const { bookingId } = useParams();

  const { data, isPending, error } = useQuery<ItemOfGetBooking>({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(Number(bookingId)),
    retry: false, // 禁用重试
  });

  return { data, isPending, error };
}
