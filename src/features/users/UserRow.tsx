import { format } from "date-fns";
import { Copy, Edit, EllipsisVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  ConfirmDelete,
  MenuItem,
  MenuList,
  Menus,
  MenuToggle,
  Modal,
  TableRow,
  Tag,
} from "../../ui";
import { EditUserForm } from "./EditUserForm";
import type { SystemUser } from "./types";
import { useDeleteUser } from "./useDeleteUser";

interface UserRowProps {
  user: SystemUser;
}

export function UserRow({ user }: UserRowProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { deleteUserMutation, isDeleting } = useDeleteUser();

  const { id, username, email, avatar, role, status, created_at } = user;

  const roleTagConfig = {
    admin: { label: "超级管理员", type: "indigo" as const },
    manager: { label: "部门经理", type: "blue" as const },
    staff: { label: "普通员工", type: "green" as const },
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success("已复制用户邮箱至剪贴板！");
  };

  const formattedDate = created_at
    ? format(new Date(created_at), "yyyy-MM-dd HH:mm")
    : "—";

  return (
    <TableRow>
      {/* 1. 用户头像与姓名 */}
      <td>
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <img
              src={
                avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=小豆`
              }
              alt={username}
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
            />
            {!isLoaded && (
              <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%]" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {username}
            </span>
            <span className="font-['Sono'] text-base text-gray-400">
              ID: {id}
            </span>
          </div>
        </div>
      </td>

      {/* 2. 邮箱 */}
      <td className="font-['Sono'] text-base text-gray-600 dark:text-gray-300">
        {email}
      </td>

      {/* 3. 角色 */}
      <td>
        <Tag type={roleTagConfig[role]?.type || "silver"}>
          {roleTagConfig[role]?.label || role}
        </Tag>
      </td>

      {/* 4. 状态 */}
      <td>
        {status === "active" ? (
          <span className="inline-flex items-center gap-1.5 text-base font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            正常活跃
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-base font-medium text-gray-400">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            已停用
          </span>
        )}
      </td>

      {/* 5. 注册时间 */}
      <td className="font-['Sono'] text-base text-gray-500 dark:text-gray-400">
        {formattedDate}
      </td>

      {/* 6. 操作 (采用 Shadcn 声明式复合架构) */}
      <td>
        <Modal>
          <Menus>
            <MenuToggle>
              <EllipsisVertical size={18} />
            </MenuToggle>
            <MenuList>
              <MenuItem icon={<Copy size={16} />} onClick={handleCopyEmail}>
                复制邮箱
              </MenuItem>

              <Modal.Trigger name="edit" asChild>
                <MenuItem icon={<Edit size={16} />}>编辑资料</MenuItem>
              </Modal.Trigger>

              <Modal.Trigger name="delete" asChild>
                <MenuItem icon={<Trash2 size={16} />}>删除用户</MenuItem>
              </Modal.Trigger>
            </MenuList>
          </Menus>

          <Modal.Content name="edit">
            <EditUserForm user={user} />
          </Modal.Content>

          <Modal.Content name="delete">
            <ConfirmDelete
              resourceName={`用户 "${username}"`}
              onConfirm={() => deleteUserMutation(id)}
              disabled={isDeleting}
            />
          </Modal.Content>
        </Modal>
      </td>
    </TableRow>
  );
}

export default UserRow;
