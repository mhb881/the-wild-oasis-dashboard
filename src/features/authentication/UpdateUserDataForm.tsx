import { useForm } from "react-hook-form";

import type { UpdateUserDataFormInput } from "../../types/types";
import { Button, FileInput, Form, FormRow, Input, Label, Spinner } from "../../ui";
import { useUpdateUser } from "./useUpdateUser";
import { useUser } from "./useUser";

function UpdateUserDataForm() {
  const { user, isPending } = useUser();
  const { updateUserMutation, isUpdatingUser } = useUpdateUser();

  const email = user?.email;
  const curUsername = user?.user_metadata.username;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserDataFormInput>({
    defaultValues: {
      username: curUsername,
      email,
    },
  });

  function onSubmit(data: UpdateUserDataFormInput) {
    if (!data.username) return;
    updateUserMutation(data, {
      onSuccess: () => {
        setValue("avatar", undefined);
      },
    });
  }

  function handleReset() {
    setValue("username", curUsername || "");
    setValue("avatar", undefined);
  }

  if (isPending) return <Spinner />;

  // 更改用户名、邮箱、头像的表单提交
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          disabled={true}
          {...register("email")}
        />
      </FormRow>

      <FormRow error={errors.username?.message}>
        <Label htmlFor="username">用户名</Label>
        <Input
          id="username"
          type="text"
          autoComplete="username"
          disabled={isUpdatingUser}
          {...register("username")}
        />
      </FormRow>

      <FormRow error={errors.avatar?.message}>
        <Label htmlFor="avatar">上传头像</Label>
        <FileInput
          id="avatar"
          accept="image/*"
          disabled={isUpdatingUser}
          {...register("avatar")}
        />
      </FormRow>

      <FormRow>
        <div className="col-span-3 flex w-full justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isUpdatingUser}
            onClick={handleReset}
          >
            重置
          </Button>
          <Button type="submit" disabled={isUpdatingUser}>
            更新信息
          </Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
