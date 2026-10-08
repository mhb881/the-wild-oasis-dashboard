import { useSearchParams } from "react-router";

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
import type { SystemUser } from "./types";
import { UserRow } from "./UserRow";
import { useUsers } from "./useUsers";

export function UserTable() {
  const { users, isPending } = useUsers();
  const [searchParams] = useSearchParams();

  if (isPending) return <Spinner />;
  if (!users || users.length === 0) return <Empty resourceName="用户" />;

  // 1) 角色与状态筛选
  const filterRole = searchParams.get("role") || "all";
  const filterStatus = searchParams.get("status") || "all";

  let filteredUsers: SystemUser[] = users;

  if (filterRole !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.role === filterRole);
  }

  if (filterStatus !== "all") {
    filteredUsers = filteredUsers.filter(
      (user) => user.status === filterStatus,
    );
  }

  // 2) 排序操作
  const sortBy = searchParams.get("sortBy") || "created_at";
  const isDesc = searchParams.get("desc") === "true";

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal: string | number = a[sortBy as keyof SystemUser] ?? "";
    let bVal: string | number = b[sortBy as keyof SystemUser] ?? "";

    if (sortBy === "created_at") {
      aVal = new Date(a.created_at).getTime();
      bVal = new Date(b.created_at).getTime();
      return (bVal - aVal) * (isDesc ? -1 : 1);
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * (isDesc ? -1 : 1);
    }

    return 0;
  });

  // 3) 分页操作
  const maxVisiblePageBtn = 5;
  const totalCount = sortedUsers.length;
  const totalPage = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const pageUsers = sortedUsers.slice(from, to + 1);

  if (filteredUsers.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-base text-gray-500">未找到符合当前筛选条件的用户</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-800">
      <Table columns="2.2fr 2fr 1fr 1fr 1.4fr 0.6fr">
        <TableHeader>
          <th>用户</th>
          <th>电子邮箱</th>
          <th>角色</th>
          <th>状态</th>
          <th>注册时间</th>
          <th>操作</th>
        </TableHeader>

        <TableBody>
          {pageUsers.map((user) => (
            <UserRow key={user.id} user={user} />
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

export default UserTable;
