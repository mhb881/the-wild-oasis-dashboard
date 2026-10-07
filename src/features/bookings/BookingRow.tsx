import { format, isToday } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Eye,
  SquareArrowDown,
  SquareArrowUp,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";

import {
  formatDistanceFromNow,
  formateCurrency,
} from "../../lib/utils/helpers";
import type { ItemOfGetBookings } from "../../types/types";
import { ConfirmDelete, MenuItem, MenuList, Menus, MenuToggle, Modal, TableRow, Tag } from "../../ui";
import { useCheckout } from "../check-in-out/useCheckout";
import useDeleteBooking from "./useDeleteBooking";

function Stacked({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 text-base [&_span]:first:font-medium [&_span]:last:text-sm [&_span]:last:text-gray-500">
      {children}
    </div>
  );
}

function BookingRow({ booking }: { booking: ItemOfGetBookings }) {
  const { isDeleting, delBookingMutate } = useDeleteBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const navigate = useNavigate();

  const {
    id: bookingId,
    status,
    totalPrice,
    startDate,
    endDate,
    numNights,
    numGuests,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
    created_at,
  } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  } as const;

  return (
    <>
      <TableRow>
        <td className="font-['Sono'] font-semibold text-gray-600">
          {cabinName}
        </td>

        <td className="">
          <Stacked>
            <span>{guestName}</span>
            <span>{email}</span>
          </Stacked>
        </td>

        <td>
          <Stacked>
            <span>
              {isToday(new Date(startDate))
                ? "今天"
                : formatDistanceFromNow(startDate)}{" "}
              &rarr; 共 {numNights} 晚
            </span>
            <span>
              {format(new Date(startDate), "yyyy/MM/dd", { locale: zhCN })}{" "}
              &mdash;{" "}
              {format(new Date(endDate), "yyyy/MM/dd", { locale: zhCN })}
            </span>
          </Stacked>
        </td>

        <td>
          <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
            {status === "unconfirmed"
              ? "未确认"
              : status === "checked-in"
                ? "已入住"
                : "已退房"}
          </Tag>
        </td>

        <td className="font-['Sono'] font-semibold">
          {formateCurrency(totalPrice)}
        </td>

        <td className="flex items-center gap-3">
          <Modal>
            <Menus>
              <MenuToggle>
                <Eye />
              </MenuToggle>
              <MenuList>
                <MenuItem
                  icon={<Eye />}
                  onClick={() => navigate(`/bookings/${bookingId}`)}
                >
                  详情
                </MenuItem>

                {status === "unconfirmed" && (
                  <MenuItem
                    icon={<SquareArrowDown />}
                    onClick={() => navigate(`/checkin/${bookingId}`)}
                  >
                    登记
                  </MenuItem>
                )}

                {status === "checked-in" && (
                  <MenuItem
                    icon={<SquareArrowUp />}
                    onClick={() => checkout(bookingId!)}
                    disabled={isCheckingOut}
                  >
                    退房
                  </MenuItem>
                )}

                <Modal.Trigger asChild>
                  <MenuItem icon={<Trash2 />}>删除</MenuItem>
                </Modal.Trigger>
              </MenuList>
            </Menus>

            <Modal.Content>
              <ConfirmDelete
                resourceName={`预订 #${bookingId}`}
                onConfirm={() => {
                  if (!bookingId) return;
                  delBookingMutate(bookingId);
                }}
                disabled={isDeleting}
              />
            </Modal.Content>
          </Modal>
        </td>
      </TableRow>
    </>
  );
}

export default BookingRow;
