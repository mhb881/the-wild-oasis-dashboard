import { format, isToday } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Home,
  Mail,
  MessageCircle,
} from "lucide-react";

import {
  formatDistanceFromNow,
  formateCurrency,
} from "../../lib/utils/helpers";
import type { ItemOfGetBooking } from "../../types/types";
import { DataItem, Flag } from "../../ui";

interface BookingDataBoxProps {
  booking: ItemOfGetBooking;
}

function BookingDataBox({ booking }: BookingDataBoxProps) {
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extraPrice,
    observations,
    totalPrice,
    hasBreakfast,
    isPaid,
    guests: {
      fullName: guestName,
      email,
      nationality,
      countryFlag,
      nationalID,
    },
    cabins: { name: cabinName },
  } = booking;

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header：增强了对比度，并在日期外加了微弱的背景色提升可读性 */}
      <header className="bg-brand-600 flex flex-col gap-4 px-6 py-5 text-indigo-50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <Home className="h-7 w-7 text-white" />
          <p>
            <span className="mr-2 font-[Sono] text-xl font-bold tracking-wide text-white">
              {cabinName}
            </span>
            <span className="text-brand-100 text-base font-normal">
              民宿 &middot; {numNights} 晚
            </span>
          </p>
        </div>

        <div className="flex w-fit items-center rounded-md bg-black/20 px-3 py-1.5 text-sm backdrop-blur-sm sm:text-base">
          <p>
            {format(new Date(startDate), "yyyy年MM月dd日", { locale: zhCN })}
            <span className="text-brand-200 mx-2">
              (
              {isToday(new Date(startDate))
                ? "今天"
                : formatDistanceFromNow(startDate)}
              )
            </span>
            &mdash;{" "}
            {format(new Date(endDate), "yyyy年MM月dd日", { locale: zhCN })}
          </p>
        </div>
      </header>

      {/* Main Section */}
      <section className="flex flex-col gap-6 px-6 py-8 sm:px-8">
        {/* 客户信息区：使用浅色背景块包裹，视觉上更聚合，避免信息散落 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            {countryFlag && (
              <Flag
                src={countryFlag}
                alt={`${nationality} flag`}
                className="h-4 w-6 rounded-xs object-cover shadow-sm"
              />
            )}
            <p className="text-base font-semibold text-gray-900">
              {guestName}
              {numGuests > 1 && (
                <span className="ml-1 text-sm font-normal text-gray-500">
                  ({numGuests} 位)
                </span>
              )}
            </p>
          </div>

          <div className="hidden h-4 w-px bg-gray-300 sm:block"></div>

          <div className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-gray-400" />
            <p>{email}</p>
          </div>

          <div className="hidden h-4 w-px bg-gray-300 sm:block"></div>

          <div className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <p>ID: {nationalID}</p>
          </div>
        </div>

        {/* 订单明细：纵向排列更利于扫描阅读 */}
        <div className="flex flex-col gap-4 px-2">
          {observations && (
            <DataItem
              icon={<MessageCircle className="text-brand-600 h-5 w-5" />}
              label="备注要求"
            >
              <span className="text-gray-700">{observations}</span>
            </DataItem>
          )}

          <DataItem
            icon={<CheckCircle className="text-brand-600 h-5 w-5" />}
            label="包含早餐"
          >
            <span className="font-medium text-gray-800">
              {hasBreakfast ? "是" : "否"}
            </span>
          </DataItem>
        </div>

        {/* 价格区块：优化了高亮配色，增加了小圆点状态指示器 */}
        <div
          className={`mt-2 flex flex-col gap-4 rounded-lg px-6 py-5 sm:flex-row sm:items-center sm:justify-between ${
            isPaid
              ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
              : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
          }`}
        >
          <DataItem
            icon={
              <DollarSign
                className={`h-6 w-6 ${isPaid ? "text-emerald-600" : "text-amber-600"}`}
              />
            }
            label="订单总价"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-xl font-bold tracking-tight">
                {formateCurrency(totalPrice)}
              </span>
              {hasBreakfast && (
                <span className="text-sm font-normal opacity-80">
                  ({formateCurrency(cabinPrice)} 住宿 +{" "}
                  {formateCurrency(extraPrice)} 早餐)
                </span>
              )}
            </div>
          </DataItem>

          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isPaid ? "bg-emerald-500" : "animate-pulse bg-amber-500"
              }`}
            ></div>
            <p className="text-sm font-bold tracking-wider uppercase">
              {isPaid ? "已付款" : "到店支付"}
            </p>
          </div>
        </div>
      </section>

      {/* Footer：利用背景色区分区域，时间格式加上了时分 */}
      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-right text-sm text-gray-500 sm:px-8">
        <p>
          订单创建于：
          {format(new Date(created_at), "yyyy年MM月dd日 HH:mm", {
            locale: zhCN,
          })}
        </p>
      </footer>
    </section>
  );
}

export default BookingDataBox;
