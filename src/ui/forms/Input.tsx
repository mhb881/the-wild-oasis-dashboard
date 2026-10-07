import type { ForwardedRef, InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "../../lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef(function Input(
  { className, error, disabled, ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      disabled={disabled}
      {...props}
      className={cn(
        // 基础样式
        "w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-800",
        "transition-all duration-200 outline-none placeholder:text-gray-400",
        // 默认状态
        !error && "border-gray-300 hover:border-gray-400",
        // 聚焦状态
        !error && "focus:border-brand-500 focus:ring-brand-100 focus:ring-2",
        // 错误状态
        error &&
          "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100",
        // 禁用状态
        disabled &&
          "cursor-not-allowed bg-gray-50 opacity-60 hover:border-gray-300",
        className,
      )}
    />
  );
});

Input.displayName = "Input";
export default Input;

