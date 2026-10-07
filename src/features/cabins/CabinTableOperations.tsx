import { Filter, SortBy, TableOperations } from "../../ui";
import AddCabin from "./AddCabin";

function CabinTableOperations() {
  return (
    <TableOperations>
      <AddCabin />
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "全部" },
          { value: "no-discount", label: "无折扣" },
          { value: "with-discount", label: "有折扣" },
        ]}
      />

      <SortBy
        options={[
          { value: "created_at", label: "按创建时间排序" },
          { value: "name", label: "按名称排序" },
          { value: "regularPrice", label: "按价格排序" },
          { value: "maxCapacity", label: "按最大入住人数排序" },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
