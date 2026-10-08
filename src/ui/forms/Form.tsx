import type { FormHTMLAttributes } from "react";

import { cn } from "../../lib/utils/cn";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  type?: "modal" | "regular";
}

const Form = ({
  children,
  type = "regular",
  className,
  ...props
}: FormProps) => {
  return (
    <form
      className={cn(
        "overflow-hidden text-sm text-gray-800",
        // 常规表单卡片样式
        type !== "modal" &&
          "rounded-lg border border-gray-200 bg-white px-8 py-6 shadow-sm",
        // 弹窗内表单样式
        type === "modal" && "px-2 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </form>
  );
};

export default Form;
