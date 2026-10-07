import { useQuery } from "@tanstack/react-query";

import { getCabins } from "../../services/apiCabins";
import type { Cabin } from "../../types/types";
import { Spinner } from "../../ui";
import CabinRow from "./CabinRow";

function CabinTable() {
  const {
    data: cabins,
    isPending,
    error,
  } = useQuery<Cabin[]>({
    queryKey: ["cabins"],
    queryFn: () => getCabins(),
  });

  if (isPending) return <Spinner />;

  /*
  <table> 元素上直接做圆角和边框，有时浏览器表现会比较怪，尤其你还加了 overflow-hidden。更稳妥的写法是把边框和圆角放到外层 div，table 只负责排版。

  建议给表格加上 border-separate border-spacing-0，这样圆角和边框更容易正常显示。
   */
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300">
      <table role="table" className="w-full border-separate border-spacing-0">
        <thead
          role="row"
          className="font-semibold tracking-wide text-gray-600 uppercase"
        >
          <tr className="grid grid-cols-[1fr_1fr_2.2fr_1fr_1fr_1fr] items-center gap-x-8 border-b border-gray-300 px-10 py-4 text-left">
            <th>小屋</th>
            <th>编号</th>
            <th>容量</th>
            <th>价格</th>
            <th>折扣</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          {cabins?.map((cabin) => (
            <CabinRow key={cabin.id} cabin={cabin} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CabinTable;
