import { Filter, SortBy, TableOperations } from "../../ui";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "全部" },
          { value: "checked-out", label: "已退房" },
          { value: "checked-in", label: "已入住" },
          { value: "unconfirmed", label: "未确认" },
        ]}
      />

      <SortBy
        options={[
          { value: "id", label: "默认排序" },
          { value: "startDate", label: "按时间排序" },
          {
            value: "totalPrice",
            label: "按金额排序",
          },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
