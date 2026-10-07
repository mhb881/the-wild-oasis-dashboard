import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

import {
  formatDistanceFromNow,
  formateCurrency,
} from "../../lib/utils/helpers";
import type { Booking } from "../../types/types";
import { Tag } from "../../ui";

function BookingDataBox({ booking }: { booking: Booking }) {
  const {
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extraPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observation,
    created_at,
  } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  } as const;

  return (
    <div className="space-y-4 rounded-lg bg-gray-50 p-6">
      <header className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            预订 #{booking.id}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDistanceFromNow(created_at)} 创建
          </p>
        </div>
        <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
          {status.replace("-", " ")}
        </Tag>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h4 className="mb-2 font-semibold text-gray-700">日期</h4>
          <p className="text-sm text-gray-600">
            入住：
            {format(new Date(startDate), "MMM dd, yyyy", { locale: zhCN })}
          </p>
          <p className="text-sm text-gray-600">
            退房：{format(new Date(endDate), "MMM dd, yyyy", { locale: zhCN })}
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-800">
            共 {numNights} 晚
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h4 className="mb-2 font-semibold text-gray-700">客人信息</h4>
          <p className="text-sm text-gray-600">客人 ID：{booking.guestId}</p>
          <p className="text-sm text-gray-600">入住人数：{numGuests} 人</p>
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm">
        <h4 className="mb-3 font-semibold text-gray-700">费用明细</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">小屋费用（{numNights} 晚）</span>
            <span className="font-semibold text-gray-800">
              {formateCurrency(cabinPrice)}
            </span>
          </div>
          {hasBreakfast && (
            <div className="flex justify-between">
              <span className="text-gray-600">早餐附加费</span>
              <span className="font-semibold text-gray-800">
                {formateCurrency(extraPrice)}
              </span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">总计</span>
              <span className="text-lg font-bold text-gray-900">
                {formateCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500">早餐</p>
          <p className="mt-1 font-semibold text-gray-800">
            {hasBreakfast ? "✅ 已包含" : "❌ 未包含"}
          </p>
        </div>
        <div className="rounded-lg bg-white p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500">支付状态</p>
          <p className="mt-1 font-semibold text-gray-800">
            {isPaid ? "✅ 已支付" : "❌ 未支付"}
          </p>
        </div>
        <div className="rounded-lg bg-white p-3 text-center shadow-sm">
          <p className="text-xs text-gray-500">小屋</p>
          <p className="mt-1 font-semibold text-gray-800">#{booking.cabinId}</p>
        </div>
      </section>

      {observation && (
        <section className="rounded-lg bg-yellow-50 p-4 shadow-sm">
          <h4 className="mb-2 font-semibold text-yellow-800">备注</h4>
          <p className="text-sm text-yellow-700">{observation}</p>
        </section>
      )}
    </div>
  );
}

export default BookingDataBox;
