import { useState } from "react";
import { useNavigate } from "react-router";

import { formateCurrency } from "../../lib/utils/helpers";
import { Button, ButtonText, Checkbox, Heading, RowLayout, Spinner } from "../../ui";
import BookingDataBox from "../bookings/BookingDataBox";
import { useBooking } from "../bookings/useBooking";
import useSettings from "../settings/useSettings";
import { useCheckin } from "./useCheckin";

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { data: booking, isPending } = useBooking();
  const { checkin, isCheckingIn } = useCheckin();
  const { settings, isPending: isPendingSettings } = useSettings();
  const navigate = useNavigate();

  if (isPending || isPendingSettings) return <Spinner />;
  if (!booking || !settings) return null;

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  // 计算可选早餐价格
  const optionalBreakfastPrice =
    settings.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkin({
        bookingId: bookingId!,
        newBooking: {
          hasBreakfast: true,
          extraPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkin({ bookingId: bookingId!, newBooking: {} });
    }
  }
  return (
    <>
      <RowLayout>
        <Heading type="h1">登记订单 #{bookingId}</Heading>
        <ButtonText onClick={() => navigate(-1)}>
          <div className="group flex items-center justify-center gap-2 transition-all duration-300 ease-in-out">
            <span className="group-hover:text-brand-700 transition-all duration-300 ease-in-out group-hover:-translate-x-2">
              &larr;
            </span>
            <span className="">返回上一页</span>
          </div>
        </ButtonText>
      </RowLayout>

      <BookingDataBox booking={booking} />

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <Checkbox
          checked={addBreakfast}
          onChange={() => {
            setAddBreakfast((add) => !add);
            setConfirmPaid(false);
          }}
          id="breakfast"
        >
          需要添加{numGuests}人{numNights}晚的早餐吗？价格为：
          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 font-semibold text-gray-900">
            {formateCurrency(optionalBreakfastPrice)}
          </span>
        </Checkbox>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          disabled={confirmPaid || isCheckingIn}
          id="confirm"
        >
          我确认{" "}
          <span className="font-medium text-gray-900">{guests.fullName}</span>{" "}
          已支付总金额{" "}
          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 font-semibold text-gray-900">
            {!addBreakfast
              ? formateCurrency(totalPrice)
              : `${formateCurrency(
                  totalPrice + optionalBreakfastPrice,
                )} (${formateCurrency(totalPrice)} + ${formateCurrency(optionalBreakfastPrice)})`}
          </span>
        </Checkbox>
      </section>

      <section className="flex justify-end gap-6">
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </section>
    </>
  );
}

export default CheckinBooking;
