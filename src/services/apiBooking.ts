import { getToday } from "~/lib/utils/helpers";

import { PAGE_SIZE } from "../lib/constants";
import type {
  Booking,
  FilterMethod,
  ItemOfGetBooking,
  ItemOfGetBookings,
  ItemOfGetBookingsAfterDate,
  ItemOfGetStaysAfterDate,
  ItemOfGetStaysTodayActivity,
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
}

// 获取单个预订详情
export async function getBooking(id: number): Promise<ItemOfGetBooking> {
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
}

export async function updateBooking(id: number, booking: Partial<Booking>) {
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
}

export async function delBooking(id: number) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("预订删除失败");
  }
}

// 获取指定日期之后创建的所有预订（用于统计近期销售额等）
export async function getBookingsAfterDate(
  date: string,
): Promise<ItemOfGetBookingsAfterDate[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extraPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));
  if (error) {
    console.error(error);
    throw new Error("获取预订记录失败");
  }
  return data;
}

/*
这个函数用于获取 今日活动列表，包括：

今天要入住的未确认订单；

今天要退房的已入住订单。

返回的数据包含预订信息以及关联的客人信息（姓名、国籍、国旗），方便前端展示今日待办事项。
 */
export async function getStaysTodayActivity(): Promise<
  ItemOfGetStaysTodayActivity[]
> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`,
    )
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("获取入住记录失败");
  }
  return data ?? [];
}

// 获取指定日期之后的实际入住/留宿记录（用于统计近期入住率、留宿时长等）
export async function getStaysAfterDate(
  date: string,
): Promise<ItemOfGetStaysAfterDate[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());
  if (error) {
    console.error(error);
    throw new Error("获取入住记录失败");
  }
  return data;
}
