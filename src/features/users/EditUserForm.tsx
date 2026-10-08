import { useForm } from "react-hook-form";

import {
  Button,
  Form,
  FormRow,
  Input,
  Label,
  useOptionalModal,
} from "../../ui";
import type { SystemUser, UpdateUserInput } from "./types";
import { useEditUser } from "./useEditUser";

interface EditUserFormProps {
  user: SystemUser;
  onClose?: () => void;
}

export function EditUserForm({ user, onClose }: EditUserFormProps) {
  const modal = useOptionalModal();
  const handleClose = onClose ?? modal?.close;

  const { editUserMutation, isEditing } = useEditUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    defaultValues: {
      username: user.username,
      role: user.role,
      status: user.status,
    },
  });

  function onSubmit(data: UpdateUserInput) {
    editUserMutation(
      { id: user.id, data },
      {
        onSuccess: () => {
          handleClose?.();
        },
      },
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[45rem] max-w-full"
      type="modal"
    >
      <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
        编辑用户信息
      </h3>

      <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
        <img
          src={user.avatar}
          alt={user.username}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {user.username}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <FormRow error={errors.username?.message}>
        <Label htmlFor="edit-username">用户名</Label>
        <Input
          id="edit-username"
          type="text"
          disabled={isEditing}
          {...register("username", {
            required: "请输入用户名",
            minLength: { value: 2, message: "用户名至少2个字符" },
          })}
        />
      </FormRow>

      <FormRow error={errors.role?.message}>
        <Label htmlFor="edit-role">用户角色</Label>
        <select
          id="edit-role"
          disabled={isEditing}
          className="focus:border-brand-600 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          {...register("role", { required: "请选择用户角色" })}
        >
          <option value="staff">普通员工 (Staff)</option>
          <option value="manager">部门经理 (Manager)</option>
          <option value="admin">超级管理员 (Admin)</option>
        </select>
      </FormRow>

      <FormRow error={errors.status?.message}>
        <Label htmlFor="edit-status">账号状态</Label>
        <select
          id="edit-status"
          disabled={isEditing}
          className="focus:border-brand-600 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          {...register("status", { required: "请选择状态" })}
        >
          <option value="active">正常活跃 (Active)</option>
          <option value="inactive">停用 (Inactive)</option>
        </select>
      </FormRow>

      <FormRow>
        <div className="col-span-3 flex w-full justify-end gap-3 pt-3">
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={isEditing}
          >
            取消
          </Button>

          <Button type="submit" disabled={isEditing}>
            {isEditing ? "保存中..." : "保存修改"}
          </Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default EditUserForm;
