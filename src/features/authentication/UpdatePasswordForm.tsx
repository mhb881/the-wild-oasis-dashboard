import { useForm } from "react-hook-form";

import type { UpdateUserDataFormInput } from "../../types/types";
import { Button, Form, FormRow, Input, Label } from "../../ui";
import { useUpdateUser } from "./useUpdateUser";

function UpdatePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<UpdateUserDataFormInput & { confirmPassword: string }>();
  const { isUpdatingUser, updateUserMutation } = useUpdateUser();

  function onSubmit(
    data: UpdateUserDataFormInput & { confirmPassword: string },
  ) {
    // 只提交业务需要的 password 字段，过滤掉 confirmPassword
    updateUserMutation(data, {
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow error={errors.password?.message}>
        <Label htmlFor="password">密码（最少6个字符）</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          disabled={isUpdatingUser}
          {...register("password", {
            required: "请输入密码",
            minLength: {
              value: 6,
              message: "密码长度不能少于6个字符",
            },
          })}
        />
      </FormRow>

      <FormRow error={errors.confirmPassword?.message}>
        <Label htmlFor="confirmPassword">确认密码</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={isUpdatingUser}
          {...register("confirmPassword", {
            required: "请确认密码",
            deps: ["password"], // 依赖密码字段，密码变化时自动重新校验
            validate: (value) => {
              return value === getValues().password || "两次输入的密码不一致";
            },
          })}
        />
      </FormRow>

      <FormRow>
        <div className="col-span-3 flex w-full justify-end gap-3">
          {/* 用 RHF 的 reset 方法完整重置表单状态 */}
          <Button
            type="button"
            variant="secondary"
            disabled={isUpdatingUser}
            onClick={() => reset()}
          >
            重置
          </Button>
          <Button type="submit" disabled={isUpdatingUser}>
            更新密码
          </Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
