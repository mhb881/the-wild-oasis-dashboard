import { PAGE_SIZE } from "../../lib/constants";
import {
  Empty,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
} from "../../ui";
import BookingRow from "./BookingRow";
import useBookings from "./useBookings";

function BookingTable() {
  const { bookings, isPending, count: totalBookings } = useBookings();

  if (isPending) return <Spinner />;
  if (!bookings.length) return <Empty resourceName="bookings" />;

  const maxVisiblePageBtn = 5;
  const totalPage = Math.ceil(totalBookings / PAGE_SIZE);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300">
      <Table columns="0.8fr 1.5fr 1.5fr 1fr 0.9fr 0.5fr">
        <TableHeader>
          <th>小屋</th>
          <th>客人</th>
          <th>日期</th>
          <th>状态</th>
          <th>金额</th>
          <th>操作</th>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </TableBody>

        <TableFooter>
          <Pagination
            totalPages={totalPage}
            maxVisiblePages={maxVisiblePageBtn}
          />
        </TableFooter>
      </Table>
    </div>
  );
}

export default BookingTable;
