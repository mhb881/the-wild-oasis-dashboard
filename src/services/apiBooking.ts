import { PAGE_SIZE } from "../lib/constants";
import type {
  Booking,
  FilterMethod,
  ItemOfGetBooking,
  ItemOfGetBookings,
} from "../types/types";
import supabase from "./supabase";

// 你的 FilterMethod 完美契合 Supabase .filter() 支持的操作符

interface GetBookingParameters {
  filter?: {
    field: string;
    value: string;
    // 💡 建议将这里的 string 改为 FilterMethod，让类型更严谨
    method: FilterMethod;
  };
  sortBy?: {
    field: string;
    isDesc: boolean;
  };
  page?: number;
}

export async function getBookings({
  filter,
  sortBy,
  page,
}: GetBookingParameters): Promise<{
  data: ItemOfGetBookings[];
  count: number | null;
}> {
  try {
    // count: "exact" 表示返回 exact 总记录数
    // 这是分页查询的重要参数，用于计算总页数
    // 例如：totalPage = Math.floor(totalBookings / maxVisibleElement)
    let query = supabase
      .from("bookings")
      .select("*, cabins(name), guests(fullName,email)", { count: "exact" });

    // 1. 处理筛选逻辑
    if (filter) {
      // 使用 .filter() 代替动态属性访问 query[method]
      const operator = filter.method || "eq";
      query = query.filter(filter.field, operator, filter.value);
    }

    // 2. 处理排序逻辑 (假设你原本有这部分逻辑)
    if (sortBy) {
      const field = sortBy.field;
      query = query.order(field, { ascending: !sortBy.isDesc });
    }

    // 3. 处理分页逻辑
    if (page) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error(error);
      throw new Error("获取 bookings 失败");
    }
    // 返回什么数据要标明类型
    return { data, count };
  } catch (err) {
    console.error(err);
    throw err instanceof Error
      ? err
      : new Error("获取 bookings 时发生未知错误");
  }
}

// 获取单个预订详情
export async function getBooking(id: number): Promise<ItemOfGetBooking> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, cabins(*), guests(*)")
      .eq("id", id)
      .single();
    if (error) {
      console.error(error);
      throw new Error("获取预订详情失败");
    }
    // 返回什么数据要标明类型
    return data;
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("获取预订详情时发生未知错误");
  }
}

export async function updateBooking(id: number, booking: Partial<Booking>) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update(booking)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error("更新预订失败");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error instanceof Error ? error : new Error("更新预订时发生未知错误");
  }
}

export async function delBooking(id: number) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("预订删除失败");
  }
}
