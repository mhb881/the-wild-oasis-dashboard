import { useForm } from "react-hook-form";

import { Button, Form, FormRow, Input, Label } from "../../ui";
import { useSignUp } from "./useSignUp";

/*
问题：
confirmPassword 的 validate 校验通过 getValues("password") 获取密码值，
但 React Hook Form 默认只会在当前字段值变化时触发校验。
当用户先填写确认密码、再回头修改密码时，确认密码的校验状态不会自动更新，
会出现「密码已修改、确认密码已不一致，但表单仍显示校验通过」的情况，仅在提交时才会报错，实时交互存在缺陷。

修复方案：
在 register 中添加 deps 依赖，指定 password 变化时自动重新校验确认密码：

deps 的标准作用
它的核心功能是：声明当前字段的校验规则依赖哪些其他字段。
React Hook Form 默认只在字段自身被操作（输入、失焦）时触发校验。
但有些校验逻辑需要依赖另一个字段的值（最典型的场景：「确认密码」必须和「密码」保持一致），这时就需要用 deps 声明依赖：
当 deps 数组里的字段值发生变化时，当前字段会自动重新执行全部校验规则，保证校验结果实时同步，不需要用户手动再操作一次当前输入框。
 */

interface SignUpFormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function SignUpForm() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<SignUpFormInput>();
  const { signUpMutation, isSignUpPending, error } = useSignUp();

  function onSubmit(data: SignUpFormInput) {
    signUpMutation(data, {
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow error={errors.username?.message}>
        <Label htmlFor="username">用户名</Label>
        <Input
          id="username"
          type="text"
          autoComplete="username"
          disabled={isSignUpPending}
          {...register("username", {
            required: "请输入用户名",
            minLength: { value: 2, message: "用户名至少2个字符" },
            maxLength: { value: 20, message: "用户名不能超过20个字符" },
            pattern: {
              value: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
              message: "仅支持字母、数字、下划线和中文",
            },
          })}
        />
      </FormRow>

      <FormRow error={errors.email?.message}>
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          disabled={isSignUpPending}
          {...register("email", {
            required: "请输入邮箱",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "请输入正确的邮箱格式",
            },
          })}
        />
      </FormRow>

      <FormRow error={errors.password?.message}>
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          disabled={isSignUpPending}
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
          disabled={isSignUpPending}
          {...register("confirmPassword", {
            required: "请确认密码",
            validate: (value) => {
              if (value !== getValues("password")) {
                return "两次输入的密码不一致";
              }
            },
            deps: ["password"],
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <div className="col-span-3 flex w-full justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => reset()}
            disabled={isSignUpPending}
          >
            重置
          </Button>

          <Button type="submit" disabled={isSignUpPending}>
            {isSignUpPending ? "注册中..." : "注册"}
          </Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default SignUpForm;
