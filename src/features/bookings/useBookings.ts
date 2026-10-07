// d:\WorkSpace\Udemy\Jonas\ultimate-react-course-main\17-the-wild-oasis\the-wild-oasis-self\src\features\bookings\useBookings.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

import { PAGE_SIZE } from "../../lib/constants";
import { getBookings } from "../../services/apiBooking";
import type { FilterMethod, ItemOfGetBookings } from "../../types/types";

export default function useBookings() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // 1. Filter
  const filterVal = searchParams.get("status");
  const filter:
    | { field: string; value: string; method: FilterMethod }
    | undefined =
    !filterVal || filterVal === "all"
      ? undefined
      : { field: "status", value: filterVal, method: "eq" };

  const sortVal = searchParams.get("sortBy");
  const isDesc = searchParams.get("desc") === "true";

  // 2. Sort
  const sortByObj: { field: string; isDesc: boolean } | undefined = !sortVal
    ? undefined
    : { field: sortVal, isDesc: isDesc };

  // 3. Pagination
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // 4. Query
  const { data, isPending, error } = useQuery<{
    data: ItemOfGetBookings[];
    count: number | null;
  }>({
    // 我们可以认为这个 queryKey 就是 React Query 的依赖数组
    // 里面任何值发生改变的时候，都会触发 Query
    // 因此我们监听 filter 对象，当其改变的时候，重新 query
    queryKey: ["bookings", filter, sortByObj, page],
    queryFn: () => getBookings({ filter, sortBy: sortByObj, page }),
  });

  const bookings = data?.data ?? []; // 如果 data 不存在，默认为空数组
  const count = data?.count ?? 0; // 如果 count 不存在，默认为 0

  // 5. 预加载下一页
  const totalPage = Math.ceil(count / PAGE_SIZE);

  if (page < totalPage) {
    // 如果当前页小于总页数, 则预加载下一页
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortByObj, page + 1],
      queryFn: () => getBookings({ filter, sortBy: sortByObj, page: page + 1 }),
    });
  }

  if (page > 1) {
    // 如果当前页大于 1, 则预加载上一页
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortByObj, page - 1],
      queryFn: () => getBookings({ filter, sortBy: sortByObj, page: page - 1 }),
    });
  }

  return {
    bookings,
    isPending,
    error,
    count,
  };
}
