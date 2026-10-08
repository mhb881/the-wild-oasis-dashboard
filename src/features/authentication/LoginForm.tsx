import { useForm } from "react-hook-form";

import { cn } from "../../lib/utils/cn";
import type { LoginObj } from "../../types/types";
import { Button, Form, FormRow, Input, Label } from "../../ui";
import { useLogin } from "./useLogin";

function LoginForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginObj>({
    defaultValues: { email: "black@example.com", password: "2085775" },
  });
  const { isLoggingIn, loginMutate } = useLogin();

  function onSubmit(data: LoginObj) {
    if (!data.email || !data.password) return;
    loginMutate(data, {
      onSettled: () => {
        setValue("password", "");
      },
    });
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-gray-100 bg-white/75 p-8 shadow-lg shadow-gray-200/60"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          用户登录
        </h2>
        <p className="mt-2 text-sm text-gray-500">请输入账号和密码继续</p>
      </div>

      <div className="space-y-5">
        <FormRow
          type="vertical"
          error={errors.email?.message}
          className="gap-2"
        >
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            邮箱
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="请输入邮箱"
            autoComplete="username"
            className={cn(
              "w-full rounded-lg border bg-white px-4 py-3 text-sm transition-colors outline-none placeholder:text-gray-400 focus:ring-2",
              "border-gray-300 focus:border-blue-500 focus:ring-blue-100",
              errors.email &&
                "border-red-500 focus:border-red-500 focus:ring-red-100",
            )}
            {...register("email", {
              required: "请输入邮箱",
            })}
          />
        </FormRow>

        <FormRow
          type="vertical"
          error={errors.password?.message}
          className="gap-2"
        >
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            密码
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="请输入密码"
            autoComplete="current-password"
            className={cn(
              "w-full rounded-lg border bg-white px-4 py-3 text-sm transition-colors outline-none placeholder:text-gray-400 focus:ring-2",
              "border-gray-300 focus:border-blue-500 focus:ring-blue-100",
              errors.password &&
                "border-red-500 focus:border-red-500 focus:ring-red-100",
            )}
            {...register("password", {
              required: "请输入密码",
            })}
          />
        </FormRow>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full rounded-lg py-3 text-base font-medium"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "登录中..." : "登录"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default LoginForm;
