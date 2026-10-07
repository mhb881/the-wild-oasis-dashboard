import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/utils/cn";

// 按钮类型枚举
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-ghost";
// 尺寸枚举
type ButtonSize = "sm" | "md" | "lg" | "icon";
// 圆角枚举
type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  radius = "md",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        // 基础样式
        "inline-flex cursor-pointer items-center justify-center border-none font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",

        // 变体
        variant === "primary" && "bg-brand-600 hover:bg-brand-700 text-white",
        variant === "secondary" && "bg-gray-500 text-white hover:bg-gray-600",
        variant === "outline" &&
          "border-brand-600 text-brand-600 hover:bg-brand-50 border-2 border-solid bg-transparent",
        variant === "ghost" &&
          "text-brand-600 hover:bg-brand-100 bg-transparent",
        variant === "danger" &&
          "bg-red-100 text-red-600 hover:bg-red-200 focus:outline-red-600",
        variant === "danger-ghost" &&
          "bg-transparent text-red-600 hover:bg-red-100 focus:outline-red-600",

        // 尺寸
        size === "icon" && "p-2 text-sm",
        size === "sm" && "px-2 py-1 text-sm",
        size === "md" && "px-3 py-2 text-base",
        size === "lg" && "px-4 py-3 text-lg",

        // 圆角
        radius === "none" && "rounded-none",
        radius === "sm" && "rounded-sm",
        radius === "md" && "rounded-md",
        radius === "lg" && "rounded-lg",
        radius === "full" && "rounded-full",

        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
