import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import { Heading, RowLayout } from "../ui";

function Bookings() {
  return (
    <>
      <RowLayout type="horizontal">
        <Heading type={"h1"}>订单列表</Heading>
        <BookingTableOperations />
      </RowLayout>
      <section className="flex w-full flex-col">
        <BookingTable />
      </section>
    </>
  );
}

export default Bookings;
