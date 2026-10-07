import { format, isToday } from "date-fns";
import { CheckCircle, DollarSign, Home, MessageCircle } from "lucide-react";

import {
  formatDistanceFromNow,
  formateCurrency,
} from "../../lib/utils/helpers";
import { DataItem, Flag } from "../../ui";

// 定义 Booking 的完整数据结构
export interface Booking {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  hasBreakfast: boolean;
  observations: string;
  isPaid: boolean;
  status: "unconfirmed" | "checked-in" | "checked-out";
  guests: {
    fullName: string;
    email: string;
    country: string;
    countryFlag: string;
    nationalID: string;
  };
  cabins: {
    name: string;
  };
}

interface BookingDataBoxProps {
  booking: Booking;
}

function BookingDataBox({ booking }: BookingDataBoxProps) {
  const {
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    guests: { fullName: guestName, email, country, countryFlag, nationalID },
    cabins: { name: cabinName },
  } = booking;

  return (
    <section className="overflow-hidden rounded-md border border-gray-100 bg-white">
      {/* Header */}
      <header className="flex items-center justify-between bg-blue-600 px-10 py-5 text-lg font-medium text-indigo-100">
        <div className="flex items-center gap-4 text-lg font-semibold">
          <Home className="h-8 w-8" />
          <p>
            {numNights} nights in Cabin{" "}
            <span className="ml-1 font-[Sono] text-xl">{cabinName}</span>
          </p>
        </div>

        <p>
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>
      </header>

      {/* Section */}
      <section className="px-10 pt-8 pb-3">
        <div className="mb-4 flex items-center gap-3 text-gray-500">
          {countryFlag && <Flag src={countryFlag} alt={`Flag of ${country}`} />}
          <p className="font-medium text-gray-700">
            {guestName} {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
          </p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <p>National ID {nationalID}</p>
        </div>

        {observations && (
          <DataItem icon={<MessageCircle />} label="Observations">
            {observations}
          </DataItem>
        )}

        <DataItem icon={<CheckCircle />} label="Breakfast included?">
          {hasBreakfast ? "Yes" : "No"}
        </DataItem>

        {/* Price */}
        <div
          className={`mt-6 flex items-center justify-between rounded-sm px-8 py-4 ${
            isPaid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <DataItem icon={<DollarSign />} label="Total price">
            {formateCurrency(totalPrice)}

            {hasBreakfast &&
              ` (${formateCurrency(cabinPrice)} cabin + ${formateCurrency(
                extrasPrice,
              )} breakfast)`}
          </DataItem>

          <p className="text-sm font-semibold uppercase">
            {isPaid ? "Paid" : "Will pay at property"}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-4 text-right text-xs text-gray-500">
        <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
      </footer>
    </section>
  );
}

export default BookingDataBox;
