import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/utils/cn";

interface FormRowProps extends ComponentPropsWithRef<"div"> {
  type?: "vertical" | "horizontal";
  className?: string;
  error?: string;
}

function FormRow({
  className,
  error,
  type = "horizontal",
  children,
  ...props
}: FormRowProps) {
  return (
    <div
      className={cn(
        "py-4 not-last:border-b not-last:border-gray-100 first:pt-0 last:pb-0",
        type === "vertical" && "flex flex-col gap-2",
        // 保留三列栅格，兼容原有 col-span-3 写法
        type === "horizontal" &&
          "grid grid-cols-[140px_1fr_1fr] items-center gap-4",
        className,
      )}
      {...props}
    >
      {children}

      {/* 错误提示：水平模式下从第2列开始跨两列，显示在输入框下方 */}
      {error && (
        <span
          className={cn(
            "text-xs text-red-500",
            type === "horizontal" && "col-span-2 col-start-2 mt-1",
          )}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default FormRow;

