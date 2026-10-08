import { useNavigate } from "react-router";

import {
  Button,
  ButtonText,
  ConfirmDelete,
  Heading,
  Modal,
  RowLayout,
  Spinner,
  Tag,
} from "../../ui";
import { useCheckout } from "../check-in-out/useCheckout";
import BookingDataBox from "./BookingDataBox";
import { useBooking } from "./useBooking";
import useDeleteBooking from "./useDeleteBooking";

function BookingDetail() {
  const { data: booking, isPending } = useBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { isDeleting, delBookingMutate } = useDeleteBooking();
  const navigate = useNavigate();

  if (isPending) return <Spinner />;
  if (!booking) throw new Error("Booking not found");

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  } as const;

  return (
    <>
      <RowLayout type="horizontal">
        {/* 替换了之前的 HeadingGroup 样式组件 */}
        <div className="flex items-center gap-6">
          <Heading type="h1">订单 #{bookingId}</Heading>
          <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
            {status === "unconfirmed"
              ? "未确认"
              : status === "checked-in"
                ? "已入住"
                : "已退房"}
          </Tag>
        </div>
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

      <section className="flex justify-end gap-6">
        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            登记入住
          </Button>
        )}

        {status === "checked-in" && (
          <Button onClick={() => checkout(bookingId!)} disabled={isCheckingOut}>
            退房
          </Button>
        )}

        <Modal>
          <Modal.Trigger asChild>
            <Button variant="danger">删除订单</Button>
          </Modal.Trigger>

          <Modal.Content>
            <ConfirmDelete
              onConfirm={() =>
                delBookingMutate(bookingId!, {
                  onSettled: () => navigate(-1),
                })
              }
              resourceName={`预订 #${bookingId}`}
              disabled={isDeleting}
            />
          </Modal.Content>
        </Modal>

        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
      </section>
    </>
  );
}

export default BookingDetail;
