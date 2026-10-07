import { differenceInDays, formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";
import slugify from "slugify";
import { transliterate } from "transliteration";
// 统一日期输入格式（项目中日期可能是字符串、时间戳、Date 对象）
export function toDate(value: string | Date | number) {
  return value instanceof Date ? value : new Date(value);
}

// 计算两个日期相差的总天数
export function subtractions(
  date1: string | Date | number,
  date2: string | Date | number,
) {
  return differenceInDays(toDate(date1), toDate(date2));
}

// 生成简洁的「相对当前时间」描述（界面展示用，比如：2 days ago、In 3 days）
export function formatDistanceFromNow(date: string | Date | number) {
  return formatDistance(toDate(date), new Date(), {
    addSuffix: true,
    locale: zhCN,
  })
    .replace("大概 ", "")
    .replace("少于 ", "")
    .replace("超过 ", "")
    .replace("几乎 ", "");
}

/*
英语实现：
export function formatDistanceFromNow(date: string | Date | number) {
  return formatDistance(toDate(date), new Date(), { addSuffix: true })
    .replace("about ", "")
    .replace("less than ", "")
    .replace("over ", "")
    .replace("almost ", "")
    .replace(/^in /, "In ");
}
 */

// Supabase 需要 ISO 日期字符串
// 但是！每次组件重新渲染，毫秒/秒都会变，导致字符串不一样，这会出问题
// 所以我们用这个小技巧：把「时分秒毫秒」全部清空/固定
export function getToday(options: { end?: boolean } = {}): string {
  // 1. 获取当前系统时间（包含年、月、日、时、分、秒、毫秒）
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it is not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    today.setUTCHours(23, 59, 59, 999); // 设为当天的最后一毫秒：23:59:59.999 (UTC)
  else today.setUTCHours(0, 0, 0, 0); // 设为当天的起点：00:00:00.000 (UTC)

  return today.toISOString(); // 3. 转为 ISO 8601 标准字符串返回，末尾带 "Z" 表示 UTC
}

export function formateCurrency(val: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
  }).format(val);
}

export function cnToEnSlug(text: string): string {
  if (!text) return "";

  // 中文转英文风格（不是机器翻译，是安全的英文化）
  const enText = transliterate(text);

  const slug = slugify(enText, {
    lower: true,
    strict: true,
    replacement: "-",
  });

  // 作用和上面的 slugify 完全一致，只是用正则手写，现在被库替代了
  // slug
  //   .toLowerCase()
  //   .replace(/\s+/g, "-")
  //   .replace(/[^\w\u4e00-\u9fa5-]/g, "");

  // 转成标准 slug
  return slug;
}
