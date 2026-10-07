import { useSearchParams } from "react-router";

import { PAGE_SIZE } from "../../lib/constants";
import type { Cabin } from "../../types/types";
import { Pagination, Spinner, Table, TableBody, TableFooter, TableHeader } from "../../ui";
import CabinRow from "./CabinRow";
import useCabins from "./useCabins";

function CabinTable() {
  const { cabins, isPending } = useCabins();
  const [searchParams] = useSearchParams(); // 获取 URL 中的参数

  if (isPending) return <Spinner />;
  if (!cabins) return null;

  // 1) Filter operations
  // 从 URL 中获取进行过滤操作的参数 discount
  const filterVals = searchParams.get("discount") || "all";

  let filteredCabins: Cabin[] = cabins;

  if (filterVals === "no-discount") {
    filteredCabins = cabins.filter((cabin) => !cabin.discount);
  } else if (filterVals === "with-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount);
  }

  // 2) Sort operations
  const sortBy = (searchParams.get("sortBy") || "id") as keyof Cabin;
  const isDesc = searchParams.get("desc") === "true";
  const sortedCabins = [...filteredCabins].sort((a, b) => {
    const getValue = (cabin: Cabin) => {
      const val = cabin[sortBy];
      return val;
    };
    const aVal = getValue(a);
    const bVal = getValue(b);

    let compareResult = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      compareResult = aVal.localeCompare(bVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      compareResult = aVal - bVal;
    }
    return compareResult * (isDesc ? -1 : 1);
  });

  // 3) Pagination operations
  const maxVisiblePageBtn = 5;
  const totalPage = Math.ceil(filteredCabins.length / PAGE_SIZE);
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const pageCabins = sortedCabins.slice(from, to + 1);

  /*
  <table> 元素上直接做圆角和边框，有时浏览器表现会比较怪，尤其你还加了 overflow-hidden。更稳妥的写法是把边框和圆角放到外层 div，table 只负责排版。

  建议给表格加上 border-separate border-spacing-0，这样圆角和边框更容易正常显示。
   */
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300">
      <Table columns="1fr 1fr 2.2fr 1fr 1fr 0.5fr">
        <TableHeader>
          <th>小屋图片</th>
          <th>名称</th>
          <th>入住人数</th>
          <th>价格</th>
          <th>折扣</th>
          <th>操作</th>
        </TableHeader>
        <TableBody>
          {pageCabins.map((cabin) => (
            <CabinRow key={cabin.id} cabin={cabin} />
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

export default CabinTable;
