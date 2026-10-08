import { Filter, SortBy, TableOperations } from "../../ui";
import AddUser from "./AddUser";

export function UserTableOperations() {
  return (
    <TableOperations>
      <AddUser />

      <Filter
        filterField="status"
        options={[
          { value: "all", label: "全部状态" },
          { value: "active", label: "正常活跃" },
          { value: "inactive", label: "已停用" },
        ]}
      />

      <SortBy
        options={[
          { value: "created_at", label: "按注册时间" },
          { value: "username", label: "按用户名" },
          { value: "role", label: "按角色排序" },
        ]}
      />
    </TableOperations>
  );
}

export default UserTableOperations;
