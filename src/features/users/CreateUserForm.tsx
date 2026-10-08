import { useForm } from "react-hook-form";

import {
  Button,
  Form,
  FormRow,
  Input,
  Label,
  useOptionalModal,
} from "../../ui";
import type { CreateUserInput } from "./types";
import { useCreateUser } from "./useCreateUser";

interface CreateUserFormInput extends CreateUserInput {
  confirmPassword?: string;
}

interface CreateUserFormProps {
  onClose?: () => void;
}

export function CreateUserForm({ onClose }: CreateUserFormProps) {
  const modal = useOptionalModal();
  const handleClose = onClose ?? modal?.close;

  const { createUserMutation, isCreating } = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateUserFormInput>({
    defaultValues: {
      role: "staff",
      status: "active",
    },
  });

  function onSubmit(data: CreateUserFormInput) {
    const { confirmPassword: _, ...payload } = data;
    createUserMutation(payload, {
      onSuccess: () => {
        reset();
        handleClose?.();
      },
    });
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[50rem] max-w-full"
      type="modal"
    >
      <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
        添加新系统用户
      </h3>

      <FormRow error={errors.username?.message}>
        <Label htmlFor="create-username">用户名</Label>
        <Input
          id="create-username"
          type="text"
          placeholder="例如：Alex Rivera"
          disabled={isCreating}
          {...register("username", {
            required: "请输入用户名",
            minLength: { value: 2, message: "用户名至少2个字符" },
          })}
        />
      </FormRow>

      <FormRow error={errors.email?.message}>
        <Label htmlFor="create-email">电子邮箱</Label>
        <Input
          id="create-email"
          type="email"
          placeholder="例如：alex@oasis.hotel"
          disabled={isCreating}
          {...register("email", {
            required: "请输入电子邮箱",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "请输入有效的邮箱地址",
            },
          })}
        />
      </FormRow>

      <FormRow error={errors.role?.message}>
        <Label htmlFor="create-role">用户角色</Label>
        <select
          id="create-role"
          disabled={isCreating}
          className="focus:border-brand-600 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          {...register("role", { required: "请选择用户角色" })}
        >
          <option value="staff">普通员工 (Staff)</option>
          <option value="manager">部门经理 (Manager)</option>
          <option value="admin">超级管理员 (Admin)</option>
        </select>
      </FormRow>

      <FormRow error={errors.password?.message}>
        <Label htmlFor="create-password">初始密码</Label>
        <Input
          id="create-password"
          type="password"
          placeholder="至少8位字符"
          disabled={isCreating}
          {...register("password", {
            required: "请设置初始登录密码",
            minLength: { value: 8, message: "密码至少8个字符" },
          })}
        />
      </FormRow>

      <FormRow error={errors.confirmPassword?.message}>
        <Label htmlFor="create-confirm-password">确认密码</Label>
        <Input
          id="create-confirm-password"
          type="password"
          placeholder="再次输入密码"
          disabled={isCreating}
          {...register("confirmPassword", {
            required: "请确认密码",
            validate: (value) =>
              value === getValues("password") || "两次输入的密码不一致",
            deps: ["password"],
          })}
        />
      </FormRow>

      <FormRow>
        <div className="col-span-3 flex w-full justify-end gap-3 pt-3">
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={isCreating}
          >
            取消
          </Button>

          <Button type="submit" disabled={isCreating}>
            {isCreating ? "创建中..." : "确认创建"}
          </Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default CreateUserForm;
